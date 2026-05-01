# Magland Books — Homepage Redesign

Four contrasting homepage design directions for [maglandbooks.com](https://www.maglandbooks.com), generated with Claude Code using a brand-locked design exploration workflow. **The brand identity is preserved across all four directions** (real logo, real watercolor covers, the live site's teal + peach palette, Playfair Display + Poppins). What varies is **layout / information architecture / structure**.

This repo bundles the deliverable mockups *and* the Claude Code agents and skills used to generate them, so anyone can review, modify, or regenerate the work.

---

## Just want to see the mockups?

You don't need to install anything.

1. Click **Code → Download ZIP** at the top of this repo (or `git clone` it)
2. Unzip
3. Open `mockups/homepage/index.html` in your browser

That gives you a side-by-side viewer for all four design directions. Click any "Open V#" link to jump into the full mockup.

| Direction | Strategy | What it does |
|---|---|---|
| **V4 — Live Site, Refined** *(closest to current)* | Minimum-disruption refresh | Same nav order, hero copy, book grid, footer columns as the live Wix site — just cleaner type, spacing, and grid alignment |
| **V1 — Bookstore Storefront** | Commercial-first IA | Lead with one featured book, sell it well; sticky nav with cart + search; mission supports |
| **V2 — Family Letter** | Relationship-first IA | Inverts ecommerce hierarchy — homepage opens as a letter from the family, books follow as "here's what we made" |
| **V3 — Catalog / Issue** | Editorial-feature IA | Each book gets a full feature spread with watercolor backdrop; floating ToC nav; "Vol. I, No. 2" masthead |

---

## Want to regenerate or modify the mockups with Claude Code?

You'll need:
- **Claude Code** — install from [claude.com/code](https://claude.com/code) or `brew install anthropic/tap/claude-code` on macOS

Then run the installer to copy the agents and skills into your global Claude config:

### macOS / Linux

```bash
cd magland-books-redesign
./install.sh
```

### Windows (PowerShell)

```powershell
cd magland-books-redesign
.\install.ps1
```

Both scripts:
- Copy the `advisor` and `art-director` agents to `~/.claude/agents/`
- Copy the `design-explore` and `mockup` skills to `~/.claude/skills/`
- Back up any existing files of the same name to `~/.claude/.backup-<timestamp>/` before overwriting
- Are safe to re-run

Pass `--dry-run` (bash) or `-DryRun` (PowerShell) to preview without writing anything.

---

## What's in this repo

```
magland-books-redesign/
├── README.md                       (this file)
├── PRODUCT.md                      Brand thesis — required by design-explore
├── CLAUDE.md                       Project conventions & anti-patterns
├── install.sh / install.ps1        Cross-platform installers
├── uninstall.sh                    Clean removal
│
├── claude-config/                  ← what gets installed to ~/.claude/
│   ├── skills/
│   │   ├── design-explore/         The 6-agent design exploration skill
│   │   └── mockup/                 Single-direction HTML mockup skill
│   └── agents/
│       ├── advisor.md              Engineering / standards critic
│       └── art-director.md         Taste / brand differentiation critic
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

## How to use the workflow once installed

Open a terminal in this folder and run `claude`. Then:

| Slash command | What it does |
|---|---|
| `/design-explore` | Generates 3 contrasting design directions for whatever surface you name (homepage, hero, pricing page, etc.), spawns 6 Opus subagents in parallel to critique each one, and writes a scored recommendation to `mockups/<surface>/REPORT.md`. **Heavy** — uses 6 Opus calls. |
| `/mockup` | Generates one or more standalone HTML mockups for a single direction. Lighter than `/design-explore` — no critique, no scoring. |
| Mention "advisor" | Spawns the engineering/standards advisor for a second opinion on any plan. |
| Mention "art director" | Spawns the brand/taste critic for visual review. Requires `PRODUCT.md` to exist. |

The skills read `PRODUCT.md` (brand thesis) and `CLAUDE.md` (project conventions) at the project root, so any redesign you generate will respect Magland's locked brand and documented anti-patterns.

> **Note on `/impeccable`:** The `design-explore` skill mentions an `/impeccable` skill for follow-up craft passes. That skill is *not* bundled here — it's larger and not needed to use this repo. The references won't cause errors; they're suggestions for further refinement that you can ignore or implement manually with `/mockup`.

---

## Removing the installed agents/skills

```bash
./uninstall.sh         # macOS/Linux
```

Removes only the files this repo installed. Backups from prior installs (if any) remain in `~/.claude/.backup-*` for manual restore.

---

## License & credit

Mockups, brand thesis, and project conventions: © 2026 Magland Books, LLC. All rights reserved.

Skills (`design-explore`, `mockup`) and agents (`advisor`, `art-director`) are released under Apache 2.0 — feel free to copy, modify, and reuse them on other projects.
