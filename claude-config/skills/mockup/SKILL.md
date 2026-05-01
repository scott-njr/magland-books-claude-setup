---
name: mockup
description: Generate standalone HTML design mockups (NOT Next.js routes/pages) in ./mockups/. Use this skill ANY time the user asks for a mockup, comp, prototype, design exploration, homepage mock, or "show me a few directions for X" — including casual phrasings like "make a mockup", "comp this out", "prototype the pricing page", "HTML mock", "lets sketch a few options for X", "explore visual directions", "throw together a quick design for". Trigger even when the user doesn't explicitly say "HTML" — defaulting to a Next.js route/page is the wrong move and creates rework. Do NOT trigger when the user explicitly asks for a Next.js page, route, component file, or anything that needs to ship to production.
---

# Mockup

Standalone HTML design mockups for visual exploration. Not production code.

## When to use this skill

**Trigger on:**
- "make a mockup", "design mockup", "homepage mock", "comp this out", "prototype X"
- "show me a few directions for X", "explore visual directions", "sketch some options"
- "HTML mock", "throw together a quick design", "what could this look like"
- Any request for visual exploration where the user hasn't explicitly asked for a Next.js page

**Do NOT trigger when:**
- User explicitly says "Next.js page", "route file", "src/app/.../page.tsx", "production page"
- User wants a single component for an existing app surface (use the app developer skill instead)
- User wants to ship code, not explore

**Why this skill exists:** Defaulting to Next.js routes for design exploration creates rework — the user is iterating on visual direction, not shipping. Standalone HTML is faster to scan, edit, fork, and discard. It also lets the user open the file in a browser, share it, or save it to disk without a dev server.

## Workflow

Follow these steps in order.

### 1. Read project context

Before generating anything, read in parallel:
- The project's root `CLAUDE.md` — extract `## Design Constraints`, `## Design System`, and any "do not use" / "avoid" rules
- The project's `AGENTS.md` if present
- The project's main CSS file for design tokens. Search in this order:
  1. `app/globals.css`
  2. `src/app/globals.css`
  3. `src/styles/*.css`
  4. `styles/*.css`
  5. If none found: ask the user where tokens live before defining new ones

Capture the token names (`--accent`, `--bg-base`, etc.), font stack, and any spacing/border conventions. You'll inline these into each mockup so file:// rendering works without a separate stylesheet.

### 2. Confirm intent (only if ambiguous)

If the prompt was clear ("make a homepage mockup", "show me 3 directions for pricing"), skip this step and proceed.

If ambiguous, briefly confirm:
- **Variant count** — defaults: 1 for singular asks, 3 for "a few directions", 5 for "explore directions"
- **Surface** — which page or component (homepage, pricing, dashboard, settings, …)
- **Variant axis** — what dimension are the variants exploring (editorial vs tactical, dense vs spacious, dark vs light, brand-forward vs utilitarian)

### 3. Create `./mockups/` if missing

Always relative to project root. Don't put mockups inside `src/` — that risks them being interpreted as routes by Next.js.

### 4. Generate each variant as a standalone HTML file

Each variant is **one self-contained `.html` file**. Hard rules:

- Inline `<style>` block in `<head>` — no separate CSS files
- Vanilla JS only if interactivity is needed — no frameworks, no build step, no npm
- Paste the project's `:root` CSS variables into the inline `<style>` so the file works via `file://`
- Never hardcode hex/rgb/hsl colors anywhere — use `var(--token)` exclusively
- CDN-hosted resources are fine: Google Fonts, Lucide CDN, Tailwind Play CDN if needed
- "Self-contained" means: open the file directly in a browser, no server required

**Naming convention:** kebab-case slugs that hint at the direction.
- Good: `editorial.html`, `tactical-hybrid.html`, `minimal-luxury.html`, `terminal-tech.html`
- Bad: `mock1.html`, `version-a.html`, `homepage-final.html`

The filename should let the reader pick from a menu without opening files.

### 5. Generate `./mockups/index.html`

A simple comparison page that links to each variant with name + 1-line description. Default to label-only (no screenshots).

```html
<!doctype html>
<html>
<head>
  <title>Mockups — [project] [surface]</title>
  <style>/* paste project tokens + minimal layout */</style>
</head>
<body>
  <h1>[Surface] mockups — [date]</h1>
  <ul>
    <li><a href="editorial.html">Editorial</a> — Magazine-style, generous whitespace, serif headlines</li>
    <li><a href="tactical-hybrid.html">Tactical Hybrid</a> — Dense data, monospace accents, dark UI</li>
  </ul>
</body>
</html>
```

If the user explicitly asks for screenshots, generate them via the project's installed Playwright (check `package.json` first). Don't add Playwright as a dep just for this.

### 6. Generate `./mockups/README.md`

Brief — intent and per-variant notes. Helps the reader (and future you) remember what each direction was trying to do.

```markdown
# Mockups — [surface]

Generated [date].

## Intent

[1-2 sentences on what we're exploring and why]

## Variants

- **editorial.html** — [direction + key choices]
- **tactical-hybrid.html** — [direction + key choices]

## Constraints applied

- [list any project Design Constraints honored]
```

### 7. Surface paths in your final message

This is non-negotiable per global Workflow Defaults. End the response with absolute paths AND clickable `file://` URLs:

```
Generated mockups:
- /Users/.../project/mockups/index.html → file:///Users/.../project/mockups/index.html
- /Users/.../project/mockups/editorial.html → file:///Users/.../project/mockups/editorial.html
- /Users/.../project/mockups/tactical-hybrid.html → file:///Users/.../project/mockups/tactical-hybrid.html
```

If a Next.js dev server is running on port 3000, mention it for context — but the mockups are NOT served via Next.js. They're standalone files opened via `file://`.

## What "standalone HTML" means

A standalone mockup file:
- Opens in a browser via `file://` and renders correctly with no server running
- Has zero local dependencies (no separate `.css`, `.js`, or asset files alongside it)
- Can use CDN-hosted resources (Google Fonts, Lucide CDN, Tailwind Play CDN)
- Has its complete CSS inline in a `<style>` block in `<head>`
- Has any JS inline in `<script>` tags
- Doesn't import npm packages or require `npm install`

If you want Tailwind utility classes, include the Tailwind Play CDN. But for fidelity to the project's production system, prefer hand-written CSS using the project's design tokens.

## Common pitfalls

- **Generating to `src/app/...` instead of `./mockups/`** — this creates Next.js routes, which is exactly what this skill exists to prevent
- **Hardcoding hex colors** — every color must be `var(--token)`; if the project has no tokens defined, ask before defining new ones
- **Forgetting paths in the final message** — non-negotiable, restated in step 7
- **Over-engineering** — mockups are throwaway. Don't build component libraries, extract shared utilities, or worry about file size. One mockup = one file.

## Variant naming patterns

Useful for quickly generating distinct directions when the user asks for "a few" or "explore":

- **Editorial** — magazine-style, generous whitespace, serif headlines, warm photography
- **Tactical hybrid** — dense data, monospace accents, dark UI, warm accent on cool base
- **Minimal luxury** — high-end retail vibe, big typography, sparse layout, premium fonts
- **Terminal tech** — monospace-everything, terminal aesthetic, command-prompt motifs
- **Hand-crafted** — irregular grids, hand-drawn elements, organic shapes
- **Magazine** — multi-column, mixed typography weights, photo-led
- **Brutalist** — heavy borders, raw HTML aesthetic, intentional ugliness
- **Soft brand** — pastels, rounded corners, friendly micro-copy

Pick variants that meaningfully differ on the axis the user cares about. Don't just rename one variant 5 times — that wastes the user's review time.
