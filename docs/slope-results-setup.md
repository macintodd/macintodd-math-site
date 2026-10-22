# Slope practice: local results images

## Current mode

At the teacher's request, names, class hour, answers, scores, and completion times stay in browser memory. The student practice app has no score/status requests, background uploads, cookies, or browser storage for student work. Refreshing or leaving resets the practice. Normal website hosting requests still occur; this is not a blanket claim of SOPPA compliance or absence of hosting metadata.

After at least 10 correct and a best streak of 5, the app draws a PNG results image using the browser's canvas. It includes the exact first and last name entered at the start (with surrounding whitespace trimmed), class hour, correct count, first-try and retry counts, best streak, graphs/attempts, and completion date/time from the device. The student's name is wrapped, never truncated. The image is created locally, displayed via a local blob URL, and can be downloaded or shared using a user-selected OS share destination. No screenshot service, Google sign-in, or Classroom API is used.

Students attach the image in the district's Google Classroom assignment and tap Turn in. Classroom identifies the submitting account. The image's typed name, device timestamp, and session ID are not an identity verification or tamper-proof assessment. The export becomes available only after the practice goal is complete. On iPads, touch-and-hold the preview or use the hardware screenshot buttons if download/share isn't available.

## Former online collection

`POST /api/slope/results` returns 410 without reading or logging the body; it cannot save new scores even when Supabase credentials remain configured. `/api/slope/status` reports collection disabled. Have students reload any tabs left open from the previous version: old client code could otherwise still attempt requests, although they will not be stored by the current endpoint.

Existing Supabase records and server credentials have not been deleted. The previous-records section of `/apps/slope/results` is collapsed by default, never polls, and loads records only after a teacher explicitly supplies the existing access key. `GET /api/slope/results` remains protected and uncached. Consult the district before handling any existing real student records; no deletion or retention changes were performed.

`docs/slope-results.sql` describes the former private schema for reference. It is not required for local-image practice. Do not re-enable uploads without an explicit teacher request and appropriate district review.

## Validation

Run `npm run test:slope`, content checks, typecheck, lint, and a production build. After building, `node scripts/test-slope-api.mjs` verifies that uploads stay disabled even with credentials present, no database writes occur, and historical records require teacher authorization. Browser-test a full 10-answer run, verify the initial name on the PNG, confirm no student API requests are made, and inspect the downloaded image on an iPad-sized layout.
