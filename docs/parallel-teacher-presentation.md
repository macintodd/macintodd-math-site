# Parallel lines teacher presentation

Canonical route: `/apps/beta/parallel-lines/teacher`. The old `/apps/beta/parallel-perpendicular-lesson/teacher` address remains supported.

The teacher page now uses its own `teacher/TeacherLesson.tsx`, not the student `Lesson.tsx`. It shares reviewed problem data, graph rendering, equation animation and mathematical checks. Student progression, scorecards, reflections and resume codes are not used by this page.

## Presentation controls

- Jump to any of the six parallel notes examples immediately, or skip to the next numbered slide.
- Previous/next problem and previous slide work without a correct answer.
- Fill answers inserts both slope fractions and the final equation. It does not automatically check the answer or start the animation.
- Check slopes or the equation using the regular keypad, with slash-to-denominator navigation and notation warnings.
- Reveal the given slope, required slope, point-slope substitution, and distributed/final equation one step at a time. Previous step hides the most recent reveal.
- Reset this problem clears its draft, drawing, result and reveal state; a generation key remounts the graph so no old canvas state survives.
- Returning to a different example preserves its teacher draft and reveal settings for the current session. There is no persistence or final student score.

## Native bridge

MathBoard injects `window.MathBoardApplet` at document start. The student and teacher routes install `window.mathBoardAppletSetState` in the document head and queue the latest restore until React subscribes. MathBoard owns `applyState`. The website publishes through the guarded `publishState` method.

The teacher route uses the `parallel-perpendicular-teacher` version 1 snapshot. It includes the current problem, drafts, checked answers, reveals, graph endpoints, selected coordinates, diagnostic zoom, active answer part, feedback, language, and scroll position. Equation animations publish phase, count, and impact checkpoints. Diagnostic zoom publishes its start and end.

The same callback restores the iPad controller and the display. Applying a snapshot suppresses publishing until a trusted user gesture. This keeps the display quiet and lets the teacher continue editing after returning to a slide. The native contract supplies the same payload to both web views. For a projector URL that must hide controls and block editing, open the same route with `?mathboardDisplay=1`.

## Checks

The parallel lesson regressions cover early callback delivery, validation, no echo, read-only rendering, sketch state, and navigation. A simulated WKWebView browser test covers pre-hydration delivery, teacher editing after restore, scroll position, projector rendering, student scratch strokes and selected points, and the number of animation publications. Physical MathBoard iPad/projector testing is still pending.

P2c has been retired from active notes. The current presentation offers five notes examples: P1, P2a, P2b, P3, P4. Legacy six-note and 12-record native snapshots are mapped by problem ID, with a restored P2c focus sent to P3. The underlying historical PPL catalog remains unchanged for old resume-code compatibility.
