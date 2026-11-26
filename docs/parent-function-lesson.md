# 3. Graphing and Evaluating Parent Functions

Route: `/apps/beta/graph-evaluate-parent-functions`. This is series widget 3, following graph-family and equation-family identification. It covers exactly **constant (1), linear, absolute value, quadratic, cubic** parents. No square root and no transformations yet. Existing Graphing Parent Functions, its six-family Precalculus behavior/resume codes, Transformation Explorer and series widgets 1/2 remain unchanged.

## Accountability and scoring

Each family must earn two graphs without hints, for ten graphing credits. A graph must pass the existing parent-graph checker: three distinct points for linear/constant, five for absolute/quadratic/cubic; origin and both sides for nonconstant parents, with every point satisfying the function and the grid bounds. Accepted no-hint graphs earn one credit for that family, capped at two. These are two successful attempts, not a streak gate. Previously earned graph credits survive later misses.

The graph hint button reveals the correct curve and canonical coordinate examples, marks the attempt assisted and prevents it earning a mastery credit. Students still plot/check; a correct assisted graph counts as mathematical correctness for the uncapped counter/decorative stars but earns no graph credit. A miss reveals the curve and coordinates with checker feedback. Both misses and assisted graphs are followed by an evaluation of that same family, not another immediate graph check. The unfinished family remains in the seeded round-robin queue until both unhinted graphs are earned.

Evaluation prompts vary f(x), g(x), h(x), y and signed integer inputs. A worked substitution/simplification and resulting ordered pair appear after either outcome. Negative powers use parentheses, and constant outputs stay one. Numeric blanks/incomplete/invalid notation trigger validation, not scored misses. Each evaluation is assessed once; repeated taps cannot deduct/recover twice.

Every wrong evaluation adds one outstanding point. Every subsequent correct evaluation recovers one outstanding point. While any remain, ask new evaluations consecutively; repeated misses add further points to recover, and partial recovery is retained. Once the outstanding balance is zero, return to graphing. Correct ordinary evaluations add no graph credit or bonus grade. Score = `max(0, graph credits − outstanding evaluation points)`, capped at ten. Preserve the actual outstanding balance even if the displayed score reaches zero. Ten points requires all five families twice without hints and no outstanding balance.

Normal practice inserts an evaluation after the first graph and then after every two graphs. A perfect session therefore has ten graphs and five evaluations, covering all families and all four notation names. Misses/hints/recovery can extend the session. Graph/evaluation order is deterministic from the seed/counters. Completed families are skipped; unfinished ones recur. No speed round, timer, Streak Keep or continue-later code. Feedback remains until an explicit Next action so students can study it. An early report is always available with the actual partial score.

## Presentation and local records

Shared notebook welcome/identity layout, pale Start Skill Practice button, navy/orange Skill, required first/last name/hour 1–8 and a mathematically accurate evaluation-to-point illustration. Shared card/info bullets identify all five families and actual scoring/features. The landscape practice header is compact, with an uncapped Number correct, independent grade, five family credit counters and gold Star Launch. Learning goal is graph mastery, not a streak. Natural scrolling remains available; phones stack the columns.

Plot integer intersections by touch/mouse or arrow keys + Enter/Space; tap again or use ordered-pair buttons to remove points. Selected point/cursor and all entered points are controlled state. The graph stays unrevealed until hint or assessment. Numeric keypad avoids the native iPad keyboard and supports hardware input; green input glow for correct output. Scratch paper is available on every question, with pen/eraser/undo/clear. It clears for each new question and stays local. Only committed strokes/tool changes enter native snapshots; pointer moves do not publish.

English default, full-page Spanish/tap-English mode. Required shared two-rating reflections precede the named, dated local PNG and manual Classroom submission. Reflections do not change math scores. No names, answers or records are sent to a website server or browser storage.

## MathBoard

App identifier `algebra2-parent-graph-evaluation`, version 1. Existing installer is unchanged; early route bootstrap now includes this route even in a regular browser. Publish only after this widget's own trusted input, never on mount/restore; foreign or malformed snapshots are rejected. Explicit `?mathboardDisplay=1` is read-only.

`customState` restores language/settled scroll, identity, seed and exact current question/notation/input, graph queue/evaluation serial, per-family credits, all assessment counters and outstanding/recovered points, graph points/keyboard cursor/focus, hint status, numeric partial entry, feedback, star run history, scratch visibility/committed strokes/tool, info dialog, return scene and completion ratings/image. No animation-frame or scratch-move publications and no restoration echo/replayed rewards. The display derives curve/corrections from the same restored question and result.

Reports send the widget's grade/maxScore and actual attempted counts. `correctFirstTry` counts unhinted graph credits plus correct evaluations; assisted correct graphs are separate in `extraData.correctGraphs`, along with graph/evaluation attempts, misses/recoveries/balance, hints, mastery and per-family credits. Open-ended question totals and a grading streak are not fabricated. `isComplete` is true only on the explicitly requested report after both ratings and a current-language local image; early reports may finish with a partial score.

## Verification and next teaching material

`node --experimental-strip-types scripts/test-parent-function-lesson.mjs` covers six seeded perfect sessions, five-family and notation coverage, exact evaluation arithmetic/KaTeX, actual graph checks, graph requeue/hints, repeated deductions/recovery and graph return, duplicate guards, early/final scores, JSON round trips, invalid snapshots, early callback/no echo, stars and Spanish. Existing parent graph, series 2, bridge, completion, Spanish, directory and card regressions remain applicable.

Browser checks cover actual plotting and keypad actions, repeated evaluation misses/recovery, hinted/missed graph correction and return, full mastery/reflections/PNG/native score, scratch commit-only publication, early/read-only restoration of partial work/feedback/record, responsive entry/workspace, Spanish, keyboard and ordinary browser operation. Physical MathBoard/iPad classroom testing remains teacher confirmation.

The larger guided slider-based transformations lesson and its accompanying notes/PDF are future teaching-design work; this implementation supplies the specified third prerequisite widget. No notes/PDF was supplied or published with this widget, and no existing course materials were changed. Keep the teacher's future constraint b≠1 ⇒ h=0 when designing those later lessons.
