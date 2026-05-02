# Magland Books — Developer Guide

Practical onboarding for working in this repo. Pair this with [`CLAUDE.md`](./CLAUDE.md) (project rules — read by Claude Code automatically) and [`PRODUCT.md`](./PRODUCT.md) (locked brand thesis).

If you only want to view the homepage mockups, see [`README.md`](./README.md). This guide is for the production Next.js app.

---

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack) + React 19
- **Language**: TypeScript 5 (strict, `noUncheckedIndexedAccess`)
- **Styling**: Tailwind CSS 4 with `@tailwindcss/postcss`
- **Tests**: Jest 30 + React Testing Library, Playwright 1.59 (desktop + mobile projects)
- **Lint**: ESLint 9 (flat config, `eslint-config-next/core-web-vitals` + `typescript`) plus a project-specific rule set in `.claude/conventions.json`
- **Payments**: Square Web Payments SDK (client) + Square Node SDK (server)
- **Email**: Resend — transactional send for the contact form (To: Summer, Reply-To: visitor) and Audiences for newsletter signups (with managed unsubscribe)
- **Hosting**: designed for Vercel
- **Brand**: locked, pulled directly from `mockups/homepage/variant-2.html`. Do not introduce new colors or fonts. See `PRODUCT.md`.

---

## Prerequisites

- Node 20.x or newer (Volta or `nvm use 20` is fine)
- A clone of this repo
- A Resend account (free tier is plenty) with `maglandbooks.com` verified as a sending domain
- A Square Developer account (sandbox is free; production is your call)
- Optional but recommended: Claude Code (`brew install anthropic/tap/claude-code`) — picks up the agents and skills in `claude-config/` once you run `./install.sh`

---

## Quick start

```bash
git clone https://github.com/scott-njr/magland-books-claude-setup.git
cd magland-books-claude-setup

npm install
bash scripts/install-git-hooks.sh   # ⚠️ DO THIS FIRST — installs the pre-commit secret scanner
cp .env.local.example .env.local    # then fill values — see below

npm run dev        # http://localhost:3000
```

The `install-git-hooks.sh` step installs a pre-commit hook that **blocks any git commit containing what looks like an API key, access token, or private key**. This is your seatbelt — leave it on. See [Secret hygiene](#secret-hygiene) below.

Without filled-in env vars, forms render and no-op gracefully in dev. Checkout shows a "not yet configured" fallback. Set up the integrations below to make them live.

---

## Secret hygiene

**The most expensive mistake in this project is committing a secret to GitHub.** Once a secret lands in git history, it's leaked — even if you remove it in a later commit. Anyone scanning public repos (and there are bots that do this 24/7) will pick it up within minutes. The cost: rotating credentials at every service, possibly explaining a fraudulent Square charge, possibly worse.

### Three layers of defense (all are on)

1. **`.gitignore`** blocks `.env`, `.env.local`, `.env*.local`, `*.pem`, `*.key`, `*service-account*.json`, and other common credential file patterns. You cannot accidentally `git add .env.local`.
2. **Pre-commit hook** (installed by `scripts/install-git-hooks.sh`) scans the staged content of every commit for things that look like secrets. If it finds one, the commit is **blocked** with a message explaining what to do. Run the install script once after cloning.
3. **CI** runs the same scanner on every PR. If a secret slips past 1 and 2, this catches it before merge.

### What counts as a secret

If you can't tell, treat it as one. The obvious ones:

- Anything labeled `*_TOKEN`, `*_SECRET`, `*_KEY`, `*_PASSWORD` with a non-empty value
- API keys from Square (`SQUARE_ACCESS_TOKEN`), Resend (`RESEND_API_KEY`), Anthropic, OpenAI, AWS, etc.
- Webhook signing keys (`SQUARE_WEBHOOK_SIGNATURE_KEY`, etc.)
- Anything containing `BEGIN PRIVATE KEY`
- Any long random-looking string Scott or a service handed you

What is **not** a secret: anything starting with `NEXT_PUBLIC_*`. Those are public by design (Next.js exposes them to the browser).

### The right place for secrets

| Where | What goes there |
|---|---|
| `.env.local` | Real values. Gitignored. Stays on your machine. **Never edited by Claude — only by you.** |
| `.env.local.example` | The template — variable names with empty values. Committed. The contract for what env vars exist. |
| Vercel project settings → Environment Variables | Production and Preview values. Set in the Vercel dashboard, not in code. |
| Square dashboard / Resend dashboard | Service-side secrets like the Square access token and the Resend API key (each provider holds them on its end too). |

### What to do if you accidentally commit a secret

This is recoverable, but you must act fast and in this order:

1. **Rotate the secret immediately** at the issuing service (Square dashboard → regenerate token; Resend dashboard → revoke and regenerate API key; etc.). Removing it from a later commit does not unleak it.
2. **Update `.env.local`** (and Vercel, and any deployed environment) with the new value.
3. **Tell Scott** so he can verify nothing fraudulent happened in the window the secret was exposed.
4. *Optional:* rewrite history with `git filter-repo` or BFG to scrub the secret from past commits. Not strictly necessary once the secret is rotated, but cleaner.

### What Claude Code is configured to do

`CLAUDE.md` (the file Claude reads on every session) has a top-priority "Secrets" section that tells Claude to:
- Never write a real secret into any tracked file
- Refuse if the user asks to "commit my `.env.local`" or similar
- Refuse to echo `.env.local` contents back in tool calls or chat
- Stop and warn before any commit if the diff looks like it contains a secret
- Tell you exactly what to do if you accidentally paste a secret into a chat with it

This makes Claude an active participant in the defense, not a passive code-writer.

---

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

| Variable | Where it goes | Why it's needed |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | client + server | Canonical URL for sitemap / OG / webhook URL construction. `http://localhost:3000` in dev. |
| `RESEND_API_KEY` | server only | Resend API key. Used for both the contact-form transactional send and newsletter Audience adds. Rotate at resend.com when leaked. |
| `RESEND_NEWSLETTER_AUDIENCE_ID` | server only | UUID of the Resend Audience that newsletter signups are added to. Find it in the Resend dashboard under Audiences. |
| `NEXT_PUBLIC_SQUARE_APPLICATION_ID` | client + server | Square app ID. Sandbox values start with `sandbox-sq0idb-`, production with `sq0idp-`. |
| `NEXT_PUBLIC_SQUARE_LOCATION_ID` | client + server | The Square location that owns the catalog and receives the order. |
| `SQUARE_ACCESS_TOKEN` | server only | OAuth access token for Orders + Payments API. Never expose. |
| `SQUARE_ENVIRONMENT` | server only | `sandbox` or `production`. |
| `SQUARE_WEBHOOK_SIGNATURE_KEY` | server only | HMAC key used by `verifyWebhookSignature` to authenticate Square webhook deliveries. |

### Setting up Resend

1. Sign up at https://resend.com (free tier: 100 emails/day, 3,000/month — far more than this site will ever use).
2. **Verify the domain** — Domains → Add Domain → enter `maglandbooks.com`. Resend gives you 4 DNS records (SPF, DKIM ×2, DMARC). Add them at the domain's DNS host. Wait for verification (minutes to a few hours).
3. **Create an Audience** for newsletter signups — Audiences → Create Audience → name it (e.g. "Newsletter"). Copy its UUID into `RESEND_NEWSLETTER_AUDIENCE_ID`.
4. **Generate an API key** — API Keys → Create API Key → "Full Access" scoped to this project. Copy into `RESEND_API_KEY`.
5. Confirm the addresses in `src/config/site.ts`:
   - `CONTACT_FROM_EMAIL` — must match a verified sender on the verified domain (default: `Magland Books <hello@maglandbooks.com>`).
   - `CONTACT_NOTIFY_EMAIL` — where contact-form submissions are delivered (default: `summer@maglandbooks.com`). This must be a real, working mailbox the team can read.
6. **Pre-verification testing** (optional): if you want to send before the DNS propagates, temporarily change `CONTACT_FROM_EMAIL` to `'Magland Books <onboarding@resend.dev>'`. Switch back once the domain shows verified.

The contact form's reply-to is the visitor's email, so hitting Reply in Gmail responds directly to them. Newsletter signups go straight to the Audience and inherit Resend's managed unsubscribe / List-Unsubscribe headers.

### Setting up Square

1. Create or open the app at https://developer.squareup.com/apps.
2. Sandbox tab → copy Application ID, Location ID, Access Token. Put them in `.env.local` with `SQUARE_ENVIRONMENT=sandbox`.
3. Once a deployment URL exists: Square dashboard → Webhooks → add subscription for `${NEXT_PUBLIC_APP_URL}/api/checkout/webhook`. Subscribe to `payment.updated`, `order.updated`, `refund.created`. Copy the signature key into `SQUARE_WEBHOOK_SIGNATURE_KEY`. Redeploy.
4. Production: repeat with the Production tab credentials, change `SQUARE_ENVIRONMENT=production`, rotate the webhook signature key, and redeploy. The CSP in `next.config.ts` already permits both sandbox and production CDN/API hosts.

Sandbox test card: `4111 1111 1111 1111`, any future expiry, any CVV, any 5-digit ZIP.

---

## Scripts

```bash
npm run dev               # Next dev server (verify port 3000 is free first)
npm run build             # Production build
npm run start             # Run the built app

npm run lint              # ESLint (Next core-web-vitals + typescript)
npm run lint:conventions  # Project-specific lint rules from .claude/conventions.json

npm test                  # Jest unit tests
npm run test:watch        # Jest watch mode

npm run test:e2e          # Playwright (defaults to http://localhost:3000)
npm run test:e2e:live     # Playwright with E2E_SUBMIT_FORM=1 (real form submits)
npm run test:e2e:report   # Open the latest Playwright HTML report
```

**Quality gates that must pass before merging:**

```bash
npm run lint && npm run lint:conventions && npm test && npm run build
```

The `.claude/settings.json` hooks run `lint:conventions` automatically on every Edit/Write and at session Stop, so violations surface in real time inside Claude Code. GitHub Actions runs **all four gates** (lint, lint:conventions, test, build) on every PR and every push to `main` — see `.github/workflows/ci.yml`. PRs cannot merge until CI is green.

---

## Project structure

```
src/
├── app/                            # App Router routes
│   ├── page.tsx                    # Homepage (Hero → TrustRow → BookRow ×2 → Mission → NewsletterForm)
│   ├── layout.tsx                  # Root layout (fonts, header, footer)
│   ├── globals.css                 # Design tokens (CSS custom properties + Tailwind 4 @theme)
│   ├── actions.ts                  # Server actions: subscribeNewsletter, submitContact
│   ├── bookshelf/                  # /bookshelf + /bookshelf/[slug] book detail pages
│   ├── our-family/, publishing/, letters/, write-to-us/, activities/
│   ├── privacy/, store-policy/, shipping-returns/
│   ├── cart/, checkout/, checkout/success/
│   ├── api/checkout/{create-order,pay,webhook}/route.ts
│   ├── sitemap.ts, robots.ts, opengraph-image.tsx, not-found.tsx
│
├── components/                     # Atomic components — one per file, named exports
│   ├── Header.tsx, Footer.tsx, Hero.tsx, Mission.tsx, BookRow.tsx, BookCard.tsx, BookDetail.tsx
│   ├── NewsletterForm.tsx, ContactForm.tsx, CheckoutForm.tsx, CheckoutOrderSummary.tsx
│   ├── CartButton.tsx, CartView.tsx, AddToBagButton.tsx, TrustRow.tsx
│   └── icons/                      # Inline SVG icons only — no Lucide / Heroicons / react-icons
│
├── config/                         # Single sources of truth
│   ├── catalog.ts                  # The 2-book catalog (server is the price authority)
│   ├── site.ts                     # Routes, social, theme color
│   ├── ui.ts                       # Spacing, button variants, type scale
│   └── messages.ts                 # Copy strings (form success/error, microcopy)
│
├── lib/
│   ├── validation.ts               # Custom validators (no Zod): name, email, message, address
│   ├── rate-limit.ts               # In-memory per-IP bucket rate limiter
│   └── services/
│       ├── resend.ts               # Resend bridge — contact-form transactional + newsletter audience
│       └── square.ts               # Orders + Payments + webhook signature verification
│
├── hooks/useCart.ts                # localStorage cart via useSyncExternalStore
├── types/index.ts
└── __tests__/                      # Jest unit tests

e2e/                                # Playwright smoke tests
mockups/                            # Design source of truth (variant-2.html is the locked direction)
public/assets/                      # Real brand assets (logo, watercolor covers)
.claude/                            # Project-level Claude Code config (settings + conventions)
scripts/lint-conventions.sh         # Generic JSON-driven lint runner
```

---

## Conventions you must follow

These are enforced by `.claude/conventions.json` (regex lint rules) and by the prose rules in `CLAUDE.md`. The Claude Code hooks fire on every Edit/Write — violations surface immediately. Run `npm run lint:conventions` before pushing.

| Rule | Why |
|---|---|
| **No `: any`** | Strict mode. Use type guards, generics, or `unknown` + narrowing. |
| **No `style={{}}`** | Tailwind utilities only. If a one-off animation needs CSS, put it in `globals.css`. |
| **No external icon libs** (lucide-react, react-icons, @heroicons) | Inline SVG only, in `src/components/icons/`. Keeps the bundle tight and the look consistent. |
| **No hex literals outside `globals.css`** | Use design tokens (`text-teal`, `bg-blush`, etc.). One named exception: `THEME_COLOR` in `src/config/site.ts` (browser meta tag can't reference a CSS variable). |
| **No `.replace()`-built Tailwind classes** | Tailwind classes must be static strings so the JIT can detect them. Use `clsx` for conditional classes. |
| **No emojis as UI icons** | Use inline SVG. Emojis in editorial copy are fine if they read naturally. |

Additional prose rules (not regex-enforceable but still required):

- **One component per file**, named export, file name matches component name.
- **Service layer enforced**: any external HTTP call (Resend, Square, anything else) goes through `src/lib/services/*` — never directly from a route or component.
- **Every form**: honeypot field + per-IP rate limit + custom validation in this order. See `src/app/actions.ts` for the canonical pattern.
- **Server is the price authority**: never trust client-sent prices. The checkout route reconstructs line items from `BOOKS` in `src/config/catalog.ts` using only the slug + quantity from the client.
- **`next/image` for all images**, with descriptive alt text. Cover images include illustrator credit.
- **Webhooks verify HMAC against the raw request body** before parsing — `req.text()` then `JSON.parse`, not `req.json()` first.

---

## Common tasks

### Add a book to the catalog

1. Edit `src/config/catalog.ts` — add a new entry to `BOOKS` with `id`, `slug`, `title`, `subtitle`, `byline`, `priceCents`, `description`, `coverImage`, `coverAlt`, `pageCount`, `format`, `ageRange`, `isbn`.
2. Drop the cover JPEG into `public/assets/`.
3. Create a detail page at `src/app/bookshelf/<slug>/page.tsx` mirroring `pirate-flu/page.tsx`.
4. Update `src/app/sitemap.ts` if the route doesn't auto-discover (it does — but verify).
5. Add JSON-LD via the existing `BookDetail` component.

### Add a new page

1. Create `src/app/<route>/page.tsx` with `generateMetadata` for title + description.
2. Add the route to `src/config/site.ts` `ROUTES`.
3. If it should appear in the header or footer, add the link in `Header.tsx` / `Footer.tsx`. Keep nav flat — no submenus.
4. Update `sitemap.ts` if the new route is dynamic.

### Add a form

Mirror `NewsletterForm.tsx` or `ContactForm.tsx`:

1. Client component with `useFormState` against a server action in `src/app/actions.ts`.
2. Server action: `checkRateLimit` → honeypot check → custom validators → service call → return `FormState`.
3. Add the field validator to `src/lib/validation.ts` if it doesn't exist.
4. Always include the honeypot input (visually hidden).
5. Write a Jest test for the validator and a Playwright smoke test for the rendered form.

### Change a color or font

The brand is **locked**. If you genuinely need a new token (you almost never do):

1. Add it to the `:root` block in `src/app/globals.css`.
2. Expose it via the `@theme inline` block so Tailwind picks it up.
3. Update `PRODUCT.md` if the change is intentional and approved.

If you're trying to introduce a new font or palette: stop and re-read `PRODUCT.md` and `CLAUDE.md`. Brand changes are not in scope.

### Add a new lint rule

1. Add the rule to `.claude/conventions.json` (`id`, `description`, `source`, `scope` glob, `pattern` regex, optional `exclude`, `severity`).
2. Run `npm run lint:conventions` to verify the rule fires only on violations.
3. Document the rule in `CLAUDE.md` under "Conventions" if it's new prose territory.

### Add a Square line-item type or new SKU

Currently the price authority is `BOOKS` in `src/config/catalog.ts`. To migrate to Square Catalog (recommended once you have more than ~10 SKUs):

1. Create catalog items in the Square dashboard with stable `catalogObjectId` values.
2. Replace the inline price lookup in `src/lib/services/square.ts` `createOrder` with `lineItems.map(item => ({ catalogObjectId, quantity }))`.
3. Square will then own pricing, tax, and discount math.

---

## Deploying

### Vercel (recommended)

1. Push to GitHub.
2. Import the repo at https://vercel.com — framework preset: Next.js.
3. Set environment variables (paste from `.env.local`, but use the **production** Resend API key and **production** Square credentials when you cut over).
4. Trigger a deploy. Watch the build log; quality gates already ran via GitHub Actions (`.github/workflows/ci.yml`) on the push.
5. Once a preview URL exists, register the webhook URL in Square and rotate `SQUARE_WEBHOOK_SIGNATURE_KEY`.

### Pre-launch checklist

- [ ] All env vars set in Vercel for both Preview and Production environments
- [ ] Webhook URL registered in Square dashboard, signature key rotated
- [ ] Resend domain (`maglandbooks.com`) verified, API key + Audience ID set in Vercel
- [ ] Sandbox checkout tested end-to-end (test card `4111 1111 1111 1111`)
- [ ] Contact form tested end-to-end (email lands at `summer@maglandbooks.com` with reply-to set to the visitor)
- [ ] Newsletter signup tested end-to-end (subscriber appears in the Resend Audience)
- [ ] `npm run build` passes locally
- [ ] `/seo-audit` clean against the staging URL (Lighthouse ≥ 95 on all four scores)
- [ ] DNS plan agreed with the family — when do we cut from Wix to Vercel? Have a rollback step.

---

## Working with Claude Code

The repo is set up so Claude Code is productive out of the box.

- `CLAUDE.md` is read automatically on session start
- `.claude/settings.json` runs `lint:conventions` after every Edit/Write
- `.claude/conventions.json` is the lintable rule set
- The `claude-config/` directory bundles three agents (`advisor`, `art-director`, `dev-nextjs-app`) and three skills (`design-explore`, `mockup`, `seo-audit`). Run `./install.sh` once to install them globally to `~/.claude/`.

Useful prompts:

- *"Use the dev-nextjs-app agent to build a /authors page that …"*
- *"Have the advisor weigh in before I drop this column."*
- *"Run /seo-audit against staging.maglandbooks.com"*
- *"Run /mockup for a printable activities page — three contrasting directions, locked brand."*

### Built-in Claude Code commands worth knowing

These ship with Claude Code itself — no install needed beyond the CLI.

| Command | When to use |
|---|---|
| `/security-review` | Before merging any branch that touches user input, payments, webhooks, env-var handling, or external HTTP. Runs a full security review of the pending changes on the current branch and flags injection vectors, missing rate limits, secret leakage, and OWASP-class issues. **Run before every merge to `main` that adds or modifies a form, API route, or service.** |
| `/review` | Pull request review. Reads the diff, spots regressions, suggests improvements. Useful when reviewing someone else's PR or self-reviewing before requesting review. |
| `/init` | Initialize or refresh `CLAUDE.md` for a codebase. Already done here — only re-run if the project structure changes substantially. |

### Pre-merge checklist for sensitive changes

When a PR touches anything in `src/lib/services/*`, `src/app/api/*`, `src/lib/validation.ts`, `src/lib/rate-limit.ts`, `src/app/actions.ts`, `next.config.ts`, or `.env.local.example`:

1. `npm run lint && npm run lint:conventions && npm test && npm run build` — all four pass
2. `/security-review` from inside Claude Code — address every flagged issue or document why it's accepted
3. If touching the Square flow: re-run a sandbox checkout end-to-end before merging
4. If touching the Resend bridge: submit a test contact message and a test newsletter signup before merging — confirm the email lands and the subscriber appears in the Audience

---

## Where to ask questions

- Code-level questions: open an issue or DM Scott
- Brand questions: re-read `PRODUCT.md` first, then ask Summer
- Claude Code / agent questions: see [claude.com/code](https://claude.com/code) or the `agent-advisor` skill if installed globally

---

## License

Code: MIT (or your choice — confirm with Scott before relicensing).
Brand assets, mockups, and brand thesis: © 2026 Magland Books, LLC. All rights reserved.
