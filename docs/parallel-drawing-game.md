# Parallel Lines · Draw the Match

Standalone game: `/apps/parallel-drawing`, listed in the Games category. The old `/apps/beta/parallel-drawing` address remains a working alias. The same drawing component also provides the unscored opening warm-up in the parallel-lines lesson.

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

## Lesson warm-up and canonical addresses

The classroom lesson is now titled **Write Linear Equations: Parallel Lines**, with canonical student route `/apps/beta/parallel-lines` and teacher route `/apps/beta/parallel-lines/teacher`. Previous `/apps/beta/parallel-perpendicular-lesson` routes remain functional aliases. Keep the historical `lessonSlug`/resume-code identity unchanged; report-title lookup maps it to the new catalog title.

The student page opts into `introGame`. After entering name/hour for a new session, it renders the drawing component in embedded mode. One valid scored drawing round enables **Continue to lesson**; unlimited retries are available. Game percentages do not count toward the lesson grade, and the embedded component has no separate reflection screen. The lesson's existing final reflection remains in place. Restoring a lesson resume code bypasses the opening game.

Embedded game state (reference, live draft, completed stroke, percentage/result, round scores, error and distance toggle) is included as `warmupGame` in the lesson's native bridge snapshot, with `screen: 'warmup'`. Read-only receivers consume the snapshot without sending updates back or advancing independently. Controller restores remount the embedded game with its saved drawing state. The document-start bootstrap recognizes both new and legacy lesson/teacher paths, so existing MathBoard URLs continue working. Standalone play still has no native bridge of its own.

The standalone game, embedding and mirroring regressions cover the same component. The new Games catalog filter and retained old routes are checked in `test-app-directory.mjs`; canonical/legacy startup bridge matching is checked in `test-parallel-bridge-startup.mjs`. The lesson warm-up and resume bypass are checked in `test-parallel-display-mirror.mjs`.
