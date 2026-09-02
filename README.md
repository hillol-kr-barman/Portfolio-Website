# Lazymate / Resume Website

This is my personal portfolio and resume site. It started as a straightforward resume website, but the finished version is closer to a small full-stack portfolio app: a polished landing page, project showcase, about/CV section, a logged-in code playground, newsletter signup, and a small "buy me a coffee" support flow.

The core build is done for now. I may still tweak the visual design later, but the main pieces are in place.

## What Is In Here

- A React + Vite frontend with a custom single-page routing setup.
- A responsive portfolio home page with a split hero and `stack.ts` code panel, featured projects, tech stack tiles, newsletter signup, and availability calls to action.
- A projects page listing active work with status pills and per-project technology chips.
- An about page with profile details, work history, education, achievements, a timeline, and a downloadable PDF resume.
- Supabase auth for login, signup, logout, forgot password, and password reset flows.
- A Monaco-powered code playground laid out as a three-column app frame — document rail, editor with an open-file tab strip, and a document/sharing/activity inspector — where logged-in users can save snippets, reopen them later, delete one or all saved snippets, and create shareable read-only links.
- A FastAPI backend for newsletter subscription, Supabase signup support, and Stripe Checkout session creation.
- Stripe-powered support tiers and custom support amounts on the coffee page.
- Supabase SQL scripts for the playground document table, row-level security policies, and auth profile syncing.
- Deployment helpers for SPA routing on Vercel/Netlify-style hosts.

## Tech Stack

The frontend is built with:

- React 19
- Vite
- TypeScript
- Tailwind CSS 4 through the Vite plugin
- Headless UI
- Heroicons
- Monaco Editor
- Supabase JS
- `@hillolbarman/ui` for shared types and dialog primitives

The backend is built with:

- FastAPI
- Pydantic
- Stripe's Python SDK
- Supabase REST/Auth calls through Python's standard HTTP tooling
- Uvicorn

## Main Pages

- `/` - the main Lazymate landing page with the hero, stack section, featured builds, newsletter signup, and support CTA.
- `/projects` - the full projects list.
- `/playground` - the code playground. Anyone can view the editor, but saving and sharing documents requires login.
- `/about` - profile, contact details, work/education history, achievements, timeline, and CV download.
- `/coffee` - support page with Stripe Checkout tiers and custom amount support.
- `/login`, `/signup`, `/forgot-password`, `/reset-password` - Supabase-backed auth screens. `/register` still resolves, as an alias of `/signup`.
- `/playground?share=<token>` - the read-only recipient view for a shared snippet.
- Any unknown route falls through to the custom 404 page.

## How The App Is Put Together

The root React app lives in `src/`. `src/App.tsx` owns the lightweight client-side routing, lazy-loads most pages, tracks the current Supabase user, and passes navigation/auth state into the pages.

Shared layout pieces live in `src/components/`: `PageShell` (canvas grid + header + footer), `AppHeader` / `AppFooter`, `SectionRule` (the `200px 1fr` eyebrow grid that every content section uses), `CodePanel`, `AuthShell`, `Dialogs`, `SharedSnippetView`, and the `LogoMark` / `Wordmark` brand pair.

Most portfolio copy and project data is in `src/pages/pageData/homePageData.tsx`. Playground language options, starter snippets, and relative timestamps live in `src/lib/playgroundLanguages.ts`; saved documents are handled by `src/lib/playgroundStore.ts`, with the Supabase browser client configured in `src/lib/supabaseClient.ts`.

## Design System

The visual language is a calm documentation-site aesthetic: tight geometric sans typography (Geist / Geist Mono), generous whitespace, hairline dividers, numbered section rules, and a 56x56 canvas grid.

All tokens live in `src/index.css`, which overrides the base tokens from `@hillolbarman/ui`. The accent is `#34d399` — roughly half the chroma of the old `#9eff1f` lime, at an emerald hue. It is a **state** colour only: active nav dot, live status, code strings, share-on, active document, current timeline period. It appears at most two or three times per screen; a fourth candidate becomes `--color-bright` instead. Primary buttons are near-white (`#e9eef1`), never green, and carry no glow.

`src/index.css` also resets the element defaults that `@hillolbarman/ui` ships in its base layer (mono accent anchors, bold headings, muted paragraphs), because the redesign drives all of that from utilities.

The backend lives in `backend/`. It exposes a health check, signup helper, newsletter subscription endpoint, and Stripe checkout endpoint.

## Backend API

The FastAPI app currently exposes:

- `GET /` - simple health check.
- `POST /signup` - Supabase signup helper.
- `POST /newsletter/subscribe` - stores newsletter subscribers in Supabase.
- `POST /newsletter/send` - sends the newsletter to all active subscribers via Resend. Guarded by the `X-Admin-Token` header.
- `GET /newsletter/unsubscribe` - unsubscribe page reached from the link in each email.
- `POST /newsletter/unsubscribe` - RFC 8058 one-click endpoint, used by mail clients' own Unsubscribe button.
- `POST /create-checkout-session` - creates a Stripe Checkout session for the coffee page.

## Local Setup

The frontend lives in `frontend/`, which is also the Vercel project root. Run
these from there:

```bash
cd frontend
npm install
```

Run the frontend:

```bash
npm run dev
```

Run a production build:

```bash
npm run build
```

Preview the built frontend:

```bash
npm run preview
```

Run ESLint:

```bash
npm run lint
```

Lint covers `.ts` and `.tsx` through `typescript-eslint`. If it ever reports
zero files, check the `files` glob in `eslint.config.js` — a `js,jsx`-only
pattern silently matches nothing in this codebase and lets hook-order bugs
through.

## Backend Setup

Create and activate a Python virtual environment if you want to run the backend locally:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Then start FastAPI:

```bash
uvicorn main:app --reload --port 8000
```

The frontend defaults to `http://127.0.0.1:8000` for API calls unless `VITE_API_BASE_URL` is set.

## Environment Variables

Frontend variables:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_or_anon_key
```

`VITE_SUPABASE_ANON_KEY` also works as a fallback if you are using the older Supabase naming.

Backend variables:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
FRONTEND_BASE_URL=http://localhost:5173

# Newsletter sending
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=Your Name <newsletter@yourdomain>
NEWSLETTER_ADMIN_TOKEN=a_long_random_string_you_invent
```

The backend will also read compatible `VITE_SUPABASE_*` values from `.env.local` for some Supabase auth calls. For newsletter writes, it needs `SUPABASE_SERVICE_ROLE_KEY` — the anon key cannot insert, and there is no fallback for this one.

`NEWSLETTER_ADMIN_TOKEN` is not issued by any service. Invent it, and treat it as the only thing standing between the public internet and your send endpoint:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

Optional:

```bash
NEWSLETTER_PUBLIC_BASE_URL=https://your-site   # host serving /newsletter/unsubscribe
PUBLIC_APP_URL=https://your-site               # falls back to FRONTEND_BASE_URL
```

Unsubscribe links are built from `NEWSLETTER_PUBLIC_BASE_URL`, then `RENDER_EXTERNAL_URL` (which Render sets automatically). This must resolve to the **API**, not the site: an SPA host rewrites unknown paths to `index.html`, so a link pointed at the frontend renders the 404 page and never unsubscribes anyone. To serve it from the site domain instead, proxy the path — `frontend/vercel.json` has a rewrite for exactly this.

## Supabase Notes

The playground uses a `playground_documents` table. The SQL for that is in:

```text
backend/sql/supabase_playground_documents.sql
```

That script creates the table, adds a share token, updates `updated_at` through a trigger, enables RLS, lets owners manage their own documents, and allows public reads for documents marked as shared.

There is also a small auth profile sync script:

```text
backend/sql/supabase_new_user_sync.sql
```

The newsletter endpoint writes to a `newsletter_subscribers` table through Supabase REST. Run `backend/sql/newsletter_setup.sql` against your project before the first send — it adds the `is_active` and `unsubscribe_token` columns and backfills tokens for existing rows. Sending fails with a clear error if `unsubscribe_token` is missing.

## Newsletter

Subscribers are stored in Supabase, not in Resend. The signup form on the home
page posts to `POST /newsletter/subscribe`; sending reads that table and hands
the messages to Resend.

### Writing and sending an issue

Write the email as a plain `.html` file in `backend/newsletters/`, with a
matching `.txt` beside it for the plain-text alternative. Copy `template.html`
and `template.txt` to start.

```bash
python3 backend/scripts_send_newsletter.py backend/newsletters/letter_1.html \
    --subject "Your subject"
```

That is a **dry run**: it reports the recipient count, batch count and body
size, and sends nothing. Add `--send` to deliver, which asks for typed
confirmation first. The admin token is read from `backend/.env`, the
environment, or `--token`.

Everything in the HTML file is transmitted verbatim, comments included. Never
put a token or any other secret in one.

Write `{unsubscribe_url}` anywhere in the HTML or text and it is replaced with
that recipient's personal link. Omit it and a default footer is appended.

### Deliverability

Gmail and Yahoo have required three things of bulk senders since February 2024.
Mail that is missing any of them tends to land in spam regardless of content:

1. **SPF and DKIM** — published when you verify your domain in Resend.
2. **DMARC** — a `TXT` record at `_dmarc.yourdomain`. The `p` tag is mandatory;
   a record without it is invalid and treated as absent.

   ```text
   v=DMARC1; p=none; rua=mailto:you@yourdomain
   ```

   `p=none` is monitor-only and the right starting policy. Tighten to
   `quarantine` once the reports show only your sender using the domain.
3. **One-click unsubscribe** — the `List-Unsubscribe` and `List-Unsubscribe-Post`
   headers, which `send_batch_to_resend` sets on every message. These are what
   put a native Unsubscribe control in the mail client.

A new sending domain has no reputation and may still be filtered for the first
few sends. Marking a message as "not spam" moves that along faster than any
header.

## Stripe Notes

The coffee page calls the FastAPI backend at:

```text
POST /create-checkout-session
```

The backend supports three built-in tiers:

- `espresso` - $5 AUD
- `double` - $10 AUD
- `snacks` - $20 AUD

It also supports a custom amount, with validation in both the frontend and backend. Successful checkouts return to `/coffee?status=success`; cancelled checkouts return to `/coffee?status=cancelled`.

## Project Structure

```text
.
|-- backend/
|   |-- main.py
|   |-- newsletter_api.py
|   |-- scripts_send_newsletter.py
|   |-- newsletters/            # newsletter drafts + template
|   |-- sql/
|   |-- requirements.txt
|   `-- Procfile
|-- frontend/
|   |-- public/
|   |   |-- HillolBarman_Resume.pdf
|   |   `-- _redirects
|   |-- src/
|   |   |-- assets/
|   |   |-- components/
|   |   |-- lib/
|   |   |-- pages/
|   |   |-- App.tsx
|   |   |-- main.tsx
|   |   `-- index.css
|   |-- package.json
|   |-- vite.config.ts
|   `-- vercel.json
|-- .github/workflows/
`-- README.md
```

## Deployment

The frontend is a Vite SPA. `vercel.json` rewrites all routes to `index.html`, and `public/_redirects` does the same style of fallback for hosts that use Netlify-style redirects.

The backend has a `Procfile` for running Uvicorn:

```text
web: uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
```

In production, the frontend needs `VITE_API_BASE_URL` pointed at the deployed FastAPI backend, and the backend needs the Supabase, Stripe, and frontend base URL variables listed above.

## Current State

The project is finished from a core-feature point of view and has been through a full visual redesign.

Known follow-ups:

- **Playground output pane.** The design includes an Output / Problems pane below the editor with real stdout and a run timing. Code execution does not exist yet, so the pane is not built and the editor fills the centre column. The `Cmd-Enter` "Run" shortcut is listed in the rail but is not wired up.
- **Technology icons** still load from `cdn.simpleicons.org` at runtime. Self-host them for production.
- **GitHub sign-in** on the auth screens calls Supabase OAuth. It needs the GitHub provider enabled in the Supabase project; until then the button surfaces a provider error.
- **Unsubscribe links point at the API host.** `frontend/vercel.json` proxies `/newsletter/unsubscribe` so they can sit on the site domain via `NEWSLETTER_PUBLIC_BASE_URL`, but the rewrite was not taking effect when last checked. Confirm the proxy works before setting that variable — with it set and the proxy down, every unsubscribe link 404s.
- **Newsletter has no composing UI.** Issues are written as HTML files and sent with `scripts_send_newsletter.py`. Resend's own Broadcasts dashboard offers a visual editor, but only for contacts stored in a Resend Audience — using it would mean syncing subscribers there instead of, or alongside, Supabase.
