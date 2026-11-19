# Resource-hub redesign

Approved November 18, 2026. Reference supplied by the teacher in `macintodd_net_ui_ux_architecture_spec_for_ai.md`.

## Approved implementation

Keep Next.js and React. Shared design tokens and `redesign.css` supply parchment #FBF9F5, white paper cards, charcoal prose, navy #0F3460 and saddle #7C5332 accents. Locally hosted Newsreader, Plus Jakarta Sans and Caveat fonts include their OFL licenses. Deterministic SVG drawings give the course cards and global bottom wave a hand-drawn appearance, without a CDN or Rough.js dependency. Grain is decorative and cannot intercept touches.

Home follows the supplied exact heading and introduction. Course indexes use a centered heading and separate sketched chapter sheets, preserving every published unit, folding state, quiz label and follow-up indentation. Native details/summary controls show sketched Open Unit or Hide Sections buttons, with actual section counts. Chapter disclosures animate their measured height over 560ms with native summary keyboard semantics, rapid reversal and reduced-motion support. Each chapter sits beside its own quarter-width review card labeled Test [unit number] Review; matching destinations live in `src/content/chapter-reviews.ts`. Algebra 2 1A has no posted review and renders unavailable. Reviews stack below chapters on phones. Supplemental practice and course/vocabulary links follow the chapter list. Per the teacher’s screenshot refinement, indexes link to lesson pages only; document links are available inside each lesson. Home card edges, smaller graph doodles and the flatter footer wave use deliberately imperfect repeated pencil strokes. A sketched vertical divider separates lesson columns, becoming horizontal when stacked on phones. The lesson page keeps four independent reviewed document positions, including explicit unavailable notices. User clarification supersedes the reference's two-document links and embedded applet. Video cards are below the title/documents in the left column and open a 16:9 native-dialog player. The right column links matching published webwidgets in a new tab, extra PDFs, review guidance and vocabulary. Beta apps stay excluded. Phone columns stack. BookReader retains previous/next and keyboard navigation. Unit overviews, directory and resources receive matching paper surfaces.

## Preserved boundaries

No teaching app behavior, scoring, storage, translations, privacy or MathBoard bridge logic changes. Existing widget-specific styles remain independent. Video embeds use youtube-nocookie and load only after a deliberate click. The modal supports Escape, a close button, background dismissal, focus containment/return and scroll locking.

## Future maintenance

Change shared resource colors/spacing in `src/app/redesign.css`, fonts in `study-fonts.css`, decorative drawings in `StudySketch.tsx`. Lesson resources come from `src/content/lessons.ts` and the existing `practice-apps.ts` lesson references. Practice activities keep their lesson-specific instructions. Special review PDF labels remain intact. Completed documents can be removed individually through the content data without changing the page layout. Physical iPad testing remains useful for native video/fullscreen behavior.

## Practice directory and topic cards

The directory is a category view, initially Functions. `practice-directory.ts` validates category values and filters apps. Beta is a selector option; All is an explicit choice and includes all 47 current widgets, including labeled beta items. Category changes update only the result division. Text, class and optional lesson filters refine that category. Reset clears refinements while retaining the category.

A one-year `macintodd-practice-category` preference cookie, scoped to `/apps` with SameSite=Lax and Secure on HTTPS, remembers the selection. Next reads it for the initial server render; the client preference store also handles navigation caches. Only the category is stored. Blocked cookies retain the choice in the current app session, with Functions on a new visit. `/apps` is request-rendered for this preference; teaching widgets stay as before.

`WidgetCard.tsx` and `widget-cards.css` supply two-column compact preview cards to both the directory and all grouped practice hubs. They retain source descriptions, optional expanded notes and directory lesson links. Demonstration metadata is explicit in `practice-apps.ts` (Tank Flow Lab and Transformation Explorer), with amber badges/edges; practice uses blue. The former collection shortcut buttons and separate Beta button are removed. Grouped hub URLs, group ordering, review links and individual widgets remain available through course indexes.

## Document note icons and directory spacing

`DocumentIcon.tsx` draws the larger paper icons as SVG, with imperfect outlines, small punched holes and a folded corner. Blank documents have ruled lines; completed/ worked/answer document kinds have decorative handwritten math. Icons also cover unavailable material positions and supporting PDFs, without changing link labels, reviewed files or availability. Decorative SVGs are hidden from assistive technology. The original small Unicode note glyph is removed.

Practice Apps uses compact breadcrumb/heading/filter spacing. At 1180px width the filters begin at y=264px instead of roughly y=357px in the previous design. `SketchDivider` draws two imperfect strokes between the optional lesson filter/memory note and the results heading. The heading-to-filter gap is 16px on iPad/desktop and 14px on phones. Filters retain their 46px touch targets.
