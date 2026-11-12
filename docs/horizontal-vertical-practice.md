# Horizontal and vertical practice

The five-level widget is `/apps/horizontal-vertical`.

- An incorrectly selected answer flashes a red outline three times, then remains outlined. The correct answer is shown in green and the explanatory cue/correct graph stay available. Reduced motion keeps a static red outline.
- Each level normally requires eight consecutive correct answers. After twenty **scored attempts within that level**, the target becomes six. Unscored classroom examples are excluded.
- A current six-streak after twenty attempts unlocks **Record Score and Skip to End**. A historical best of six alone is not sufficient. Students may continue to later levels instead.
- The early-exit action opens the shared reflection screen, not an immediate downloadable scorecard. Both five-star reflection questions are still required before the single completion record can be created and saved.
- Preserve the original scoring denominator: each level contributes `min(1, bestStreak / 8) * 2` points. Round the sum to one decimal place. Unattempted levels earn zero. Thus lowering a practice target never awards full credit automatically. All five levels at six earn 7.5/10; all five at eight earn 10/10.
- Record the early-exit status, each level's actual best streak / 8, student identity, local completion date/time, totals and reflections. Names and results remain local.
- Existing resume codes remain accepted. New codes use marker 4 for adaptive targets and preserve the early-exit status separately from normal completion. Do not migrate the level order again for marker 3 or 4 codes.

Tests: `node --experimental-strip-types scripts/test-horizontal-vertical.mjs` plus the shared completion-flow checks and required repository checks.
