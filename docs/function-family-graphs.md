# Algebra 2 transformations · 1. Identify Function Family from Graph

Student test route: `/apps/beta/function-family-graphs`. Keep this widget in beta and out of published lesson links until the teacher requests promotion. Existing transformation widgets and the older Parent Function Challenge are preserved.

## Teaching scope

This is the first independent widget in a new numbered series:

1. Identify Function Family from Graph — implemented here.
2. Identify Function Family from Equation — planned; equation identification, including standard and vertex forms, will be a separate widget.
3. Graphing Parent Functions — planned; discuss with the teacher before implementation.

Use exactly five Algebra 2 families: constant, linear, absolute value, quadratic (square), and cubic. The constant parent is `f(x)=1`; the other parents are `x`, `|x|`, `x²`, and `x³`. Nonconstant coefficients are never zero, so a line cannot degenerate into a constant or a quadratic/cubic into a lower-degree family.

The series uses `g(x)=a f(b(x-h))+k` with the teacher's restriction **if b≠1, h=0**. This graph-recognition widget uses b=1 throughout. Do not add combined horizontal scaling and horizontal shifting in later widgets.

## Practice and feedback

The teacher confirmed that the published widget integrates correctly with MathBoard on November 24, 2026. Preserve the established bridge, score calculation, snapshot builder/reader, and publication/restoration/timer effects when making presentation changes.

- The graph is left and the five large multiple-choice buttons are right on landscape iPads; phones stack them. Equal x/y units, labeled axes, and a fixed −6 to 6 window keep graph shapes comparable.
- A seeded sequence includes all five families in each five-question block, without adjacent repeated families. The first block uses parents. Later blocks include parents plus shifted, reflected, stretched, and shrunk examples. There is no escalating level menu.
- One answer is counted per graph. A correct answer reveals the actual graph equation over the graph on a white panel, with **Parent:** and the corresponding parent equation beneath it. Polynomial reveals include both expanded standard and shifted forms. After a miss, a transparent blue-ink overlay on the graph pops in with a large Caveat handwritten sentence identifying the family (for example, “All graphs with this shape are absolute value functions.”), then the exact graph equation. The small reassurance remains below the choices; the student moves to a fresh graph. The miss overlay has no box, border or background; a subpixel highlight/shadow gives the blue handwriting and typeset equation slight relief without obscuring the grid. The miss overlay does not apply a success glow and works in the speed-round miss result too.
- The left side of the progress bar shows a star for every answer in the current correct run. On a miss, that run becomes one numbered star; each prior finished run keeps its own star. For example, three correct, a miss, two correct, a miss, then one correct shows stars numbered 3 and 2 followed by one plain star. Consecutive misses at zero add nothing. Between the star trail and Practice Score, **Number correct** shows the uncapped cumulative correct count as a plain integer with no denominator. Misses do not reset it; it can exceed ten while the student is still pursuing a ten-answer streak. The best-streak grade remains a separate /10 display immediately left of Get grade report.
- Styling follows the website’s parchment, navy/brown ink, Newsreader headings, Plus Jakarta Sans text, Caveat accents and hand-drawn SVG frames/stars. Mathematics and graph geometry remain precise; style changes are scoped to this widget.
- The teacher reconfirmed that this pure-identification practice requires **ten correct in a row**. Do not substitute the five-answer streak used in other activities or a ten-total/five-streak gate. The teacher selected **best session streak, capped at 10**, for the grade. A miss resets the current streak without erasing the best. There is no fixed problem total and no resume/continue-later code or browser persistence. MathBoard can still restore its own saved session.
- **Get grade report** is available as soon as practice starts, including a 0/10 report. Both five-star reflections are required before the named, dated local image is created using the shared CompletionFlow. Reflection answers do not change the grade. Returning to practice preserves the session; opening a later report uses a new completion timestamp and clears the old record/reflections.

## Public description and information window

The Practice Apps card (Beta/All), its expanded Details and the Beta hub replace the paragraph with three bullets, sharing `src/lib/function-family-graph-info.ts`:

- **Functions:** constant, linear, absolute value, quadratic, cubic
- **Scoring:** best streak/10
- **Special Features:** 60-second speed round at end.

A sketched information **i** beside the widget title opens a small native dialog showing the same data, with a close button, Escape dismissal, focus return and full Spanish text. It remains available on the opening/practice/speed screens. Existing unrelated cards retain their paragraphs and complete expanded Details.

`FamilyStarState.infoOpen` is optional presentation metadata. The existing native snapshot code carries it without changes to app/version or score/completion fields. Open/closed information windows restore via the unchanged bridge; readonly projector views cannot dismiss a mirrored window, and restoration never publishes an echo. Old snapshots without the field start closed. The core question/scoring/timer reducer, native publication effects, rewards and reports are unchanged.

## Standard skill-entry screen

The November 25 entry redesign uses shared `SkillWelcome` / `SkillIdentityFields`. The catchphrase **Different graphs. Familiar families.** sits at the top of the sheet with **Look at the shape** as its subtitle. The left-aligned skill reads **Skill: Identify a function family from a graph**, with a brown label and blue inline statement. Removed the long three-bullet explanation, series list and redundant local-data footer from the screen; local-only behavior is unchanged. Names and the 1–8 hour dropdown remain required. The compact button says **Start Skill Practice**, with pale fern #E0E9E5 (hover #D3E2DA), dark green #24563F lettering, a sketched border and a touch-friendly target. The base fern palette remains #2F6B4F.

The right visual accurately compares dashed blue `y=x²` with solid red `y=−½(x+1)²+3`, including their vertices. Both are quadratic functions: reflected, vertically shrunk, shifted one left and three up. Geometry uses equal units. The **Goal:** below the visual shows **Streak 10**; the small bottom line says **Score = longest streak out of 10.** The teacher's written clarification explicitly preserves this drill's ten-in-a-row rule and scoring; the briefly suggested 10-total/five-streak rule and alternate formula were not implemented. Whole-page Spanish and native restoration of an unfinished identity form remain supported.

This is the reference entry layout for future widgets. The shared component does not own a reducer, score, native bridge, storage or start action; other widgets supply their own real goals and scoring note. The standard is committed in the webwidget design guidelines and mirrored into the original MathBoard-project guideline file. Existing unrelated widgets are not migrated.

## Gold-star reward trial

- Class hour is a required 1–8 dropdown; names remain local. Older restored hour text is preserved rather than silently rewritten.
- Each newly credited practice answer flashes the current run’s gold stars, with a 420ms bounce on the new star. Each falling copy starts at its own flashing chart star’s measured viewport rectangle, launches up/right at an independently randomized speed (330–520 px/s before viewport scaling) and angle (32–65°), then follows a constant-gravity parabola until fully off the right or bottom of the viewport. Rotation speed also varies; motion is sampled closely for smooth Web Animations playback without per-frame React/native updates. Copies leave at the flash peak with a 70ms stagger; one copy per current streak answer, capped at eight per answer (most recent eight stars), with at most 24 live copies during rapid answers. Flight duration is calculated from the launch velocity, gravity and first off-screen boundary. The same gold-star SVG is reused; no copies enter from the top of the screen.
- Speed answers get falling copies based on that round’s count and a small score bounce. Practice star history, scoring, ten-in-a-row goal and speed timing are unchanged. Misses and duplicate checks earn no animation.
- Effects are decorative, viewport-wide, pointer-transparent and hidden from assistive technology. Reduced motion keeps the static stars. All animations are canceled when leaving for the report.
- Effects are transient local presentation: no extra snapshot fields, no dispatch/publication on animation frames, and no replay on restoring a saved MathBoard slide or receiving a mirrored state. Earned stars, inputs, scores and positions continue through the existing bridge unchanged.
- The teacher will review this visual trial before it becomes a shared reward-system standard. Do **not** add it to either shared webwidget guideline copy yet.

## Speed round

After a streak of ten, the student may enter the speed round or get the practice report. The timer starts only when **Start 60-second round** is pressed. A correct answer adds one, displays its equation and parent for 650ms, then automatically advances. The clock continues during that reveal. The first miss or the 60-second deadline ends the round. A deadline check also runs in the answer handler, so a late tap cannot earn a point.

The round score is the raw number correct in that run, with no denominator or ten-point cap. Unlimited retries reset the round's count and clock while preserving the best speed score and practice grade. The completion record lists best/last speed scores and round count separately from the practice grade. Requesting a report during a live round ends that run at its current count.

## Language and student data

English is the default with no translation tags. The shared transformation-language boundary supplies a full Spanish mode, tap-to-English text, and separate control-translation tags that cannot submit an answer. New translations live in `src/lib/function-family-graphs-spanish.ts`.

Names, hour, answers, and image exports remain in session memory; there are no score/name HTTP uploads, account requirements, localStorage/sessionStorage records, or resume codes. When embedded, the native MathBoard bridge receives the session snapshot needed for restoration, including identity and local record imagery. The website does not add a server persistence endpoint.

## MathBoard integration

The global document-head installer recognizes the new route and defines `window.mathBoardAppletSetState` before React, including ordinary-browser visits to this route. It queues early incoming state. This change preserves the existing native-only early bootstrap on the canonical and legacy parallel lesson routes.

Snapshots use `app: "algebra2-function-family-graphs"`, `version: 1`:

- `score`: min(best practice streak, 10); `maxScore`: 10; `scoreDisplay`: the same fraction.
- `isComplete`: true after both reflections and creation of the current-language final record, including an early finish below ten; false while reflection is unfinished or after returning to activity.
- Optional `answeredItems`, `correctFirstTry`, and actual `longestStreak` describe practice only. Do not send a made-up `totalItems` for this open-ended activity.
- `extraData`: current practice streak, best/last/current speed scores, and number of speed rounds. An unplayed last speed score is the string “Not played,” not a fabricated zero.
- `customState`: the complete session state, language, and settled page scroll position. The optional `state.starTrail` presentation field contains `completed` run lengths and `earlierCorrect`. It travels through the existing unchanged snapshot code; bridge calls, score fields, completion behavior and version remain unchanged. New restores reproduce each numbered star and the current plain stars. Older states without run history retain the earlier correct total as labeled text instead of inventing past runs.
- The seed and question indices reconstruct the exact graphs, equations, selections, and reveals. It also carries speed deadline/remaining time/reveal checkpoint, report timestamp, reflection ratings, missing-rating notice, and local record image.

Native publication is guarded and does not occur at mount. Meaningful input, answer, scene, language, report, and settled-scroll changes publish checkpoints. The speed reducer changes the countdown only once per second and at answer/reveal/end transitions, not every timer tick or animation frame. Restoration remains quiet until a trusted controller interaction; a passive receiver neither advances the timer nor echoes state. An explicit `?mathboardDisplay=1` receiver is read-only even after trusted input.

The speed deadline uses wall-clock time. Backgrounding the page does not add time. A restored controller initially shows the supplied checkpoint; on its next trusted interaction, the original deadline is enforced. Projector displays follow received checkpoints instead of running an independent timer.

## Catalog registration reference

No real Firebase catalog entry is created by the implementation or its tests. For a teacher-approved test registration, the URL is `https://www.macintodd.net/apps/beta/function-family-graphs`, title is **1. Identify Function Family from Graph**, course is **Algebra 2**, topic is **Function transformations**, MathBoard category is **Practice** (`assessment`), Activity Mode is **Scored** (`scored`), and a suitable initial canvas size is 1000 × 700 points. The website directory category is **Transformations**, exposed through Beta or explicit All while this route is experimental. Visibility remains the teacher's choice; private scope is not an enforced privacy boundary.

## Validation and release

The shared star/counter/notebook standards are now in `docs/webwidget-Design-Guidelines.md` for all future widget work; each activity retains its own stated goals and scoring.

Run `scripts/test-function-family-stars.mjs` for separate collapsed runs, current stars, unchanged core/native fields, and old/new snapshot restoration. Run `scripts/test-function-family-graphs.mjs` for independent graph/equation agreement, family coverage, scores, timer boundaries/retries, snapshot validation, early restoration/no-echo, projector mode, and Spanish coverage. Run the existing bridge-startup, previews, directory, widget-card, and completion/language regressions plus typecheck, lint, content check, production build, and `git diff --check`.

Browser validation should cover main practice through ten in a row, early reports and both reflections, local image export, repeat speed rounds ending on miss/time, clean English/Spanish/tap translation, document-start restoration, passive/read-only receivers, native teacher continuation, and responsive iPad/phone layouts. Physical iPad/MathBoard/projector verification remains for the teacher. See `docs/ai-handoff.md` for the actual validation and deployment results.
