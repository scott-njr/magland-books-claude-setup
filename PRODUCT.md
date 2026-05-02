---
name: Magland Books
register: brand
source: https://www.maglandbooks.com (assets extracted from live site, 2026-05-01)
status: variant-2 chosen and in production at the repo root; brand identity locked
scope: layout / IA / structure improvements only — brand identity is locked
---

# Magland Books — Brand Thesis (Live Brand, Locked)

## Status

After 8 rounds of design exploration, **variant-2 ("Family Letter") was selected** as the production direction and the family approved it. A Next.js 16 production app at the repo root extends variant-2's visual language onto every page the mockup didn't cover (catalog, book detail, services, contact, cart, checkout, secondary pages). See [`DEVELOPER.md`](./DEVELOPER.md) for the codebase.

The brand thesis below is unchanged. What variant-2 captured visually is now the locked design system going forward.

## Scope of redesign
This redesign improves **layout, navigation, and information architecture** only. The brand identity (logo, palette, fonts, illustration style) is published and locked — variants must use the actual assets, not reinterpret them.

## Brand assets (use these verbatim)

### Logo
`./assets/logo.png` — hand-sketched ink illustration of a hurricane lantern with a candle inside, paired with "Magland Books" set in a hand-drawn serif (cross-hatched fill). The logo is **the strongest brand signal**: it's hand-drawn, warm, slightly irregular. Treat it accordingly — don't crowd it, don't recolor it, don't put it on busy backgrounds.

In the production app the same file lives at `public/assets/logo.png`. Keep both copies in sync if either is replaced.

### Book cover art (real, by Kaitlyn Phillips)
- `./assets/book-grizzly.jpg` — *Mags & MarMar: The Mystery of the Gruffly Grizzly* — watercolor, purple/blue tones, girl + dog peeking around a door. Story by Summer Nelson, illustrations by Kaitlyn Phillips. $14.99.
- `./assets/book-pirate.jpg` — *Pirate Flu (And What to Do)* — watercolor, sky-blue background, ensemble of pirates with cold/flu symptoms. Written by Leigh Gardener, illustrated by Kaitlyn Phillips. $14.99.

The covers are the visual heart of the page. Show them large. Don't hide them behind faux gradient placeholders — that's what the prior round did wrong.

### Color palette (extracted from live site CSS tokens, mirrored as design tokens in `src/app/globals.css`)
**Primary teal range:**
- `#14525F` — primary teal (color_15, headers/CTAs)
- `#206773` — deep teal (color_19)
- `#10333A` — deepest teal (color_20)
- `#80BDC8` — light teal accent (color_17)
- `#E7F1F0` — very light teal/mint surface (color_16)

**Peach/blush accent range:**
- `#FFC9B9` — peach (color_22)
- `#FFE4DC` — blush (color_21, soft surfaces)
- `#BF9789` — dusty rose (color_23)

**Warm neutrals:**
- `#80655D` — warm taupe (color_24)
- `#40322E` — dark warm brown (color_25, body text option)
- `#FFFFFF` / `#FFF9F5` — paper white / cream

In the production app these are exposed as CSS custom properties (`--color-teal`, `--color-blush`, etc.) and surfaced through Tailwind 4's `@theme` block. Never hardcode hex literals outside `globals.css` — the `no-hardcoded-hex` lint rule enforces this.

### Typography
- **Playfair Display** — serif display (matches the hand-drawn logo serif). Use for masthead, hero, section heads, book titles.
- **Poppins** — sans body (use for nav, body copy, UI). Poppins ExtraLight is the live site's lightweight choice for delicate body copy.
- **Caveat** — handwritten accent. Used for greetings ("Dear reader,"), tags ("our newest"), signature flourish, and "Bag · 0" cart treatment. Sparingly.

In the production app these are loaded via `next/font/google` in `src/app/layout.tsx` and exposed as `font-display`, `font-body`, `font-script` Tailwind utilities.

### Illustration / texture
The watercolor cover art establishes the visual register. Anywhere the page needs decoration, lean into watercolor / hand-drawn / soft-edged motifs — radial halo gradients behind covers, blush/mint surface alternation between sections, drop caps on opening paragraphs, signature flourishes at section ends. **Do not** introduce hard letterpress shadows, kraft paper, ink stamps, dashed borders, or "Etsy artisan" tropes — that's a different brand than this one.

## Voice (from the live site, verbatim — preserve)
- Hero: **"Stories That Spark Faith, Laughter, and Adventure!"**
- Mission: **"Magland stories are rooted in values that matter — courage, kindness, trust, and the quiet strength that comes from faith."**
- Identity: **"Made by Family, for Families. We are not a corporation. We are a family who believes deeply in the power of a good book shared on a quiet evening."**
- Newsletter: **"New book announcements, free printable activities, and faith-filled resources delivered straight to your inbox. No spam, ever. Unsubscribe anytime."**

## What was wrong with the previous Wix site (the actual problem we solved)
The Wix template was generic. It didn't:
1. **Showcase the watercolor covers** — the strongest commercial asset was buried in product cards
2. **Lead with a single book or family voice** — both titles competed for attention, neither landed
3. **Differentiate the mission** — "Made by family, for families" is the brand's spike, but it sat in a generic block below the products
4. **Honor the hand-drawn brand** — the layout chrome was Wix-default rectangles; nothing in the structure echoed the warmth the logo and covers carry
5. **Make pages findable** — primary content lived under a "More" submenu and footer-only links

## Chosen direction: variant-2 ("Family Letter")

**File:** `mockups/homepage/variant-2.html` — the visual source of truth for composition, palette, type, motifs. Frozen as a historical artifact.

**Why it was chosen:** it inverts the e-commerce hierarchy that doesn't fit a 2-title mom-and-pop publisher. The homepage opens as a letter from the family, books appear as "here's what we made," mission threads through as a pull-quote. It honors the "we are not a corporation" thesis literally — this *reads* like a family wrote it, not like a SaaS landing page.

**The other three explored variants** (V1 Bookstore Storefront, V3 Catalog/Issue, V4 Live Site Refined) and 8 prior exploration rounds were pruned from the repo to keep the developer's working directory clean. They remain in git history if ever needed (`git log --all -- v1_classic_storybook/` etc.).

## Production design system (extending variant-2)

### Canonical information architecture

**Primary nav** — flat, no submenus, voice-aligned labels. Every nav target reachable from the homepage in one click:

1. **Bookshelf** — `/bookshelf` (catalog + book detail pages)
2. **Our Family** — `/our-family` (family bio, mission, faith statement)
3. **Publishing** — `/publishing` (services hub)
4. **Letters** — `/letters` (blog, currently a stub)
5. **Write to Us** — `/write-to-us` (contact form)

Cart indicator at right: `Bag · 0` in Caveat with a peach underline (carried over from variant-2).

**Footer** mirrors the same voice: The Bookshelf · The Family · Stay in Touch · Fine Print. Single source of links — nothing is footer-only.

### Pages variant-2 did not cover (extended within the same visual language)

- `/bookshelf` — catalog grid using `BookCard` (compact form of the variant-2 BookRow)
- `/bookshelf/<slug>` — book detail with JSON-LD Schema.org `Book` + `Product` blocks
- `/publishing` — Publishing Services with the live-site copy migrated and presentation polished
- `/letters` — letter-styled stub ("we're currently writing the first letter")
- `/write-to-us` — contact form
- `/activities` — printable activities placeholder, includes embedded newsletter form
- `/cart`, `/checkout`, `/checkout/success` — Square-backed commerce flow
- `/privacy`, `/store-policy`, `/shipping-returns` — legal/policy pages

Each extends variant-2's visual language: drop caps on opening paragraphs, signature flourishes at section ends, watercolor radial gradients behind hero artifacts, blush/mint surface alternation, Caveat handwritten accents on tags and greetings. **Do not** introduce new motifs, fonts, or palette tokens to support a new page — extend what's already locked.

### Hard guardrails (anti-patterns, archived directions)

These were tried in earlier exploration rounds and rejected. Do not revive:

- **"Too formal"** (V1 Classic Storybook, archived) — gold filigree, Old World library, Times Roman, Latin numerals. The buyer is a 4-8-year-old's parent, not a Brooklyn lit-mag subscriber.
- **"Daycare aesthetic"** (V3 Whimsical & Playful, archived) — Fredoka/Quicksand/Comic Sans cousins, primary-color rainbow palettes, sticker-badge UI, hand-drawn cartoons beyond the logo. Hard guardrail.
- **Generic SaaS chrome** — gradient hero with floating orbs, "Trusted by 10,000+ families" hero metric, identical 3-col card grids with circle icons, "Empower / Unlock / Discover" copy.
- **Christian-bookstore default** — beige + scripture verse hero + dove imagery + "Christ-centered" eyebrow. The brand is faith-forward but not faith-as-marketing-segment.
- **Letterpress / Etsy artisan** — kraft paper, ink stamps, dashed borders, hard offset shadows, typewriter UI fonts.
- **Faked book covers** — never use gradient placeholders. Real cover JPEGs only.
- **Emojis as UI icons** — use inline SVG (in `src/components/icons/`). Emojis in editorial copy are fine if they read naturally.

### When generating new surfaces (mockups, new pages, marketing collateral)

The exploration phase is over for the homepage. For new surfaces (e.g. a printable activities page, a newsletter template, a pitch deck for press), follow this hierarchy:

1. **Read this file (`PRODUCT.md`) and `mockups/homepage/variant-2.html`** for the visual language.
2. **Read `src/components/`** for the canonical implementation of Hero, BookRow, Mission, NewsletterForm, etc. — extend these patterns rather than inventing new ones.
3. **Stay inside the locked palette and type system.** No new colors, no new fonts.
4. **Use real assets** from `public/assets/` (or `mockups/homepage/assets/` in HTML mockups). Never gradient placeholders.
5. **Critique with `art-director`** before shipping any new visible surface — it compares against named competitors (Tuttle Twins, The Good and the Beautiful, Sophia Institute Press, Sparkhouse Family, Eerdmans, Tilbury House) and flags anything derivative or category-average.
