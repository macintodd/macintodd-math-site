# Multiplication Minute

Route `/apps/multiplication`, linked from Practice apps. Collects first/last name, hour (3/6/7/8), and selected focus factors. Each selected factor is practiced against 0–11. Products above 110 are excluded, so the all-factors deck has 143 ordered facts and never includes 11×11. A shuffled deck visits every selected fact before reshuffling and avoids an immediate identical repeat at the boundary.

Study mode shows a table with selected rows highlighted. Start removes the table and flips in the timed card; it cannot be reopened during the one-minute round. Performance-clock deadline checking occurs both in the animation-frame timer and on each input/submit event so late answers cannot score, including after returning from a background tab. Every nonempty submitted answer advances. Correct answers earn one point, a spinning star, and a green frame; misses flash red and show the correct fact. Streak and accuracy are informational, with no point deduction.

The landscape layout gives a large problem panel and a separate three-column keypad. Physical keyboard digits, Enter, Backspace and Escape also work. Repeated held keys are ignored. Ocean, Arcade, Sunset and Forest color themes are available; reduced-motion preferences remove flips/spins/flashes. Phones use a stacked layout. Name/hour remain in the header after setup.

Names, answers and results remain in component memory, without storage, analytics, or server collection. Results show points, answered count, accuracy, best streak, chosen factors, and missed-fact review. A local canvas creates a named/hour PNG for manual Classroom submission. Reload resets practice.

Validation: `node --experimental-strip-types scripts/test-multiplication.mjs`, lint/build/typecheck/content checks, website/PDF smoke checks, and browser review of selections, table hiding, keypad, feedback, timer end and named results export at iPad landscape sizes.


## Signed factors and combined reports

Include Negatives expands each selected magnitude to both signs in either factor (without negative zero duplicates). All products remain within −110 to 110; ±11 × ±11 are excluded. The keypad has ± and accepts three digits plus a sign. Negative operands are shown in parentheses. A bare minus sign cannot be submitted.

Each completed minute appends an immutable in-memory snapshot: unique round ID, completion timestamp, selected factors, whether negatives were enabled, and answers. Reports list actually answered factor magnitudes separately from selected factors, points, weighted accuracy, and date/time per minute, with combined totals and a combined named PNG. Factor/sign changes retain the same student's earlier rows. Name or class-hour changes clear all prior rows and exported-image state immediately; New student also resets identity/settings. Reload clears history; nothing is persisted or uploaded.

Google's Classroom Share button shares a URL and can attach links to student assignments, but does not itself turn in the assignment. A locally generated data-URL report image is not a remotely accessible report URL. No Google API, tokens, report hosting, or third-party sharing script was added. The image download remains, followed by a plainly labeled Open Google Classroom link for manual attachment/turn-in. References: https://developers.google.com/workspace/classroom/tutorials/assignment-workflows and https://developers.google.com/workspace/classroom/guides/sharebutton. SOPPA agreement/operator status cannot be determined just by choosing a share button.

Additional checks: all 525 signed ordered facts, sign entry, immutable snapshots, weighted accuracy, and actual component-event tests for multiple timed sessions, combined image rows, factor changes, identity changes and explicit New student reset (`scripts/test-multiplication-flow.mjs`). Native browser preview is unavailable for this revision; these are automated logic checks, not an interactive iPad verification.
