# Slope practice and private results

The app is `/apps/slope`; the teacher view is `/apps/slope/results`.

## Current behavior without credentials

The complete practice app works without a database. It explicitly says that online saving is not connected. Names and answers remain in React memory until leaving/reloading. Finishing creates a downloadable JSON report that a student can attach in Google Classroom. The teacher view imports those files locally, recalculates scores, filters by hour, and exports CSV. Imported reports are not uploaded or retained after leaving/reloading. Treat downloaded reports as student work that students can edit, rather than verified assessments.

## Enable online collection

Use a school-approved private database. This implementation supports Supabase's REST API without adding a browser database SDK. Confirm school approval and retention requirements before enabling student collection.

1. Create/select a Supabase project in the teacher/school account and run `docs/slope-results.sql`.
2. In the production Vercel project serving macintodd.net, configure **server-only** environment variables:
   - `SUPABASE_URL`: project URL, e.g. `https://PROJECT.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: server service-role key. Never use a `NEXT_PUBLIC_` prefix or commit credentials.
   - `RESULTS_TEACHER_PASSWORD`: a unique randomly generated access key of at least 24 characters. Keep it in a password manager; don't send it to students. The current dashboard uses a bearer key sent over HTTPS, compares its hash in constant time, and clears the input after use. It isn't stored in browser storage or URLs.
3. Redeploy. There are currently two Vercel projects connected to this repository; configure the actual production project deliberately. Do not copy student data to a public GitHub repository.
4. Test with a fictional student. Finish, confirm the saved message, reload the teacher dashboard, and verify one result appears even if saving was retried. Verify unauthenticated GET is rejected and anonymous Supabase access cannot read/write the table.
5. Choose a retention period and delete expired records in Supabase. The teacher dashboard shows the latest 500 records. Export as needed; no scheduled deletion is configured.

Collection sends name, class hour, start/finish times, graph parameters, submitted fractions, and derived totals on completion or explicit Finish. It does not save every keystroke or background progress. Save failures are explicit and retryable; the download remains available. Reloading before Finish loses the current session. Scores are recomputed on the server, but answers and identities are self-reported. Anonymous submission is intended for low-stakes classroom practice, not high-stakes grading; deploy platform rate limits before enabling broadly advertised collection. The endpoint enforces same-origin browser submissions, bounded payloads, valid graph/answer data, and duplicate-session protection. Same-origin checks are not authentication and do not prevent custom clients submitting fictional work.

## Google identity

The teacher supplied school domain is `dps61.net`; no domain filtering is claimed in this version. The teacher email allowlist is still needed.

Being signed into a managed iPad or Google Classroom does not authenticate this website. No Google password is requested. If verified email identity is required, the next step is school-approved Google OAuth: a configured Google Cloud client, exact website redirect URLs, domain restrictions, and a teacher allowlist. Do not claim verified Google identity until that flow is connected and tested. This version uses student-entered names and a separate teacher key, so it does not require students to approve third-party Google access.

## Scoring

A star means a graph was answered correctly on attempt one or two. A first miss immediately breaks the streak. Retry success earns one star and leaves the streak at zero. Second miss reveals the answer, no star. Completion requires at least 10 stars and a **best** first-try streak of at least 5 in that session. Equivalent fractions count, with simplest-form feedback. Denominator zero is an input error, not a scored attempt. Horizontal lines are included; vertical lines are excluded because the requested interface is a fraction. Every generated line has at least two visible integer grid intersections; points are marked only after a miss.

Run `npm run test:slope` plus the standard project checks before publishing. After building, `node scripts/test-slope-api.mjs` tests access controls, validation, score recomputation, and idempotent saving against a local mock database. It does not substitute for testing the actual configured Supabase project.

Reference: https://supabase.com/docs/guides/api/securing-your-api
