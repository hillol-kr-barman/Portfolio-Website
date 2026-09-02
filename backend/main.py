import json
import logging
import os
import ssl
from pathlib import Path
from urllib import error, request

import stripe
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from newsletter_api import router as newsletter_router

try:
    import certifi
except ImportError:  # pragma: no cover
    certifi = None


logger = logging.getLogger("resume_project")

app = FastAPI(title="Resume Project API")


def relay_upstream_error(source: str, exc: Exception, raw: str | None = None) -> str:
    """Log an upstream failure in full and return a message safe to show a client.

    Provider errors routinely embed credentials and internal detail — a Stripe
    auth failure quotes a partial secret key, and PostgREST errors carry schema
    hints. None of that belongs in a browser response.
    """
    logger.error("%s call failed: %s%s", source, exc, f" | body={raw}" if raw else "")
    return f"{source} request failed. Please try again shortly."


def is_duplicate_error(status_code: int, raw_body: str) -> bool:
    """True when Postgres rejected an insert for violating a unique constraint.

    PostgREST surfaces SQLSTATE 23505 as HTTP 409. Matching on the SQLSTATE is
    the reliable half; the status alone can mean other conflicts.
    """
    if status_code != 409:
        return False

    try:
        parsed = json.loads(raw_body)
    except json.JSONDecodeError:
        return False

    return isinstance(parsed, dict) and parsed.get("code") == "23505"


def client_safe_message(parsed: object, keys: tuple[str, ...]) -> str | None:
    """Pull a provider message intended for end users, if it is a plain string."""
    if not isinstance(parsed, dict):
        return None

    for key in keys:
        value = parsed.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()

    return None

class CheckoutRequest(BaseModel):
    tier: str | None = None
    custom_amount: float | None = None

PRICE_MAP = {
    "espresso": 500,
    "double": 1000,
    "snacks": 2000,
}

MIN_CUSTOM_AMOUNT_CENTS = 2600
MAX_CUSTOM_AMOUNT_CENTS = 1_000_000

def load_env_file() -> None:
    # Local runs may start from either the backend folder or the Vite project root.
    env_candidates = [
        Path(__file__).resolve().parent / ".env",
        Path(__file__).resolve().parent.parent / ".env.local",
    ]

    for env_path in env_candidates:
        if not env_path.exists():
            continue

        for line in env_path.read_text().splitlines():
            stripped = line.strip()

            if not stripped or stripped.startswith("#") or "=" not in stripped:
                continue

            key, value = stripped.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip("'\""))


load_env_file()


def get_allowed_origins() -> list[str]:
    """Explicit origins. `allow_origins=["*"]` with credentials is invalid per
    the CORS spec — browsers reject credentialed requests against a wildcard —
    so the deployed frontend is named directly."""
    configured = [
        os.getenv("FRONTEND_BASE_URL", "").rstrip("/"),
        os.getenv("PUBLIC_APP_URL", "").rstrip("/"),
    ]

    # The site is served from www but FRONTEND_BASE_URL may name the apex (it
    # is also used to build Stripe return URLs, where either works). A browser
    # sends whichever host it is on, so accept both spellings rather than
    # letting a redirect difference block every request.
    variants: list[str] = []
    for origin in configured:
        if not origin:
            continue
        variants.append(origin)
        if "://www." in origin:
            variants.append(origin.replace("://www.", "://", 1))
        else:
            scheme, _, host = origin.partition("://")
            if host:
                variants.append(f"{scheme}://www.{host}")

    defaults = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    return sorted({origin for origin in variants + defaults if origin})


app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Admin-Token"],
)


class SignUpRequest(BaseModel):
    email: str
    password: str = Field(min_length=6)
    name: str | None = None


class NewsletterSubscribeRequest(BaseModel):
    email: str




def get_supabase_config() -> tuple[str, str]:
    supabase_url = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
    supabase_key = (
        os.getenv("SUPABASE_KEY")
        or os.getenv("SUPABASE_ANON_KEY")
        or os.getenv("VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY")
        or os.getenv("VITE_SUPABASE_ANON_KEY")
    )

    if not supabase_url or not supabase_key:
        raise HTTPException(
            status_code=500,
            detail=(
                "Supabase credentials are missing. Set SUPABASE_URL with SUPABASE_KEY or "
                "SUPABASE_ANON_KEY, or provide VITE_SUPABASE_URL with "
                "VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY or VITE_SUPABASE_ANON_KEY "
                "in .env.local."
            ),
        )

    return supabase_url.rstrip("/"), supabase_key


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


def get_ssl_context() -> ssl.SSLContext:
    if certifi is not None:
        return ssl.create_default_context(cafile=certifi.where())
    return ssl.create_default_context()


def get_stripe_config() -> tuple[str, str]:
    stripe_secret_key = os.getenv("STRIPE_SECRET_KEY")
    frontend_base_url = os.getenv("FRONTEND_BASE_URL", "http://localhost:5173").rstrip("/")

    if not stripe_secret_key or "..." in stripe_secret_key:
        raise HTTPException(
            status_code=500,
            detail=(
                "Stripe is not configured. Set a real STRIPE_SECRET_KEY in backend/.env or "
                ".env.local."
            ),
        )

    return stripe_secret_key, frontend_base_url


def supabase_sign_up(payload: SignUpRequest) -> dict:
    supabase_url, supabase_key = get_supabase_config()
    signup_url = f"{supabase_url}/auth/v1/signup"
    normalized_email = payload.email.strip().lower()

    if "@" not in normalized_email:
        raise HTTPException(status_code=422, detail="A valid email address is required.")

    body = {
        "email": normalized_email,
        "password": payload.password,
    }

    if payload.name:
        body["data"] = {"name": payload.name.strip()}

    req = request.Request(
        signup_url,
        data=json.dumps(body).encode("utf-8"),
        headers={
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with request.urlopen(req, context=get_ssl_context()) as response:
            return json.loads(response.read().decode("utf-8"))
    except error.HTTPError as exc:
        raw_error = exc.read().decode("utf-8")

        try:
            parsed_error = json.loads(raw_error)
        except json.JSONDecodeError:
            parsed_error = None

        detail = client_safe_message(parsed_error, ("msg", "error_description"))
        if detail is None:
            detail = relay_upstream_error("Signup", exc, raw_error)

        raise HTTPException(status_code=exc.code, detail=detail) from exc
    except error.URLError as exc:
        raise HTTPException(
            status_code=502,
            detail=relay_upstream_error("Supabase", exc),
        ) from exc


def subscribe_to_newsletter(payload: NewsletterSubscribeRequest) -> dict:
    supabase_url, supabase_key = get_supabase_rest_config()
    normalized_email = payload.email.strip().lower()

    if "@" not in normalized_email:
        raise HTTPException(status_code=422, detail="A valid email address is required.")

    request_body = {"email": normalized_email}

    # Newsletter writes need the service role key because public clients should not insert directly.
    #
    # `on_conflict=email` names the constraint that `resolution=ignore-duplicates`
    # should ignore. Without it PostgREST defaults to the primary key, so a
    # repeat address raised a unique violation (23505 -> HTTP 409) instead of
    # being quietly skipped.
    req = request.Request(
        f"{supabase_url}/rest/v1/newsletter_subscribers?on_conflict=email",
        data=json.dumps(request_body).encode("utf-8"),
        headers={
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation,resolution=ignore-duplicates",
        },
        method="POST",
    )

    try:
        with request.urlopen(req, context=get_ssl_context()) as response:
            raw_body = response.read().decode("utf-8")
            rows = json.loads(raw_body) if raw_body else []
    except error.HTTPError as exc:
        # PostgREST errors carry schema hints; log them, do not ship them. The
        # status still distinguishes "your request was rejected" from "the
        # upstream broke" — telling a reader to retry a permanent 4xx is wrong.
        raw_error = exc.read().decode("utf-8")

        # A repeat address is a normal outcome, not a failure. Belt and braces
        # alongside on_conflict above: if the insert still surfaces a unique
        # violation, report it as "already subscribed" rather than an error.
        if is_duplicate_error(exc.code, raw_error):
            return {"email": normalized_email, "created": False}

        logger.error("Newsletter insert failed: %s | body=%s", exc, raw_error)
        if 400 <= exc.code < 500:
            raise HTTPException(
                status_code=exc.code,
                detail="That email address could not be added to the list.",
            ) from exc
        raise HTTPException(
            status_code=502,
            detail="Newsletter request failed. Please try again shortly.",
        ) from exc
    except error.URLError as exc:
        raise HTTPException(
            status_code=502,
            detail=relay_upstream_error("Supabase", exc),
        ) from exc

    created_row = rows[0] if rows else None

    return {
        "email": normalized_email,
        "created": created_row is not None,
    }

app.include_router(newsletter_router)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/signup")
def signup(payload: SignUpRequest) -> dict:
    signup_response = supabase_sign_up(payload)
    user = signup_response.get("user")

    if not user:
        raise HTTPException(status_code=400, detail="Supabase did not return a user.")

    return {
        "message": "Signup successful. Check your email if confirmation is enabled in Supabase.",
        "user": {
            "id": user.get("id"),
            "email": user.get("email"),
        },
        "session": signup_response.get("session"),
    }


@app.post("/newsletter/subscribe")
def newsletter_subscribe(payload: NewsletterSubscribeRequest) -> dict:
    result = subscribe_to_newsletter(payload)
    message = (
        "Too easy. You are now on the list."
        if result["created"]
        else "You are already on the list."
    )

    return {
        "message": message,
        "email": result["email"],
        "created": result["created"],
    }

@app.post("/create-checkout-session")
def create_checkout_session(payload: CheckoutRequest):
    stripe_secret_key, frontend_base_url = get_stripe_config()
    amount = None

    if payload.custom_amount is not None:
        amount = int(round(payload.custom_amount * 100))

        if amount < MIN_CUSTOM_AMOUNT_CENTS:
            raise HTTPException(status_code=400, detail="Mate it must be at least $26.00.")

        if amount > MAX_CUSTOM_AMOUNT_CENTS:
            raise HTTPException(status_code=400, detail="You want the ATO to pay me a visit?")
    else:
        amount = PRICE_MAP.get(payload.tier or "")
        if not amount:
            raise HTTPException(status_code=400, detail="Invalid support tier.")

    stripe.api_key = stripe_secret_key

    try:
        session = stripe.checkout.Session.create(
            mode="payment",
            success_url=f"{frontend_base_url}/coffee?status=success",
            cancel_url=f"{frontend_base_url}/coffee?status=cancelled",
            line_items=[
                {
                    "price_data": {
                        "currency": "aud",
                        "product_data": {"name": "Buy me a coffee"},
                        "unit_amount": amount,
                    },
                    "quantity": 1,
                }
            ],
        )
    except stripe.error.StripeError as exc:
        # `user_message` is Stripe's own end-user copy (card declined, etc.) and
        # is safe to pass through. `str(exc)` is not — on an auth failure it
        # quotes a partial secret key.
        safe = getattr(exc, "user_message", None)
        message = safe if isinstance(safe, str) and safe.strip() else relay_upstream_error("Stripe", exc)
        raise HTTPException(status_code=502, detail=message) from exc

    return {"url": session.url}
