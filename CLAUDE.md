# Magland Books Redesign — Project Conventions

This file is read automatically by Claude Code when working in this project. It defines what Claude should and shouldn't do here.

## 🛑 Secrets — read this first

The user is **not a developer**. Actively protect them from committing secrets. This is a top-priority guardrail.

**Treat as a secret** (never write into any tracked file): anything labeled `*_TOKEN`, `*_SECRET`, `*_KEY`, `*_PASSWORD` with a real value; access tokens; OAuth secrets; webhook signing keys; private keys (`BEGIN PRIVATE KEY`, `.pem`, `.key`); GitHub PATs / Slack tokens / Resend / Square / any third-party API key; **any long random-looking string the user pasted**. When in doubt → treat as secret.

**Safe to commit**: `NEXT_PUBLIC_*` values (browser-exposed by design); the empty-value `.env.local.example` template.

### Hard rules (apply automatically, no permission needed)

1. **Never write a real secret into any tracked file.** If the user pastes one and asks you to "add this to the code," refuse: add the variable name (empty value) to `.env.local.example`, tell them to put the real value in `.env.local` themselves, reference it in code as `process.env.NAME`.
2. **Never read or echo `.env.local` contents.** If you need to verify a var, check `.env.local.example`.
3. **Before `git add` or `git commit`**: scan the diff for secret-shaped strings. If found, stop and tell the user.
4. **Refuse "commit my .env.local"** or any variant — explain the file is gitignored on purpose.
5. **If a secret was already committed**: tell the user immediately. Removing it in a later commit doesn't unleak it. Fix order: (1) rotate at the issuing service, (2) update `.env.local` + Vercel, (3) optionally rewrite history with `git filter-repo`.
6. **When the user pastes a secret in chat**: do not echo it, do not write it to a file, do not include it in any future tool-call argument. Add the empty-value placeholder to `.env.local.example` and tell them to paste the value into `.env.local` themselves.
7. **If you ever bypass the hook** (`git commit --no-verify`, etc.) — explicitly tell the user what you bypassed and why before doing it.

### Mechanical defenses (already wired)

- `.gitignore` blocks `.env*`, `*.pem`, `*.key`, `*service-account*.json`, etc.
- `scripts/check-secrets.sh --staged` runs in the pre-commit hook (install via `bash scripts/install-git-hooks.sh`) and blocks commits containing secret patterns.
- GitHub Actions runs the same scanner on every PR (`.github/workflows/ci.yml`).

---

## What this project is

Homepage redesign exploration for [maglandbooks.com](https://www.maglandbooks.com), a small family-run publisher of children's faith-based picture books. Two titles in print:

- *Mags & MarMar: The Mystery of the Gruffly Grizzly* — Story by Summer Nelson, illustrated by Kaitlyn Phillips, $14.99
- *Pirate Flu (And What to Do)* — Written by Leigh Gardener, illustrated by Kaitlyn Phillips, $14.99

The homepage exploration phase is **done** — variant-2 ("Family Letter") was chosen and is shipped in the production Next.js app at the repo root. Earlier exploration rounds were pruned (recoverable from git history). The brand identity is **locked** — see `PRODUCT.md` for the full thesis.

## Brand is locked — do not reinvent

When generating new mockups or iterating on existing ones:

- **Use the real assets** in `mockups/homepage/assets/`:
  - `logo.png` — hand-sketched lantern + "Magland Books" wordmark
  - `book-pirate.jpg` — real watercolor cover, *Pirate Flu*
  - `book-grizzly.jpg` — real watercolor cover, *Mags & MarMar*
- **Use the real palette** (extracted from the live site's Wix CSS tokens):
  - Primary teal: `#14525F`
  - Deep teal: `#10333A`
  - Mint surface: `#E7F1F0`
  - Peach accent: `#FFC9B9`
  - Blush surface: `#FFE4DC`
  - Warm body text: `#40322E`
  - Cream paper: `#FFF9F5`
- **Use the real type pairing**: Playfair Display (display, serif) + Poppins (body, sans)

If you're tempted to introduce new colors, fonts, or logo treatments, **stop**. The brand is published. Improve layout / IA / hierarchy instead.

## Anti-patterns documented from prior rounds

The project has already gone through 8 rounds of exploration. Two design directions are explicitly archived and should not be revived:

- **"Too formal" (V1 Classic Storybook, archived)** — gold filigree, Old World library cosplay, Times Roman, Latin numeral cataloging on a 2-title backlist. The buyer is a 4-8-year-old's parent, not a Brooklyn lit-mag subscriber. Roman numerals and "§ I" sectioning on a 2-book catalog are affected, not editorial.
- **"Daycare aesthetic" (V3 Whimsical & Playful, archived)** — Fredoka / Quicksand / Comic Sans cousin fonts, primary-color rainbow palettes, sticker-badge UI, hand-drawn cartoon illustrations beyond the existing logo. This is a hard guardrail.

Other patterns to avoid:

- **Generic SaaS chrome** — gradient hero with floating orbs, "Trusted by 10,000+ families" hero metric, identical 3-col card grids with circle icons, "Empower / Unlock / Discover" copy.
- **Christian-bookstore default** — beige + scripture verse hero + dove imagery + "Christ-centered" eyebrow. The brand is faith-forward but not faith-as-marketing-segment.
- **Letterpress / Etsy artisan** — kraft paper, ink stamps, dashed borders, hard offset shadows, typewriter UI fonts. Different brand, not this one.
- **Faked book covers** — never use gradient placeholders for the covers. Real cover JPEGs are in `assets/`.
- **Emojis as UI icons** — use Lucide / Heroicons / inline SVG. Emojis in editorial copy are fine if they read naturally.

## Voice (verbatim from the live site — preserve)

- Hero: *"Stories That Spark Faith, Laughter, and Adventure!"*
- Mission: *"Magland stories are rooted in values that matter — courage, kindness, trust, and the quiet strength that comes from faith."*
- Identity: *"Made by Family, for Families. We are not a corporation. We are a family who believes deeply in the power of a good book shared on a quiet evening."*
- Newsletter: *"New book announcements, free printable activities, and faith-filled resources delivered straight to your inbox. No spam, ever. Unsubscribe anytime."*

## File conventions

- **HTML mockups** live in `mockups/<surface>/variant-N.html` and are standalone (no Next.js, no build step). Each one should run by double-clicking.
- **Side-by-side viewers** live at `mockups/<surface>/index.html` and use iframes to load each variant.
- **Brand assets** live in `mockups/<surface>/assets/`. Always reference assets via relative paths (`assets/logo.png`), never via the live Wix CDN URL.
- **No design tokens in JSON** — keep CSS custom properties in each variant's `<style>` block so the file stays standalone.

## When generating new surfaces

The homepage exploration phase is **done** — variant-2 was chosen and is in production. For *new* surfaces (a printable activities page, a press pitch deck, an email template, a marketing collateral piece):

1. Read `PRODUCT.md` first — that's the brand thesis.
2. Read `mockups/homepage/variant-2.html` for the locked visual language and `src/components/` for the canonical implementations of Hero, BookRow, Mission, NewsletterForm, etc.
3. Use real assets (`public/assets/` for production code, `mockups/homepage/assets/` for HTML mockups) and the locked palette/type pairing.
4. The strategic axis to vary is **information architecture / layout / hierarchy** — not brand identity.
5. Don't pick a "safe middle" — three real, contrasting positions are more useful than three iterations on one theme.
6. If you generate a control (no-strategy baseline) for the design-explore skill, generate it **before** the strategic variants so it doesn't anchor on them.

## When critiquing variants (advisor / art-director)

- The `advisor` agent reads `CLAUDE.md` and `PRODUCT.md` and flags rule violations.
- The `art-director` agent reads `PRODUCT.md` and refuses to critique without it. It compares against named competitors (Tuttle Twins, The Good and the Beautiful, Sophia Institute Press, Sparkhouse Family, Eerdmans Books for Young Readers, Tilbury House) and the broader indie children's publisher space.

## When developing (dev-nextjs-app)

- The Next.js production app lives at the repo root (`src/`, `package.json`, etc.). The `dev-nextjs-app` agent operates in production-app mode by default — see the "Production app" section below for stack and conventions.
- For HTML mockup work (extending design exploration to a new surface, e.g. `mockups/<surface>/variant-N.html`), the agent switches to static-HTML mode: standalone files, CSS custom properties in each variant's `<style>` block, no build step.
- When converting a new chosen mockup to production: extend the existing `src/` app rather than scaffolding fresh. Atomic React components (Hero, BookRow, Mission, NewsletterForm, Footer) are already shipped — extend them.
- The agent enforces: no emojis as UI icons, no AI slop patterns, locked brand palette and fonts, real assets only.

## SEO

- Run `/seo-audit` against the live site or a staging URL before any major launch. The skill produces a prioritized punchlist covering technical SEO, on-page, content gaps, structured data, Core Web Vitals, and indexing.
- For a children's book publisher, pay particular attention to: book schema (Schema.org `Book` and `Product`), author schema (Schema.org `Person`), descriptive alt text on watercolor cover images, and structured navigation that's crawlable without JS.

## Production app

The Next.js 16 production app now lives at the repo root alongside the mockups archive.

- **Stack**: Next 16 App Router, React 19, TypeScript strict (`noUncheckedIndexedAccess`), Tailwind 4 (theme tokens in `src/app/globals.css`), Jest 30, Playwright 1.59.
- **Source of truth for design**: `mockups/homepage/variant-2.html`. Brand is locked — see PRODUCT.md.
- **Scripts**:
  - `npm run dev` — start Next dev server (verify port 3000 is free first)
  - `npm run build` / `npm run start`
  - `npm run lint` — ESLint (Next core-web-vitals + typescript)
  - `npm run lint:conventions` — project-specific lint rules in `.claude/conventions.json`
  - `npm test` / `npm run test:watch` — Jest
  - `npm run test:e2e` — Playwright smoke (`E2E_BASE_URL` defaults to `http://localhost:3000`)
- **Conventions** (enforced by `.claude/conventions.json` + hooks in `.claude/settings.json`):
  - No `: any`, no `style={{}}`, no external icon libs, no hex literals outside `globals.css`, no `.replace()`-built Tailwind classes, no emoji as UI icons.
- **Key directories**:
  - `src/app/` — App Router routes
  - `src/components/` — atomic components (one per file, named exports)
  - `src/components/icons/` — inline SVG icons (no Lucide/Heroicons/react-icons)
  - `src/config/{site,catalog,messages,ui}.ts` — single sources of truth
  - `src/lib/validation.ts`, `src/lib/rate-limit.ts` — input + abuse defenses on every server action
  - `src/lib/services/resend.ts` — Resend bridge (transactional contact email + newsletter audience)
- **Forms**: every form has a honeypot + per-IP rate limit before validation. Newsletter and contact actions live in `src/app/actions.ts`.
- **Env vars**: see `.env.local.example`. Missing Resend vars no-op gracefully in dev; production returns `resend-not-configured` from the service layer.
- **Mockups directory** (`mockups/`) is read-only design reference and excluded from ESLint and the lint-conventions runner. Only `mockups/homepage/variant-2.html` remains — the chosen direction. Earlier exploration rounds were pruned; they're recoverable from git history if ever needed.

### Checkout (Square)

The checkout flow uses the Square Web Payments SDK on the client and the Square Node SDK (`square` package) on the server. All Square calls go through `src/lib/services/square.ts`.

- **Env vars** (in `.env.local`, all required for live checkout):
  - `NEXT_PUBLIC_SQUARE_APPLICATION_ID` — public, exposed to the browser. Sandbox values start with `sandbox-sq0idb-`; production with `sq0idp-`. The checkout form picks the matching SDK CDN URL based on this prefix.
  - `NEXT_PUBLIC_SQUARE_LOCATION_ID` — public, exposed to the browser.
  - `SQUARE_ACCESS_TOKEN` — server-only OAuth access token for Orders + Payments API.
  - `SQUARE_ENVIRONMENT` — `sandbox` or `production`. Selects the API host.
  - `SQUARE_WEBHOOK_SIGNATURE_KEY` — server-only, used by `verifyWebhookSignature` to authenticate Square webhook deliveries.
- **Square dashboard**: https://developer.squareup.com/apps — create or open the app, copy sandbox credentials from the "Sandbox" tab, production credentials from "Production".
- **Switching sandbox ↔ production**: change `SQUARE_ENVIRONMENT`, swap `SQUARE_ACCESS_TOKEN` to the production token, swap `NEXT_PUBLIC_SQUARE_APPLICATION_ID` and `NEXT_PUBLIC_SQUARE_LOCATION_ID` to production values, regenerate the webhook signature key, and redeploy. The CSP in `next.config.ts` already allows both sandbox and production CDN/API hosts.
- **Webhook URL to register in Square dashboard**: `${NEXT_PUBLIC_APP_URL}/api/checkout/webhook` — subscribe to at minimum `payment.updated`, `order.updated`, and `refund.created`. Copy the signature key into `SQUARE_WEBHOOK_SIGNATURE_KEY` and redeploy before enabling the subscription.
- **Tax**: not collected at launch (Idaho doesn't tax books). When the seller starts shipping to taxable states, update `createOrder` in `src/lib/services/square.ts` to populate the `taxes` array or migrate to Square Catalog with location-based tax rules.
- **Shipping**: flat $5 USD via an order-level service charge. Adjust `FLAT_SHIPPING_CENTS` in `src/lib/services/square.ts`.
- **Price authority**: the server reconstructs every line item's price from `BOOKS` in `src/config/catalog.ts` using only the slug + quantity sent by the client. Client-supplied prices are ignored.
