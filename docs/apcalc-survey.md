# APcalc break practice survey

Share `/survey` (also `/apps/apcalc-survey`), which opens `/surveys/apcalc.html`. Code `APcalc` is case-insensitive. The new and original AP practice pages link here. A is one practice set per day; B is all sets assigned Day 1. Totals update via Firebase Realtime Database listeners. Wide screens show voting left and bars right; phones stack them.

No student names/emails are requested. Only a random anonymous Firebase Auth UID and A/B vote are stored in `classSurveys/apcalc-break-2026/votes`. This is separate from Card Clash. The class code is a convenience gate, not a secret authentication credential. Firebase handles anonymous sign-in and its usual connection metadata.

The one-year, SameSite=Lax, HTTPS Secure cookie blocks another ballot in the same browser. Firebase browser-local anonymous auth recovers an existing vote when that identity remains. Server rules make a vote immutable for each UID and only accept A or B. Clearing browser data, private browsing or another device can bypass browser-only identity; this is not verified one-person voting. No administrator reset/delete UI is exposed.

`docs/apcalc-survey.rules.json` records deployed rules, preserving the existing Card Clash subtree byte-for-byte in parsed JSON. Future Firebase rule deployments must merge this branch too. A temporary separate test branch and disposable test auth accounts/votes were used for live validation, then removed. Production votes were not seeded.

Verification: model and real HTML/JS interaction test in `scripts/test-apcalc-survey.mjs`; live Firebase REST checks for A/B totals, invalid/duplicate/foreign-UID writes and unauthenticated reads. UI harness uses linkedom from the existing temporary test workspace; on another machine install linkedom to a temporary directory and set `SURVEY_TEST_DOM=/absolute/temp/package.json` before running the script. No test dependency ships to students.
