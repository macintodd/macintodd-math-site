# Tank Flow Lab

Route: `/apps/tank-flow`. Teacher demonstration for Algebra 2 Unit 1B slope/rate of change and graphing; also appropriate for Precalculus lines and average rate of change. Linked and tagged in the app directory with a tank/graph preview.

- Inputs: initial gallons, capacity in gallons, inlet and drain in gallons per minute. Enter / Apply commits the selected field, immediately resets water to the initial level and t=0, and closes the valves. Raising the initial volume beyond capacity expands capacity. Reducing capacity below the initial volume is rejected. Values are finite, nonnegative, at most 1,000,000 and have at most two decimals; capacity must be positive.
- Model: V(t)=V0+(inlet-outlet)t. Decimal net rates round to the input precision. The clock stops exactly when volume reaches zero or capacity; rates then close rather than overflowing. Equal rates keep volume constant. Valid time domain is shown.
- Open valves starts/resumes; Close valves pauses. Reset tank returns to t=0 without erasing scratch work. +1 minute advances by one model minute or to the first boundary. Playback speed is explicitly labeled in model minutes per real second. Background-frame deltas are capped to avoid large unexpected jumps.
- Tank/graph views share all state. Graph has labeled minute/gallon axes, a dashed model prediction, actual elapsed flow in teal, and the current ordered pair. Switching views never resets the clock.
- Keypad respects caret and selections; hardware Enter applies. Scratch pad stays mounted across tool toggles. Drawing captures touch without scrolling. Scratch work resets for the example presets; normal setup edits and Reset tank preserve it.
- Presets: draining 500 at net -20 gal/min (25 min); filling 100 at net +50 gal/min to capacity 1000 (18 min); balanced 500 at +30/-30. No name, score, persistence, or network submission.
- Checks: `scripts/test-tank-flow.mjs` validates physics/boundaries/decimals/1,000 cases; `scripts/test-tank-flow-ui.mjs` exercises actual component handlers and animation-frame updates, pause, graph sync, controls and setup errors. Standard lint, build, typecheck and content checks also required.
