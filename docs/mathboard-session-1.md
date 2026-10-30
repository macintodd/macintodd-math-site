# MathBoard Session 1 — Unit 1B Lesson 3

Lesson page: `/courses/algebra-2/graphing-linear-equations`.
Guided lesson: `/apps/mathboard/session-1`.

## Pool revision — October 29, 2026

The lesson opens directly. No teacher-password setup or generated class link is required. The former `/teacher` page redirects to the lesson; configuration-creation requests return 410. Both section checkpoints use the word **Linear** (case-insensitive, whitespace trimmed). The code is verified on the server; no student name, answers, hour, or scores accompany verification. Signed releases preserve checkpoint order. Existing teacher credentials and protected slope records are unchanged. This is classroom pacing, not secure examination software.

A centered, large serif student name appears below the session title. The pool scenario appears in the middle of the opening left panel, with a Start button and no keypad. Start reveals the first question and moves the scenario under the name across the top. Questions are larger/bold; numerical entries are compact and off-white. Each check flashes the question panel green or yellow three times, with reduced-motion alternatives. Success text is larger; all paper-writing prompts later in the lesson are larger and blue. Opening pool screens contain no paper-writing directions.

The pool starts with 15,000 gallons and drains at 720 gallons/hour. Volume's signed rate is −720 gallons/hour. The rate screen has a narrow numerical fraction, “What are the units?”, and a separate narrow units fraction. Gallons/Hour buttons are part of the keypad. Equivalent negative rates are accepted.

The starting-point screen first checks amount + units, then reveals a separate elapsed-time question. Only after the second answer is correct does (0, 15,000) appear. An arrow and repeatedly flashing “y-intercept” label remain until leaving the slide. The equation screen similarly checks −720 first and reveals the question for the 15,000 constant afterward. The following screen asks for V(10) = 7,800 gallons.

The slider uses ten-minute increments from zero to 1,250 minutes (20 h 50 min), the exact emptying time. The axis runs 0–22 hours and 0–16,000 gallons. Volume is never negative; the modeled line stops at zero. Hour buttons plus Empty support precise finger interaction. Students visit 1, 5, 10 hours and Empty before checking the constant-decrease question. Coordinate labels are thinned on dense pool plots while every hourly point remains visible.

## Remaining instruction

37 data-driven screens retain fractional/negative/reordered slope-intercept recognition, positive and negative rise/run movements, two checkpoints, six independent graphs, and three exit-ticket questions. Session 2 standard-form instruction is not implemented here. Existing standard-form practice apps are unchanged.

The graph supports configurable scales and half-unit snapping with a small integer magnet. Independent lines are drawn through the student's actual points and mathematically checked; correct lines are not revealed prematurely. Any two distinct valid points are accepted. Opposite valid rise/run movements are accepted. The self-contained 2048 intermission has no bearing on lesson completion and retains its board while waiting.

Data: `src/content/mathboard/session-one.ts`. Validators/resume: `src/lib/mathboard/model.ts`. Graph: `LessonGraph.tsx`. Presentation: the route-specific `mathboard.css`.

## Local data and materials

This lesson saves name, hour, progress, attempts, hints, graph state, partial staged answers, and game board locally under `macintodd.mathboard.session1.pool.v2`. Prior Marcus-session answers are not resumed into the revised pool problems. Clear/next-student actions remove current and legacy lesson storage. Existing practice apps remain memory-only. Completion images are generated locally for manual Classroom upload. No database, score collection, analytics, or DNS changes.

Original paper notes/practice PDFs remain unchanged and retain their former money example and later Session 2 sections. Pool answers are therefore not directed onto that earlier word problem. Only reviewed instructional pages 1–2 are posted; completed keys have not been located. Notes page 1 has ½ − 7x; page 2 prints a different −7x − ½ example, explicitly distinguished in the lesson.

## Validation

`npm run test:mathboard`: all 37 validators, signed fractions, units, equivalent rates/graphs, pool arithmetic, exact emptying time, checkpoint order/forgeries, local resume, and 2048 merges.
`node scripts/test-mathboard-api.mjs`: direct access, retired setup endpoint, Linear for both gates, wrong/forged releases, and slope collection remaining 410.
Browser checks cover introduction without keypad, prominent name, staged initial-point/equation questions, fraction/units entry, checks/feedback animation, pool slider, y-intercept callout, direct checkpoint release, persistence, and landscape layout.
