# Magland Books — Production App

This repo contains three layers:

1. **Production Next.js app** at the repo root — the actual site that replaces the current Wix install. Built on the "Family Letter" design direction with locked brand identity. **Developers start here:** [`DEVELOPER.md`](./DEVELOPER.md).
2. **Locked design reference** at `mockups/homepage/variant-2.html` — the standalone HTML mockup that established the brand language. Open it by double-clicking. Earlier exploration rounds were pruned from the repo (recoverable from git history).
3. **Claude Code toolkit** in `claude-config/` — the agents and skills used to generate, critique, and maintain the work. `setup.sh` installs them as part of full project setup, or run `./install.sh` to register them globally without the rest.

The brand identity is **locked** — see [`PRODUCT.md`](./PRODUCT.md).

---

## Production app — first-time setup

**One command.** `setup.sh` handles everything — Claude Code agents, npm dependencies, pre-commit secret scanner, and `.env.local`. Safe to re-run anytime.

```bash
git clone https://github.com/scott-njr/magland-books-claude-setup.git
cd magland-books-claude-setup

bash setup.sh                       # macOS / Linux
# .\setup.ps1                       # Windows PowerShell

# Then fill in .env.local — the values you need are documented in DEVELOPER.md
npm run dev                         # http://localhost:3000
```

### Updating after Scott pushes changes

When you see a notification (or just want to make sure you're up to date):

```bash
cd <wherever-you-cloned-it>
git pull
bash setup.sh                       # macOS / Linux  — re-runs everything; idempotent
# .\setup.ps1                       # Windows PowerShell
```

`setup.sh` is **idempotent** — running it again does the right thing:

- **Claude Code agents and skills**: any updated versions in the repo overwrite your local copies in `~/.claude/`. Your previous versions are auto-backed-up to `~/.claude/.backup-<timestamp>/`.
- **npm dependencies**: `npm install` picks up any new or updated packages.
- **Pre-commit hook**: re-installs the hook (no-op if already current).
- **`.env.local`**: leaves your existing file alone — never overwritten.

For env var setup, integrations (Square + Google Apps Script), deploying to Vercel, secret hygiene, and contributing conventions, read [`DEVELOPER.md`](./DEVELOPER.md).

---

## Just want to see the chosen design?

You don't need to install anything.

1. Click **Code → Download ZIP** at the top of this repo (or `git clone` it)
2. Open `mockups/homepage/variant-2.html` in your browser

That's the locked design reference — the "Family Letter" direction that the production app extends. It's a standalone HTML file, no build step.

---

## Want to regenerate, modify, or build on top of these mockups?

You'll need:
- **Claude Code** — install from [claude.com/code](https://claude.com/code) or `brew install anthropic/tap/claude-code` on macOS

The full setup path is the same as the production-app one above:

```bash
git clone https://github.com/scott-njr/magland-books-claude-setup.git
cd magland-books-claude-setup
bash setup.sh                       # installs Claude Code agents + skills, npm deps, git hooks, and .env.local
claude                              # opens this project in Claude Code
```

Once Claude Code is running, try:

```
/design-explore   pricing page         # 3 critiqued layout directions for any surface
/mockup           authors page         # one HTML mockup, lighter
/seo-audit        https://staging.…    # site-wide SEO audit
```

Claude Code reads `CLAUDE.md`, `PRODUCT.md`, and the `.claude/conventions.json` rule set automatically.

### Just installing the agents and skills (no production-app setup)

If you only want the Claude Code toolkit and skip everything else, run the lighter installer instead of `setup.sh`:

```bash
./install.sh                     # macOS / Linux
.\install.ps1                    # Windows PowerShell
```

That copies agents to `~/.claude/agents/` and skills to `~/.claude/skills/`, backing up any existing same-named files to `~/.claude/.backup-<timestamp>/`. Pass `--dry-run` (bash) or `-DryRun` (PowerShell) to preview without writing.

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
├── DEVELOPER.md                    ← Developer onboarding for the production app
├── PRODUCT.md                      Brand thesis — required by design-explore + art-director
├── CLAUDE.md                       Project conventions & anti-patterns (read by Claude Code)
├── install.sh / install.ps1        Installs the agents + skills to ~/.claude/
├── uninstall.sh                    Clean removal of installed agents/skills
│
├── package.json, tsconfig.json     Production Next.js app — see DEVELOPER.md
├── next.config.ts, eslint.config.mjs
├── jest.config.ts, playwright.config.ts, postcss.config.js
├── .env.local.example              Env vars (Apps Script + Square)
│
├── src/                            Next.js 16 App Router source
│   ├── app/                        Routes, layout, server actions, api/checkout/*
│   ├── components/                 Atomic components + inline-SVG icons
│   ├── config/                     catalog, site, ui, messages
│   ├── lib/                        validation, rate-limit, services (sheets, square)
│   ├── hooks/, types/, __tests__/
│
├── public/assets/                  Real brand assets (logo + watercolor covers)
├── e2e/                            Playwright smoke tests
├── docs/apps-script/               Google Apps Script source + deployment guide
├── scripts/lint-conventions.sh     Generic JSON-driven lint runner
├── .claude/                        Project-level Claude Code config
│   ├── settings.json               Hooks (lint:conventions on Edit/Write/Stop)
│   └── conventions.json            Lintable rule set
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
└── mockups/homepage/               ← locked design reference
    ├── variant-2.html              "Family Letter" — the chosen direction
    └── assets/                     Mockup assets (mirrored to public/assets/)
```

---

## Common workflows

### Tweak the locked design reference

```
cd <project-folder>
claude
> Update mockups/homepage/variant-2.html so the hero copy reads "..." and the CTA button says "Browse Our Story"
```

The `dev-nextjs-app` agent will edit the file in place and respect the locked brand. Note: the production app at `src/` is the source of truth for the live site; the mockup is only the visual reference.

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

### Add a new page or surface to the production app

```
> Use the dev-nextjs-app agent to add a new /authors route. Use the variant-2 visual language (drop caps, signature flourishes, watercolor halos) and the existing Hero / BookRow / NewsletterForm components. JSON-LD Person schema for each author.
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
