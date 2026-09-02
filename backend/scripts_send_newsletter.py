#!/usr/bin/env python3
"""Compose and send a newsletter from local files.

Write your email as a plain .html file (and optionally a matching .txt), then:

    python3 backend/scripts_send_newsletter.py backend/newsletters/2026-09-launch.html \
        --subject "lazymate.dev has a new look"

That performs a DRY RUN: it reports how many people would receive it and sends
nothing. Add --send to deliver, which asks for confirmation first.

Reads NEWSLETTER_ADMIN_TOKEN from the environment, or --token.
"""

from __future__ import annotations

import argparse
import json
import os
import ssl
import sys
import urllib.error
import urllib.request
from pathlib import Path

try:
    import certifi
except ImportError:  # pragma: no cover
    certifi = None


def ssl_context() -> ssl.SSLContext:
    """Python on macOS often has no system CA bundle; the backend does the same."""
    if certifi is not None:
        return ssl.create_default_context(cafile=certifi.where())
    return ssl.create_default_context()

DEFAULT_API = "https://resume-project-qh2u.onrender.com"


def post(api: str, token: str, body: dict) -> dict:
    req = urllib.request.Request(
        f"{api.rstrip('/')}/newsletter/send",
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json", "X-Admin-Token": token},
        method="POST",
    )

    try:
        # Render's free tier sleeps; a cold start can take most of a minute.
        with urllib.request.urlopen(req, timeout=120, context=ssl_context()) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8")
        try:
            detail = json.loads(detail).get("detail", detail)
        except json.JSONDecodeError:
            pass
        sys.exit(f"error  HTTP {exc.code}: {detail}")
    except urllib.error.URLError as exc:
        sys.exit(f"error  could not reach {api}: {exc.reason}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Send a newsletter from an HTML file.")
    parser.add_argument("html", type=Path, help="Path to the .html body")
    parser.add_argument("--subject", required=True)
    parser.add_argument(
        "--text",
        type=Path,
        help="Plain-text alternative. Defaults to the .txt file beside the HTML if present.",
    )
    parser.add_argument("--reply-to")
    parser.add_argument("--from-email", help="Override RESEND_FROM_EMAIL for this send.")
    parser.add_argument("--api", default=os.getenv("NEWSLETTER_API", DEFAULT_API))
    parser.add_argument("--token", default=os.getenv("NEWSLETTER_ADMIN_TOKEN"))
    parser.add_argument("--send", action="store_true", help="Actually deliver. Without this it is a dry run.")
    parser.add_argument("--yes", action="store_true", help="Skip the confirmation prompt.")
    args = parser.parse_args()

    if not args.token:
        sys.exit("error  set NEWSLETTER_ADMIN_TOKEN or pass --token")
    if not args.html.is_file():
        sys.exit(f"error  no such file: {args.html}")

    html = args.html.read_text(encoding="utf-8")

    text_path = args.text or args.html.with_suffix(".txt")
    text = text_path.read_text(encoding="utf-8") if text_path.is_file() else None
    if text is None:
        print("note   no plain-text alternative found — sending HTML only.")
        print("       A .txt version improves deliverability. Create", text_path.name)

    body = {
        "subject": args.subject,
        "html": html,
        **({"text": text} if text else {}),
        **({"reply_to": args.reply_to} if args.reply_to else {}),
        **({"from_email": args.from_email} if args.from_email else {}),
    }

    # Always rehearse, whether or not this run will deliver.
    preview = post(args.api, args.token, {**body, "dry_run": True})
    count = preview.get("subscriber_count", 0)

    print(f"\n  subject     {args.subject}")
    print(f"  body        {args.html}  ({len(html):,} chars)")
    print(f"  text        {text_path if text else '(none)'}")
    print(f"  recipients  {count}")
    print(f"  batches     {preview.get('batch_count', 0)}")

    if "{unsubscribe_url}" not in html:
        print("  note        no {unsubscribe_url} in the HTML — a default footer will be appended")

    if not args.send:
        print("\ndry run — nothing sent. Add --send to deliver.\n")
        return

    if count == 0:
        sys.exit("\nnothing to do — no active subscribers.\n")

    if not args.yes:
        print(f"\nThis will email {count} {'person' if count == 1 else 'people'} immediately. There is no undo.")
        if input('Type "send" to confirm: ').strip() != "send":
            sys.exit("aborted.")

    result = post(args.api, args.token, {**body, "dry_run": False})
    print(f"\nsent to {result.get('subscriber_count')} in {result.get('batch_count')} batch(es)")
    for email_id in result.get("email_ids", []):
        print(f"  {email_id}")
    print()


if __name__ == "__main__":
    main()
