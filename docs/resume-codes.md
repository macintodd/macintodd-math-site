# Local resume codes

Intro to Point-Slope Form, Transformation Notation Practice, Standard form x and y intercept, and Standard form to Slope Intercept support Stop & save progress at checked-problem boundaries. The entry form validates the name and hour before either Enter resume code or Start practice. There is no autosave, browser persistence, or score/identity API request. Students retain their code or named PNG themselves.

## Encoding and validation

Version 2 uses a two-bit widget discriminator for four activities and continues reading previously issued version-1 codes. Versioned base-32 alphabet omits 0/O and 1/I, grouped in four-character chunks. First and last initial letters are normalized and converted into numeric values; full names are never included. Class hour and a widget discriminator are bound into the payload. A 16-bit CRC catches copy/typing errors and casual edits. A reversible XOR mask obscures the visible layout. This is not encryption, a digital signature, authentication, or prevention of deliberate score fabrication. Matching initials are a classroom mix-up check, not proof of identity; same-initial students can use the same code if the hour matches.

Variable-length integer packing minimizes length. Typical Intro code in tests: 11 characters before dashes. Typical transformation checkpoints: 13–20. Large lifetime counters can make codes longer; they are never truncated. Empty, malformed, overlong, incompatible-version, wrong-widget, wrong-initial, wrong-hour and semantically inconsistent payloads fail before applying progress.

## Restored state

- Intro stores correct count, correct retries, revealed problems, current/best first-try streaks and total step checks. The aggregate history is reconstructed to preserve grading, attempts, problem number and initial color-guidance cutoff. Previous equations/ink are not restored; a new problem is generated. Saving is available only once a problem is correct or its answer has been revealed, so unfinished steps cannot be scored twice.
- Transformation practice stores the active level, a pending-next-question or completed-level boundary, per-level correct/earned/errors/current/best values, original start date and completed-level calendar dates. Level 1 restarts equal its error count. The six-type remaining-set bitmask preserves coverage. A restored unfinished level starts a fresh question from that remaining set; a saved completed level restores its results screen before continuing. Counters and first-try qualification are unchanged. Calendar dates survive; original times of day are not carried in compact codes.

## Save screen

Native modal shows full entered name, hour, save date/time, code, and progress summary. Copy code uses the Clipboard API and falls back to selecting the field for manual Copy. Download progress card creates a named/dated PNG locally and also presents the image with a download link for iPad save/long-press workflows. The suggested filename includes widget/date; the browser or iPad controls the destination folder. Keep practicing closes the modal without changing the current session. Return to start clears the student/session only after the student has had the chance to retain their code. Codes are reusable; lost codes cannot be recovered by the website.

## Validation

`test-resume-code.mjs`: 600 Intro histories preserve all grading/progress fields; all transformation levels/boundaries, remaining six-type coverage, repeat resumes, cross-day dates, typo checks and initial/hour/widget mismatches. `test-resume-dialog.mjs`: native modal, clipboard and fallback, download filename and named/dated image, close/reset actions. Both actual widget flow suites save, leave, reject mismatched entry, resume, continue and finish. CI runs all four along with normal publishing checks.

## Standard-form graphing

The two standard-form routes have separate widget IDs. Save is enabled after a correct or missed Check graph, before advancing. Code stores correct and incorrect graph totals and current/best streaks; the boolean history is reconstructed without changing score, deduction, graph number or submission eligibility. A resumed activity starts a new equation on a fresh scratch pad; ink, coordinates and the previous equation are not restored. The original slope-intercept graphing route shares the component but does not gain resume controls in this change. The common save modal suggests a separate standard-form filename for each route. Tests cover 800 progress histories, legacy codes, actual correct/missed graph saves and returns for both modes, full completion and next-student reset.
