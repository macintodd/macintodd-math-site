# Parallel/perpendicular teacher presentation

Route: `/apps/beta/parallel-perpendicular-lesson/teacher`.

The teacher page now uses its own `teacher/TeacherLesson.tsx`, not the student `Lesson.tsx`. It shares reviewed problem data, graph rendering, equation animation and mathematical checks. Student progression, scorecards, reflections and resume codes are not used by this page.

## Presentation controls

- Jump to any of the 12 examples immediately, or skip to the next numbered slide.
- Previous/next problem and previous slide work without a correct answer.
- Fill answers inserts both slope fractions and the final equation. It does not automatically check the answer or start the animation.
- Check slopes or the equation using the regular keypad, with slash-to-denominator navigation and notation warnings.
- Reveal the given slope, required slope, point-slope substitution, and distributed/final equation one step at a time. Previous step hides the most recent reveal.
- Reset this problem clears its draft, drawing, result and reveal state; a generation key remounts the graph so no old canvas state survives.
- Returning to a different example preserves its teacher draft and reveal settings for the current session. There is no persistence or final student score.

## Native bridge

MathBoard must open the same `/teacher` URL on the controller and external display. It injects `window.MathBoardApplet` at document start and calls `window.mathBoardAppletSetState(snapshot)` on the receiver.

The teacher page publishes a separate `parallel-perpendicular-teacher`, version 1 JSON payload. It includes the current problem index, all teacher drafts/reveals/turns, graph snapshots (drawing, points, camera), active input/fraction part, feedback, notation warning, language and current equation-animation frame. The native bridge must relay the complete object unchanged; no server or native API changes are required under the existing relay contract.

The receiver registers once, validates the payload, marks its role synchronously to avoid echoes, and renders read-only. Native controls are hidden; mathematical entries and graphs stay visible. It does not run an independent equation animation. The graph callback is memoized so receiving a child snapshot cannot cause a parent-child publication loop. Regular browsers have no native bridge and keep working normally.

## Checks

`node --experimental-strip-types scripts/test-parallel-teacher.mjs` covers answer filling/checks for every example, navigation, reveals/reset, read-only JSON restoration, stable graph callback, graph/zoom channels, language, warnings, animation frames, validation, full publisher dependencies and receiver cleanup. Existing parallel classroom, language and display-mirror checks pass. Typecheck, lint, content check and production build pass.

Physical MathBoard iPad/projector testing is still needed. Native browser inspection on the editing Mac was unavailable; do not report a hardware or visual viewport test as completed.
