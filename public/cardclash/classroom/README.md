# Card Clash classroom beta

This is a separate classroom game. The original two-player test remains at `/cardclash/teacher.html`.

## Open the three pages

- Teacher: https://www.macintodd.net/cardclash/classroom/teacher.html
- Students: https://www.macintodd.net/cardclash/classroom/index.html
- Shared display: https://www.macintodd.net/cardclash/classroom/display.html

The beta apps directory also links to Classroom Game. The host page opens student/display links carrying the game code.

## One-time Firebase update

In the **Card Clash** project only, replace Realtime Database → Rules with the contents of `../database.rules.json`, then Publish. The classroom host has **Copy updated database rules**. Anonymous sign-in is already configured. Do not change MathBoard's Firebase project or any keys. The only new allowed command types are `spin` and `difficulty`; the latter accepts 1–4. Host-side code verifies the current phase, round, winner and selected chooser before acting. Existing two-player commands still work.

Without the update, normal rounds and teacher overrides work, but student spinner/difficulty requests are denied. The UI reports the error; use the updated rules rather than open/test-mode access.

## Classroom flow

1. Create a game with 2–40 code names (default 36) and a round time. Open the shared display: students choose an available code name and type it on their iPad. Claims are first come, first served; a claimed name disappears immediately, even if its device later goes offline. The teacher can release it. Optional printed slips remain available, but are not required. Students enter their real name on their own iPad; it is stored only in that browser’s local storage, keyed by game and code name. It is never sent to Firebase or the shared display.
2. Students use the same four-letter code and choose an available animal name. Simultaneous duplicate claims are blocked atomically. **Release code** moves a player to another device while preserving points and progress. Close the old student page before transfer.
3. Select the first category and difficulty. Start when at least two students are connected. Unused slots are ignored. Students joining after the start wait for the next round.
4. Everyone in a round receives the same seeded problem for a fair classroom race. Two attempts, two paid hints, keypad, optional graph taps and taller local scratch paper with black/red circle pen buttons, eraser icon and Clear are retained. The x/y keys are adjacent in the same variable color; number, operation and extra keys each have their own color. Only x/y are keypad variables, so composition questions now consistently use x. The original round scoring is unchanged; the first correct answer received by the host gets the speed bonus. Network delay can affect this bonus.
5. When all active participants finish or the timer expires, scores are added once to class totals. A round-score preview appears beside scratch work, directly below answer feedback; it is labeled provisional until closure because ties can change the speed bonus. Top-five correct finish places (including ties) appear there. The worked answer stays at the bottom and opens at review. The round winner is the correct student with the highest round points; ties use earlier completion, then code name. If nobody is correct, the teacher handles the next spin.
6. Press **Next round · winner’s spin**. The winner can tap Spin or quickly swipe the wheel with a finger. A qualifying swipe immediately disables the button; a button press disables gestures. Slow/short drags or canceled touches do not consume the spin. Faster swipes produce more rotations, in the swipe direction; the category and chooser stay random. The teacher has the same two input choices as an override. Shared angle, speed/power, starting angle and server-aligned time keep the display animation in step; no new Firebase rules are needed. The host chooses the category and a random connected student; all screens animate the same stored wheel angle/start time. Labels and numbers identify categories as well as color.
7. After the spin, the selected student chooses difficulty 1–4. The teacher can choose instead. If nobody chooses within 30 seconds and at least two are connected, difficulty 2 starts automatically. Category and seed change, scores stay, and the game code remains the same.
8. Pause freezes answering and the round/spin/difficulty clocks. Resume preserves the remaining time. End round gives unfinished answers zero points and keeps completed work. End class game keeps totals and opens two local five-star reflections and a local image completion record for students. Reflections never go to Firebase or alter scores. Save image opens the native file share menu when supported; the exact Photos option is controlled by iPadOS. Long-press image remains available.
9. Download the teacher CSV for code-name totals, correct rounds, rounds played and streaks. It contains no real-name mapping. End the current game before creating another in the same tab.

## Display and reliability

Keep the teacher tab open, connected and awake. It checks answers and processes commands. The display is read-only and shows top standings, progress, category legend and the synchronized wheel. It never shows student answer content or missed-answer messages. Full screen is available when the browser supports it. Wheel animation seeks to the shared elapsed time if the display opens mid-spin.

The same teacher tab can refresh and restore its game; host identity and game code use session persistence. A different browser/device does not automatically acquire host ownership. Student code/name are session-persisted; rejoin with the same tab identity or ask the teacher to release the code for a new device. Scratch work stays in memory on that device, survives feedback/pause updates, and clears for a fresh round. It is not restored across reload or device transfers.

Offline participants who started a round remain in that round until it ends or times out. They are omitted from the next round unless connected again. The teacher can end a stalled round; the game does not silently abandon or re-pair students. This version is **whole-class rounds**, not the original specification's paired pick/swap/ghost tournament.

## Stored data

Firebase stores pseudonymous code names, anonymous auth UIDs, presence, seeds/settings, answer commands, per-round outcomes and cumulative scores/history. Exact-game reads require anonymous authentication; anyone signed in who knows the code can inspect the game, so this is classroom practice, not a secure test. Only the host can write canonical scores/settings. Source contains the problem generators. Records remain in Firebase until the project owner deletes the game; no automatic deletion of existing records is performed.

The teacher's CSV is generated locally. Scratch pixels, reflection ratings and completion images are local. No real-name roster, student email, service-account key or Vercel teacher password is included. These boundaries do not by themselves establish district/SOPPA approval.

## Tests and remaining checks

- `node scripts/test-card-clash-classroom.mjs`: simulated 40-player scoring, continuous rounds, seeds, winner/chooser gates, wheel timing, pause, timeout default, late joining and transfers.
- Existing Card Clash generator/round/drawing tests remain in place.
- DOM tests exercised student/teacher/display transitions and reflection/image replacement with temporary Linkedom tooling (not a browser rendering test).
- Live Firebase REST test passed two rounds, totals, display readback, pause/resume and score-write denial with isolated temporary users. After the owner updated rules, winner spin and selected-student difficulty commands both passed positive live verification through a second continuous round. All temporary users/game data were deleted. A separate simultaneous-claim test verified exactly one of two claimants succeeds; its test users/game were also deleted.
- A physical teacher/display/student iPad test is still needed for layout, native save menu, subscriptions/reconnection and apparent spinner synchronization. No native MathBoard bridge was changed.

The host can show available names on the display during an active game for late arrivals. Offline reservations remain unavailable until the host releases them. Returning students use their original code even when it is no longer in the available list.
