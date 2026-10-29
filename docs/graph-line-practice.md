# Graph the line

`/apps/graph-linear` is linked from Practice apps. Students enter first/last name and class hour (3, 6, 7, 8). Name, hour, total correct, current/best streak, score, and stars remain in a sticky progress bar. All student information remains in React memory; result PNGs are generated on-device. No server submission or browser storage. Manual screenshot/download and Classroom upload only.

Each task shows y = mx + b above a −10…10 coordinate grid. Integer intercepts and reduced, countable slopes use the existing line generator; prevent three consecutive identical slopes. Points snap to integer intersections. Tapping the same point removes it; a third point requires first removing one. Point changes invalidate the drawn line. Graph line animates the infinite line clipped to the grid from left to right (bottom to top for vertical student lines), with arrows at both ends. Check is unavailable until a line has been drawn. Every check is locked to prevent duplicate credit.

Correct: one star/point, current streak advances, whole-app border flashes, reward star jumps/spins. Miss: streak resets; overlay the correct green line, intercept, and slope triangle while retaining the student's dashed red line. Then move to a new equation; no credited retry after revealing the answer.

Full credit requires ten total correct and a best first-try streak of six in this session. Score = max(0, min(correct,10) − max(0,6−bestStreak)). Ten correct with best streak four earns 8/10. Submission is available at ten correct even without the streak; students may continue. Full goal completion automatically opens results. PNG includes full entered name/hour, grade, correct/checked totals, best/final streak, deduction, timestamp.

SVG uses touch-action:none, pointer capture, movement filtering, and pointer cancellation handling; only the grid captures gestures. Outside content scrolls normally. Keyboard arrows move a cursor; Enter/Space toggles a point. Native controls retain touch targets ≥44px; reduced-motion disables drawing/celebration animations.

`npm run test:graph-line` checks clipping, equivalence, duplicate/wrong points, 1,500 random graph configurations, scoring and completion. This test is included in CI. Helpers can support later point/slope or standard-form exercises without adding those modes now.

## Standard form / intercept mode

The original app is now named **Graph the line: Slope-intercept form**. `/apps/graph-standard` uses the same session, plotting, celebration, six-streak/ten-correct scoring, and local results UI, named **Graph the line: Standard form x and y intercept**.

Generate Ax + By = C with nonzero integer intercepts in −8…8. A is positive; B and C may be negative; both coefficients divide C exactly. Avoid three consecutive identical slopes. Students enter both coordinates of each intercept with the touch number pad and plot the two intercepts. Check requires both ordered pairs and both plotted intercepts to be correct. Missing/incomplete fields produce a reminder, not a graded miss. Correct answers earn one star; misses reveal the correct intercepts and line, and show only the needed x/y intercept calculations: substitute the other variable as zero, simplify, divide both sides in vertically stacked fractions, and state the ordered pair. If just the graph is wrong, show plotting guidance. Hide the disabled keypad after checking to make room for corrections. No credited retry after the answer is revealed.

`npm run test:standard-form` verifies 2,000 generated equations, signed exact divisibility, integer intercepts, input checks, required intercept plotting, and repeated-slope avoidance. Added to CI. Results downloads identify which graphing mode was used.
