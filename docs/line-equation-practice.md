# Write the line practice

Route: `/apps/line-equations`, linked from the practice apps index.

- Collect first name, last name, and hour (3, 6, 7, 8) before starting. Show full name and hour throughout practice and on results.
- Keep all identity, answers, history, scores, and generated result images in this page’s memory. No fetch, API submission, analytics event, browser storage, or database integration. Reloading resets practice. Students manually screenshot or download a local PNG and upload to Classroom.
- Graphs use slopes with numerator −5…5 and denominator 1…5, in lowest terms, with integer y-intercepts −5…5. At least two integer grid points are visible. Horizontal lines included; vertical lines excluded. Never generate three consecutive identical slopes. Reuse slope app’s tap-to-toggle integer point coordinates and retry triangle.
- Students enter the y-intercept’s two coordinates, slope rise/run, and a linear expression after the supplied `y =` or `f(x) =` prefix. Notation alternates with each graph. All three entries must be correct for a star.
- Equivalent fractions and linear expressions are accepted using a bounded arithmetic parser, without eval. Fractions use `/`; parentheses, unary signs, decimals, explicit multiplication, and common implicit multiplication forms are accepted. Reject nonlinear expressions, variable denominators, division by zero, and executable input.
- First error resets streak and gives targeted hints. One retry can still earn a star but never a streak point. Second error reveals the intercept, slope, and equation.
- Score = max(0, min(correct, 10) − max(0, 5 − best streak)). The best first-try streak in the current session counts even after later mistakes. Ten correct and best streak three gives 8/10. Five correct in a row allows submission at 5/10. Ten correct also allows submission regardless of streak. Continue practicing to improve either goal. Automatically show results when both ten correct and best streak five have been earned.
- Saved PNG displays full entered name, hour, grade, correct count, first-try count, best/final streak, attempts, deduction, and completion time. No share/upload button.

Validation: `npm run test:line-equations`; includes equivalent and invalid expressions, ordered-pair checks, grade/retry rules, 2,000 generated graph checks, and repeated-slope prevention. Included in CI alongside existing slope tests.
