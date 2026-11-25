# 2. Identify Function Family by Equation

Beta route: `/apps/beta/function-family-equations`. Five choices only: constant, linear, absolute value, quadratic (square), cubic. Student-facing text is about identifying families, never about transformations or the private difficulty mechanism. Uses the shared entry/identity sheet, three-bullet public card/info dialog and existing gold Star Launch implementation without editing widget 1.

## Curriculum and grade

Parent round: balanced five-family blocks, ten correct in a row. Equations cycle f(x), g(x), h(x), y; parent constant is 1. Large congratulations dialog after ten: “You are now ready for advanced identification.” Starting advanced resets the displayed star trail, but preserves parent results, total correct and earned Keeps.

Advanced: another ten correct in a row. Internally, begin with exactly one nonidentity operation. A credited streak of five permanently unlocks multiple-operation equations; this boundary does not reset the streak. Freeze each question's kind during feedback so the fifth correct answer does not change its displayed equation. Misses after unlocking do not revert difficulty. Mixed expanded/grouped forms include shifted absolute value, expanded quadratic/cubic and fractions. Leading coefficients never vanish; linear shifts cannot cancel the intercept. All horizontal input scales are one, preserving the series constraint b≠1 ⇒ h=0.

Constant functions cannot have two independently observable geometric transformations. Their advanced multiple-operation expressions show a nonunit multiple of 1 plus a nonzero constant, e.g. `3(1)+4`; they remain constant. No pretend horizontal shift of a constant is counted. The generator's private operation count counts reflection, magnitude scale, nonzero horizontal shift and vertical shift; negative nonunit scales count as two. It never appears in the student UI.

Grade policy follows the teacher's wording: parent partial credit = best parent streak/2 (0–5); completing only parents reports 5/10. Once an advanced answer is attempted, grade = best advanced streak/10, including values below five. Both rounds mastered earns 10/10. A later mistake never erases the earned best streak. The optional clarification asked whether five should remain a floor; absent a reply, the literal requested advanced-streak formula was used and stated in chat. Do not silently add a floor or change this to ten total/five in a row.

## Streak Keep

Visible balance is earned minus used. First earned after eight parent questions answered (right or wrong); then one after each eight consecutive *unassisted* correct advanced answers. This follows “first 8 questions complete” and “8 more in a row”; teacher can revise the policy. A miss resets the unassisted run even if a Keep is used, preventing Keep awards from feeding themselves.

A Keep lights only when a positive streak has just broken and balance is available. It remains available after the next equation appears, but expires when that equation is answered. Using it removes that miss's collapsed run star and restores the pre-miss streak, spending one Keep. The missed question remains wrong in raw attempts/correct counts; it grants neither another star nor a launch. It cannot be used twice for one miss. No zero-run Keeps. Keep balance carries across rounds.

Per-question progression is automatic after feedback (1.4 seconds right/saved, 3 seconds wrong). The stage-start action is explicitly Start advanced identification. No timer, per-question Continue, speed round, continue-later code or browser student-data persistence. Reports remain available at any time, with shared two-rating reflections, named/dated local PNG and manual submission.

## MathBoard contract

New app `algebra2-function-family-equations`, snapshot version 1. Existing bridge installer is unchanged; only the early bootstrap route match now includes this route. Normal browser works with no native object. No publish on mount or restore; only this widget's trusted input arms publication. Passive restored views do not auto-advance until controller interaction. Explicit `?mathboardDisplay=1` is read-only.

`customState` includes language, settled scroll and full state: names/hour, seed, phase, fixed question kind/index, selected response and feedback, both round counters/raw runs/credited runs and collapsed stars, hidden unlock, Keep bank/pending recovery, next-question deadline, congrats/info state, return scene and completion reflections/image. It reproduces the exact equation and scene. Incoming malformed/foreign snapshots are ignored. Star presentation adapters reuse widget 1's components; restoration does not replay launches. Timer ticks produce no state/publication until an actual question/scene transition. No animation-frame publications.

Required numeric score/maxScore and meaningful progress are reported. `answeredItems` and `correctFirstTry` are actual attempts/correct answers; `longestStreak` is the longest **unassisted first-try** run, so insured runs do not misstate it. `extraData` distinguishes credited parent/advanced best streaks and Keep usage. `totalItems` is omitted because this is open-ended streak practice. `isComplete` becomes true only on an explicitly requested report after both reflections and the current-language local record exist, including early reports. Mastery by itself does not prematurely finish the shared record flow.

Identity, answers and records stay local/in the existing native snapshot. No score uploads, localStorage, cookie identity or Firebase catalog writes. Discovery is Beta/explicit All only, not lesson links.

## Verification

- `scripts/test-function-family-equations.mjs`: all families/names, exact equation values, KaTeX, fractions, polynomial and grouped forms, private operation gates.
- `scripts/test-function-family-equation-state.mjs`: both gates, unlock latching, duplicate answers, reset stars, Keep recovery/expiry/counters/awards, grade and snapshots, final record readiness and malformed states.
- Existing graph-family/stars, early bridge, completion, Spanish, directory, card and content regressions remain required.
- Browser checks cover responsive entry/gameplay, actual two-round flow/insured miss, congrats, rewards, reflections/PNG, early restoration, readonly mirror/no echo, reduced motion, Spanish, regular browser and no student-data POSTs. Physical MathBoard/iPad testing remains for the teacher.
