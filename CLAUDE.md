# Magland Books Redesign — Project Conventions

This file is read automatically by Claude Code when working in this project. It defines what Claude should and shouldn't do here.

## What this project is

Homepage redesign exploration for [maglandbooks.com](https://www.maglandbooks.com), a small family-run publisher of children's faith-based picture books. Two titles in print:

- *Mags & MarMar: The Mystery of the Gruffly Grizzly* — Story by Summer Nelson, illustrated by Kaitlyn Phillips, $14.99
- *Pirate Flu (And What to Do)* — Written by Leigh Gardener, illustrated by Kaitlyn Phillips, $14.99

The deliverable is four contrasting homepage layouts in `mockups/homepage/`. The brand identity is **locked** — see `PRODUCT.md` for the full thesis.

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

## When generating new variants

1. Read `PRODUCT.md` first — that's the brand thesis.
2. Use real assets and the locked palette/type pairing.
3. The strategic axis to vary is **information architecture / layout / hierarchy** — not brand identity.
4. Don't pick a "safe middle" — three real, contrasting positions are more useful than three iterations on one theme.
5. If you generate a control (no-strategy baseline) for the design-explore skill, generate it **before** the strategic variants so it doesn't anchor on them.

## When critiquing variants (advisor / art-director)

- The `advisor` agent reads `CLAUDE.md` and `PRODUCT.md` and flags rule violations.
- The `art-director` agent reads `PRODUCT.md` and refuses to critique without it. It compares against named competitors (Tuttle Twins, The Good and the Beautiful, Sophia Institute Press, Sparkhouse Family, Eerdmans Books for Young Readers, Tilbury House) and the broader indie children's publisher space.
