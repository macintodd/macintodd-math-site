# Write the Linear Equation — classroom guide
Route: /apps/write-linear-equation. Existing Intro to Point-Slope Form remains available.

## Teaching progression
- Level 1: given m=2 and b=3 example, y=2x+3. Example unscored. Then 3 consecutive first-try correct problems.
- Level 2: example graph y=x/2+2. Tap (0,2) then another integer point; enter signed rise/run, check; enter complete y= equation. Unscored example, then 3 consecutive clean problems.
- Bridge challenge: y=(3/4)x+1.25. Integer grid points include (1,2) and (5,5). First attempt acknowledged, subsequent wrong answers say Keep working; correct unlocks Level 3. Challenge unscored.
- Level 3: example m=2, point (3,4), y=2x-2. Drag or tap quantities into point-slope form, check, distribute with a check, then isolate y. Example unscored. Full goal: best clean streak 5, with no 10-correct total requirement. Five clean answers can complete the level. Existing partial-credit exit after 10 total correct remains available for students who keep struggling.
- A failed scored check immediately breaks streak. A successful retry still adds a correct answer, but not to streak. First missing-x warning is a free correction; second and later break streak. Examples never alter math totals.
- Complete y=mx+b notation required; decimal/fraction slopes accepted, unfinished parenthetical forms require simplification. No vertical or horizontal questions generated.

## Score / motivation
L1 up to 2 points (best streak /3); L2 up to 2 points (best streak /3); L3 up to 6 (best streak /5 ×6). Full completion =10/10.
One earned random target digit1–9 per completed level. Bonus counters cycle0–9 at1,3,5 digits/sec; dialogs precede timers. One Stop per round, next round unlocks regardless of result. Three matches =+1, maximum11/10. Grade math separately if desired.
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

## Teacher demonstration version
URL: /apps/write-linear-equation/teacher. Auto-starts as Teacher Demo; no name/hour entry, student resume controls, or score-card/export route. Prominent no-credit label. Normal student URL retains its existing behavior.
Bottom navigation offers next problem, next level (including the challenge and bonus), level-ending spin previews, previous/next worked steps, and direct jumps to each example, level end, challenge introduction, or bonus. Step previews fill prior quantities without awarding answers. Navigation cancels pending reward/spin timers. Bonus completion shows Demonstration complete rather than scores. Teacher page is public, intentionally ungraded, and marked noindex.
Test: scripts/test-linear-teacher.mjs plus full student regression flow.

## Follow-up classroom refinements
- Challenge No opens an Are you sure? confirmation. Confirmation No returns to the readiness question; Yes restarts Level 1’s shared example and clears all scores, streaks, stars, target digits, and warning counters while retaining the entered name/hour. Same flow in teacher demo.
- Source quantities have pastel fills matching outlines. Empty drop zones stay white; filled zones take the dropped quantity’s color. Neutral gray shading remains when color help is off.
- Distribution equation text matches checked equations; input sizes unchanged. Extra x in either numeric distribution box produces a no-penalty format reminder. First two scored distribution errors preserve streak and suggest calculator multiplication; second warns, third and later reset streak. This allowance is across the Level 3 session and saved in resume codes. Unscored examples do not consume it.
- Correct Level 3 answers never auto-open animation. After the star reward, Next: graph animation opens it on demand. Finish math remains available whenever ten correct have been earned, including after later mistakes, and on animation slides; it proceeds to the final spin/bonus. Existing optional early finish at best streak5 is retained.
- Bonus rates now1,3,5 numbers/sec, prominently labeled rate of change/slope. Explanation distinguishes progression between counter resets from the wrap back to zero.

## MathBoard external-display bridge (teacher route only)
MathBoard injects window.MathBoardApplet.publishState before loading the teacher URL. After React mounts, the page registers window.mathBoardAppletSetState(snapshot). The native host should wait until that function exists, then apply the most recent snapshot; replay it again when reconnecting a display.

Outgoing snapshot: app=write-linear-equation-teacher, version=1, derived screen, and all 33 visible/stateful parent values. This includes session/progress, problem, answers, active field, stage/placements/selected points, feedback/warning and challenge gates, scratch view, reward/animation/spin flags, drag selection, scratchDataURL, bonusMirror {instructions,running,digit}, and celebrationMirror {replay,sound}. Native code should treat this as an opaque JSON object and forward it unchanged.

Restore marks the receiving WebView as external immediately via a ref and React state, cancels pending local reward/spin timers, and restores every snapshot value. The receiving view never publishes snapshots back. The local external-display role is deliberately not copied from the teacher snapshot. The handler is removed on unmount only if the component still owns it.

Bonus counter state is controlled by the parent on the teacher route; the external copy uses the received digit and runs no independent interval. Animation and Replay are synchronized through animation and celebrationMirror; CSS/SVG animation starts automatically when received. Secondary-display goat audio is suppressed to avoid double playback.

The remote page is inert/read-only, with keyboard, tool tabs and teacher navigation hidden. Answer fields/quantities remain visible as read-only presentation content. Scratch drawing controls are replaced by a read-only image; the teacher's completed pen, erase, undo and clear operations publish a PNG after the stroke/action, using the same local capture mechanism as Intro to Point-Slope. New problems clear the mirrored ink.

No bridge receiver or publishing is registered on the student route or in a regular browser without the injected bridge. No server storage or network score submission is introduced. Reload both native WebViews after deploying this change. Physical iPad/projector behavior must be confirmed in MathBoard; repository tests simulate both ends of the bridge.

Tests: test-linear-mathboard-bridge.mjs checks JSON snapshots, every useState/payload/dependency/restore mapping, echo prevention, cleanup, student/browser isolation and read-only rendering; child tests verify remote counters have no timer and remote animation replays do not allow controls/audio.

## Student streak scenes (November 2026)
Only the scored student Level 3 animation uses the new story. Current streak 1: skier; 2: climbing goat; 3: skier with goat chasing on the same solved line; 4: goat skiing; 5: haggard man climbing; 6+: man riding the skiing goat. A broken streak returns to the first scene when a new clean correct answer earns streak 1. Examples, teacher demos, the MathBoard bridge and the separate Intro to Point-Slope app retain their existing behavior. Full credit is unchanged: 10 correct and best streak 5. Six is a cosmetic extra surprise, not an added requirement. Repeated counted misses (two or more) show named encouragement and a level-specific strategy. Correct answers clear that encouragement; previous totals remain intact. Reduced-motion preference suppresses moving characters.

Character sheet: `public/images/linear-streak-characters.png`, built-in image generation using the teacher-supplied future character references. Final prompt: Create ONE transparent game sprite sheet, landscape 1536x1024, divided into THREE equal columns and TWO equal rows (each cell512x512). No visible cell borders, absolutely transparent background. Match these reference character identities, clean cartoon black outlines. All face RIGHT, full body fits in its cell, ski/foot contact baseline at y=460 within every cell. Top row: two consecutive walking poses of the haggard blue M helmet man (column1 and2); column3 a playful tired standing pose of same man. Bottom row: column1 goat on red skis matching reference, column2 second skiing pose of that goat, column3 the blue helmet man sitting astride that same goat on red skis, both visible and happy. No words/captions, no ground, no shadows, no background. Keep ample margin inside each cell. Used for small animated graph characters. Preserve actual alpha transparency.

## Shortened Level 3 (November 6, 2026)
Supersedes the earlier six-streak scene pacing above. Full credit now needs only best streak 5; total correct is informational, not a completion gate. L1 and L2 remain 2 points each, L3 earns best streak/5 times 6 points, capped at 6. Completing all levels earns 10/10; optional bonus can make 11/10. Legacy resume codes retain their stats and a saved best streak 5 proceeds to the final spin. Student Level 3 example shows the skier without affecting score; scored streaks 1 through 5 show goat, chase, skiing goat, haggard man, then man riding skiing goat. Teacher animation behavior remains unchanged.
