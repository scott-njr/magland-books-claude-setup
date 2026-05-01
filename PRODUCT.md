---
name: Magland Books
register: brand
source: https://www.maglandbooks.com (assets extracted from live site, 2026-05-01)
scope: layout / IA / structure improvements only — brand identity is locked
---

# Magland Books — Brand Thesis (Live Brand, Locked)

## Scope of redesign
This redesign improves **layout, navigation, and information architecture** only. The brand identity (logo, palette, fonts, illustration style) is published and locked — variants must use the actual assets, not reinterpret them.

## Brand assets (use these verbatim)

### Logo
`./assets/logo.png` — hand-sketched ink illustration of a hurricane lantern with a candle inside, paired with "Magland Books" set in a hand-drawn serif (cross-hatched fill). The logo is **the strongest brand signal**: it's hand-drawn, warm, slightly irregular. Treat it accordingly — don't crowd it, don't recolor it, don't put it on busy backgrounds.

### Book cover art (real, by Kaitlyn Phillips)
- `./assets/book-grizzly.jpg` — *Mags & MarMar: The Mystery of the Gruffly Grizzly* — watercolor, purple/blue tones, girl + dog peeking around a door. Story by Summer Nelson, illustrations by Kaitlyn Phillips. $14.99.
- `./assets/book-pirate.jpg` — *Pirate Flu (And What to Do)* — watercolor, sky-blue background, ensemble of pirates with cold/flu symptoms. Written by Leigh Gardener, illustrated by Kaitlyn Phillips. $14.99.

The covers are the visual heart of the page. Show them large. Don't hide them behind faux gradient placeholders — that's what the prior round did wrong.

### Color palette (extracted from live site CSS tokens)
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

### Typography
- **Playfair Display** — serif display (matches the hand-drawn logo serif). Use for masthead, hero, section heads, book titles.
- **Poppins** — sans body (use for nav, body copy, UI). Poppins ExtraLight is the live site's lightweight choice for delicate body copy.
- *Optional accent:* Caveat or Kalam for handwritten flourish (e.g. signature, tagline) — sparingly, since the logo already carries the hand-drawn note.

### Illustration / texture
The watercolor cover art establishes the visual register. Anywhere the page needs decoration, lean into watercolor / hand-drawn / soft-edged motifs. **Do not** introduce hard letterpress shadows, kraft paper, ink stamps, dashed borders, or "Etsy artisan" tropes — that's a different brand than this one.

## Voice (from the live site, verbatim — preserve)
- Hero: **"Stories That Spark Faith, Laughter, and Adventure!"**
- Mission: **"Magland stories are rooted in values that matter — courage, kindness, trust, and the quiet strength that comes from faith."**
- Identity: **"Made by Family, for Families. We are not a corporation. We are a family who believes deeply in the power of a good book shared on a quiet evening."**
- Newsletter: **"New book announcements, free printable activities, and faith-filled resources delivered straight to your inbox. No spam, ever. Unsubscribe anytime."**

## What's wrong with the current site (the actual problem to solve)
The Wix template is generic. It doesn't:
1. **Showcase the watercolor covers** — the strongest commercial asset on the site is buried in product cards
2. **Lead with a single book** — both titles compete for attention, neither lands
3. **Differentiate the mission** — "Made by family, for families" is the brand's spike, but it sits in a generic block below the products
4. **Honor the hand-drawn brand** — the layout chrome is Wix-default rectangles; nothing in the structure echoes the warmth the logo and covers carry

## What to vary across the 3 variants
**LAYOUT and INFORMATION ARCHITECTURE only.** Three real positions on how to structure a homepage for this brand:

- **V1 — Bookstore Storefront**: lead with the books, sell them well; mission supports; commercial polish.
- **V2 — Family Letter**: lead with the family/relationship; books appear as "what we made"; inverts ecom hierarchy to match the "we are not a corporation" thesis.
- **V3 — Catalog Issue**: each book gets a full editorial feature spread with immersive watercolor backdrop; mission threaded between as pull-quote; navigation feels like flipping through a publication.

All three use the same logo, the same palette, the same fonts, the same book covers. They differ in *how the homepage is organized*, not in *what the brand looks like*.
