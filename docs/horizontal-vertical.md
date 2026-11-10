# Write the Linear Equations Level 0: Horizontal and Vertical

Route `/apps/horizontal-vertical` is preserved for existing links; its displayed title and Practice Apps listing use the new Level 0 name. Algebra 2 and Precalculus tags remain.

Five internal levels, each requiring five consecutive scored correct answers:
1. Graph → horizontal or vertical (two choices).
2. Graph → zero or undefined slope (two choices).
3. A simple x = c or y = c equation → direction or slope (two choices).
4. Graph → equation (four choices distinguishing the variable and constant).
5. A random mixture of all four skills.

Each level has a fixed unscored demo, followed by a skill reminder before the randomized scored questions. Wrong answers show the correct choice and a clear constant-coordinate/rise/run cue. The current streak resets, completed levels remain complete. No timer, timeouts, automatic advancement or speed score. Students read feedback and select Next. Five stars and a named congratulations screen celebrate each completed level. Mastery score is 2 points per level at full mastery, with a best-streak partial measure for saved progress; completing all five levels earns 10/10. Accuracy, attempts and correct totals exclude examples.

Names, class hours (2,3,4,6,7,8), date and progress remain visible on the sticky scorebar. Spanish is local. A Stop & save dialog uses the existing encoded/checksummed local codec, with HV0 prefix, encoded initials/hour matching, all five level stats and demo/completion flags. A restored question starts fresh; completed counts/streaks and level boundaries remain. This is a classroom convenience, not identity authentication or encryption. Nothing is uploaded or stored in browser persistence.

Final reflection confidence and difficulty ratings are required. Once confirmed, the named/dated results image prepares locally without a separate Create Image button. Save or Share Image opens the native image menu when supported; iPad controls whether Save Image/Save to Photos is offered. Long-press saving remains a fallback. Ratings and skill/results are included in the image. Language changes invalidate the old language image until the replacement is ready. New student resets identity, progress, code, image and reflection session.

Test: `node --experimental-strip-types scripts/test-horizontal-vertical.mjs`. It checks 5,000 questions, mathematical answers, all level kinds, deterministic examples, five-streak gates/reset, all-level resume serialization/name/hour/typo rejection, actual full component progression, duplicate input locking, skill reminders, required reflections and automatic local image/native action. Content, typecheck, lint and production build are required. Responsive CSS uses a graph/question column and large choices/feedback column, phone stacking and reduced motion. No physical iPad visual verification was available for this update.
