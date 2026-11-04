# Write the line: guided and independent levels

Level 1 asks students to tap the y-intercept, check it, tap a distinct second integer point, check the slope, and write the equation. Correct earlier steps stay visible as compact confirmations. Three consecutive problems with every check right on the first try unlock Level 2. A missed intermediate check immediately breaks the streak. Retries can still earn a gold star, but the problem cannot extend the qualifying streak.

Level 2 allows manual intercept, slope, and equation entry with a single final submission. Graph taps are optional. The existing Level 2 scoring requires three correct and a best first-try streak of three for full credit; guided stars do not inflate that score. The named local results image reports both levels separately. No names, answers or results are transmitted or persisted.

The keypad puts a purple variable x key and expression tools on the left, with a standard 3×3 numeric group and +/− on the right. Editing preserves the input cursor position. Inputs unlock only when appropriate for the current guided stage.

Validation:
- `node --experimental-strip-types scripts/test-line-equation-levels.mjs`
- `node --experimental-strip-types scripts/test-line-equation-flow.mjs` (actual component event handlers; not a browser layout test)
- Existing line-equation and slope suites, content checks, lint, production build and TypeScript checks.

## Success stars

A successful Level 1 y-intercept check briefly pops a star at the graph’s confirmed y-intercept. Incorrect checks do not trigger it. On a correct equation, the answer field emits exactly the current first-try streak count for the active level. A correct retry with a broken streak emits zero burst stars while retaining its normal earned scoring star. These effects do not award extra points or alter the streak. The final Level 2 equation stays visible for 1.7 seconds before the automatic report, allowing its burst to finish. Both effects ignore pointer events and are suppressed under reduced-motion preferences. New problems and new students clear the effects.

Both levels now target three correct and a best first-try streak of three. Level 2 retains a score out of ten: correct-count credit scales to ten at three correct, with one point deducted for each missing best-streak step. A student may submit after three correct or continue to reach the streak goal. Minus and backspace symbols use a 30px font.
