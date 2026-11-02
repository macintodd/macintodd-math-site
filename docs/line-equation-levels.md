# Write the line: guided and independent levels

Level 1 asks students to tap the y-intercept, check it, tap a distinct second integer point, check the slope, and write the equation. Correct earlier steps stay visible as compact confirmations. Five consecutive problems with every check right on the first try unlock Level 2. A missed intermediate check immediately breaks the streak. Retries can still earn a gold star, but the problem cannot extend the qualifying streak.

Level 2 allows manual intercept, slope, and equation entry with a single final submission. Graph taps are optional. The existing Level 2 scoring requires ten correct and a best first-try streak of five for full credit; guided stars do not inflate that score. The named local results image reports both levels separately. No names, answers or results are transmitted or persisted.

The keypad puts a purple variable x key and expression tools on the left, with a standard 3×3 numeric group and +/− on the right. Editing preserves the input cursor position. Inputs unlock only when appropriate for the current guided stage.

Validation:
- `node --experimental-strip-types scripts/test-line-equation-levels.mjs`
- `node --experimental-strip-types scripts/test-line-equation-flow.mjs` (actual component event handlers; not a browser layout test)
- Existing line-equation and slope suites, content checks, lint, production build and TypeScript checks.
