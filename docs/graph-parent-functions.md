# Graphing Parent Functions

Route: `/apps/graph-parent-functions`. Precalculus · Functions directory; tagged to the existing parent-functions lesson.

## Practice
- One fixed unscored linear example, then one graph per family in seeded shuffled order: linear y=x, constant y=c, quadratic y=x², cubic y=x³, square root y=√x, absolute value y=|x|. Constant c is a nonzero integer from -4 to 4. No transformations or rational-function graphing in this activity.
- Equal-scale integer grid -10 to 10. Tap the same point to remove it; coordinate chips also remove points. SVG pointer coordinates map through the current screen transform. Grid gestures use pointer capture and touch-action:none; scrolling outside the graph is normal. Keyboard arrows move a crosshair, Enter/Space toggles an integer point.
- Linear: 3 points including the origin and points on both sides. Constant: 3 distinct points. Quadratic/cubic/absolute: 5 points including origin and at least two on each side. Square root: 4 points; within this grid, integer coordinates are (0,0), (1,1), (4,2), (9,3). Instructions disclose these criteria.
- Every plotted point must satisfy the original equation. Duplicate points do not count. Check is unavailable until the minimum count is present. First miss gives feedback and highlights wrong points; students must edit before retrying. Correct first check earns 1 point; correct retry earns 0.5; a second miss earns 0 and reveals the correct graph and example coordinates. Total /6, no timer/streak. The unscored example never changes totals.
- Curves reveal only after successful grading or the second miss. A correct graph earns an animated star. Reduced-motion CSS suppresses animation. Partial finish is available after a scored graph; both reflection and completion screens return to the same checked graph with points/results intact.

## Local completion/resume
Names/hour, graph points, answers and results stay in React memory. No backend, browser storage, or student-data uploads. PGF1 code encodes deterministic seed, completed graph scores, initials/hour check and checksum; it omits full names and resumes at the next unfinished graph. Codes are convenience checkpoints, not authentication. Preserve generation order/version after release. Shared two-reflection CompletionFlow captures name, local completion time, score, and both survey answers. Spanish whole-page/tap-English is included. No MathBoard bridge added.

## Rational formatting change
`scaleEquation` wraps rational parent fractions in scalable parentheses when |a| differs from 1. Example: `g(x)=-6\left(\frac{1}{3x-6}\right)+1`. k remains outside the vertical multiplier. Only formatting changed; parameters, correct descriptions and scoring are untouched.

## Verification
New regression: 12,000 parent graphs across seeds/families, true/false coordinate grading, domains, required shape/anchors, duplicates, SVG snapping, KaTeX, Spanish, compact resume integrity and identities, actual demo/retry/half-credit/partial-report-return/all-six completion flow. Existing transformation-scale, shared completion and directory checks also run. Physical iPad visual/touch inspection remains for teacher testing.
