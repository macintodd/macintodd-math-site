# MathBoard Session 1 — Unit 1B Lesson 3

Lesson page: `/courses/algebra-2/graphing-linear-equations`.
Guided lesson: `/apps/mathboard/session-1`.
Teacher setup: `/apps/mathboard/session-1/teacher`.

## Teacher workflow

Use the existing Vercel `RESULTS_TEACHER_PASSWORD` (at least 24 characters) on the teacher setup page. Choose available hours 1–8 (default 3,6,7,8). Set separate release codes for checkpoints 1 and 2, or disable either checkpoint. Generate and copy the class lesson link to Classroom. No source edit, database, Supabase table, or additional service is needed.

Students use that class link for their first visit. The base lesson URL can resume a saved session, but does not start an unconfigured new session. Changing settings creates a new class link; older links retain their configuration. Rotating the teacher password invalidates old links and release grants. Keep the class link and release codes separately. Release codes are never included as plaintext in student HTML, the JavaScript bundle, or local lesson progress. The config in the link is encrypted with AES-256-GCM; release grants are HMAC signatures. Server verification prevents local resume state from skipping an unreleased checkpoint. This is a classroom pacing mechanism, not a secure examination/proctoring system.

Checkpoint 1 follows the Marcus story; checkpoint 2 follows guided graphing. Students can review earlier activities and play 2048 while waiting. Wrong release codes do not advance. Checkpoint 2 requires checkpoint 1 release. Disabled checkpoints are counted as complete when students continue. Reopening the independent practice after completion requires the checkpoint 2 code (or its disabled setting).

## Instructional sequence

37 data-driven screens cover the 12 requested activities: initial amount, equivalent rates with units, starting point, money slider/pattern, equation/function notation, slope/intercept meaning, two teacher checkpoints, six recognition questions, positive/negative rise/run, guided graphing, six independent graphs, and a three-part exit ticket. Session 2 standard-form instruction is deliberately absent.

Data: `src/content/mathboard/session-one.ts`. Math and resume checks: `src/lib/mathboard/model.ts`. Configurable graph: `LessonGraph.tsx`. Model graph is restricted to nonnegative hours, with x 0–5 hours and y 0–140 dollars; later plane −10…10 supports half-unit snapping and fractional coordinates. A small integer magnet reduces finger-position errors. Independent lines are drawn through the student's actual points, including invalid vertical lines; the correct line is not displayed before successful checking. Any two distinct valid points are accepted. Negative slope accepts the equivalent opposite movement.

Paper files: reviewed blank Lesson 3 notes and practice pages 1–2, omitted trailing header/footer-only pages. Matching completed keys were not found and remain explicitly unavailable. Notes page 1 has `f(x)=1/2−7x`; page 2 contains a different example `f(x)=−7x−1/2`. The lesson follows the requested positive-half reordered expression and explicitly distinguishes the printed examples. Paper includes later standard-form sections; students are directed to leave those for Session 2.

## Privacy and local resume

This new lesson explicitly supports the user's requested browser persistence. The existing practice apps remain memory-only. Name, hour, activity progress, answers, attempts, hint usage, graphs, completion time, and 2048 board are stored under `macintodd.mathboard.session1.v1` in localStorage. The entry and completion screens provide a clear/next-student action. Browser profiles on shared iPads must be cleared between students. Local storage is not a classwide reporting service and can be lost by browser storage clearing. Private browsing or quota restrictions may prevent saving; the UI warns when save fails.

Only class-link validation and checkpoint-code verification contact the server, sending the encrypted token, checkpoint number, entered release code, and prior signed grants. No student name, hour, answers, score, or game state is sent. Teacher password/codes are not stored in browser persistence. No analytics or third-party lesson embeds are used. Results images are generated on-device for manual Classroom upload. No database writes, DNS changes, or changes to the disabled slope score POST endpoint.

## Validation

`npm run test:mathboard`: all 37 screen validators, signed fractions/decimals, rate equivalence and units, arbitrary valid graph points, movement, strict wrong-line rejection, checkpoint cryptography/order, disabled settings, forged grants, local resume, 2048 merge rules.
`node scripts/test-mathboard-api.mjs`: local Next server with dummy teacher credentials; verifies teacher authentication, no plaintext code disclosure, wrong/forged releases, checkpoint order, and signed resume; confirms slope POST remains 410.
Browser UI: full 37/37 completion; empty Marcus graph, exact first point, all money points through (5,130), slider visits, local reload resume, both teacher releases, incorrect codes blocked, intermission board preserved, fractional keypad, independent slope/intercept records, valid fractional-coordinate graphs, wrong actual line drawn/rejected, equivalent negative movement, and exit ticket. Landscape layout checks at 1024×768; phones fall back to a scrolling layout. Keyboard avoids native numeric input via inputMode=none with on-screen keypad. Touch graph uses pointer capture/touch-action:none. Reduced-motion supported.
