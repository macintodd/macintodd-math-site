# Transformation scales practices

- `/apps/transformation-scales`: five sequential levels. Each starts with a fixed, unscored example, followed by a skill reminder and randomized scored questions.
- `/apps/parent-transformations`: the mixed transformations applied to six parent-function families, with a fixed absolute-value example.
- Levels 1–4 require at least five correct and a best streak of three. Level 5 requires five correct and a best streak of five. The parent-functions practice requires ten correct and a best streak of five. An incorrect scored check resets the current streak, keeps earned correct answers, and reveals the correct description; the next scored question is fresh.
- Horizontal factors are reciprocals of the absolute inside multiplier. Reflections and scales precede translations. Level 3 never combines a nonidentity b with a horizontal shift.
- Factoring level: most input constants are divisible by b, yielding integer shifts. Some, including the teacher's fixed `3f(4x+3)` example, yield fractional shifts. All shifts are read after factoring the entire input. Later mixed questions may combine all four parameters.
- Parent questions preserve the written expression instead of algebraically simplifying away its transformation structure. Choices equivalent as complete curves are removed. Negative-b questions use asymmetric parents rather than hiding a reflection in an even parent.
- Completed goals earn 10/10 for that level. Partial level credit averages the fraction of the correct-answer goal and best-streak goal achieved, each capped at one. The five-level final score averages all five levels; unattempted levels contribute zero. Early finishing is labeled partial.
- TSC/TPF resume codes use the existing name-initial/hour-bound checksum codec with separate activity salts and all five levels' totals. An unfinished question starts fresh. Names, answers, survey responses, and score images remain local; no score submissions or browser persistence are added.
- Both final five-star reflections are required before a named, dated PNG can be generated. The standard share-image control opens the native share menu if available; Photos choices remain controlled by iPadOS.
- Shared English/Spanish controls translate local reviewed copy, preserve equations/names/typed answers, and generate the report and resume image in the selected whole-widget language.

Validation: `scripts/test-transformation-scales.mjs` checks generated math, unique parent-curve choices, LaTeX, mastery thresholds, both complete component flows, resume identity/isolation, reflection gating, exports, and resets. Run content checks, TypeScript, lint, and a production build before publication.
