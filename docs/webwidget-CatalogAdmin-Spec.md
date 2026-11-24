# MathBoard Web Widget Catalog Admin — Field Specification

**Website integration revision — November 24, 2026. For use by the AI assisting with web widget registration.**

This document describes every field in the MathBoard Catalog Admin page (`public/catalog-admin.html` in this website repository), what each field writes to Firestore, and how MathBoard uses that data at runtime. Read this before registering a new web widget or modifying an existing one.

---

## Access

The hosted admin page is [https://www.macintodd.net/catalog-admin.html](https://www.macintodd.net/catalog-admin.html). Its source in this website repository is `public/catalog-admin.html`. The supplied MathBoard-project specification refers to its own `tools/catalog-admin.html` source location; that is not the website source path. The page signs in to Firebase and writes to the `mathtivityCatalog` Firestore collection. Only accounts with write permission can save entries.

Read [webwidget-Design-Guidelines.md](webwidget-Design-Guidelines.md) before registration or widget integration work. Category, activity mode, and the widget’s reporting pattern are independent choices. Widget state and student results belong in the runtime bridge, not in catalog-registration fields.

---

## Field Reference

### Title
- **Field ID**: `f-title`
- **Firestore key**: `title`
- **Required**: Yes
- **Notes**: Shown in the MathBoard catalog list, the teacher's library drawer, and the live progress dashboard. Use a clear, descriptive name. The Firestore document ID is derived from this title as a slug (`remote.multiplication-minute`), so it is stable across edits.

---

### Widget URL
- **Field ID**: `f-url`
- **Firestore key**: `webAppletURL` (also written into `jsonStoragePath` as `webapplet://<url>`)
- **Required**: Yes
- **Notes**: The public HTTPS URL of the web widget. MathBoard loads this URL in a WKWebView. The `webapplet://` prefix in `jsonStoragePath` signals MathBoard to treat this as a remote web applet rather than a Firestore Storage download. Test the URL in a browser before registering — it must load without authentication.

---

### Preferred Width / Height
- **Field IDs**: `f-width`, `f-height`
- **Firestore keys**: `preferredWidth`, `preferredHeight`
- **Required**: No (default: 800 × 560)
- **Notes**: The initial size of the widget when placed on a teacher's canvas, in logical points. These are the actual rendered dimensions on the canvas (not fullscreen — that is always device-width × device-height for the student). Choose values that match the widget's natural layout. Common values:
  - Compact (bell ringers): 700 × 480
  - Standard (practice): 820 × 560
  - Wide (graphs/lesson): 1000 × 640

---

### Category
- **Field ID**: `f-workflow`
- **Firestore key**: `pedagogicalWorkflow`
- **Required**: Yes
- **Options and their internal values**:

| Displayed label | Firestore value | Typical use (recommendation only) |
|---|---|---|
| Bell Ringers & Exit Slips | `bellRingerExitTicket` | Short checks of understanding |
| Concept Widgets | `conceptualInteractive` | Concept exploration and demonstrations |
| Practice | `assessment` | Independent skill practice |
| Skill Drills | `skillDrill` | Fluency practice |
| Lesson Widgets | `lessonWidget` | Guided lesson steps |
| Class Play | `classPlay` | Whole-class activities |
| Tools | `tools` | Utilities and generators |

- **How MathBoard uses it**: Determines which section of the library catalog the widget appears in. Category does not select a mode, require a numeric score, or prohibit completion reporting. Choose it based on the widget’s teaching purpose.

---

### Activity Mode
- **Field ID**: `f-mode`
- **Firestore key**: `mode`
- **Required**: Yes
- **Options**: `demo` (displayed as **Demo**) and `scored` (displayed as **Scored**).
- **Notes**: Keep the existing stored values and existing catalog entries. Select the activity mode independently of category. This field does not prescribe the widget’s scoring formula or reporting pattern. Either Demo or Scored widgets may report completion.

The widget maker decides whether the widget reports:

- A numeric result using `score`, `maxScore`, and `isComplete`.
- Completion using `isComplete`, without a numeric score.
- No result, omitting score and completion fields while still supporting state restoration/mirroring.

The widget alone calculates its score. MathBoard receives the reported result without recalculating it; MathBoard owns its display. Do not use catalog category or mode to override the result the widget reports.

Question counts, fixed totals, first-try/retry counts, streaks, timing, and `extraData` are optional runtime enrichment fields. MathBoard collects supplied fields and ignores absent ones; absence is not zero. They are not grading instructions or registration requirements. Do not add scoring formulas or mandatory question-total controls to this form. See the design guidelines for the runtime schema.

---

### Topic
- **Field ID**: `f-topic`
- **Firestore key**: `topic`
- **Required**: Yes
- **Notes**: The math topic or subject area. Used for catalog search and filtering. Examples: `Arithmetic`, `Algebra`, `Geometry`, `Statistics`. Use a consistent, broad term — not a specific standard code.

---

### Course (optional)
- **Field ID**: `f-course`
- **Firestore key**: `course`
- **Required**: No
- **Notes**: Optional course-level specificity, e.g. `Algebra 2`, `Precalculus`, `8th Grade Math`. Leave blank for general-use widgets.

---

### Description
- **Field ID**: `f-description`
- **Firestore key**: `description`
- **Required**: No
- **Notes**: A short description shown in the catalog detail view. Describe what the student does, not what the widget is. Example: "Students practice identifying domain and range from function graphs with immediate feedback."

---

### Tags
- **Field ID**: `f-tags`
- **Firestore key**: `tags`
- **Required**: No (but recommended)
- **Notes**: Comma-separated keywords for catalog search. Include the topic, relevant standards terms, and the interaction style. Example: `algebra, slope, linear equations, graphing, practice`. Lowercase, no punctuation beyond commas.

---

### Availability (Scope)
- **Field ID**: `f-scope` (hidden input, set by clicking scope tiles)
- **Firestore key**: `scope`
- **Options**:
  - `global` — Visible to all MathBoard teachers in the shared catalog.
  - `private` — Intended for the registering teacher’s catalog, but app-side filtering is a known pending feature: published private entries may be visible to other signed-in teachers. The admin page therefore labels this **Private (not enforced)**. Do not treat it as a privacy boundary. Uncheck **Published** for drafts.
  - `website` — Not added to the MathBoard catalog at all. Used for widgets that are linked from the macintodd.net website but not intended for classroom use.
- **Notes**: `website` scope sets `isPublished: false`, which prevents the entry from appearing in the MathBoard catalog regardless of other settings.

---

### Published
- **Field ID**: `f-published` (checkbox)
- **Firestore key**: `isPublished`
- **Notes**: Controls whether the widget appears in the MathBoard catalog. Unchecking this hides the widget without deleting it; use this for drafts while private scope is not enforced. It does not make the hosted widget URL private. Automatically saved as `false` when scope is `website`.

---

## Firestore Document Structure

A saved web widget entry contains the following fields in the `mathtivityCatalog` collection:

```json
{
  "title":               "Multiplication Minute",
  "topic":               "Arithmetic",
  "course":              null,
  "description":         "Students answer multiplication facts under time pressure.",
  "tags":                ["arithmetic", "multiplication", "fluency", "skill drill"],
  "catalogKind":         "remoteWebApplet",
  "activityType":        "multipleChoice",
  "mode":                "scored",
  "pedagogicalWorkflow": "skillDrill",
  "isPublished":         true,
  "schemaVersion":       1,
  "version":             1,
  "webAppletURL":        "https://macintodd.net/apps/multiplication-minute",
  "jsonStoragePath":     "webapplet://https://macintodd.net/apps/multiplication-minute",
  "preferredWidth":      820,
  "preferredHeight":     560,
  "scope":               "global",
  "updatedAt":           "<server timestamp>"
}
```

**Fields MathBoard reads at runtime:**

| Field | Used for |
|---|---|
| `webAppletURL` | URL loaded in WKWebView |
| `jsonStoragePath` | `webapplet://` prefix triggers remote applet path in app code |
| `preferredWidth` / `preferredHeight` | Initial canvas widget size when placed by teacher |
| `pedagogicalWorkflow` | Catalog section placement; independent of result reporting |
| `mode` | Activity-mode metadata (`demo` or `scored`); does not determine the widget’s reported result |
| `title` | Display name throughout the app |
| `isPublished` | Whether the widget appears in the library drawer |
| `scope` | Visibility filtering (full enforcement pending) |

**Fields not currently used by the app** (stored for future use or website display only):
- `topic`, `course`, `description`, `tags`, `activityType`, `schemaVersion`, `version`

---

## Document ID Convention

Document IDs follow the pattern `remote.<slug>` where `<slug>` is the title lowercased with non-alphanumeric characters replaced by hyphens. Example: "Multiplication Minute" → `remote.multiplication-minute`.

The ID is set once when the entry is first saved and never changes on subsequent edits. Changing the title does not change the document ID.

---

## Known Limitations

1. **Private scope not enforced in-app**: Items with `scope: "private"` are currently visible to all signed-in teachers. A `teacherUserID` field and compound Firestore query are needed to enforce this. Do not rely on `private` to hide drafts. Save drafts with `isPublished: false` instead.

2. **Native reporting implementation is maintained in MathBoard**: This website form registers metadata; it does not implement the dashboard or scoring pipeline. The agreed contract is that the widget supplies its result and optional progress data. `totalItems` is optional enrichment and must not act as a score trigger. Any legacy native behavior that derives grades from counts or discards completion based on `mode` belongs with the MathBoard programmer to reconcile with this contract.

3. **`activityType` is a placeholder**: Web applets always write `activityType: "multipleChoice"` regardless of their actual interaction type. This field is used by native JSON widgets and is not meaningful for web applets.
