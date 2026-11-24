# MathBoard Web Widget Design Guidelines

**Version 2.0 — 2026-11-24**

**Website clarification, November 24, 2026:** Catalog activity mode and result reporting are independent. Either Demo or Scored widgets may report completion. The widget alone determines its score; MathBoard receives it without recalculating it. Optional statistics may be omitted and are ignored when absent. These teacher clarifications supersede older scoring-mode descriptions.

---

## Overview

A MathBoard Web Widget is any web application hosted at a public URL and registered in the MathBoard catalog. When a teacher places a web widget on a lesson slide, students see it fullscreen with forward/backward slide navigation. MathBoard injects a JavaScript bridge into every web widget page so the widget can communicate state, progress, and scores back to the app in real time.

This document describes the full integration contract a web widget must follow to participate in MathBoard's live progress monitoring and scoring pipeline.

---

## The MathBoard Bridge Object

MathBoard injects `window.MathBoardApplet` into every web widget page before the page's own scripts run. You do not need to load any SDK or script tag — it is always present.

```javascript
window.MathBoardApplet = {
  // YOU call this to send state/progress/score to MathBoard.
  publishState: function(stateObject) { ... },

  // MathBoard calls this internally to push state into your page.
  // Do NOT override or call this directly. Instead, implement
  // window.mathBoardAppletSetState (see "Restoring State" below) —
  // MathBoard's applyState calls your function automatically.
  applyState: function(state) { ... }
};
```

---

## Widget Tracking Patterns

Choose one of three tracking patterns based on what your widget does. The pattern determines which fields you send in `publishState`.

### Pattern 1 — Scored

The widget performs its own scoring logic and reports a numeric result. MathBoard displays the score live on the teacher dashboard.

**Use for**: Bell Ringers & Exit Slips, Practice, Skill Drills, Assessments.

Required fields: `score`, `maxScore`, `isComplete`.

```javascript
window.MathBoardApplet.publishState({
  score:      7,      // widget's own computed result — any scale you choose
  maxScore:   10,     // the maximum possible value for this session
  isComplete: false   // true only when the student is finished
});
```

The widget computes `score` using whatever logic fits the activity — accuracy, speed, streaks, partial credit, weighted items, or any combination. MathBoard does not mandate a formula.

---

### Pattern 2 — Completion Only

The widget has activities the student should complete (reading, guided exploration, structured steps) but no numeric score. MathBoard marks the student "Complete" on the dashboard when the widget signals it.

**Use for**: Lesson Widgets with guided steps, some Class Play widgets.

Required fields: `isComplete`.

```javascript
window.MathBoardApplet.publishState({
  isComplete: true   // set when the student has finished everything
});
```

When `isComplete: true` is sent, show the student a clear completion screen ("All done!", "Completed ✓", or similar) so they know MathBoard has recorded their finish. Without a visible end state, students may keep interacting with the widget or navigate away without knowing they finished.

---

### Pattern 3 — No Tracking

The widget runs with no dashboard reporting — no score, no completion marker. The student simply uses the tool.

**Use for**: Concept exploration widgets, Tools/generators.

Do not send `score`, `maxScore`, or `isComplete`. You may still use `publishState` to send `customState` for teacher/student mirroring (see below), but all scoring and completion fields must be absent.

---

## Sending Progress and Score Data

Call `window.MathBoardApplet.publishState(stateObject)` whenever something meaningful happens. MathBoard reads the state in real time.

### Primary Fields

| Field | Required for | Type | Notes |
|---|---|---|---|
| `score` | Scored widgets | Number | The widget's computed earned value. Any numeric scale. |
| `maxScore` | Scored widgets | Integer | The maximum possible value for this session. |
| `isComplete` | Scored + Completion-only | Boolean | `true` when the student is fully finished. |

### Named Enrichment Fields

If your widget tracks any of these, include them. MathBoard captures and stores them for detailed reporting and data export. They are all optional.

| Field | Type | Notes |
|---|---|---|
| `totalItems` | Integer | Total questions / problems in the session. |
| `answeredItems` | Integer | Items the student has attempted; count each item once regardless of tries. |
| `correctFirstTry` | Integer | Items answered correctly on the very first attempt. |
| `correctAfterRetry` | Integer | Items answered correctly after one or more retries. |
| `longestStreak` | Integer | Best run of consecutive correct first-try answers. |
| `timePerProblem` | Number | Average seconds per problem, or the time for the most recent one. |
| `scoreDisplay` | String | Human-readable score shown directly on the teacher dashboard (e.g. `"7/10"`, `"85%"`). |

### Extra Data (Open-Ended Collection)

If your widget produces metrics that don't fit the named fields above, put them in `extraData`. MathBoard captures every key-value pair and surfaces them in the teacher's detailed data view. Use this for any widget-specific statistic you want visible to teachers.

```javascript
extraData: {
  numberOfExtraCreditsCorrect: 2,
  hintsUsed: 1,
  timeOnTask: 145,
  difficultyReached: "hard",
  bonusRoundScore: 3
}
```

Values may be numbers, strings, or booleans. Use clear, descriptive key names — these are displayed as-is to the teacher. Do not use key names that conflict with the named fields above (`score`, `maxScore`, `isComplete`, `scoreDisplay`, `timePerProblem`, etc.).

### State Restoration Field

| Field | Type | Notes |
|---|---|---|
| `customState` | Object | Any widget-specific data needed to fully reconstruct the student's session on return. MathBoard stores it and passes it back unchanged via `applyState`. |

---

### Full Example State Object

```javascript
window.MathBoardApplet.publishState({

  // ── Required (Pattern 1 — Scored) ────────────────────────────────────────
  score:      7,
  maxScore:   10,
  isComplete: false,

  // ── Named enrichment (all optional) ──────────────────────────────────────
  totalItems:        10,
  answeredItems:     7,
  correctFirstTry:   5,
  correctAfterRetry: 2,
  longestStreak:     4,
  timePerProblem:    8.5,
  scoreDisplay:      "7/10",

  // ── Extra data — any widget-specific metrics ──────────────────────────────
  extraData: {
    numberOfExtraCreditsCorrect: 2,
    hintsUsed: 1,
    bonusRoundScore: 3
  },

  // ── Restoration ───────────────────────────────────────────────────────────
  customState: {
    currentQuestion: 7,
    answers: [1, 0, 2, 1, 0, 2, 1],
    longestStreak: 4,
    currentStreak: 1
  }

});
```

---

## When to Call `publishState`

| Trigger | What to send |
|---|---|
| Student's first action (fresh start only) | Full state with current counts |
| Student submits / checks an answer | Updated score and enrichment fields |
| Student completes the final item | Full final state with `isComplete: true` |
| Student resets / starts over | Zeroed-out state |

**Do not** call `publishState` on page load. If the student is returning to the slide, `mathBoardAppletSetState` will be called with their saved state — publishing zero at load time would flash incorrect data on the teacher dashboard and risks echoing stale values.

**Always guard the call** — `window.MathBoardApplet` exists only inside MathBoard. Direct browser visits (while testing your widget at its URL) will crash without a guard:

```javascript
function publish() {
  if (!window.MathBoardApplet) return; // not running inside MathBoard
  if (isRestoring) return;             // don't echo restored state back
  window.MathBoardApplet.publishState({ ... });
}
```

---

## Restoring State (State Persistence)

When a student returns to a slide that contains your widget, MathBoard calls `window.mathBoardAppletSetState(state)` with the last state your widget published. You **must** implement this function to restore the student's work.

MathBoard may call `mathBoardAppletSetState` either before or after the page's `load` event fires. Use a `pageReady` flag and a `pendingRestoreState` queue to handle both cases safely:

```javascript
let pageReady         = false;
let pendingRestore    = null;
let isRestoring       = false;

// Keep isRestoring true throughout restoration AND rendering so no
// event triggered during re-render can accidentally call publish().
function applyRestoredState(state) {
  if (!state) return;
  isRestoring = true;

  if (state.customState) {
    myWidget.loadState(state.customState); // restore widget-specific data
  }

  renderCurrentQuestion(); // safe — isRestoring blocks any publish() calls here
  isRestoring = false;
  // Do NOT call publish() — echoing restored state back creates stale dashboard data.
}

// Define BEFORE any async code — MathBoard may call this before 'load' fires.
window.mathBoardAppletSetState = function(state) {
  if (!state) return;
  if (!pageReady) {
    pendingRestore = state; // page not ready yet — queue it
    return;
  }
  applyRestoredState(state);
};

window.addEventListener('load', function() {
  pageReady = true;
  if (pendingRestore) {
    applyRestoredState(pendingRestore); // apply queued restoration
    pendingRestore = null;
  } else {
    renderCurrentQuestion(); // fresh start — render initial state
  }
  // Do NOT publish on load.
});
```

This pattern ensures:
- If MathBoard calls `mathBoardAppletSetState` before `load` fires, the state is queued and applied once the page is ready.
- If the page loads first (fresh start), question zero (or the initial state) is rendered as normal.
- `isRestoring` covers both the data restoration and the subsequent render, so no accidental `publish()` can fire during either.

The `customState` field is entirely yours to define. Store everything needed to fully reconstruct the student's session: current question index, all answers given, timer values, difficulty level, etc.

---

## Minimal Complete Example

```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
<div id="question-area"></div>
<button id="submit-btn">Check Answer</button>
<button id="retry-btn" style="display:none">Try Again</button>

<script>
  const TOTAL = 5;

  // Per-item results: null = not yet attempted,
  // 'first' = correct first try, 'retry' = correct after retry, 'wrong' = still incorrect.
  let answers       = new Array(TOTAL).fill(null);
  let currentQ      = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  let hintsUsed     = 0;

  let pageReady      = false;  // true once 'load' has fired and the UI is ready
  let pendingRestore = null;   // stores state received before the page was ready
  let isRestoring    = false;  // blocks publish() during restoration and rendering

  // ── State restoration ────────────────────────────────────────────────────
  // isRestoring stays true through restoration AND the subsequent renderQuestion
  // so no event triggered during rendering can accidentally call publish().
  function applyRestoredState(state) {
    if (!state) return;
    isRestoring = true;
    if (state.customState) {
      answers       = state.customState.answers       || new Array(TOTAL).fill(null);
      currentQ      = state.customState.currentQ      ?? 0;
      currentStreak = state.customState.currentStreak ?? 0;
      longestStreak = state.customState.longestStreak ?? 0;
      hintsUsed     = state.customState.hintsUsed     ?? 0;
    }
    renderQuestion(currentQ); // safe — isRestoring blocks publish() here
    isRestoring = false;
    // Do NOT call publish() — echoing restored state creates stale dashboard data.
  }

  // Define BEFORE any async code — MathBoard may call this before 'load' fires.
  window.mathBoardAppletSetState = function(state) {
    if (!state) return;
    if (!pageReady) {
      pendingRestore = state; // queue it; applyRestoredState runs after 'load'
      return;
    }
    applyRestoredState(state);
  };

  window.addEventListener('load', function() {
    pageReady = true;
    if (pendingRestore) {
      applyRestoredState(pendingRestore); // restoration arrived before page was ready
      pendingRestore = null;
    } else {
      renderQuestion(0); // fresh start — no saved state to restore
    }
    // Do NOT publish on load.
  });

  // ── Answer submission ────────────────────────────────────────────────────
  document.getElementById('submit-btn').addEventListener('click', function() {
    if (answers[currentQ] !== null) return; // guard: already answered

    if (checkAnswer()) {
      answers[currentQ] = 'first';
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
      advanceQuestion();
    } else {
      answers[currentQ] = 'wrong';
      currentStreak = 0;
      showRetryButton();
    }
    publish();
  });

  document.getElementById('retry-btn').addEventListener('click', function() {
    if (answers[currentQ] !== 'wrong') return; // guard

    if (checkAnswer()) {
      answers[currentQ] = 'retry';
      // streak stays 0 — retries do not count toward first-try streak
      advanceQuestion();
    }
    // If still wrong, leave as 'wrong' so the student can try again.
    publish();
  });

  // ── Scoring helper ───────────────────────────────────────────────────────
  function publish() {
    if (!window.MathBoardApplet) return; // browser preview — no bridge
    if (isRestoring) return;             // don't echo restored state

    const correctFirst = answers.filter(a => a === 'first').length;
    const correctRetry = answers.filter(a => a === 'retry').length;
    const answered     = answers.filter(a => a !== null).length;
    const totalCorrect = correctFirst + correctRetry;

    // Complete only when every item is resolved correctly.
    // answered === TOTAL would be premature if the last item is still 'wrong'.
    const done = answers.every(a => a === 'first' || a === 'retry');

    window.MathBoardApplet.publishState({
      // Pattern 1 — required
      score:      totalCorrect,
      maxScore:   TOTAL,
      isComplete: done,

      // Named enrichment
      totalItems:        TOTAL,
      answeredItems:     answered,
      correctFirstTry:   correctFirst,
      correctAfterRetry: correctRetry,
      longestStreak:     longestStreak,
      scoreDisplay:      totalCorrect + "/" + TOTAL,

      // Extra data — widget-specific stats visible to teachers
      extraData: {
        hintsUsed: hintsUsed
      },

      // Restoration — everything needed to reconstruct this session
      customState: {
        answers:       answers,
        currentQ:      currentQ,
        currentStreak: currentStreak,
        longestStreak: longestStreak,
        hintsUsed:     hintsUsed
      }
    });
  }
</script>
</body>
</html>
```

**Note on completion condition**: this example auto-completes when every item has been answered correctly (`'first'` or `'retry'`). If your widget should allow students to submit with partial credit or move on without finishing all items, add an explicit **Finish** button that sets a `done` flag and calls `publish()` with `isComplete: true`.

---

## Teacher/Student State Sync

When the **teacher** opens the same widget on their screen (via the external display or teacher canvas), MathBoard applies the last published state from the student via `applyState`. This lets the teacher see exactly what the student sees.

If your widget is a **demonstration only** (teacher drives it, students watch), the student side does **not** call `publishState` — only the teacher does. However, the student page **must still implement `window.mathBoardAppletSetState`**, because MathBoard uses it to push the teacher's state into the student's view in real time. Without it, the student screen will not mirror the teacher.

---

## Choosing a Widget Type

Every web widget is registered with a **Category** (internally `pedagogicalWorkflow`). This determines where the widget appears in the MathBoard catalog and what teachers and students expect from it.

| Category | Tracking pattern | Student experience | Typical design |
|---|---|---|---|
| **Bell Ringers & Exit Slips** | Scored | Short, focused check | 3–8 questions, quick submit |
| **Concept Widgets** | None | Exploration / observation | Sliders, graphs, animations — no right/wrong |
| **Practice** | Scored | Independent skill work | 10–20 questions with retry |
| **Skill Drills** | Scored | Timed fluency | Rapid-fire questions, streak tracking |
| **Lesson Widgets** | Completion or Scored | Guided step-by-step | Narrative flow; score if there are check-for-understanding moments |
| **Class Play** | Completion or None | Whole-class game | Teacher-driven; student view mirrors teacher |
| **Tools** | None | Utility / generator | Produces an artifact (number line, grid, spinner) |

The catalog **Activity Mode** is either **Demo** or **Scored**. Choose it independently of category and reporting pattern. Either mode may report completion; the widget maker decides what result to report. The typical patterns in the category table are suggestions, not reporting restrictions.

---

## Registration in the MathBoard Catalog

Web widgets are registered via the MathBoard Catalog Admin page (see `webwidget-CatalogAdmin-Spec.md` for the full field reference). The minimum required fields are:

| Field | Notes |
|---|---|
| **Title** | Shown in the catalog and on the teacher dashboard |
| **URL** | The public HTTPS URL of your web app |
| **Category** | The widget type — see "Choosing a Widget Type" above |
| **Activity Mode** | Demo or Scored; independent of category and reporting pattern |
| **Preferred Width / Height** | Canvas widget size in points (e.g. 820 × 560) |
| **Scope** | Global, Private (not enforced), or Website Only; unpublish drafts |

---

## Checklist Before Submitting a Widget

**All widgets**
- [ ] Loads cleanly over HTTPS with no mixed-content errors
- [ ] Usable on iPad-sized screens (1024 × 768 minimum) in portrait and landscape
- [ ] No external authentication required — loads without a login prompt
- [ ] `publishState` is **not** called automatically on page load
- [ ] Every `publishState` call is guarded: `if (!window.MathBoardApplet) return`
- [ ] `window.mathBoardAppletSetState` is defined before any async code runs
- [ ] `mathBoardAppletSetState` queues state if the page isn't ready yet (`pageReady` flag)
- [ ] `isRestoring` flag covers both the data restoration and the subsequent render
- [ ] `mathBoardAppletSetState` does **not** call `publish()` (no restoration echo)
- [ ] `customState` contains everything needed to fully restore the student's session
- [ ] Catalog **Activity Mode** and category describe the activity; neither overrides its chosen reporting pattern

**Scored widgets (Pattern 1) only**
- [ ] `publishState` sends `score` and `maxScore` after every meaningful student action
- [ ] `isComplete: true` is sent only when the student has actually finished — not prematurely on the last attempt if the answer is still wrong
- [ ] Completion condition reflects the widget's real finish state (all correct, explicit submit, etc.)
- [ ] `extraData` keys are descriptive and do not conflict with reserved field names (`score`, `maxScore`, `isComplete`, `scoreDisplay`, `timePerProblem`, etc.)

**Completion-only widgets (Pattern 2) only**
- [ ] `publishState` sends `isComplete: true` when the student finishes
- [ ] The widget shows a visible "Completed" or "Done" screen so the student knows MathBoard recorded their finish
