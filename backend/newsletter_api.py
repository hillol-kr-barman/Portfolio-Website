import json
import logging
import os
import ssl
import uuid
from urllib import error, request
from urllib.parse import quote, urlencode

from fastapi import APIRouter, Header, HTTPException, Query
from fastapi.responses import HTMLResponse, Response
from pydantic import BaseModel, Field

try:
    import certifi
except ImportError:  # pragma: no cover
    certifi = None


router = APIRouter(prefix="/newsletter", tags=["newsletter"])

RESEND_BATCH_LIMIT = 100


class NewsletterSendRequest(BaseModel):
    subject: str = Field(min_length=1)
    html: str = Field(min_length=1)
    text: str | None = None
    from_email: str | None = None
    reply_to: str | None = None
    dry_run: bool = False


logger = logging.getLogger("resume_project.newsletter")


def get_ssl_context() -> ssl.SSLContext:
    if certifi is not None:
        return ssl.create_default_context(cafile=certifi.where())
    return ssl.create_default_context()


def request_json(
    url: str,
    *,
    method: str = "GET",
    headers: dict[str, str] | None = None,
    body: dict | list | None = None,
) -> dict | list | None:
    request_headers = {"User-Agent": "resume-project/1.0"}
    if headers:
        request_headers.update(headers)

    data = None
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        request_headers.setdefault("Content-Type", "application/json")

    req = request.Request(url, data=data, headers=request_headers, method=method)

    try:
        with request.urlopen(req, context=get_ssl_context()) as response:
            raw_body = response.read().decode("utf-8")
            return json.loads(raw_body) if raw_body else None
    except error.HTTPError as exc:
        # Resend and PostgREST error bodies carry API detail and schema hints.
        # Log them in full; return nothing specific to the caller.
        raw_error = exc.read().decode("utf-8")
        logger.error("%s %s failed: %s | body=%s", method, url, exc, raw_error)
        raise HTTPException(
            status_code=502,
            detail="Upstream request failed. Please try again shortly.",
        ) from exc
    except error.URLError as exc:
        logger.error("%s %s unreachable: %s", method, url, exc)
        raise HTTPException(
            status_code=502,
            detail="Upstream service is unreachable. Please try again shortly.",
        ) from exc


def get_supabase_rest_config() -> tuple[str, str]:
    supabase_url = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not supabase_url or not supabase_key:
        raise HTTPException(
            status_code=500,
            detail=(
                "Supabase REST credentials are missing. Set SUPABASE_URL and "
                "SUPABASE_SERVICE_ROLE_KEY in backend/.env or .env.local."
            ),
        )

    return supabase_url.rstrip("/"), supabase_key


def get_resend_config() -> tuple[str, str]:
    resend_api_key = os.getenv("RESEND_API_KEY")
    resend_from_email = os.getenv("RESEND_FROM_EMAIL")

    if not resend_api_key:
        raise HTTPException(
            status_code=500,
            detail="Resend is not configured. Set RESEND_API_KEY in backend/.env or .env.local.",
        )

    if not resend_from_email:
        raise HTTPException(
            status_code=500,
            detail="Set RESEND_FROM_EMAIL in backend/.env or .env.local.",
        )

    return resend_api_key, resend_from_email


def require_newsletter_admin(x_admin_token: str | None) -> None:
    expected_token = os.getenv("NEWSLETTER_ADMIN_TOKEN")

    if not expected_token:
        raise HTTPException(
            status_code=500,
            detail="Set NEWSLETTER_ADMIN_TOKEN before using newsletter send endpoints.",
        )

    if x_admin_token != expected_token:
        raise HTTPException(status_code=401, detail="Invalid newsletter admin token.")


def get_public_base_url() -> str:
    """Public origin of this API — where /newsletter/unsubscribe is served.

    This must not be the frontend origin. The SPA host rewrites every unknown
    path to index.html, so an unsubscribe link pointed there renders the site's
    404 page and never reaches the endpoint. RENDER_EXTERNAL_URL is supplied by
    Render automatically, so deployments there need no extra configuration.
    """
    base_url = (
        os.getenv("NEWSLETTER_PUBLIC_BASE_URL")
        or os.getenv("RENDER_EXTERNAL_URL")
        or os.getenv("API_PUBLIC_URL")
        or "http://127.0.0.1:8000"
    )
    return base_url.rstrip("/")


def get_active_subscribers() -> list[dict]:
    supabase_url, supabase_key = get_supabase_rest_config()
    query = urlencode({"select": "*", "is_active": "eq.true"})
    rows = request_json(
        f"{supabase_url}/rest/v1/newsletter_subscribers?{query}",
        headers={
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}",
        },
    )

    if not isinstance(rows, list):
        raise HTTPException(status_code=502, detail="Supabase did not return a subscriber list.")

    subscribers = []

    for row in rows:
        if not isinstance(row, dict):
            continue

        email_value = str(row.get("email", "")).strip().lower()
        unsubscribe_token = str(row.get("unsubscribe_token", "")).strip()

        if not email_value or "@" not in email_value:
            continue

        if not unsubscribe_token:
            raise HTTPException(
                status_code=500,
                detail=(
                    "Subscribers are missing unsubscribe_token values. Add the column and backfill "
                    "tokens before sending newsletters."
                ),
            )

        subscribers.append(
            {
                "email": email_value,
                "name": str(row.get("name", "")).strip(),
                "unsubscribe_token": unsubscribe_token,
            }
        )

    return subscribers


def unsubscribe_by_token(token: str) -> bool:
    supabase_url, supabase_key = get_supabase_rest_config()
    response_rows = request_json(
        f"{supabase_url}/rest/v1/newsletter_subscribers?unsubscribe_token=eq.{quote(token, safe='')}",
        method="PATCH",
        headers={
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}",
            "Prefer": "return=representation",
        },
        body={"is_active": False},
    )

    return isinstance(response_rows, list) and len(response_rows) > 0


def chunked(items: list[dict], size: int) -> list[list[dict]]:
    return [items[index:index + size] for index in range(0, len(items), size)]


def build_unsubscribe_url(token: str) -> str:
    return f"{get_public_base_url()}/newsletter/unsubscribe?token={quote(token, safe='')}"


def render_html_content(template_html: str, unsubscribe_url: str) -> str:
    footer = (
        "<hr style=\"margin-top:32px;margin-bottom:16px;border:none;border-top:1px solid #e5e7eb;\">"
        f"<p style=\"font-size:12px;color:#6b7280;\">"
        f"If you do not want these updates anymore, <a href=\"{unsubscribe_url}\">unsubscribe here</a>."
        "</p>"
    )

    if "{unsubscribe_url}" in template_html:
        return template_html.replace("{unsubscribe_url}", unsubscribe_url)

    return f"{template_html}{footer}"


def render_text_content(template_text: str | None, unsubscribe_url: str) -> str | None:
    if template_text is None:
        return None

    footer = f"\n\nIf you do not want these updates anymore, unsubscribe here: {unsubscribe_url}"

    if "{unsubscribe_url}" in template_text:
        return template_text.replace("{unsubscribe_url}", unsubscribe_url)

    return f"{template_text}{footer}"


def send_batch_to_resend(payload: NewsletterSendRequest, subscribers: list[dict]) -> dict:
    resend_api_key, default_from_email = get_resend_config()
    sender = payload.from_email or default_from_email
    batch_requests = []

    for subscriber in subscribers:
        unsubscribe_url = build_unsubscribe_url(subscriber["unsubscribe_token"])
        email_payload = {
            "from": sender,
            "to": [subscriber["email"]],
            "subject": payload.subject,
            "html": render_html_content(payload.html, unsubscribe_url),
            "headers": {
                # RFC 8058. Mail clients surface a native "Unsubscribe" button
                # from these and providers weigh their presence heavily.
                # One-Click means the provider POSTs the URL directly, so the
                # endpoint accepts POST as well as GET.
                "List-Unsubscribe": f"<{unsubscribe_url}>",
                "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            },
            **({"reply_to": payload.reply_to} if payload.reply_to else {}),
        }

        rendered_text = render_text_content(payload.text, unsubscribe_url)
        if rendered_text is not None:
            email_payload["text"] = rendered_text

        batch_requests.append(email_payload)

    if payload.dry_run:
        return {
            "dry_run": True,
            "subscriber_count": len(subscribers),
            "batch_count": len(chunked(batch_requests, RESEND_BATCH_LIMIT)),
        }

    sent_ids = []

    for batch in chunked(batch_requests, RESEND_BATCH_LIMIT):
        response_payload = request_json(
            "https://api.resend.com/emails/batch",
            method="POST",
            headers={
                "Authorization": f"Bearer {resend_api_key}",
                "Content-Type": "application/json",
                "Idempotency-Key": str(uuid.uuid4()),
            },
            body=batch,
        )

        data = response_payload.get("data", []) if isinstance(response_payload, dict) else []
        sent_ids.extend(item.get("id") for item in data if isinstance(item, dict) and item.get("id"))

    return {
        "dry_run": False,
        "subscriber_count": len(subscribers),
        "batch_count": len(chunked(batch_requests, RESEND_BATCH_LIMIT)),
        "email_ids": sent_ids,
    }


@router.post("/send")
def send_newsletter(
    payload: NewsletterSendRequest,
    x_admin_token: str | None = Header(default=None),
) -> dict:
    require_newsletter_admin(x_admin_token)
    subscribers = get_active_subscribers()

    # An empty list is only an error for a real send. A dry run is how you check
    # the list before writing, so it reports zero rather than refusing.
    if not subscribers and not payload.dry_run:
        raise HTTPException(status_code=400, detail="No active newsletter subscribers found.")

    return send_batch_to_resend(payload, subscribers)


@router.post("/unsubscribe")
def unsubscribe_one_click(token: str = Query(..., min_length=1)) -> Response:
    """RFC 8058 one-click endpoint.

    Mail providers POST here when the reader uses their client's own
    Unsubscribe button. They read the status code, not the body, and a
    non-2xx makes the client report the unsubscribe as failed — so an
    unrecognised token still answers 200 rather than 404.
    """
    unsubscribe_by_token(token)
    return Response(status_code=200)


@router.get("/unsubscribe", response_class=HTMLResponse)
def unsubscribe_newsletter(token: str = Query(..., min_length=1)) -> HTMLResponse:
    updated = unsubscribe_by_token(token)

    if updated:
        return HTMLResponse(
            "<html><body style=\"font-family: sans-serif; padding: 32px;\">"
            "<h1>You have been unsubscribed.</h1>"
            "<p>You will not receive future newsletter emails from this list.</p>"
            "</body></html>"
        )

    return HTMLResponse(
        "<html><body style=\"font-family: sans-serif; padding: 32px;\">"
        "<h1>Link not found.</h1>"
        "<p>This unsubscribe link is invalid or has already been used.</p>"
        "</body></html>",
        status_code=404,
    )
