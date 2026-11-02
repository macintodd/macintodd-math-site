# Write the Line: Given point and slope

The existing /apps/line-equations widget is renamed “Write the Line: Given m and b” in its title, metadata, catalog and report. Its guided/independent behavior and URL remain unchanged.

The new /apps/point-slope widget guides students through four checks: slope, coordinate substitution in point-slope form, distribution, and the final equation. They first tap two integer points on a cropped, numbered graph. Coordinates auto-fill; there is no point check. Before the slope check they can remove a selected point by tapping it again; subsequent steps freeze the chosen points. Subtraction templates wrap coordinates in parentheses so negative values are unambiguous.

Each generated line has a small nonzero integer or fractional slope and an integer y-intercept. The cropped window spans x=2 through x=10 and eight vertical units around the line at x=6, guaranteeing multiple visible integer points while hiding the y-axis. It need not stay within one quadrant; hiding x=0 is what prevents directly reading the intercept. The generator prevents three consecutive equal slopes even under constant randomness.

The final equation check reveals a larger window containing the y-axis, intercept and selected points, including a signed rise/run triangle from the intercept to the starting point. The first incorrect final equation permits a retry; a second reveals the answer and ends that graph. Intermediate mistakes keep the current step open and provide a hint.

All four checks must be correct on the first try to extend the problem streak. Correct retries earn a star. The familiar goal is ten correct and a best first-try streak of five for full credit. Submitting is available after ten correct or a best streak of five; deductions use the existing equationProgress calculation. The name and class hour remain visible. Reports and PNG export are local-only, and next-student reset clears state.

Validation covers 1,200 cropped graphs and 5,600 selectable points, hidden intercepts, integer coordinates, at least two targets, distribution and safe equation parsing, strict LaTeX, reveal-window containment and repetition prevention. Actual component events cover incorrect/correct checks at every stage, unlocking, the graph reveal, retry/streak scoring, named export and reset. Existing line-equation and directory/preview tests also pass. iPad visual confirmation remains outstanding because browser automation is unavailable.
