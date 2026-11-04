# Transformation Notation Practice

Route `/apps/transformation-notation`, listed in Functions for Algebra 2 and Precalculus. Preview card shows a representative expression and ordered transformations. Tagged Precalculus section 1.7A; no unpublished lesson route is invented.

Based on the teacher's local `1.7A New Notes Transformations Shifts and Reflections.pdf`, page 1, Notation Key — Rigid Transformations and Practice Reading the Notation. The PDF is consulted only, not uploaded by this change. Use h inside and k outside, both positive symbolic distances, matching the handout.

- Level 1 shuffles all six transformation types. Each appears exactly once per run. Six consecutive correct classifications complete the perfect run. A miss immediately resets run progress and current streak to zero, reveals the correct answer and memory hint, and prepares a fresh shuffled six-type run. Lifetime attempts, correct answers and restart count remain available for the report.
- Level 2 generates one transformation with numerical distances 1–9 (or one reflection). Exactly six shuffled choices: up, down, left, right by the equation's distance, plus both axis reflections. Reflection questions use a random distance for the four shift distractors.
- Level 3 generates one or two transformations: single shifts/reflections, horizontal plus vertical shifts, x-axis reflection plus either shift, or y-axis reflection plus vertical shift. No dilation and no horizontal translation inside a y-axis reflection. Correct answers and distractors name reflections before translations. Six distinct answer choices are generated from the problem's distances.
- Levels 2 and 3 each require 10 correct and a best streak of 5. Misses preserve the correct total, reset the streak, and show the answer and a memory hint before the next problem. Level 3 uses the same goal as Level 2 by stated assumption because no different goal was specified.
- Correct responses emit the current streak count of stars. Completion presents a native modal with a score-appropriate compliment, a fancy-font student name, completion date, dismiss button, and star flight. Dismissal shows level results before continuing. All three mastered levels earn 10/10; per-level response accuracy and attempts are reported separately so missed answers remain visible.
- Name, hour (2,3,4,6,7,8), and session date remain visible in a sticky header. Completion dialogs also show name and date. A local canvas progress image can be created at any point. The final downloadable PNG includes name/hour, start/completion dates, level mastery, correct totals, streaks, attempts, accuracy, and Level 1 restarts. New student clears all state and image. No names, answers or scores leave browser memory or enter browser storage.
- Six large answer buttons use a two-column landscape layout and stack on narrow phones. Reduced-motion preferences suppress flying stars. Duplicate/stale answer actions are ignored. No automatic timed question progression.

Validation: `test-transformation-notation.mjs` independently checks 3,600 generated question/choice sets, graph-point geometry, order and exclusions, strict KaTeX, perfect-run coverage, restarts, streaks, duplicate actions and reports. `test-transformation-notation-flow.mjs` exercises the actual component handlers from entry through all level splashes to PNG and next-student reset. Both run in CI alongside directory/preview and production checks.

## Continue another day

At a checked-problem boundary, Stop & save progress creates a compact resume code and a named/dated downloadable card. Returning students enter their name, original hour and code on the start screen. See [resume-codes.md](resume-codes.md) for restored fields, initial/hour checks, local-only handling and tests.
