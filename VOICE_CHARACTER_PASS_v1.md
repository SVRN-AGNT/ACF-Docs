# Voice Character Pass: Parts 1 to 6 · v1.0

> **Mission (owner, 2026-10-13):** "the docs are much more human now, but make sure they have character, taste,
> and some of my humor where appropriate. we worked very hard to make everything defensible, mathematically sound
> and less opinionated, now lets add back in some character so it doesn't feel dull or robotic."
> **Builds on:** `VOICE_HUMANIZATION_AUDIT_v1.md` (July 2026) and register v2 (the October 2026 rewrite: institutional
> "we", dated history, one Scope box per Part, no em dashes, no AI tells).
> **Branch:** `claude/docs-character-pass`.

## 1. What character means here

The owner's voice, read from his pre-calibration Parts and his own review notes, is dry, blunt and low-ego: an
engineer who has watched the textbook fail and finds it a little funny. In print that becomes understatement and
deadpan, never a joke for its own sake. The reader should occasionally smile and never doubt the math.

Moves, in order of preference:

1. **Restore the owner's own lines** where they still hold up. His sentences beat new ones.
2. **Deadpan drawn from facts already on the page** ("It is hard to mistime a sale that never happens.").
3. **A short plain sentence after a long technical one.** Rarely.
4. **Definition by negation**, once, where it is real ("Fragility is not volatility.").
5. **The question the reader is actually asking**, then the answer.
6. **Imperatives that invite the work** ("Consider the mathematics.").

## 2. Taste rules

- Density: about one voiced moment per 400 to 600 words. Most paragraphs stay plain.
- Humor targets ideas and habits (the 60/40, "I still believe in the story", overtrading in a Roth), never people,
  firms, parties or the reader.
- Never in falsifier tests, disclosures, Scope boxes, tax and legal hedges, the Evidence page, chart captions,
  source lines, tables or rule statements. Those stay clinical.
- A voiced line adds no new fact and no new number. If it implies a fact, the fact is already on the page.
- Each Part keeps its own flavor and no quip repeats across Parts: P1 the old playbook and its bill; P2 engine and
  fuel; P3 architecture, not faith; P4 the tax code as a silent partner; P5 postures as jobs; P6 a score built by
  subtraction, and restraint as a rule.
- Register v2 still holds: no em dashes, no stock words (quietly, crucially, robust, navigate, landscape, unlock),
  no reflex triplets, no tour-guide narration, no exclamation marks, no political jabs, no price targets.

## 3. What changed

About 44 edits across the six Parts: roughly three quarters restore the owner's own sentences, about nine are new
deadpan lines built from facts already on the page, and two trim a flat bridge sentence. No number, threshold, rule,
citation, falsifier, chart or caption changed.

- **Part 1:** the verbatim-locked "The problem was not bad luck" triple is back (a correction pass had dropped it);
  "Fragility is not volatility" and "garden-variety correction" restored; two new dry lines on falling rates and the
  cost of living.
- **Part 2:** engine and fuel, "Price is a participant, not an observer", "conditionally valid", "sensors, not
  pillars", "Passive indexing works when the market works", bookended at the close.
- **Part 3:** "That is not faith. That is architecture.", volatility as the toll on the upside, the paycheck that
  arrives "on an employment schedule, not an opportunity schedule", "It is hard to mistime a sale that never
  happens", and Accumulate-forever as a complete plan.
- **Part 4:** the tax code as a silent partner (and its callback at harvesting), "it removes the tax on a bad trade,
  not the bad trade", "a tax shelter is only as useful as what it can hold", generational wealth at the closing
  bookend.
- **Part 5:** "never allowed to become load-bearing", "The difference between speculation and gambling is
  governance", postures as jobs ("Hype's job description is mostly a list of things it may not do"), Ballast as the
  part of the plan that still has buying power when the low arrives, the owner's two rebalancing questions.
- **Part 6:** "Fix the penalty, recover the points", "Discipline includes restraint", "Absence of triggers means
  hold", "Part 4 routes both the other way".
- **Key takeaways** now open Parts 2 to 6, in Part 1's collapsible box: five or six plain bullets each, every figure
  as the body states it, at most one dry line per set. The narrator skips them, as on Part 1.

## 4. Guardrails added

- `tests/voice-locks.test.mjs` pins the owner's signature lines on each Part, so a later correction pass cannot
  drop one without noticing. Changing a lock needs the owner's sign-off in the same commit.
- `scripts/sync-counts.mjs` now leaves the Key takeaways box out of the listening time (the narrator skips it) while
  still counting it for the reading time. Recalibrate the listening times from the next pre-render log, as before.

## 5. Flagged for the owner, not changed

- **"Dominant structural return multiplier."** Earlier project notes list this as canonical phrasing. The October
  audit softened it to "structural return multiplier" across Parts 2 and 4 and the chart source labels; it was left
  as is because "dominant" is the stronger empirical claim.
- **Part 5, doctrine vs parameter.** The first section calls the posture aggregate ranges (Ballast 20 to 35 percent)
  doctrine, while the change-governance list treats a "Ballast aggregate ceiling (default 40%)" as a tunable
  parameter.
- **Part 5 case study.** It sizes Bitcoin at 20 percent for an investor with moderate risk tolerance on the strength
  of a 15-year horizon; Part 3 ties 10 to 15 percent to moderate risk capacity and 20 to 30 percent to higher
  conviction.
