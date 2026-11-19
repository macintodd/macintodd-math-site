# Resource-hub redesign

Approved November 18, 2026. Reference supplied by the teacher in `macintodd_net_ui_ux_architecture_spec_for_ai.md`.

## Approved implementation

Keep Next.js and React. Shared design tokens and `redesign.css` supply parchment #FBF9F5, white paper cards, charcoal prose, navy #0F3460 and saddle #7C5332 accents. Locally hosted Newsreader, Plus Jakarta Sans and Caveat fonts include their OFL licenses. Deterministic SVG drawings give the course cards and global bottom wave a hand-drawn appearance, without a CDN or Rough.js dependency. Grain is decorative and cannot intercept touches.

Home follows the supplied exact heading and introduction. Course indexes use a centered heading and separate sketched chapter sheets, preserving every published unit, folding state, quiz label and follow-up indentation. Native details/summary controls show sketched Open Unit or Hide Sections buttons, with actual section counts. Review collections and course/vocabulary links follow the chapter list so the opening view matches the teacher’s reference. Per the teacher’s screenshot refinement, indexes link to lesson pages only; document links are available inside each lesson. Home card edges, smaller graph doodles and the flatter footer wave use deliberately imperfect repeated pencil strokes. A sketched vertical divider separates lesson columns, becoming horizontal when stacked on phones. The lesson page keeps four independent reviewed document positions, including explicit unavailable notices. User clarification supersedes the reference's two-document links and embedded applet. Video cards are below the title/documents in the left column and open a 16:9 native-dialog player. The right column links matching published webwidgets in a new tab, extra PDFs, review guidance and vocabulary. Beta apps stay excluded. Phone columns stack. BookReader retains previous/next and keyboard navigation. Unit overviews, directory and resources receive matching paper surfaces.

## Preserved boundaries

No teaching app behavior, scoring, storage, translations, privacy or MathBoard bridge logic changes. Existing widget-specific styles remain independent. Video embeds use youtube-nocookie and load only after a deliberate click. The modal supports Escape, a close button, background dismissal, focus containment/return and scroll locking.

## Future maintenance

Change shared resource colors/spacing in `src/app/redesign.css`, fonts in `study-fonts.css`, decorative drawings in `StudySketch.tsx`. Lesson resources come from `src/content/lessons.ts` and the existing `practice-apps.ts` lesson references. Practice activities keep their lesson-specific instructions. Special review PDF labels remain intact. Completed documents can be removed individually through the content data without changing the page layout. Physical iPad testing remains useful for native video/fullscreen behavior.
