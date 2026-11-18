# Card Clash — first playable round (beta)

This milestone is a **single two-player round**, not the complete eight-card tournament in the game specification. No matchmaking, category-picking battle, swap round, projector leaderboard, ghosts or cumulative tournament results yet. Keep existing review apps available for class assignments.

## Teacher setup — one time

1. Use the separate **Card Clash** Firebase project, `card-clash-ccb27`. Do not change MathBoard's database.
2. Authentication → Sign-in method → Anonymous must be enabled.
3. Realtime Database → Rules: replace the rules with `database.rules.json`, then press **Publish**. Do not use open/test-mode rules. The web configuration is already in `js/firebase-config.js`; these public identifiers are not administrator credentials.
4. If Firebase reports an unauthorized domain, add `www.macintodd.net` and `macintodd.net` under Authentication → Settings → Authorized domains. The app uses anonymous sign-in, not Google OAuth.

## Run a round

- Teacher: `/cardclash/teacher.html`. Choose a skill, difficulty and time limit; create the round.
- Students: `/cardclash/index.html`. Enter the four-letter game code and one of the two animal names (`fox-27`, `owl-42`). Do not enter real names.
- Both students must join before Start is enabled. Two distinct tabs can test this on one computer; use a separate tab for each student. The same tab can reconnect with its current anonymous identity.
- **Keep the teacher page open and awake.** It is the authority that processes answer commands. Students cannot write scores or round settings. If the host disconnects, submissions wait; on return the teacher checks pending submissions against the original timer deadline. This milestone has no pause/resume or offline scoring.
- Students can use two hints, two attempts, an on-screen keypad, optional integer graph taps and local scratch paper. A notation/simplification correction does not use an attempt.
- Once both finish or time expires, points are finalized and both see worked solutions. Each student sees their own outcome; there is no public missed-answer feed.
- Start another round with Create round. This creates a new code and does not silently replace a round another student is using. Existing rounds remain in Firebase until the teacher deletes them in the console.

## Scoring

Difficulty D gives D points for first-try success or ceil(D/2) for second-try success. Each hint subtracts 1 (floor zero). A correct answer without hints earns +1. The first correct answer received by the teacher earns +1; equal timestamps get no speed bonus. Thus a clean difficulty-4 first-try fastest answer earns 6. Missed/expired answers earn zero. Speed is determined by host receipt, so connection delay can affect it. No streak or full tournament scorecard is implemented in this milestone.

## Data boundaries

Firebase stores animal codes, anonymous authentication UIDs, presence/time, problem seed/category/difficulty, submissions, hints/checks and round scores. No real-name or email fields exist. Scratch pixels remain in the student's browser memory and are not transmitted. Anonymous identities are session-persisted for reconnecting. This is pseudonymous data, not a claim of SOPPA compliance; obtain district review before classroom deployment. No existing student records or MathBoard settings were modified.

The rules permit authenticated users who know a game code to read that round. This is suitable for a classroom review beta, not a secure assessment: browser source contains the generators, and a motivated user can reconstruct answers. Host ownership is enforced by Firebase auth UID, not a public JavaScript password. Student writes are limited to claiming a prelisted code, presence and commands; only the host writes canonical outcomes. There is no private service-account key in this bundle.

## Development and portability

Plain HTML/CSS/ES modules under `public/cardclash/`, served by the current site. Firebase modular SDK comes from Google's official CDN. KaTeX assets currently use the site's `/vendor/katex/` paths. To move the bundle to GitHub Pages, copy those assets and their license and update the two HTML paths for the destination. This does not move macintodd.net hosting.

Run `node scripts/test-card-clash.mjs` for deterministic generators, rendered LaTeX, answer checks and host round/scoring tests. `test.html` is a hidden generator viewer. No student data is needed for tests.

Official setup references:
- https://firebase.google.com/docs/web/alt-setup
- https://firebase.google.com/docs/auth/web/anonymous-auth
- https://firebase.google.com/docs/database/security

## Verification limits

The rules require Firebase console publication by the owner. Until then the app displays a clear database-locked error. Automated local tests do not establish live multi-device behavior or prove rules enforcement; a teacher + two-device smoke test is required after publishing rules. Physical iPad layout, Pencil behavior and connection recovery need that test as well.
