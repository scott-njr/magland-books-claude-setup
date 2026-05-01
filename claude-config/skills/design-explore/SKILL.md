---
name: design-explore
description: Parallel design exploration with dual-agent critique — for when you want a *recommendation*, not just options. Generate 3 deliberately contrasting design directions for any UI surface (homepage, hero, pricing, logo, dashboard, landing, settings) then spawn the `advisor` (engineering/standards) and `art-director` (taste/differentiation) Opus subagents in parallel to critique each, then synthesize into a scored recommendation with the *why*. Use whenever the user says "compare design directions for X", "design sprint for X", "parallel design exploration", "give me 3 critiqued directions", "which direction should I pick", "I need a recommendation between approaches", "critique 3 versions of X", "audited design exploration", or is starting a brand/redesign sprint and needs structured exploration. Heavier and slower than `/mockup` — that skill just generates HTML comps to look at; this skill generates AND evaluates AND recommends. Requires a PRODUCT.md / brand thesis at project root (art-director will refuse without one). Do NOT trigger on plain "show me a mockup", "sketch this out", "comp this" — those are /mockup territory.
version: 1.0.0
user-invocable: true
license: Apache 2.0
---

Generate 3 contrasting design directions, run dual-agent critique in parallel, synthesize a recommendation.

The skill produces two diagnostic measurements alongside the recommendation:
1. **Blind pick vs synthesis** — did the 6-agent critique loop change my mind among the strategic variants? (Convergence weakens the case for the loop; divergence is the signal.)
2. **Strategic variants vs control** — did the strategic variants beat what I would have shipped without any of this? A no-strategy control variant (`variant-0-control.html`) is generated alongside the 3 strategic variants and sits outside the scoring matrix specifically to make this measurable.

Both are recorded in REPORT.md as permanent receipts. Over enough runs, they form a corpus for evaluating whether the skill is earning its compute or has become decorative.

## When to use this vs /mockup vs /impeccable

| You want | Use |
|---|---|
| Just a few HTML comps to look at | `/mockup` |
| A single iterative design pass | `/impeccable craft` or `shape` |
| 3 contrasting directions + critique + a recommendation | **this skill** |

This is a heavy skill — 6 Opus subagents (3× advisor + 3× art-director) in parallel, plus 3 mockup generations. Use deliberately, not for casual exploration.

## Setup gates

Pass these before generating anything. Skipping them produces critique that ignores the brand.

| Gate | Check | If fail |
|---|---|---|
| Brand thesis | PRODUCT.md exists at project root, >200 chars, no `[TODO]` markers | Stop. Tell user to either write a brand thesis or run `/impeccable teach` to scaffold PRODUCT.md. The art-director agent will refuse without one. |
| Project conventions | Read CLAUDE.md from project root if present | If absent, advisor falls back to general frontend best practices |
| Mockups directory | `./mockups/` exists or can be created | Create it |

## Workflow

### 1. Capture the brief

Get from the user (one short clarification turn if anything is missing):
- **Target** — what's being designed (e.g., "pricing page", "homepage hero", "logo direction", "settings panel")
- **Register** — brand or product. Brand = marketing/landing/identity (design IS the product). Product = app UI/dashboard/tool (design SERVES the product). Default from PRODUCT.md `register` field if present; otherwise infer from target.
- **Constraints** — any hard constraints (must include X, must not look like Y). Optional.

Slugify the target for the directory name: "homepage hero" → `homepage-hero`.

### 1.5. Generate the no-strategy control variant

Before generating the strategic variants, write a `variant-0-control.html` to `./mockups/<target-slug>/`. This is the control — the hero (or pricing page, settings panel, etc.) you would produce from a plain "design [target] for [project]" prompt with no strategy framing, no register selection, and no contrast directive. Just the unguided default.

The control measures whether the strategic exploration earns its compute. If a senior reviewer can't tell the strategic variants apart from the control on a side-by-side glance, the loop is decorative for this run. That signal is only legible if the control is generated honestly:

- **Generate it before the strategic variants.** If you write V0 after V1/V2/V3, you anchor on them — the "default" stops being a default and becomes a reaction. Do this in a dedicated tool call, separated from the strategic-variant generation.
- **Respect project constraints.** The control still reads PRODUCT.md, DESIGN.md, and CLAUDE.md. The skill measures *strategy contrast vs unguided defaults*, not *strategy contrast vs rule-violating slop*. A control that violates the brand guide isn't a control, it's a strawman.
- **No strategy commitment.** No editorial commitment, no proof rail, no figure, no maximalist palette, no anti-pattern subversion. Conventional layout, default type sizes, default container widths. The control is allowed to be visually quiet — that's the point.
- **Keep it outside the scoring matrix.** The control is not scored, not weighted, not entered in the recommendation calculus.
- **Do not critique it with the 6 agents.** Sending it through the advisor + art-director loop changes its nature: it would start optimizing toward the rubric instead of staying at "what the model produces unguided." The control is a baseline, not a candidate.

The control is the first file in `./mockups/<target-slug>/`. Move on to step 2 once it's written.

### 2. Generate 3 contrasting variants

Write three standalone HTML files in `./mockups/<target-slug>/`:
- `variant-1.html`
- `variant-2.html`
- `variant-3.html`

Each must use a **different design strategy**. Variations on the same theme defeat the purpose — the whole point is contrast that forces a real choice.

**Brand register strategies** (pick three):
- Restrained — tinted neutrals + one accent ≤10%
- Committed — one saturated color carries 30–60% of the surface
- Drenched — the surface IS the color
- Editorial / typographic — type as the primary visual element
- Maximalist — full palette, dense composition
- Anti-pattern subverted — take the category cliché and break it on purpose

**Product register strategies** (pick three):
- Minimal/quiet — generous whitespace, low information density
- Structured/dense — IDE-style information density, monospace accents
- Expressive/branded — product surfaces feel like the brand, not generic SaaS
- Card-free — no boxes, layout via type and rhythm
- Data-first — the data is the design (Bloomberg terminal energy)
- Spatial — depth, layering, asymmetry

If two variants would render at >70% similarity, throw one out and pick a more distant strategy. The judge of distance: would a designer look at them side-by-side and immediately see two different points of view, or two iterations of one?

Each variant follows `/mockup` conventions: standalone HTML, no Next.js, design tokens (no hardcoded colors except where intentional per the strategy), real content (no lorem ipsum).

### 2.5. Record blind baseline

Before spawning any critique agents, write your own pick — 3 to 5 sentences, in your own voice, with no input from the advisor or art-director. Hold it in scratch state and do not show it to the agents (they will anchor on it and the diagnostic value is gone).

The blind pick now ranks **4 surfaces** — the control (V0) plus the 3 strategic variants — not 3. This matters: if the blind read picks the control over all three strategic variants, that is a major signal that the strategic exploration didn't earn its compute on this run. Surface that prominently in the REPORT (don't bury it in a footnote).

The blind pick must:
- Name one surface as the winner (V0, V1, V2, or V3).
- Explain in 2-3 sentences why it beats the others.
- Name one trade-off you are accepting by picking it.

The point is not to bias the agents — it is to see whether the dual-agent synthesis ends up agreeing or disagreeing with the unvalidated baseline. Convergence and divergence both carry information. If the synthesis always agrees with the blind pick, the critique loop is decorative and the user can rip it out. If it sometimes disagrees, the disagreement is the most useful signal in the run, because it is exactly what the agents are paid to surface. And if the blind pick keeps landing on the control, the *whole skill* is decorative for the user's actual workflow.

Save the blind pick verbatim. You will paste it into REPORT.md in step 5.

### 3. Spawn parallel critique

Launch 6 subagents **in the same turn** (one message, six Task tool calls):
- 3× `advisor` (one per variant) — engineering / standards lens
- 3× `art-director` (one per variant) — taste / differentiation lens

Sequential spawns waste time and let later runs anchor on earlier ones. The whole reason for the dual-agent isolation is independent verdicts.

#### Advisor prompt template (per variant)

```
Critique this design variant: <absolute path to variant-N.html>

Brief: <user's brief — target, register, constraints>

Project conventions (paste from CLAUDE.md): <Design Constraints / Styling / Code Structure sections, or "no CLAUDE.md present">

Evaluate:
1. CLAUDE.md compliance — flag any rule violations with line citations
2. Anti-patterns — gradient text, glassmorphism as default, hero-metric template, identical card grids, dark glows, etc.
3. Technical concerns — accessibility (contrast, semantic HTML, keyboard nav), responsive behavior, performance smells
4. Specific tradeoffs of this variant's design strategy

Return a structured verdict (under 250 words):
- Pros: 2-3 things that work
- Cons: 2-3 things that don't
- Blockers: anything that disqualifies this variant
- Score 1-5 on technical fitness
```

#### Art-director prompt template (per variant)

```
Critique this design variant: <absolute path to variant-N.html>

Brief: <user's brief>
Brand thesis: <paste full PRODUCT.md>

Evaluate:
1. Brand fit — does this match the thesis? Where does it diverge?
2. Differentiation — name 3-5 named competitors in this space and compare. Is this variant distinctive or derivative?
3. Category-reflex check — does this look like the training-data answer for this domain? (observability → dark blue, healthcare → white+teal, finance → navy+gold, crypto → neon-on-black, etc.)
4. Taste — what's confident, what's hedging?

Return a structured verdict (under 250 words):
- Wins: 2-3 things that land
- Misses: 2-3 things that don't
- Disqualifiers: anything that's actively wrong for the brand
- Score 1-5 on brand/taste fitness
```

### 4. Synthesize

Combine all 6 verdicts. Build:

#### Scoring matrix

| Variant | Strategy | Advisor (1-5) | Art Director (1-5) | Combined |
|---|---|---|---|---|
| 1 | <strategy> | ? | ? | ? |
| 2 | <strategy> | ? | ? | ? |
| 3 | <strategy> | ? | ? | ? |

Combined isn't a simple sum — weight per the register. Brand register weights art-director 60/40. Product register weights advisor 60/40. State the weighting you used.

#### Recommendation

Pick one variant. Surface the tradeoffs explicitly:
- **Recommended:** Variant N (<strategy>)
- **Why:** 2-3 sentences naming the specific reasons this beats the others
- **What you give up:** 1-2 sentences on what the rejected variants did better

**Don't pick the safe middle by default.** A "good across the board" middle option often loses to a "great in one dimension, weak in another" bold option, depending on the brief. State the bias in your pick.

If two variants tie, recommend one and explain why — never punt to "either could work."

If advisor and art-director disagree sharply on a variant (e.g., 5 vs 1), surface that disagreement as the most useful signal in the report. Don't smooth it over.

#### Control vs strategic variants

Before writing the recommendation, do a sighted comparison of each strategic variant against the control (V0). The frame:

> The strategic variants earn their compute only if at least one is visibly more committed than the control to a degree that a senior reviewer would describe as "this took a position the default wouldn't." If the strategic variants and the control feel interchangeable on a side-by-side glance, the loop is decorative for this run.

Write 1-2 sentences per strategic variant naming the specific structural position it takes that the control doesn't (a typographic commit, an information-architecture move, a visual artifact replacing decoration, an anti-pattern subverted, etc.). Be honest — if a variant is structurally close to the control, say so.

End with a one-line verdict using exactly one of these phrasings:
- "**Verdict on the loop's compute for this run:** the strategic variants earned their compute."
- "**Verdict on the loop's compute for this run:** the loop was decorative for this run."

The phrasing is intentionally rigid so the verdict is greppable across runs — the user is building a corpus of these one-liners to evaluate whether the skill earns its compute over time.

#### Blind baseline vs synthesized verdict

After the synthesized recommendation is written, pull the blind pick from step 2.5 out of scratch state and compare. Two outcomes:

- **Convergence** — blind pick and synthesis name the same variant. Note this explicitly in the report. It is a useful diagnostic because it weakens the case that the 6-agent critique loop was load-bearing for this run; over enough runs, consistent convergence is evidence the loop is decorative and can be simplified.
- **Divergence** — they name different variants. This is the most useful signal in the run. Surface the disagreement and write 1-2 sentences naming what specifically the agent critique caught (or claimed to catch) that the blind read missed, or vice versa. Do not smooth it over by quietly switching the recommendation to match the blind pick — the synthesis is still the recommendation; the blind pick is the control against which the synthesis is measured.

Either way, the blind pick gets recorded in REPORT.md as a permanent receipt — the user is building up a corpus over multiple runs to evaluate whether the agent loop is earning its compute.

### 5. Write outputs

Final deliverable in `./mockups/<target-slug>/`:

```
mockups/<target-slug>/
├── variant-0-control.html  # no-strategy baseline (NOT scored, NOT critiqued)
├── variant-1.html
├── variant-2.html
├── variant-3.html
├── index.html              # side-by-side iframe viewer
└── REPORT.md               # the synthesis
```

#### index.html structure

The control sits in its own row at the top (full-width), labeled "BASELINE / NOT SCORED" with a brief inline explainer that names what it measures (strategic exploration vs unguided defaults). The 3 strategic variants sit below in a labeled 3-column grid ("STRATEGIC VARIANTS / SCORED / CRITIQUED BY 6 AGENTS"). The recommended strategic variant gets a small badge; the control does not.

The visual separation matters — putting the control inside the 3-column grid would imply it's a peer of the strategic variants, which it isn't. The two-row layout makes the comparison legible: "here's what gets shipped without strategy" above, "here's what strategy produced" below.

No styling beyond a minimal CSS grid + iframe sizing — this is a viewer, not a portfolio piece.

#### REPORT.md structure

```markdown
# <Target> — Design Exploration Report

## Brief
<target>, <register>, <constraints if any>

## Control (no-strategy baseline)
`variant-0-control.html` — what an unguided "design [target]" prompt produces with no strategy framing. Sits outside the scoring matrix and is not critiqued by the 6 agents. Exists to A/B-test whether the strategic exploration earns its compute against what gets shipped without it.

<2-3 sentences describing the control's actual shape — layout, type sizes, what positions it does NOT take>

## Variants

### Variant 1 — <strategy name>
<1-line summary of the visual direction>

### Variant 2 — <strategy name>
<1-line summary>

### Variant 3 — <strategy name>
<1-line summary>

## Advisor findings
### Variant 1
<paste verdict>
### Variant 2
<paste verdict>
### Variant 3
<paste verdict>

## Art Director findings
### Variant 1
<paste verdict>
### Variant 2
<paste verdict>
### Variant 3
<paste verdict>

## Scoring
<the matrix, with weighting noted. Control does not appear here.>

## Blind baseline
<paste the verbatim 3-5 sentence blind pick from step 2.5 — ranks 4 surfaces (control + 3 strategic)>

**Convergence:** yes / no — <one line: which surface the synthesis ended up picking, and whether it matches the blind pick. If divergent, name the specific thing the agent critique caught (or claimed to catch) that the blind read missed.>

## Control vs strategic variants
<sighted comparison from step 4 — 1-2 sentences per strategic variant naming what structural position it takes that V0 doesn't, ending with the rigid one-line verdict on whether the loop earned its compute>

## Recommendation
**Variant N — <strategy>**

<why, 2-3 sentences>

**Tradeoffs:** <what you give up, 1-2 sentences>

**Disagreement of note:** <if advisor and art-director split sharply on any variant, name the tension>
```

### 6. Final message to user

Surface absolute paths to all 5 files (3 variants + index + REPORT). State the recommendation and the headline reason in 2-3 sentences.

Example:
> Generated 3 design directions in `/Users/.../mockups/pricing-page/`:
> - variant-1.html — Restrained
> - variant-2.html — Committed (recommended)
> - variant-3.html — Drenched
> - index.html — side-by-side viewer
> - REPORT.md — full synthesis
>
> **Recommended:** Variant 2 (Committed). Carries the brand confidence the thesis asks for; Variant 1 hedges, Variant 3 overstates. Full reasoning in REPORT.md.

## Anti-patterns

Things that defeat the purpose of this skill:

- **Three minor variations.** "Same layout, different colors" is not 3 directions. Throw out and regenerate with real strategy contrast.
- **Picking the middle.** The middle option is comfortable and usually the worst recommendation because it doesn't commit to anything. Bias toward the variant that takes a stand.
- **Smoothing over agent disagreement.** Sharp disagreement (advisor 5, art-director 1) is the most useful signal in the report. Surface it; don't average it away.
- **Generating from a missing brand thesis.** Without PRODUCT.md, art-director critique is decorative. Stop and gate.
- **Sequential agent spawns.** All 6 in one message. Period.
- **Picking >3 variants.** 3 is the magic number for forced choice. 5+ defeats the purpose — too many to compare meaningfully.
- **Showing the blind pick to the critique agents.** They would anchor on it and the diagnostic value is gone. Hold the blind pick until after all 6 agent verdicts return.
- **Quietly switching the recommendation to match the blind pick when they diverge.** The synthesis is the recommendation; the blind pick is one of two controls. Smoothing them together erases the diagnostic signal you just paid for.
- **Critiquing the control with the 6 agents.** Defeats its purpose — once it goes through the rubric, it stops being unguided and starts being a 4th candidate. The control's value depends entirely on it staying at "what the model produces with no strategy framing."
- **Pulling the control inside the scoring matrix.** Same problem — it becomes a candidate, not a baseline. The whole point of the control is that it sits outside the comparison so the comparison can be measured against it.
- **Generating the control AFTER the strategic variants.** It anchors on them. The "default" then becomes a reaction to the strategies, not an unguided default. Generate the control first, in its own tool call, before any strategic variant exists.

## Out of scope (v1)

These are deliberate omissions, not oversights:

- **Image generation** — no AI-generated photos/illustrations in variants. Use placeholder boxes or real free images.
- **Live browser screenshots** — the index.html viewer is the artifact. Adding Puppeteer screenshots is a v2 ask.
- **Iteration loop** — user picks a winner, then refines. That's a separate workflow (likely `/impeccable craft` taking the chosen variant as input).
- **More than 3 variants** — see anti-patterns above.
- **Critiquing existing live URLs** — this skill generates fresh variants. To critique what already ships, use `/impeccable critique` or `/impeccable audit`.
