# Parallel Lines · Draw the Match

Standalone experimental route: `/apps/beta/parallel-drawing`, listed only in Beta Apps. The parallel notes lesson and teacher presentation are not changed.

## Student flow

Enter name and hour locally. Draw a first stroke on the ungridded canvas; it becomes a straight blue reference. Freehand the red match. The red stroke remains unstraightened when scored. Reveal five perpendicular distance markers, retry the same reference, or draw a new first line. There is no timer or imposed round count.

The compact header keeps name/hour/local session timestamp visible. Finish & reflect opens the shared completion flow with two required ratings, local completion time, average percentage, best score, round count and individual scores. The named record can be saved using the shared Photos/image actions. Return to practice keeps the current local session. Reloading starts fresh. No names, strokes or scores are sent to a server or stored in browser storage.

## Geometry and score

The new helper is `src/lib/parallel-drawing-game.ts`. Do not replace the pre-existing `parallel-drawing.ts`; that file belongs to the earlier beta opening lesson.

Both strokes are resampled uniformly along arc length so stylus pauses or densely clustered events do not change weighting. Orthogonal least squares fits the reference (including vertical lines) and the candidate direction. The second stroke is assessed using signed perpendicular distances to the infinite reference line. A matching direction and constant signed gap produce 100. Variation/wobble, drift and crossing lower the score. Reverse drawing is equivalent. This is a bounded, rounded game index, not a formal mathematical percentage or course grade.

The score is `round(100 * alignment² * exp(-1.5 * spread / scale))`, clamped to 0–100. Alignment is the absolute direction dot product. Spread is RMS variation of signed gaps. Scale is the mean-gap magnitude capped at a quarter of the reference span, with an 18-unit floor. Canvas geometry is a 1000 × 560 viewBox with preserved aspect ratio, so perpendicular distances remain perpendicular on all screens.

Reject first strokes shorter than 160 units and highly curved first strokes. Second strokes must span at least max(140, min(280, 60% of reference span)) and leave a visible gap. Short/overlapping strokes get a supportive prompt and do not count as a round. Pointer capture, a single active pointer, touch-action:none and cancellation handling keep drawing from scrolling the page and prevent duplicate scoring.

## Verification

`node --experimental-strip-types scripts/test-parallel-drawing-game.mjs` checks perfect horizontal/vertical/diagonal/reversed matches, angular score degradation, crossing/wobble penalties, short/overlap rejection, event-density independence, perpendicular marker geometry, pointer interactions, duplicate/cancel guards, retry history, named/dated reflection transition and Spanish strings.

The earlier `scripts/test-parallel-drawing.mjs` was preserved and still passes, as do the parallel language and shared completion-flow regressions. Required typecheck, lint, content checks, production build and diff check pass. Physical iPad/Apple Pencil feel and viewport layout still need user testing; no physical-device or browser screenshot check was completed on this Mac.
