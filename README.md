# Magland Books — Homepage Redesign

Four contrasting homepage design directions for [maglandbooks.com](https://www.maglandbooks.com), generated with Claude Code using a brand-locked design exploration workflow. **The brand identity is preserved across all four directions** (real logo, real watercolor covers, the live site's teal + peach palette, Playfair Display + Poppins). What varies is **layout / information architecture / structure**.

This repo bundles the deliverable mockups *and* the Claude Code agents and skills used to generate them, so anyone can review, modify, regenerate, or extend the work.

---

## Just want to see the mockups?

You don't need to install anything.

1. Click **Code → Download ZIP** at the top of this repo (or `git clone` it)
2. Unzip to anywhere you like (the folder location doesn't matter)
3. Open `mockups/homepage/index.html` in your browser

That gives you a side-by-side viewer for all four design directions. Click any "Open V#" link to jump into the full mockup.

| Direction | Strategy | What it does |
|---|---|---|
| **V4 — Live Site, Refined** *(closest to current)* | Minimum-disruption refresh | Same nav order, hero copy, book grid, footer columns as the live Wix site — just cleaner type, spacing, and grid alignment |
| **V1 — Bookstore Storefront** | Commercial-first IA | Lead with one featured book, sell it well; sticky nav with cart + search; mission supports |
| **V2 — Family Letter** | Relationship-first IA | Inverts ecommerce hierarchy — homepage opens as a letter from the family, books follow as "here's what we made" |
| **V3 — Catalog / Issue** | Editorial-feature IA | Each book gets a full feature spread with watercolor backdrop; floating ToC nav; "Vol. I, No. 2" masthead |

---

## Want to regenerate, modify, or build on top of these mockups?

You'll need:
- **Claude Code** — install from [claude.com/code](https://claude.com/code) or `brew install anthropic/tap/claude-code` on macOS

### Step 1 — Choose where the project lives

The repo can live anywhere on your machine — Claude Code runs in whatever folder you `cd` to. Pick a location that makes sense for you:

```bash
# anywhere — pick what fits your workflow
git clone https://github.com/scott-njr/magland-books-claude-setup.git ~/Documents/magland-books
# or
git clone https://github.com/scott-njr/magland-books-claude-setup.git ~/Projects/magland-redesign
# or just download the ZIP and unzip it where you like
```

The installer in step 2 only copies global agents/skills to `~/.claude/` (Claude Code's standard location). It does **not** move or copy the project files — they stay wherever you cloned them.

### Step 2 — Install the agents and skills globally

```bash
cd <wherever-you-cloned-it>
./install.sh                     # macOS / Linux
.\install.ps1                    # Windows PowerShell
```

Both scripts:
- Copy all agents to `~/.claude/agents/`
- Copy all skills to `~/.claude/skills/`
- Back up any existing files of the same name to `~/.claude/.backup-<timestamp>/` before overwriting
- Are safe to re-run

Pass `--dry-run` (bash) or `-DryRun` (PowerShell) to preview without writing anything.

### Step 3 — Open the project in Claude Code

```bash
cd <wherever-you-cloned-it>
claude
```

Claude Code reads `CLAUDE.md` and `PRODUCT.md` automatically. The agents and skills are now available globally in any Claude Code session.

---

## What's in the toolkit

### Skills (slash commands you can run in Claude Code)

| Slash command | What it does | Cost |
|---|---|---|
| `/mockup` | Generates one or more standalone HTML mockups for a single direction. Default for design exploration. | Light |
| `/design-explore` | Generates 3 contrasting design directions for whatever surface you name (homepage, hero, pricing page, etc.), spawns 6 Opus subagents in parallel to critique each one, and writes a scored recommendation to `mockups/<surface>/REPORT.md`. | **Heavy** — 6 Opus calls |
| `/seo-audit` | Site-wide SEO audit methodology — technical SEO, on-page, content gaps, structured data, Core Web Vitals, indexing. Use before launching, after a migration, or when investigating a traffic drop. | Medium |

### Agents (auto-spawn when relevant, or invoke explicitly)

| Agent | What it does |
|---|---|
| `advisor` | Engineering / standards second opinion. Reads CLAUDE.md, PRODUCT.md, and the work; flags rule violations, hidden assumptions, and blast-radius concerns. Doesn't rewrite — critiques and asks sharp questions. |
| `art-director` | Brand / taste / differentiation critic. Reads PRODUCT.md (refuses to critique without it); compares against named competitors; flags derivative or category-average work. |
| `dev-nextjs-app` | Full-stack Next.js + TypeScript + Tailwind developer. Use when converting any of the HTML mockups into a real production site. Also handles plain HTML / static-site work for projects without a Next.js stack. |

### End-to-end workflow

The full toolkit supports a complete redesign cycle:

```
1. Explore visually    → /mockup or /design-explore (HTML directions)
2. Pick a winner       → review side-by-side viewer in mockups/<surface>/index.html
3. Refine craft        → ask the dev-nextjs-app agent or use /mockup to iterate
4. Build for production → dev-nextjs-app converts HTML to Next.js + Tailwind
5. Pre-launch SEO check → /seo-audit on the new site
```

---

## What's in this repo

```
.
├── README.md                       (this file)
├── PRODUCT.md                      Brand thesis — required by design-explore + art-director
├── CLAUDE.md                       Project conventions & anti-patterns
├── install.sh / install.ps1        Cross-platform installers
├── uninstall.sh                    Clean removal
│
├── claude-config/                  ← what gets installed to ~/.claude/
│   ├── skills/
│   │   ├── design-explore/         3-direction design exploration with 6-agent critique
│   │   ├── mockup/                 Single-direction HTML mockup skill
│   │   └── seo-audit/              Site-wide SEO audit methodology
│   └── agents/
│       ├── advisor.md              Engineering / standards critic
│       ├── art-director.md         Brand / taste critic
│       └── dev-nextjs-app.md       Full-stack Next.js / static HTML developer
│
├── mockups/homepage/               ← the deliverable
│   ├── index.html                  Side-by-side viewer (open this)
│   ├── variant-1.html              Bookstore Storefront IA
│   ├── variant-2.html              Family Letter IA
│   ├── variant-3.html              Catalog / Issue IA
│   ├── variant-4.html              Live Site, Refined (closest to current)
│   └── assets/
│       ├── logo.png                Real logo, fetched from live site
│       ├── book-pirate.jpg         Real cover (Pirate Flu)
│       └── book-grizzly.jpg        Real cover (Mags & MarMar)
│
├── index.html                      Round-2 archive viewer (history)
└── v1_classic_storybook/ … v8_split_magland/   Prior exploration rounds (history)
```

---

## Common workflows

### Regenerate a mockup with new copy

```
cd <project-folder>
claude
> Update mockups/homepage/variant-4.html so the hero copy reads "..." and the CTA button says "Browse Our Story"
```

The `dev-nextjs-app` agent will edit the file in place and respect the locked brand.

### Generate a fresh design exploration for a different surface

```
> /design-explore  pricing page
```

The skill will:
1. Generate a no-strategy control variant
2. Generate 3 contrasting strategic variants
3. Spawn the `advisor` and `art-director` agents in parallel to critique each
4. Write a scored recommendation to `mockups/pricing-page/REPORT.md`
5. Open a side-by-side viewer

### Convert a chosen variant to Next.js

```
> Use the dev-nextjs-app agent to scaffold a Next.js + TypeScript + Tailwind app from variant-4.html. Migrate design tokens, convert sections to atomic components (Hero, BookGrid, Mission, Newsletter, Footer), and wire the newsletter form to a placeholder handler.
```

### Pre-launch SEO check

```
> /seo-audit https://staging.maglandbooks.com
```

Returns a prioritized punchlist: technical SEO, on-page, content gaps, structured data, Core Web Vitals, indexing.

---

## Notes

> **On `/impeccable`:** The `design-explore` skill mentions an `/impeccable` skill for follow-up craft passes. That skill is *not* bundled here — it's larger and not needed to use this repo. The references won't cause errors; they're suggestions for further refinement that you can ignore or implement manually with `/mockup` and the `dev-nextjs-app` agent.

> **On agent auto-spawn:** Claude Code automatically spawns the right agent based on what you're asking for. You don't have to invoke them explicitly — saying "build a new component" will route to `dev-nextjs-app`; saying "is this on-brand?" will route to `art-director`. You *can* invoke them explicitly with phrases like "have the advisor weigh in" or "/mockup".

---

## Removing the installed agents/skills

```bash
./uninstall.sh         # macOS / Linux
```

Removes only the files this repo installed. Backups from prior installs (if any) remain in `~/.claude/.backup-*` for manual restore.

---

## License & credit

Mockups, brand thesis, and project conventions: © 2026 Magland Books, LLC. All rights reserved.

Skills (`design-explore`, `mockup`, `seo-audit`) and agents (`advisor`, `art-director`, `dev-nextjs-app`) are released under Apache 2.0 — feel free to copy, modify, and reuse them on other projects.
