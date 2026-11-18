# MacIntodd Math AI handoff

The M4 Mac mini is the primary editing machine. The AI on the other Mac reviews changes on GitHub. Use GitHub `main` as the published source and follow [AGENTS.md](../AGENTS.md) for maintenance rules. Review the latest commits before starting work.

## Latest application change

- The classroom lesson now ends the notes at P4. A correct P4 opens **I’m ready to Practice** with a prompt to show the teacher. The teacher route also lists only the six parallel notes examples. The existing handout link opens to the front.
- Generated parallel practice uses integer y-intercepts. Students need three consecutive correct graph problems, two guided point-slope problems, two independent problems, and two standard-form problems without hints. A mistake or standard-form hint resets the current streak. A corrected answer advances to a fresh problem. Independent and standard-form problems show scratch paper above the equation field. Independent practice also shows a point-slope reference.
- Original PPL codes restore parallel notes progress. Practice codes preserve generated questions, attempts, streaks, hints, and completion. Historical perpendicular records remain available to the old decoder.

- Student P4 now shows a graph-free left workspace. Check the given slope, check the new slope, place the three signed quantities in point-slope form, then submit the final slope-intercept equation. The preparatory checks leave the existing equation scoring in place. The keypad on every student slide uses the Level 3 layout and switches to local scratch paper. Scratch work stays available when switching tabs and clears when changing problems.

- Correct student equation fields and accepted slope readouts keep a green border glow. The red solution line glows after the equation is correct, whether it preserves a checked sketch or comes from the submitted equation.

- Every correct student sketch shows the graphical-answer heading and two small callouts. One arrow points to the gold point and the other to the given blue line. The red bubble describes the parallel or perpendicular relationship. Continue returns to slope checks or equation entry, according to the problem’s progress.
- `f0f8afa` enlarges the markers and ordered pairs shown when students tap integer points. All sketching problems now use the diagnostic camera for a missed point or an incorrect slope. **Retry drawing** restores the drawing grid. Perpendicular problems highlight the crossing angle or identify parallel lines. The separate teacher presentation also uses the shared graph.
- P3 on Slide 3 supports an optional tap or drag sketch and **Check line**. The exact y-intercept is −14/3. The directions prompt students to derive the equation in point-slope form and submit it in slope-intercept form.
- The header arrows step through reached problems and retain the current lesson's sketches and typed work. The first unsolved equation limits forward navigation.
- `ced4605` removed the slope input and keypad beside the sketch. A tap draws through the given gold point and replaces the previous red point. A drag starts where the student presses.
- Routes are the [student beta lesson](https://www.macintodd.net/apps/beta/parallel-perpendicular-lesson) and [teacher presentation](https://www.macintodd.net/apps/beta/parallel-perpendicular-lesson/teacher).

## MathBoard mirroring

- The student and teacher routes install the restore callback before React and queue early snapshots. A restore stays quiet until a trusted user gesture, so the teacher can edit after returning to a slide and a passive receiver stays quiet. The native contract has no projector role field. A projector URL with `?mathboardDisplay=1` hides controls and stays read-only.
- Student and teacher restore graph state and scroll position. Student scratch checkpoints carry editable strokes and the selected pen or eraser. Older scratch images still restore as a background. Reflection and save dialogs restore their visible state. Diagnostic zoom sends start and end checkpoints. Equation animation sends phase, count and impact checkpoints.

- The student snapshot carries the ready screen, seeded practice records, hints, and scratch image. Both routes retain read-only receivers. The teacher receiver can restore older snapshots of the parallel notes portion and displays six notes examples.

- P4 slope progress, selected and placed quantities, and placement completion travel in the existing progress snapshot. The optional scratch field carries the active tab and a read-only image after each stroke or edit. The student bridge remains version 1 and accepts older snapshots without this field.

- The answer and line glows use the existing correct-slope and solved-equation state. A simulated read-only receiver reproduced both glows with the existing snapshot format.

- `c56cf8f` added the native bridge. The controller sends snapshots through `window.MathBoardApplet.publishState(snapshot)`. The external display receives them through `window.mathBoardAppletSetState(snapshot)`, registers once, and renders read-only without sending received state back. Regular browsers work without the native bridge.
- In `ced4605`, the graph snapshot carries the tapped point as part of the sketch segment so the external display draws the same line and single red marker. Drag endpoints, selected coordinate labels, diagnostic zoom, equation animation, language, dialogs, and the local completion image still mirror. The removed sketch slope editor no longer contributes state.
- The larger labels and the diagnostic camera use the existing selected-coordinate and zoom snapshot fields on the student and teacher routes.
- The existing graphical-success flag now renders the correct sketch callouts for every student sketching problem on the read-only display. The existing progress and graph snapshots carry the reviewed problem index and the P3 sketch. The bridge methods and snapshot version stay the same.

## Verification and deployment

- MathBoard startup and controller restore update passed typecheck, lint, content checks, production build, diff checks, and parallel lesson, teacher, scratch, completion, and MathBoard regressions. Simulated document-start tests covered drafts, scroll, selected points, scratch undo after restore, and passive and explicitly read-only views. The teacher equation animation sent nine meaningful updates in the tested example. Both Vercel deployments for `aa73c80` succeeded. The simulated document-start restore and animation publication checks passed on macintodd.net.

- Parallel-only update passed a simulated iPad walkthrough from the notes through graphing by tap and drag, guided and independent work, standard-form hints, streak resets, resume, both reflections and the completion image. Typecheck, lint, content checks, production build, diff checks, app directory, and the parallel, teacher, Spanish, and MathBoard regressions passed. Both Vercel deployments for `dabb976` succeeded. The full walkthrough passed again on macintodd.net.

- P4 and keypad update passed typecheck, lint, content checks, build, diff check, parallel classroom, Spanish, teacher, and MathBoard regressions. Simulated iPad landscape testing covered touch drag and drop, tap-to-place, rejected and accepted placements, slope and equation keypad entry, scratch drawing and tab switching, Spanish, and read-only MathBoard restoration. Both Vercel deployments for `acd4b2f` succeeded. The touch walkthrough and simulated MathBoard restoration passed again on macintodd.net.

- For the answer glows, typecheck, lint, content checks, build, diff check, and parallel lesson, teacher, Spanish, and MathBoard regressions passed. The simulated iPad landscape check covered correct and incorrect equations, accepted slopes, the final line, and MathBoard restoration. The custom-domain Vercel deployment for `30a907a` succeeded. The secondary deployment was still pending at the last check. The answer-glow and MathBoard checks passed on the live site.

- For the all-sketch success callouts, typecheck, lint, content checks, build, diff check, the parallel classroom, Spanish, teacher, and MathBoard regressions passed. A simulated iPad landscape walkthrough checked all nine sketch problems, both relationship wordings, Spanish, slope and equation continuation, and read-only MathBoard callout restoration. Both Vercel deployments for `037ae3b` succeeded. The same nine-problem walkthrough passed on the custom domain.

- For `f0f8afa`, typecheck, lint, content checks, build, diff check, the parallel lesson and separate teacher regressions, beta Spanish, and MathBoard all passed. Simulated iPad and phone testing covered the updated callouts. The iPad walkthrough also checked larger coordinates, both kinds of sketch error on Slide 2, P3 retry, perpendicular diagnostics, and the separate teacher route. Both Vercel deployments for release `95588b0` succeeded. Repeated the walkthrough on macintodd.net and confirmed the student and teacher diagnostics mirror to simulated read-only MathBoard receivers without echo.

- Passed `npm run typecheck`, `npm run lint`, `npm run check:content`, `npm run build`, and `git diff --check` for the callout, P3 sketch, and navigation update.
- Passed the parallel lesson regression scripts (`scripts/test-parallel-*.mjs`), the beta Spanish regression, and the MathBoard regression. In simulated iPad landscape and phone viewports, checked the bubble layout. The iPad landscape test also covered Spanish, P3's fractional equation, and navigation that retains a checked sketch and draft equation.
- Both Vercel deployments for `0e36649` succeeded. Verified Slide 1 callouts in English and Spanish, P3 sketch and equation checks, and review navigation on the custom domain. The simulated native bridge showed all three callout arrows on a read-only display with no feedback echo. The live teacher route returned HTTP 200.
- The two separate related-lines scripts (`scripts/test-related-lines.mjs` and `scripts/test-related-lines-v2.mjs`) fail looking for **Create my results image**. The same failures were reproduced at `c56cf8f`.
- Both Vercel deployments for `ced4605` succeeded. `macintodd-math-site-nhx6` serves the custom domain. Verified the live student sketch in a simulated iPad landscape viewport, including graph centering, tap replacement, drag, equation keypad, and the Spanish toggle. The live teacher route returned HTTP 200.

## Still open

- Test the native MathBoard bridge on a physical iPad connected to a projector or external display. Verify that taps, drag, diagnostic zoom, Slide 1 callouts, P3 sketches, and review navigation appear on the projector and that the receiver stays read-only.

## Separate teacher presentation (review Mac)

- The teacher route now mounts `teacher/TeacherLesson.tsx`, with its own `teacher.css`. The student `Lesson.tsx`, `LessonGraph.tsx`, graph logic, progression, and scoring were not edited for this change.
- Teacher controls: unrestricted problem/slide navigation, fill answers, check slopes/equation, step-by-step reveal/back, reset current problem. No student final scorecard. All 12 examples share the student problem data.
- Its native bridge uses `app: 'parallel-perpendicular-teacher', version: 1`; the native app relays this object unchanged through the existing publish/restore functions. Teacher and TV must use the same `/teacher` URL. It mirrors drafts, graph/zoom, animation frames, reveals, warnings, language and active input, without feedback echoes. New test: `scripts/test-parallel-teacher.mjs`.
- Other touched shared file: `src/lib/parallel-classroom-spanish.ts` only adds translations for new teacher labels. `scripts/test-parallel-language.mjs` recognizes the separate teacher entry and scans its prose. The primary AI can continue student work independently; coordinate changes to shared graph or problem-data contracts.
- Both Vercel projects reported success for the separate teacher presentation commit `a75073e`. Typecheck, lint, content check, production build, teacher tests and existing parallel classroom/language/mirroring tests passed. See `docs/parallel-teacher-presentation.md`. Physical MathBoard projector testing remains open; browser layout testing was unavailable on the editing Mac.

## Horizontal/Vertical feedback and early finish (review Mac)

- Scope confirmed by teacher: all five levels of `/apps/horizontal-vertical` only, not every widget on the website.
- A wrong selected choice flashes a red outline three times and keeps its red outline afterward. The actual correct choice remains green. Reduced-motion users get the steady red outline without flashing. Demos still do not count.
- Each level starts with its existing eight-in-a-row goal. At 20 scored attempts in that level, the goal becomes six in a row. A current streak of six (not only a historical best) unlocks **Record Score and Skip to End**. Students can instead continue through the normal level flow with the reduced target.
- Early exit goes to the existing two required reflections and final named/dated completion record. Scoring stays on the original rubric: up to 2 points per level for best streak / 8; unattempted levels earn 0. Early-exit records explicitly say the six-streak option was used and show every level's actual best streak / 8. Six in every level earns 7.5/10; full eight-streak mastery still earns 10/10.
- Resume format now uses HV's existing extension marker 4 and a separate early-exit flag. Existing eight-streak and older five-streak codes remain supported. Tests cover current/reduced targets, early exits at all five levels, scores, old/new code round trips, wrong-choice styling, double taps and the real named/dated reflection transition.
- No MathBoard bridge, student data collection, or parallel/perpendicular lesson files were changed.
- Passed widget regressions, completion-flow regressions, typecheck, lint, content check, production build and diff check. Browser layout/hardware inspection was unavailable on this Mac. Deployment status: feature commit awaiting Vercel/live verification; record the result below once checked.

### Horizontal/Vertical deployment verified

Both Vercel deployments for `c2c12dd` succeeded. Verified the custom-domain `/apps/horizontal-vertical` page's published JavaScript includes the six-streak early-finish control and partial-score details, and that its published stylesheet includes the incorrect-choice flash. The student widget checks and shared reflection tests passed. No physical iPad visual check was performed on this Mac.

## Standalone parallel drawing game (review Mac)

- Added `/apps/beta/parallel-drawing`: **Parallel Lines · Draw the Match**. New Beta Apps card has a drawing preview. Regular app directory still excludes beta routes. Parallel student/teacher lesson components were not changed.
- Students draw a first stroke that straightens, then freehand a red match. 0–100 game score combines constant signed perpendicular spacing with matching direction; reverse, horizontal and vertical strokes work. Short/overlapping strokes receive prompts and are not counted. Optional perpendicular distance markers explain the result. Retry the reference or draw a new one; untimed, no fixed round count.
- Local name/hour and session timestamp remain visible. Finish opens the shared two-reflection completion record with local date/time, average/best percentage, round count and every round result. No new student data transmission/storage. Spanish whole-page/tap-English system is included. No MathBoard bridge was added to this standalone game.
- New math helper/test are **parallel-drawing-game.ts** and **test-parallel-drawing-game.mjs**; the older parallel-drawing.ts / test-parallel-drawing.mjs remain unchanged and their original opening-lesson tests pass. See docs/parallel-drawing-game.md for score design and integration boundaries.
- Passed new game checks, earlier drawing regression, parallel language regression, shared completion tests, typecheck, lint, content checks, production build and diff check. Physical iPad/Pencil feel and visual viewport testing remain open. Feature commit awaiting live deployment verification; record result below once checked.

### Parallel drawing game deployment verified

Both Vercel deployments for `4ac84ef` succeeded. Verified the custom-domain `/apps/beta/parallel-drawing` page, published game controls/scoring prompts and touch-safe canvas CSS. Verified its card/link appears in Beta Apps and remains absent from the regular app directory. Physical iPad/Pencil drawing feel remains for teacher testing.

## Drawing warm-up and parallel-only addresses (review Mac)

- User approved standalone game. Its step 1 now reads **Draw a straight line on the canvas.** Step 2 is unchanged. Promoted it to `/apps/parallel-drawing` in the new **Games** directory category; `/apps/beta/parallel-drawing` remains a working alias. The source component stays in its existing folder for reuse.
- Lesson title is now **Write Linear Equations: Parallel Lines**. Canonical routes are `/apps/beta/parallel-lines` and `/apps/beta/parallel-lines/teacher`; old parallel-perpendicular-lesson paths still render the same pages. Catalog and teacher/student navigation use the new URLs. Historical internal `lessonSlug` and resume encodings stay unchanged; scorecard title lookup handles aliases.
- A new student session enters an unscored drawing warm-up after name/hour. The game reuses that identity. Play a valid round, retry freely, then Continue to lesson starts P1. Existing resume codes go directly to saved lesson work. No extra survey is imposed before the notes; normal final lesson reflections/scoring are unchanged. The teacher presentation remains independently navigable.
- The warm-up is embedded through optional `introGame` on the student page and optional embedded/read-only/state props on the game. Its live drawing, reference, result, score history and distance overlay are in the parent MathBoard snapshot as `warmupGame` with screen `warmup`. Read-only displays do not publish or advance. The document-start bridge recognizes new and old student/teacher URLs. Standalone game still has no native bridge.
- Passed game, classroom, lesson mirroring (including warm-up and resumed-code bypass), bridge startup, teacher, language, scorecard and directory regressions; typecheck, lint, content check, production build and diff check. Physical iPad/Pencil/projector layout/feel still requires teacher testing. Feature commit awaiting live deployment verification.

### Drawing warm-up and canonical URLs verified

Both Vercel deployments for `8728e21` succeeded. Live checks confirmed `/apps/beta/parallel-lines` and the old lesson URL both show the parallel-only title and drawing-game entry; `/apps/parallel-drawing` and its old beta URL show the revised step 1. Verified the new teacher URL, warm-up/mirroring bundles, standalone Games entry and new Beta lesson link. Existing saved-work bypass is covered by the regression test. Physical device testing remains open.

## Retired notes problem P2c (review Mac)

- User requested removal of the fourth integer-intercept graph/equation example, Slide 2 P2c. Active `parallelNotes` now contain **P1, P2a, P2b, P3, P4**. Both student and teacher navigation omit P2c. Slide 2 counter now uses its actual two-problem total. The opening game and generated practice requirements are unchanged.
- The original 12-entry `parallelLesson` array remains intact exclusively for legacy PPL encoding and old presentation compatibility. Do not delete/reorder its P2c slot: active notes filter it out instead.
- Student code saving maps active notes back to legacy IDs and fills the retired slot only after earlier notes are complete, maintaining old sequential-code validation. Loading maps legacy IDs to active notes, discarding P2c only. Old practice tails retain the same seed/serial/stage history. An old code stopped at P2c resumes at P3.
- Previous six-note MathBoard snapshots are normalized to the five-note order. Student draft/progress and teacher P3/P4 mappings are preserved, and a snapshot focused on retired P2c advances to P3. Current generated-practice snapshots are not remapped.
- Added `scripts/test-parallel-retired-note.mjs` for old/new PPL compatibility, old completed-practice codes and snapshot index migration. Passed classroom, teacher, mirroring, language and bridge checks, typecheck, lint, content check, production build and diff check. Physical device check remains open. Feature commit awaiting live deployment verification.

### P2c removal verified live

Both Vercel deployments for `d359002` succeeded. Live canonical and legacy teacher pages now list exactly P1, P2a, P2b, P3, P4, with no P2c option. Both student lesson URLs return HTTP 200. Student progression, old/new resume mapping and native snapshot migration passed the regression checks.

## AP Precalculus rational-functions MCQ practice

- Added `/apps/ap-rational-practice`, original questions based on the ten teacher-selected 1.7A–1.9 packet/solution/extra PDFs. No originals uploaded or changed. New generator/resume/Spanish modules, app files, test and documentation; shared edits are directory preview/catalog, translation registry and scorecard skill.
- Default 10 no-calculator + 10 calculator-allowed questions, selectable parts/topics. +10 correct, -5 missed, signed totals, no streak. Worked feedback, missed-question review, scratch paper, local identity/resume, Spanish, two required reflections and named/local-time completion image.
- Passed 30,000 generated-question checks and actual component flow, shared directory/scorecard/completion regressions, typecheck, lint, content check, production build and diff check. No MathBoard bridge changes. Physical iPad layout testing remains open. See docs/ap-rational-practice.md. Deployment pending live verification.

### AP rational-functions deployment verified

Both Vercel deployments for `ce8a3f3` succeeded. Verified HTTP 200 and the activity title on `/apps/ap-rational-practice`, its regular app-directory entry, and the published app JavaScript/CSS including calculator sections and RAT1 resume logic. Shared completion-flow tests passed before deployment. Physical iPad visual testing remains open.

## Transformation Explorer: compare two equations

- Split the right-hand controls into Equation A (orange) and Equation B (purple), each with independent selected-parameter sliders and reset. Circular checkbox selectors allow A, B or both; the last visible equation cannot be hidden. Hiding preserves values. Shared function-family selection and parameter menu still apply to both, with unselected parameters reset to identity at launch.
- Graph draws only enabled equations plus the dashed parent, including independent mapped dots and rational holes. Mapping/same-input tables show both enabled configurations. Recorded views and the named completion record preserve both settings and visibility. No student-data/network or MathBoard bridge changes.
- Updated actual-component regression covers independent sliders, visibility guard, table columns, resets and recorded A/B settings. Math checks cover 6,525 mapped points and rational branch/domain behavior; typecheck, lint, content check and production build passed. Browser/iPad visual inspection remains open on this Mac. Deployment pending verification.

### Dual-equation explorer verified live

Both Vercel deployments for `fdef8b1` succeeded. Verified the custom-domain `/apps/transformations` page returns HTTP 200 and its published JavaScript includes independent B controls/reset/comparison data; its stylesheet includes the two-column equation layout and B styling. Physical iPad visual verification remains open.

## Remove unrelated quarter-turn demo from Parallel Lines

- Removed the quarter-turn prompt, reveal/replay controls and example text from all student problems and the separate teacher presentation, plus the graph's rotation overlay. Generated practice stage 0 uses slide number 5, which accidentally activated the legacy perpendicular demonstration.
- Retained legacy turn fields in MathBoard snapshots/types for compatibility, but they no longer render rotation content or trigger slope arrows in this parallel-only lesson. No changes to problem generation, completion gates, scoring, resume codes or other widgets.
- Classroom, teacher, display-mirroring and language regressions passed; added a no-quarter-turn regression for all three renderers. Typecheck, lint, content check, production build and diff check passed. Deployment verification pending below. No physical iPad check performed for this removal.

### Quarter-turn removal verified live

Both Vercel deployments for `e0e5afb` succeeded. Verified HTTP 200 for canonical student and teacher Parallel Lines routes and confirmed both published page bundles omit reveal/replay quarter-turn controls and the quarter-turn graph overlay. Canonical and legacy routes share these components. Physical iPad inspection remains open.

## Algebra 2 Unit 1B Lesson 4 notes and online practice

- Teacher requested only blank Lesson 1.4 notes, no completed notes and no practice PDFs. Reviewed both pages of `U1B L4 Notes Writing Equations of Lines.pdf` and compared the older similarly named three-page copy; selected the explicit two-page notes unchanged. One allowlisted PDF only, with source/published SHA-256.
- Added `/courses/algebra-2/writing-linear-equations`, Lesson 4 under Unit 1B, vocabulary and resource-only materials. Added data-driven `practiceActivities` to the existing lesson reader: Levels 0–5 plus combined Levels 1–3 labeled as an alternative. Catalog lesson tags updated. Existing video/review flows unchanged, no worked examples added, no MathBoard changes.
- Content checker now validates activity slugs against the app catalog and permits activity-based lessons without videos. Typecheck, lint, content check, directory regression, production build and diff check passed. Generated HTML verified: one notes PDF, seven app links, Algebra 2 index and Unit 1B lesson sidebar. Deployment verification pending below; PDF pages visually reviewed. No physical iPad check performed.

### Lesson 4 verified live

Both Vercel deployments for `f68d386` succeeded. Verified the live Lesson 4 page, all six Levels 0–5 links plus the alternative combined app, its Algebra 2 index link, and exactly one published PDF anchor. The live blank-notes PDF SHA-256 matches the reviewed original. No completed notes or practice PDFs were uploaded. Physical iPad layout inspection remains open.

## Safe return from reflection/completion to practice

- Shared CompletionFlow now shows **Continue practice** before the two reflection questions, with Spanish translation. Final image still has **Return to practice**. Both invoke a required explicit parent callback; there is no page-reload fallback. Read-only external displays cannot activate either return. Reflection gating for creating the named record is unchanged.
- Every current shared completion owner now supplies a non-resetting handler. Stretches/Shrinks/Shifts and Parent Transformations clear only the finished/report flags: exact current question, selection, checked outcome, hints, levels and statistics remain. Other early-finish widgets similarly retain progress; completed-only activities return to their last work/review. Original guided MathBoard session no longer clears the student/session when returning. Family iframe returns to the final level summary, preserving accumulated level results.
- Prevented automatic re-opening of the Given m and b report after returning. Related-line tutorials preserve final entries and do not count the last equation twice. Linear-equation bonus results remain intact; revisiting the last problem does not force another completed spinner game.
- Updated outdated test harnesses that still expected retired inline result screens to assert the shared completion handoff and return behavior instead. Passed actual partial-finish/return round trips for both scale modes and Horizontal/Vertical, all six rigid skills, both related-line tutorials, combined linear-equation flow, Given m and b auto-finish return, family host and two-point slopes. Shared completion tests cover reflection/image buttons, Spanish, required non-reset callbacks on all owners, image/rating gating and read-only mirroring. Parallel display-mirroring regression, typecheck, lint, content check, production build and diff check passed. No native payload changes or student-data uploads. Physical iPad visual testing remains open. Deployment pending verification.

### Completion return verified live

Both Vercel deployments for `44c664c` succeeded. Verified live HTTP 200 and published Continue practice control/parent return wiring for transformation-scales, parent-transformations, horizontal-vertical and write-linear-equation-level-4. Local actual-component regressions confirm preserved question/statistics and no double scoring across early returns; shared tests enforce a return handler on every completion owner and guard external-display navigation. Physical iPad interaction check remains open.

## Graphing Parent Functions + rational multiplier notation

- New `/apps/graph-parent-functions`: Precalculus Functions card/preview and parent-functions lesson tag. Fixed unscored example then six shuffled families (linear, constant, quadratic, cubic, square root, absolute value). Plot/remove integer points on equal-scale -10..10 grid; explicit minimum/anchor/side criteria ensure points reveal the parent shape. One corrective retry, 1 / 0.5 / 0 points per graph, /6 total, no timer or streak. Graded curves and success star; touch capture, keyboard crosshair and reduced motion.
- Local identity/hour, Spanish/tap-English, compact PGF1 continue-later codes and shared two-reflection completion records. Early-finish return preserves current checked graph and totals. Names/results never uploaded or persisted. No native MathBoard bridge changes. See docs/graph-parent-functions.md for criteria and resume version boundaries.
- All Transformations: Parent Functions rational expressions with stretches/shrinks now put the fraction inside scalable parentheses after a, e.g. -6(1/(3x-6))+1. The +1 stays outside the multiplier. Mathematical values/answer choices unchanged.
- New test passed 12,000 seeded graph cases, grading/domain/shape/duplicates, resume identity/checksum, exact rational formatting, LaTeX/Spanish and actual demo/retry/save/early-return/completion events. Transformation-scale, shared completion and directory regressions, typecheck, lint, content checks, production build and diff check passed. Deployment verification pending below. Physical iPad visual inspection remains open.

### Parent graphing and rational notation verified live

Both Vercel deployments for `9692ca8` succeeded. Verified HTTP 200 for `/apps/graph-parent-functions`, its regular practice-directory card, live graph-check/PGF1 resume/completion JavaScript and touch-safe graph CSS. Retrieved the published parent-transformations module with the rational-parenthesizing branch; exact -6(1/(3x-6))+1 LaTeX is covered by the regression. Physical iPad visual/touch verification remains open.

## Exact Lesson 4 worksheet widget

- Added `/apps/unit-1b-lesson-4-practice` for the teacher's two-page 16-problem `U1L4 PRACTICE Write Eq of Lines.pdf`. Reviewed text, both rendered pages and all embedded source graphs. Fixed original problem order/givens; graph slopes/intercepts verified. Original PDF not uploaded/modified; only an app link was added to Lesson 4 and the directory.
- Editable, independently checkable answers; free navigation to all 16 from the start; unlimited retries; three paid hints per question at −0.2 each with a 0.5 floor for checked-correct work. Checks/hints persist. Editable final answer review, correct/incorrect/changed/unchecked statuses, and per-question reporting. Q13 accepts x=0; Q16 requires the student's two-point drawn graph as well as the equation. Reference graphs offer optional integer-point reading aids only.
- Exact-place local saves on problem/review/reflection/final-image screens: downloadable JSON progress file + longer backup code containing drafts, hint/check histories, graph state, active question/screen/scroll, language, time and reflection ratings. L4P1 includes checksum/initials-hour check. Restored final record is regenerated locally. No names/results uploaded or browser storage used; no MathBoard native changes.
- Shared CompletionFlow gained optional save/submission-checklist/record-restore props. Existing behavior defaults unchanged. Required paper-work + online-record checklist appears on screen and saved record. Continue practice keeps work. New math/state/UI regression and extended shared completion tests passed; directory and display-mirroring regressions, typecheck, lint, content checks, production build and diff check passed. Deployment verification pending below. See docs/unit-1b-lesson-4-practice.md. Physical iPad/Files picker inspection remains open.

### Worksheet widget verified live

Both Vercel deployments for `2d2db7b` succeeded. Verified live HTTP 200 for `/apps/unit-1b-lesson-4-practice`, app-directory and Lesson 4 notes links, and published editable-review, progress-file/code, per-problem reporting and two-item submission-checklist assets. Confirmed rich L4P1 resume code and touch-safe graph CSS. Source-matched grading/state/restore and shared completion regressions passed locally. Original PDF was not uploaded. Physical iPad graph/Files-picker inspection remains open.

## Parallel Lines optional warm-up bypass

- Added Skip Warm-up on the drawing-game opening, notes examples, practice-ready checkpoint and graphing/point-slope guided stages. It jumps to Independent practice, preserving completed work and existing generated problem seed/history. Existing independent work is resumed rather than reset. Both canonical `/apps/beta/parallel-lines` and legacy `/apps/beta/parallel-perpendicular-lesson` share this student component. Separate teacher presentation is unchanged.
- Independent and standard-form gates remain two consecutive correct each (standard form without hints). Skipped optional stages are identified on the completion record, never fabricated as correct. Navigation ignores abandoned optional warm-ups.
- New PPI resume format records explicit stages and actual note outcomes for skip sessions; existing PPL/generated codes remain supported unchanged. Identity-initial/hour and checksum checks remain local. Native snapshots carry the bypass in the existing progress object; read-only displays cannot invoke it. Added Spanish strings and compact wrapping controls.
- Regression coverage includes fresh and partially completed skips, idempotence, retained attempts/seed, mandatory streaks, named/hour/checksum resume validation, completion, nonsequential optional-note review and native display restoration/no echoes. Classroom, language, teacher and retired-note regressions, typecheck, lint and content checks passed. Production build and live deployment verification recorded below when complete. Physical iPad inspection remains open.

### Warm-up skip verified live

Production build and diff checks passed. Both Vercel deployments for `3fd7651` succeeded. Verified HTTP 200 and published Skip Warm-up, direct-independent-practice explanation and skipped-work completion-label JavaScript on both `/apps/beta/parallel-lines` and `/apps/beta/parallel-perpendicular-lesson`. No physical iPad inspection was performed. Existing teacher page and student data transport remain unchanged.

## Level 4 best-streak requirement reduced to three

Write the Linear Equation LEVEL 4 now requires 10 correct plus a best streak of 3 for full math credit. Updated focused completion/scoring, welcome/goal/streak/early-finish text, Spanish strings and app-directory metadata. Other levels and support fading (three-streak calculation, eight-correct independent stage) unchanged; resume-code format unchanged. Focused full-flow/support/resume and language regressions, typecheck, lint, content checks, production build and diff checks passed. Deployment verification pending.

### Level 4 streak change verified live

Custom-domain Vercel deployment for `769c6ed` succeeded. Verified HTTP 200 for `/apps/write-linear-equation-level-4` and published welcome/goal text stating 10 correct plus a best streak of 3. Local regression verifies completion at 10/3, noncompletion at 10/2 and 5/3, full 10/10 math scoring at the new threshold, and preserved support milestones/resume behavior.

## Classroom material publication: Algebra 2 L4 and Precalculus 1.6–1.7B

- Algebra 2 Writing Equations of Lines now links blank notes, completed classroom notes, matching 16-question blank practice and newly supplied handwritten practice key. Original key is unchanged; final answer 7 has an intercept-sign error, clearly corrected as y=−5x/4+3/2 next to the links using shared MathText. Other worksheet final answers were checked against the existing source-matched companion regression. Previous blank-only restriction is superseded by this request.
- Precalculus 1.6 now has four matching material links. Added Unit 1B 1.7A Shifts & Reflections (four links) and 1.7B Stretches & Shrinks (blank notes, annotated notes, blank practice; separate practice key not found and explicitly unavailable). Added vocabulary, unit skills and existing practice activities. No new videos/worksheets authored. Existing 1.7B practice DOCX was exported to a two-page PDF and visually checked.
- Organized descriptive copies in the local course/completed folders without overwriting originals, including previously published Algebra 2 L3 notes/practice/key. See publishing-review documents and content-sources.json for exact source selections. Only selected classroom materials are published; tests/quiz keys remain excluded.
- All selected source and browser-rewritten pages inspected; verified identical rendered pixels for the first 14 source/PDF pairs. Added L4 key also inspected on both pages. Content checks now cover 34 lessons and 110 allowlisted PDFs. Typecheck, worksheet-companion grading/state regression and initial lint/build passed; final lint/build and deployment verification below. Physical iPad inspection remains open. No native bridge, score transport or widget behavior changes.

Final lint/build and diff checks passed. Verified all 15 affected source/published PDF pairs have matching source hashes, two pages and identical rendered pixels. Inspected generated lesson HTML for all four material positions, selected PDF links and the typeset problem-7 correction. All original teacher files remain unchanged.

### Course handouts verified live

Both Vercel deployments for `3efbca2` succeeded. Verified HTTP 200 and expected material links on Algebra 2 Writing Equations of Lines, Precalculus parent functions, 1.7A shifts/reflections and 1.7B stretches/shrinks pages. Confirmed both new lessons appear in the Precalculus contents. All 15 affected PDF links return HTTP 200 with PDF content type; live Lesson 4 practice-key SHA-256 matches the reviewed published file. Problem-7 correction is present on the live lesson page. The 1.7B completed-practice PDF remains unlocated/unpublished and explicitly marked Not posted yet.

## Separate test/quiz review pages

- Added Algebra 2 Unit 1B Day 1 and Day 2 review pages, each grouping Part A/B blank reviews and corresponding worked answer sheets. Slugs: `unit-1b-test-day-1-review` and `unit-1b-test-day-2-review` under `/courses/algebra-2`. All eight PDFs are two pages.
- Added Precalculus `/courses/precalculus/quiz-review-sections-1-6-to-1-7`, covering 1.6–1.7B, with blank review (two pages) and matching review answer key (one page). Exported existing Word sources without content changes; PDF copies are beside originals in the Chapter 1 Sections 1.6-1.10 folder. Actual test/quiz files and test/quiz keys are excluded.
- Data-driven pages use the existing lesson reader, explicit review/answer labels, lesson links, study directions, optional practice and vocabulary. New content module `src/content/test-reviews.ts`. No native bridge, widget progress or score changes.
- Reviewed all 19 PDF pages; verified all ten source/published pairs by source hash, page count and exact rendered pixels. Content checks cover 37 lessons and 120 allowlisted PDFs; typecheck passed. Final lint/build and deployment verification below.

Final lint/build and diff checks passed. Generated HTML confirms all three review pages, all ten PDF links and both class-index entries.

### Separate reviews verified live

Custom-domain Vercel deployment for `6d3d7ac` succeeded. Verified HTTP 200 for all three new review pages, their links in both course contents, and all ten review/answer PDF URLs with PDF content type. Algebra 2 Part A/B reviews and worked answers are grouped by test day; Precalculus review/key is on its separate 1.6–1.7B page. Actual assessments remain unpublished.

## Day 1 interactive review widget

- Added `/apps/unit-1b-day-1-review` (Unit 1B Day 1 · Review & Learn), matching the published Day 1 Review Parts A (21 questions) and B (18). Mutually exclusive part buttons update the numbered navigation; questions unlocked from the start; answer drafts persist across parts. Checks cover every requested component (including units/signs, slope/direction, both intercepts/equation, and both labeled graphs).
- Learning-first self-evaluation notice on the start/practice/report; no test grade or streak/timer. Each completed problem earns 1 minus 0.2 per hint with 0.5 floor; three progressive hints; unlimited free rechecks. Feedback identifies correct components and gives targeted next steps for others. Formula hints and questions typeset with LaTeX. Graphs use integer-point taps, visible coordinates, separate a/b selection, Draw then Check. Scratch per problem + keypad.
- Editable selected-part answer review, optional partial finish with both reflections, named/local-time completion image and safe return; D1R1 local progress file/backup code restores drafts, counts, graphs, scratch, part/question/tool/screen/scroll, language and ratings. No uploads/storage. New directory preview and Day 1 review-page link. Shared scorecard skill/Spanish strings added; no MathBoard bridge changes. See docs/day1-review-widget.md.
- Independent all-39-answer and graph math regression, actual component flow, pointer gestures, resume/schema/checksum/identity, translations and LaTeX passed. Existing Lesson 4 worksheet, shared CompletionFlow and equation-language regressions passed; typecheck/content/lint/build passed before final simplified-expression grading refinement. Final build/deployment below. Browser/iPad visual inspection unavailable (native browser pipe missing).

Final grading refinements (distribute variable expressions and equations before accepting simplified form), full regression, typecheck, content checks, lint, production build and diff checks passed. Generated HTML verifies the self-evaluation welcome and links from the app directory and Day 1 review lesson. Deployment verification pending below.

### Day 1 review widget verified live

Both Vercel deployments for `59f9a91` succeeded. Verified HTTP 200 and the self-evaluation-only welcome at `/apps/unit-1b-day-1-review`, plus working links from `/apps` and the Day 1 review lesson. Retrieved published JavaScript chunks containing D1R1 resume, paid hints, editable answer review, two-line graphing and final reflection flow; confirmed live responsive/touch-safe graph CSS. All 39 answer/component/gesture/resume regressions and production checks passed locally. Physical iPad/Photos-picker inspection remains open.

## Precalculus review companion widget

- Added `/apps/precalculus-quiz-review`, matching all 30 questions in the attached/published Sections 1.6–1.7B review guide and matching review key. Three section buttons preserve original numbering (1–10, 11–19, 20–30). Structured checks cover every paper subpart; choice support for parent/domain/range/reflection/descriptions; free editable navigation/review.
- Learning-first self-evaluation notice explicitly says not a quiz grade. Same paid-hint rule as Day 1 (−0.2 each, correct floor 0.5), unlimited free retries, no streak/timer; named/local-time two-reflection completion image and safe return. Compact formula keypad, per-question scratch, PCR1 exact-place local progress downloads/codes with graphs, drafts/counts/language/ratings. Names/work never uploaded or persisted in browser storage. Existing codes untouched.
- Source-matched tappable reference curves, including greatest integer open/closed steps. Q8 plots both half-plane rays and endpoints; Q19 parent/shifted parabolas and Q30 parent/transformed absolute value require enough points, vertices, both sides and Draw. Actual student points determine displayed curves; optional reading taps are never graded. Preserved source-labeled points; Q17/18 anchor coordinates are not revealed until tapped.
- Restricted symbolic function parser (bounded polynomial coefficients and normalized abs/root curves) accepts equivalent formulas and parent f-notation without eval or sampling. AST LaTeX preview handles grouping/prefixes. Spanish covers all copy and skill reflection. Added directory preview/card and updated the Precalculus review page's practice link. Source PDFs unchanged; no MathBoard/native bridge changes.
- Independent all-30-answer/key and symbolic/parser tests, source graphs/curve fitting, boundary/vertex criteria, actual section/input/hint/review/scratch/resume/report behavior, pointer/read-only-point aids, complete Spanish/LaTeX and schema/checksum/identity round trips passed. Day 1 and shared completion regressions passed; typecheck/content/lint/build passed before the final anchor/keypad polish. Final checks and deployment below. See docs/precalculus-review-widget.md. Physical iPad/Photos inspection remains open (browser native pipe unavailable).

Final all-30-answer/UI/gesture/symbolic/LaTeX/Spanish/resume regression, typecheck, content checks, lint, production build and diff checks passed. Generated HTML confirms the 30-question self-evaluation welcome and links from the app directory and Precalculus review page. Deployment verification pending.

### Precalculus review widget verified live

Custom-domain Vercel deployment for `6625069` succeeded. Verified HTTP 200, the 30-question/self-evaluation-only welcome, and links from `/apps` and the Precalculus quiz-review page. Retrieved live JavaScript containing PCR1 saves, formula input, hints, sketch controls, editable review and reflection flow; confirmed compact operation-keypad/touch-safe graph styles. All source-matched math, UI, graph-gesture, parser, bilingual, resume and production checks passed locally. Physical iPad/Photos-picker verification remains open.

## Point-slope teaching convention

Teacher clarified that finding a line from a point and slope must use y − y₁ = m(x − x₁), then simplify to y = mx + b, rather than substituting into y = mx + b to solve for b. Updated Precalculus review Problem 1 hint 3 (typeset LaTeX) and its corrective prompt, plus matching obsolete “recalculate b” feedback in Lesson 4 worksheet and mixed Level 5 practice. Spanish updated alongside English. Given-slope-and-intercept tasks still use y = mx + b directly; standard-form intercept finding is unchanged. No grading/progress behavior changes. Precalculus review, Lesson 4 worksheet and mixed-practice regressions passed; final checks/deployment below.

Precalculus hint regression (exact point-slope wording), worksheet and mixed flows, equation Spanish, typecheck, lint, content checks, production build and diff check all passed.

### Point-slope wording verified live

Both Vercel deployments for `2ff16eb` succeeded. Retrieved live Precalculus review chunks and confirmed the exact new typeset point-slope hint and removal of the previous “Use y = mx + b with either point: b = 3” wording. Matching worksheet/mixed corrective prompts and Spanish were included in the tested deployment.

## Card Clash: first playable round beta

Built the explicitly agreed first milestone (single teacher-hosted two-student round), not the full tournament spec. Static files at `public/cardclash/`; beta directory entry redirects `/apps/beta/card-clash` to teacher.html. Student index.html uses four-letter game codes and prelisted animal code names only. Teacher chooses any of eight generated categories/four difficulties, creates/starts/ends a timed round, processes commands authoritatively through Firebase transactions, and finalizes difficulty/attempt/hint/no-hint/speed points. Includes math keypad, optional integer graph taps/plotting, local scratch paper, worked review, clear locked-database errors and copy-rules UI. No real-name fields or changes to existing app data/MathBoard settings.

Firebase public web config supplied by teacher is wired to separate Card Clash project. Rules file permits authenticated exact-round reads; student writes only own claim/presence/commands; host UID controls canonical round/score updates. Classroom review, not secure assessment. Owner still must publish `public/cardclash/database.rules.json` in Firebase console. Live anonymous sign-in check failed with ADMIN_ONLY_OPERATION: verify Anonymous is enabled and saved in Card Clash project (no temporary identity was created). No rules were deployed and no game data written during check. Do not claim live multi-device functionality verified yet.

Completed tests: 6,400 deterministic generated question/answer/KaTeX cases across both choice/typed modes; scoring examples, retry lockout, stale/duplicate commands, deadline, start gate and settlement. Linkedom DOM smoke tests (temporary tooling outside repo) passed all 32 student question variants, hint/review/score states and graph select/draw/deselect. Typecheck, lint, content check, app-directory regression and production build passed. First build raised a Next.js security vulnerability warning and requested retry; retry succeeded. Recommend a separate framework security upgrade before broad rollout, without changing unrelated app behavior here. Existing app-preview test fails on untouched `parallel-drawing` because it assumes every preview contains math; no preview component was changed. No physical browser/iPad available (CUA native browser pipe missing); no Firebase rules-emulator runtime available (Java absent). Full tournament matchmaking, pick/swap phases, ghost/projector, cumulative roster/awards and final reflection flow remain future milestones; README and beta UI explicitly state limited scope. Publication verification pending.

### Card Clash beta publication verified

Both Vercel projects succeeded for `bf5ca48` (feature `bd0d8e1` plus supported-rule-method fix). Verified custom-domain HTTP 200 for teacher/student pages, round engine and rules JSON; teacher includes Copy database rules and beta hub includes the new entry. Verified live rules use explicit field/index allowlists, no unsupported numChildren rule calls. All three Firebase 13.3.0 CDN modules returned 200. Firebase Anonymous sign-in still needs owner attention (ADMIN_ONLY_OPERATION) and database rules still need owner console publication. Live play must be tested after these two setup steps. No claim of multi-device or rules-enforcement verification. No MathBoard mirroring changes in this milestone.

### Card Clash Firebase owner setup completed and live backend verified

Owner confirmed Anonymous/rules setup complete. Ran an isolated live REST round with three temporary anonymous identities. Passed host create/start, both student code claims, own presence, hint submission/host processing/student readback, both correct answers, final review and expected hint/speed scores. Verified denial of unauthenticated round read, duplicate name claim, other student's presence/commands, student score edits and host takeover. Deleted the isolated round and all three temporary auth identities successfully. Firebase setup blockers are resolved. Browser SDK subscription/transaction/reconnection and physical iPad testing still remain; no browser/device verification claimed. README updated accordingly; no app logic changed.

## Card Clash code-name transfer between devices

Teacher reported offline fox-27 remained reserved after closing its browser, preventing iPad reuse. Added host Release code name control per claimed player (confirmation required); atomically clears UID/presence and old pending/processed commands, preserves progress/score/partner/timer. Timer continues during transfer. Student error now directs to release control; revoked student view hides interactive work and shows join screen. No new Firebase rules needed, no third player added to the two-player milestone. README explains transfer.

Passed 6,400 generator regressions plus transfer reducer checks, all 32 student DOM variants/graph interactions, teacher release-button DOM interaction, typecheck, lint, content and production build (retry after same pre-existing framework security warning). Live isolated Firebase transfer test passed: release an existing player after hint, old-device command denied, new anonymous identity claims the same code, hint progress preserved, both answers/final scoring successful. Test round and all four temporary identities deleted. No physical iPad verification claimed. Deployment verification pending.

### Card Clash transfer fix verified live

Retrieved custom-domain teacher.js and round.js over HTTP 200 and confirmed Release code name UI/handler and releasePlayer reducer are live for `b04c16a`. Existing teacher tab should be refreshed (same tab retains host auth/session), then release fox-27 and join from iPad using the same game code. Firebase rules unchanged. Physical device check remains with teacher.

## Card Clash scratch layout and drawing tools

Round 1 confirmed working on teacher/student devices. Teacher requested scratch paper directly under the problem in the left column beside the keypad. Moved the pad out of the collapsed full-width section into that column and made it always visible. Added black/red pen controls, true alpha-erasing tool and Clear; selected tool and local canvas snapshot persist through hint/check rerenders. Touch-safe pointer capture, pointer-ID isolation, CSS-size-aware strokes and edge-to-edge coordinates. Drawing remains device-local; no database/rules/scoring changes.

Passed drawing-tool/coordinate/pointer/placement tests, student DOM regression all 32 variants, existing 6,400 question/round tests, typecheck, lint and content check. Production build passed on retry after the previously disclosed Next.js security warning. Physical iPad positioning should be confirmed by teacher. Deployment verification pending.

Teacher also proposed winner-triggered synchronized category spinner on their display, selecting a color/category and a random student to choose difficulty. Explained feasible as a shared Firebase phase, with text labels as well as color; this mechanic is NOT implemented in the current two-player-round milestone. Current +1 speed bonus remains unchanged. Preserve this proposal for full class/tournament implementation.

### Card Clash scratch layout verified live

Both Vercel deployments succeeded for `23b478b`. Retrieved live student.js, ui.js and CSS over HTTP 200, confirming scratch-area placement, pen/eraser control implementation and toolbar styles. Refresh student page before next round to load changes. Spinner remains proposed future work, not part of this release.
