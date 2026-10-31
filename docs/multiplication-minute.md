# Multiplication Minute

Route `/apps/multiplication`, linked from Practice apps. Collects first/last name, hour (3/6/7/8), and selected focus factors. Each selected factor is practiced against 0–11. Products above 110 are excluded, so the all-factors deck has 143 ordered facts and never includes 11×11. A shuffled deck visits every selected fact before reshuffling and avoids an immediate identical repeat at the boundary.

Study mode shows a table with selected rows highlighted. Start removes the table and flips in the timed card; it cannot be reopened during the one-minute round. Performance-clock deadline checking occurs both in the animation-frame timer and on each input/submit event so late answers cannot score, including after returning from a background tab. Every nonempty submitted answer advances. Correct answers earn one point, a spinning star, and a green frame; misses flash red and show the correct fact. Streak and accuracy are informational, with no point deduction.

The landscape layout gives a large problem panel and a separate three-column keypad. Physical keyboard digits, Enter, Backspace and Escape also work. Repeated held keys are ignored. Ocean, Arcade, Sunset and Forest color themes are available; reduced-motion preferences remove flips/spins/flashes. Phones use a stacked layout. Name/hour remain in the header after setup.

Names, answers and results remain in component memory, without storage, analytics, or server collection. Results show points, answered count, accuracy, best streak, chosen factors, and missed-fact review. A local canvas creates a named/hour PNG for manual Classroom submission. Reload resets practice.

Validation: `node --experimental-strip-types scripts/test-multiplication.mjs`, lint/build/typecheck/content checks, website/PDF smoke checks, and browser review of selections, table hiding, keypad, feedback, timer end and named results export at iPad landscape sizes.
