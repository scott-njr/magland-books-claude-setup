---
name: predeploy-check
description: Pre-deploy code review for the Magland Books Next.js production app. Catches stale references after architecture changes, security gaps in form/payment handling, hardcoded values that should be configured globally (in `src/config/`), mobile-responsive regressions, and CLAUDE.md / DEVELOPER.md / README.md drift. Outputs a prioritized Blockers / Warnings / Nits punchlist and re-verifies docs after fixes are applied so fix-related drift can't sneak in. Use this skill PROACTIVELY whenever the user says any of "code check", "run a code check", "do a code check", "predeploy check", "pre-deploy check", "check before deploy", "check before we ship", "before we ship", "ready to ship?", "ready for production?", "audit the code", "is this ready to deploy?", "final check before merging", or otherwise asks for a pre-merge sweep, sanity check, or review of the project state before pushing to `main` or deploying to Vercel. Default to invoking even on terse phrasings — the family member running this project uses "code check" as natural-language shorthand. ONLY for the Magland Books production Next.js app at the repo root; do not invoke for unrelated projects, mockup directories alone, or generic code-review requests outside the deploy context.
---

# Predeploy Check — Magland Books

A structured pre-deploy review. Six sequential checks, one prioritized punchlist, one re-verification loop after fixes. Output is a markdown report grouped into **Blockers / Warnings / Nits**, ending with a clear `READY` / `NOT READY` verdict.

## What this skill is for

The project already has ESLint, `lint:conventions`, Jest, Playwright, and a pre-commit secret scanner. Those catch syntax, types, project conventions, broken tests, and obvious leaks. This skill catches the **adjacent** class of problems they miss:

- Documentation that drifted out of sync after an architecture change (CLAUDE.md still says "see services/sheets.ts" after the file was renamed)
- `TODO` comments referencing work that has already shipped
- Env vars in `.env.local.example` that nobody reads anymore — or env vars read in code but missing from the example
- Hardcoded values in components that should live in `src/config/` so they can't drift between files
- Forms that lost their rate-limit, honeypot, or validators during a refactor
- Mobile-responsive regressions that don't show up in unit tests

These problems pile up between deploys. The skill exists so the family running this project doesn't have to remember them all.

## Project assumptions

This skill is project-specific. It assumes:

- A Next.js 16 App Router app at the repo root with `src/` source root and TypeScript strict mode
- Forms wired through `src/app/actions.ts` and external calls through `src/lib/services/*`
- A `.env.local.example` template that defines the env contract
- Conventions documented in `CLAUDE.md` (no `: any`, no `style={{}}`, no external icon libs, no hex literals outside `globals.css`)
- A mobile audit harness at `mobile-audit/capture.mjs`
- A secret scanner at `scripts/check-secrets.sh`
- Single sources of truth in `src/config/{site,catalog,messages,ui}.ts`

If any of those assumptions fail, surface that and stop. Don't try to apply this methodology to a project of a different shape.

## Workflow

Run the six checks below in order. Collect findings into a running buffer organized by severity. After all six finish, render the punchlist (see "Output format" below). After the user applies fixes, re-run **Check 5 only** to make sure no fix-related drift snuck into the docs.

---

### Check 1 — Stale references sweep

Goal: after an architecture change, find every place the old terminology still lives.

**1.1 Read recent context** to learn what's been rotated out:

```bash
git log --oneline -20
```

Read `CLAUDE.md` and recent commit messages. Anything mentioned in CLAUDE.md is current; anything mentioned only in old commit messages may be stale.

**1.2 Build a grep pattern list** from the recent commits and removed files. Common categories:

- File names of removed modules (e.g. `sheets.ts`, `Code.gs`)
- Removed env-var prefixes (e.g. `APPS_SCRIPT_`)
- Removed function names (e.g. `appendToSheet`)
- Names of services/tools that have been swapped out (e.g. "Apps Script", "Google Sheet", "spreadsheet")
- Time-bound phase language: `"phase 1"`, `"phase 2"`, `"integration phase"`, `"exploration phase"`, `"TODO if you want a CI pipeline"` — anything that may have outlived its phase

Run a unified grep:

```bash
grep -rni --color=never \
  -e "<old-pattern-1>" \
  -e "<old-pattern-2>" \
  --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git \
  --exclude-dir=test-results --exclude-dir=mobile-audit \
  . 2>/dev/null | grep -v "package-lock.json"
```

For each hit decide:

- Intentional historical mention (e.g. "we migrated off Wix") → keep
- Stale reference (broken file path, outdated env var, obsolete TODO) → flag

**1.3 Walk every TODO / FIXME / HACK / XXX**:

```bash
grep -rni --color=never -E "TODO|FIXME|XXX|HACK|DEPRECATED" \
  --include='*.ts' --include='*.tsx' --include='*.md' --include='*.sh' \
  --exclude-dir=node_modules --exclude-dir=.next . 2>/dev/null
```

For each one, judge whether it still describes work that needs doing. If it references a flag, migration, or feature that has already shipped, flag for removal.

**1.4 Verify env-var symmetry**. Drift in either direction is a problem:

```bash
# Vars actually read in code:
grep -rn --color=never -oE "process\.env\.[A-Z_]+" src/ 2>/dev/null \
  | sed -E 's/.*process\.env\.//' | sort -u

# Vars declared in the example:
grep -E '^[A-Z_]+=' .env.local.example | sed 's/=.*//' | sort -u
```

`diff` the two lists.

- Read in code but not declared → **Blocker** (deploy will silently misbehave)
- Declared but never read → **Warning** (could be Vercel-set, could be dead — verify with the user)

**1.5 Verify imports resolve**:

```bash
grep -rn --color=never "from '@/lib/services" src/ 2>/dev/null
```

For each import, confirm the file exists at `src/lib/services/<name>.ts`.

**1.6 Walk file paths in docs**. Defer the actual verification to Check 5 — but note hits here so you don't double-grep.

---

### Check 2 — Security review

Goal: confirm every input surface still has its defenses.

**2.1 Invoke `/security-review`** on the current branch's pending changes. This catches injection vectors, missing validation, secret leakage, and OWASP-class issues across staged work.

**2.2 Form-defense order**. Every server action that handles user input MUST follow this exact order. The reason: each step gates the next, and reordering them creates real abuse vectors (validators that hit a database before rate-limiting can be DoS'd, honeypot before rate-limit wastes the cheap check, etc.).

1. `checkRateLimit(...)` — first
2. Honeypot check via `formData.get(HONEYPOT.<form>)` — second
3. Field validators from `src/lib/validation.ts` — third
4. Service call (Resend, Square, etc.) — last

Read `src/app/actions.ts` and confirm `subscribeNewsletter` and `submitContact` follow this order. Read every `src/app/api/checkout/*/route.ts` and confirm the same. Any deviation is a **Blocker**.

**2.3 Service-layer enforcement**. No external HTTP call should originate inside `src/app/` or `src/components/` directly. Search:

```bash
grep -rn "fetch(" src/app src/components --include='*.ts' --include='*.tsx' 2>/dev/null
```

Internal `fetch` (e.g. internal API routes, Next.js server fetches) is fine. External calls must live in `src/lib/services/*`. Flag violations as **Blocker**.

**2.4 Webhook hygiene**. For any `src/app/api/*/webhook/route.ts`:

- The handler must call `req.text()` (not `req.json()` first)
- HMAC verification must happen against the raw text BEFORE `JSON.parse`
- The handler must always 200 once the signature is valid (Square retries on non-2xx — non-200 creates a retry storm)

Read each webhook route. Any deviation is a **Blocker**.

**2.5 Server-as-price-authority**. `src/app/api/checkout/create-order/route.ts` and `src/app/api/checkout/pay/route.ts` MUST reconstruct prices from `BOOKS` in `src/config/catalog.ts` using only the slug + quantity from the client. Search for any place a client-supplied price flows into a Square API call — that's a **Blocker**.

**2.6 Secret scanner** on staged changes:

```bash
bash scripts/check-secrets.sh --staged
```

Any non-zero exit is a **Blocker**.

---

### Check 3 — Statically assigned values that should be globally configured

Goal: catch values hardcoded into a component when they should live in `src/config/` so they can't drift between files.

**3.1 Hardcoded email addresses outside `src/config/`**:

```bash
grep -rn --color=never -E "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}" \
  src/app src/components --include='*.ts' --include='*.tsx' 2>/dev/null \
  | grep -v "from '@/config"
```

Any hit that isn't a comment, schema example, or test fixture should reference `src/config/site.ts` (`CONTACT_EMAIL`, `CONTACT_NOTIFY_EMAIL`, `CONTACT_FROM_EMAIL`).

**3.2 Hardcoded external URLs**:

```bash
grep -rn --color=never -E "https?://[a-zA-Z0-9.-]+" \
  src/app src/components --include='*.ts' --include='*.tsx' 2>/dev/null \
  | grep -v -E "schema.org|maglandbooks.com"
```

Filter out schema.org (used in JSON-LD) and the canonical site URL. Anything left should probably move to `src/config/site.ts` or `.env.local`.

**3.3 Hex literals outside `globals.css`**. The `lint:conventions` runner already enforces this:

```bash
npm run lint:conventions
```

Any hex literal outside `src/app/globals.css` (or the documented exception, `THEME_COLOR` in `src/config/site.ts`) is a **Blocker**.

**3.4 Repeated copy strings**:

```bash
grep -rho --color=never -E "'[^']{30,}'" src/app src/components 2>/dev/null \
  | sort | uniq -c | sort -rn | head -20
```

Any string >30 chars appearing in 2+ different components likely belongs in `src/config/messages.ts`.

**3.5 Hardcoded prices / currencies / ages outside `src/config/catalog.ts`**:

```bash
grep -rn --color=never -E "\\\$[0-9]{1,3}\\.[0-9]{2}|priceCents.*[0-9]" \
  src/app src/components --include='*.ts' --include='*.tsx' 2>/dev/null \
  | grep -v "from '@/config/catalog"
```

Catalog data must flow from `src/config/catalog.ts`. Any hardcoded price in a component or route is a **Blocker** — it breaks the server-as-price-authority invariant.

---

### Check 4 — Mobile responsive

Goal: confirm the site renders cleanly at small viewports, since most readers (parents browsing for picture books) will arrive on phones.

**4.1 Find a running dev server**. Both port 3000 and 3001 have been used in this project:

```bash
lsof -i :3000 -i :3001 -sTCP:LISTEN 2>/dev/null
```

Note which port is live. If neither, ask the user to run `npm run dev` and continue once it's up.

**4.2 Run the screenshot sweep**. The harness already exists:

```bash
E2E_BASE_URL=http://localhost:<port> node mobile-audit/capture.mjs 2>&1 | tail -50
```

The harness captures every route at iPhone SE 375×667, iPhone 14 390×844, and Pixel 7 412×915, and writes findings to `mobile-audit/report.json`. Read the report and surface:

- Any route returning non-200 (route exists in `src/app/` but renders 404/500) → **Blocker**
- Any route with `overflow.overflow > 1` (horizontal overflow at any viewport) → **Blocker** (mobile users will see content cut off)
- All clean → ✓

**4.3 Validate `viewport` and `themeColor` in `src/app/layout.tsx`**:

```bash
grep -E "viewport|themeColor" src/app/layout.tsx
```

Both must be exported from layout.tsx (Next.js 16 pattern). Missing either → **Warning**.

**4.4 Manual-check reminder**. Some things the screenshot sweep cannot validate. Add these to the punchlist's "Manual checks" section:

- [ ] Hamburger menu open state at iPhone SE viewport
- [ ] Sticky header behavior mid-scroll
- [ ] iOS Safari rubber-band scroll
- [ ] Android keyboard pushing forms upward
- [ ] Cart / checkout flow with items added (sweep captures empty state)
- [ ] Touch-target sizes meet Apple's 44×44px minimum

---

### Check 5 — Doc drift

Goal: every claim made in `CLAUDE.md` / `DEVELOPER.md` / `README.md` / `PRODUCT.md` must be verifiable against the current code state. **This is the check that gets re-run after fixes** — it's the explicit guardrail against fix-related drift.

**5.1 Service files**. Every `src/lib/services/*` file mentioned in docs must exist:

```bash
grep -rhoE "src/lib/services/[a-z-]+\.ts" \
  CLAUDE.md DEVELOPER.md README.md PRODUCT.md 2>/dev/null \
  | sort -u | while read f; do test -f "$f" || echo "MISSING: $f"; done
```

**5.2 Env vars mentioned in docs**. Each must exist in `.env.local.example` AND be read somewhere in `src/`:

```bash
grep -rhoE "[A-Z][A-Z0-9_]{4,}" CLAUDE.md DEVELOPER.md README.md \
  | grep -E "_(URL|KEY|SECRET|ID|TOKEN|EMAIL)$" | sort -u
```

For each:
- Confirm presence in `.env.local.example`
- Confirm `grep -r "process.env.<NAME>" src/` returns at least one hit

A mention with no example slot or no reader is a **Warning** (doc claims something nobody uses).

**5.3 Routes mentioned in docs** must exist in `src/app/`:

```bash
grep -rhoE "/[a-z][a-z-]*(/[a-z][a-z-]*)?" CLAUDE.md DEVELOPER.md README.md \
  | sort -u
```

For each path that looks like an app route (not a doc anchor or external URL), confirm `src/app/<path>/page.tsx` exists.

**5.4 npm scripts referenced in docs** must exist in `package.json`:

```bash
grep -rhoE "npm run [a-z:-]+" DEVELOPER.md README.md | sort -u
```

For each, confirm presence in `package.json` `scripts`.

**5.5 Stale phase language** in docs:

```bash
grep -rni --color=never -E "phase[ -]?[12]|integration phase|exploration phase|TODO if you want|when integration phase begins|coming in phase" \
  CLAUDE.md DEVELOPER.md README.md PRODUCT.md 2>/dev/null
```

Cross-check each hit against the actual current state. If the phase is over but the doc says it's pending → **Blocker** for accuracy.

**5.6 File paths mentioned in docs** must exist:

```bash
grep -rhoE "(src|public|mockups|scripts|docs|e2e|claude-config|apps-script)/[a-zA-Z0-9_./-]+" \
  CLAUDE.md DEVELOPER.md README.md PRODUCT.md \
  | sort -u | while read f; do test -e "$f" || echo "MISSING: $f"; done
```

Any `MISSING:` is a **Blocker** — the doc references a file that doesn't exist.

---

### Check 6 — Punchlist + re-verification loop

**6.1 Render the punchlist** in the format below. Do not summarize the findings — render the full list so the user can triage.

**6.2 The re-verification loop**. After the user applies fixes, **re-run Check 5 only**. The reason: when you fix a stale reference in code, it's easy to forget the docs. The whole point of this skill is to keep CLAUDE.md / DEVELOPER.md / README.md consistent with the code at deploy time.

If new doc-drift items appear that didn't exist on the first pass, those are caused by the fixes themselves — flag them as "fix-induced drift" and have the user resolve them before signing off.

**6.3 Sign-off rule**. The status is `READY` only when:

1. The Blockers section is empty
2. The doc-drift re-run is clean

If either fails, the status is `NOT READY`. Don't soften this — the whole point of running the skill is to get a clear yes/no.

---

## Output format

Always render the punchlist as one complete markdown block:

```markdown
# Predeploy Check — <YYYY-MM-DD>

## Blockers
- `<file>:<line>` — <what's wrong>. Fix: <suggested fix>.

## Warnings
- `<file>:<line>` — <what's wrong>. Fix: <suggested fix>.

## Nits
- `<file>:<line>` — <observation>. Consider: <suggestion>.

## Manual checks (not automatable)
- [ ] <item>
- [ ] <item>

## Summary
| Check | Findings |
|-------|----------|
| 1. Stale references | <N flagged> |
| 2. Security | <N flagged> |
| 3. Static-vs-config | <N flagged> |
| 4. Mobile responsive | <N flagged> |
| 5. Doc drift | <N flagged> |

**Status: READY** *(or)* **Status: NOT READY — fix the Blockers above and re-run.**
```

If the user asks "should I ship?", the answer is determined entirely by the punchlist:

- Blockers empty AND doc-drift re-run clean → "yes, ready to ship"
- Otherwise → "no, fix the Blockers first"

## Edge cases

**No dev server running** — Skip Check 4.2 and add a Nit asking the user to start the dev server and re-run. Don't fail the whole skill.

**Empty staged diff** — `/security-review` and `bash scripts/check-secrets.sh --staged` will both report "nothing to check". That's fine. The other checks operate on the working tree, not the staged diff.

**No recent commits** — If `git log -20` returns nothing, fall back to reading CLAUDE.md only to infer the current architecture. Don't try to mine history.

**Project not at expected shape** — If `package.json`, `src/app/`, or `.env.local.example` is missing, stop and tell the user: "this skill is for the Magland Books Next.js production app — it doesn't apply to <whatever the project is>".

**User says "I just want a quick check"** — You can shorten by skipping Check 4 (mobile screenshot sweep is the slowest) and noting the omission in the report, but never skip Check 2 (security) or Check 5 (doc drift). Those are the load-bearing reasons this skill exists.
