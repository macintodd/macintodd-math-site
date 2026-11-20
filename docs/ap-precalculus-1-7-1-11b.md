# AP Precalculus Sections 1.7–1.11B Practice

Route: `/apps/ap-precalculus-1-7-1-11b`. Original AP-style questions, not official College Board items. Separate from the existing `/apps/ap-rational-practice` so RAT1 resume codes and its 20-question bank remain unchanged.

## Material scope

Reviewed the teacher's appc_1.7a, 1.7b, 1.8, 1.9, 1.10, 1.11a and 1.11b packets in AP Precalculus / Unit 1B Rational Functions. Extracted packet text and visually inspected new-topic notes, including the hole/limit graph, binomial theorem page and polynomial-division/slant examples. No source PDFs changed or uploaded.

- 1.7A: original domains and graphical end behavior.
- 1.7B: horizontal asymptotes, leading terms, end limits.
- 1.8: zeros, holes, sign tables, evaluation and modeling.
- 1.9: vertical asymptotes and one-sided behavior.
- 1.10: holes versus remaining poles, multiplicity, finite limits versus undefined values, numerical hole limits.
- 1.11A: equivalent polynomial/rational forms with preserved restrictions, third binomial terms and coefficients, numerical use of factored forms.
- 1.11B: polynomial quotient/remainder forms, nonhorizontal slant equations, degree classification, numerical distance from an asymptote.

Seven independently selectable topics; every selected topic appears in each enabled calculator section. Both sections: 28 questions (14 no-calculator, then 14 calculator-allowed). One section: 14 questions. With all topics selected, each topic receives two questions per part. Question values/order/answer letters are seed-generated. No timer/streak. +10 for correct, −5 for a miss; negative totals allowed. Correct answer and worked reasoning shown after each check; one scored response per question. Original bank is independently frozen in the new module to preserve the old widget's resume behavior.

## Save/resume and records

Stop & save is available on question, part break, missed-answer review and final reflection screens. APU1 base-32 code stores seed, selected topics, calculator mode, all checked choices and final completion timestamp (when complete), plus initials/hour hash and typo checksum. Score is recomputed from restored answers, not trusted from a separate score field. Codes are typically 27–41 characters including separators while in progress, up to 53 at full completion because completion time is included. Copy button and PNG card avoid manual transcription. This is local portability, not secure server-backed score authentication. Matching initials/hour is a convenience guard, not a guarantee against sharing.

Progress image includes full student name, local save date/time, score, tried count, correct/missed counts, accuracy, topics and code. Copy fallback selects the code; image preview supports touch-and-hold Save to Photos; Download progress card saves PNG through the browser's Files workflow. Browser controls the actual destination. Shared dialog now uses an AP-Precalculus filename for AP titles. Resume opens the next unanswered question (or calculator break / finished review); checked answers and score are preserved. Scratch ink and an unsubmitted selection are not encoded. No student names, scores or answers leave the browser, and no new storage/database is used.

Completion uses the shared two-reflection / separate completion-image flow with name, local completion date/time, scores and calculator-part breakdown. Return to review and save remain available. Local Spanish translation with tap-English behavior retained. Layout follows the original two-column AP widget; starts and next-question navigation scroll to the top so prior setup scroll position does not hide the prompt.

## Discovery and validation

Listed under Functions in Practice Apps with its own question preview. Original rational widget header links to the expanded practice. No unrelated index/hub redesign reverted.

`scripts/test-ap-unit1b.mjs`: 22,400 generated questions / 40 templates, deterministic regeneration, all modes and topic coverage, unique choices, all KaTeX and Spanish stems/reasons, independent numeric/polynomial/binomial oracles, score/accuracy and negative totals, full answer history at every save position, name/hour/checksum validation and code-size bound, actual answer/check/break/resume/missed-review/final-save flows. Existing rational suite passes 30,000 cases unchanged. Resume-dialog tests verify clipboard/fallback, named/dated image, score/tried/correct/missed summaries and AP filename. Browser test in Safari: setup → correct answer (+10) → save image preview → return to start → enter code → next question with 10 points and 1 correct retained. Physical iPad save menus remain owner device confirmation.
