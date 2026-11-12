# MacIntodd Math AI handoff

The M4 Mac mini is the primary editing machine. The AI on the other Mac reviews changes on GitHub. Use GitHub `main` as the published source and follow [AGENTS.md](../AGENTS.md) for maintenance rules. Review the latest commits before starting work.

## Latest application change

- Student P4 now shows a graph-free left workspace. Check the given slope, check the new slope, place the three signed quantities in point-slope form, then submit the final slope-intercept equation. The preparatory checks leave the existing equation scoring in place. The keypad on every student slide uses the Level 3 layout and switches to local scratch paper. Scratch work stays available when switching tabs and clears when changing problems.

- Correct student equation fields and accepted slope readouts keep a green border glow. The red solution line glows after the equation is correct, whether it preserves a checked sketch or comes from the submitted equation.

- Every correct student sketch shows the graphical-answer heading and two small callouts. One arrow points to the gold point and the other to the given blue line. The red bubble describes the parallel or perpendicular relationship. Continue returns to slope checks or equation entry, according to the problem’s progress.
- `f0f8afa` enlarges the markers and ordered pairs shown when students tap integer points. All sketching problems now use the diagnostic camera for a missed point or an incorrect slope. **Retry drawing** restores the drawing grid. Perpendicular problems highlight the crossing angle or identify parallel lines. The separate teacher presentation also uses the shared graph.
- P3 on Slide 3 supports an optional tap or drag sketch and **Check line**. The exact y-intercept is −14/3. The directions prompt students to derive the equation in point-slope form and submit it in slope-intercept form.
- The header arrows step through reached problems and retain the current lesson's sketches and typed work. The first unsolved equation limits forward navigation.
- `ced4605` removed the slope input and keypad beside the sketch. A tap draws through the given gold point and replaces the previous red point. A drag starts where the student presses.
- Routes are the [student beta lesson](https://www.macintodd.net/apps/beta/parallel-perpendicular-lesson) and [teacher presentation](https://www.macintodd.net/apps/beta/parallel-perpendicular-lesson/teacher).

## MathBoard mirroring

- P4 slope progress, selected and placed quantities, and placement completion travel in the existing progress snapshot. The optional scratch field carries the active tab and a read-only image after each stroke or edit. The student bridge remains version 1 and accepts older snapshots without this field.

- The answer and line glows use the existing correct-slope and solved-equation state. A simulated read-only receiver reproduced both glows with the existing snapshot format.

- `c56cf8f` added the native bridge. The controller sends snapshots through `window.MathBoardApplet.publishState(snapshot)`. The external display receives them through `window.mathBoardAppletSetState(snapshot)`, registers once, and renders read-only without sending received state back. Regular browsers work without the native bridge.
- In `ced4605`, the graph snapshot carries the tapped point as part of the sketch segment so the external display draws the same line and single red marker. Drag endpoints, selected coordinate labels, diagnostic zoom, equation animation, language, dialogs, and the local completion image still mirror. The removed sketch slope editor no longer contributes state.
- The larger labels and the diagnostic camera use the existing selected-coordinate and zoom snapshot fields on the student and teacher routes.
- The existing graphical-success flag now renders the correct sketch callouts for every student sketching problem on the read-only display. The existing progress and graph snapshots carry the reviewed problem index and the P3 sketch. The bridge methods and snapshot version stay the same.

## Verification and deployment

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
