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
