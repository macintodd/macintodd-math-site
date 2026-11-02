# Practice app directory

The /apps directory groups all twelve student-facing apps and interactive lessons into five skill categories. Each has suitable-course tags and primary lesson links. Arithmetic and algebra refreshers identify their review role. Parent Function Challenge and 2048 explicitly have no single published lesson match. Factoring is available to both classes, with its current Precalculus packet linked and no invented Algebra 2 lesson.

Maintain app descriptions, category, course suitability, and lesson references in src/content/practice-apps.ts. Lesson labels come from the existing lesson catalog, and the build rejects unknown lesson references. Filters combine class, category and lesson; changing class clears the lesson selection. A clear-filters button restores the complete directory.

Run scripts/test-app-directory.mjs with Node type stripping to check app routes, lesson references and actual filter handlers, plus the normal content, lint, type and build checks. The directory does not change app scoring or student-data handling.

The approved navy/copper redesign now leads every app card with a representative activity visual, labeled “Example activity.” These are authored examples rather than live screenshots or student results. AppPreview.tsx owns the graph, equation, arithmetic, pool and 2048 visuals. Mathematical examples use the shared KaTeX renderer. Course tags remain visible; linked lesson matches expand beneath each description. Existing class/category/lesson filters remain unchanged. Three columns fit wide desktops, two fit tablets, and one fits phones.
