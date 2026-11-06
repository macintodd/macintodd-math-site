# Write the Linear Equation — classroom guide
Route: /apps/write-linear-equation. Existing Intro to Point-Slope Form remains available.

## Teaching progression
- Level 1: given m=2 and b=3 example, y=2x+3. Example unscored. Then 3 consecutive first-try correct problems.
- Level 2: example graph y=x/2+2. Tap (0,2) then another integer point; enter signed rise/run, check; enter complete y= equation. Unscored example, then 3 consecutive clean problems.
- Bridge challenge: y=(3/4)x+1.25. Integer grid points include (1,2) and (5,5). First attempt acknowledged, subsequent wrong answers say Keep working; correct unlocks Level 3. Challenge unscored.
- Level 3: example m=2, point (3,4), y=2x-2. Drag or tap quantities into point-slope form, check, distribute with a check, then isolate y. Example unscored. Full goal 10 correct and best clean streak 5. May finish early after 10 correct or best streak 5.
- A failed scored check immediately breaks streak. A successful retry still adds a correct answer, but not to streak. First missing-x warning is a free correction; second and later break streak. Examples never alter math totals.
- Complete y=mx+b notation required; decimal/fraction slopes accepted, unfinished parenthetical forms require simplification. No vertical or horizontal questions generated.

## Score / motivation
L1 up to 2 points (best streak /3); L2 up to 2 points (best streak /3); L3 up to 6 (existing correct-minus-missing-best-streak score /10 ×6). Full completion =10/10.
One earned random target digit1–9 per completed level. Bonus counters cycle0–9 at1,2,4 digits/sec; dialogs precede timers. One Stop per round, next round unlocks regardless of result. Three matches =+1, maximum11/10. Grade math separately if desired.
L3 graph celebrations preserve skier at streak3, goat at4, stars at5; animations skippable. Reduced-motion honored. Role-reversed skier-climbing/goat-skiing surprises deferred for a later refinement.

## Save / classroom use
Name, hour2/3/4/6/7/8 and date visible. Names and scores remain in memory, no server submission or browser storage. Stop &save produces a copyable short checkpoint and downloadable named image. Resume checks initials and hour plus typo checksum; it is obfuscation, not secure identity verification. Unfinished problem restarts. Completed stats, earned targets, bonus attempts retained. A finished level resumes at its spin, preventing an extra problem; earned spins cannot be rerolled by normal resume.
Final reflection confidence rating and local downloadable named/date/score image for manual Classroom submission.
For observation: demo each shared example; then let students work independently. The bridge question prompts why point-slope form is useful when b is difficult to read.

## Verification
scripts/test-write-linear.mjs: generators, equation checking, scoring and resume.
scripts/test-write-linear-ui.mjs: all three levels, warnings, examples, challenge, spins and report.
scripts/test-linear-bonus.mjs: timers, locked rounds, visible digit result, all-match bonus.
Landscape iPad browser checks, tap targets, scratch tools, keypad caret/backspace, strict KaTeX preview render, content/type/lint/build checks.

## Classroom refinements, November 5
- Fixed drag buttons to override general touch-action rules with none; pointer capture, prevented native scrolling/selection, and a visible dragged-number ghost. Tap-to-place and keyboard activation remain available. Labels m, x₁, y₁ are larger and below quantities.
- Tan operation keys, pale red backspace, stronger red Clear. Correct answers display typeset full equation; missing-x warning displays the student's expression with a blinking x after its coefficient, outside any denominator.
- Level 2: larger prompt/intercept, darker grid, Run below denominator, verified slope under intercept; second coordinate stays only on graph. First completed slope/intercept error preserves streak and warns; subsequent errors break streak. Blank/incomplete entries do not count as attempts.
- Challenge confidence introduction with Yes/No and review path, red flame-style title, tappable integer points (including1,2 and5,5).
- Top answer history: gold correct, consecutive misses merged in blue star; eight-icon limit folds earlier counts into blue/gold summaries. Saved in local resume codes along with reading-warning counter; old codes still accepted. Unscored examples and challenge do not add history stars.
- Resume image has an explicit Show image to save to Photos button and long-press instructions. Files download uses a PNG Blob and a DOM-attached download link, verified as a real downloaded PNG in browser. iPad Photos save still depends on its native long-press menu; not directly tested on a physical iPad.
- Future character art preserved in workspace assets/future-characters, not published yet.
