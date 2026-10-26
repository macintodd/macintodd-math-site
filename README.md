# MacIntodd Math

Public Algebra 2 and Precalculus lesson library, built with Next.js, React, TypeScript, Tailwind CSS, and KaTeX. Published content includes Algebra 2 Unit 1A Lessons 0-10 and Unit 1B Lessons 1-2, plus Precalculus rectangular coordinates. Course tables of contents group lessons beneath linked unit headings. Unit overviews explain skills and everyday relevance. Landscape-iPad lesson readers use a narrow unit sidebar and a large 16:9 video with normal document scrolling, with plain PDF links under a compact title, Previous/Next controls, and arrow-key navigation. Worked examples are retained in source data but are not displayed.

## Develop and verify

Use Node 22 or newer. Run `npm ci`, then `npm run dev`.

Before publication:

```sh
npm run check:content
npm run typecheck
npm run lint
npm run build
```

`check:content` validates lesson records, math syntax, PDF allowlist membership, page-count metadata, file hashes, and the factoring answer-checking regressions.

## Update a lesson

1. Edit the course and lesson records in `src/content/lessons.ts`. The shared paginated reader renders navigation, one video at a time, and four material positions; unavailable matching keys are explicitly marked not posted yet, and unfinished classroom scans are labeled partial. Unit summaries live in src/content/units.ts. Add a unitSlug to each lesson to connect it to a unit.
2. For a video replacement, change its YouTube `id`, `title`, and `author`. Guest videos are explicitly identified on the page.
3. To update a PDF, inspect the source first and update its explicit entry in `content-sources.json`. Run `scripts/sync-materials.py --source-root '/path/to/2026 2027 School Year'` with Python and pypdf installed. This copies only allowlisted materials into `public/materials`; source files remain untouched.
4. Run `scripts/create-coordinate-key.py` with reportlab on macOS if regenerating the prepared Precalculus answer guide. Its fonts use the system Arial family.
5. Recheck the rendered PDFs and website at phone, tablet, and desktop widths. Verify PDF open/download links, unit lesson navigation, and video page controls.
6. Commit and push to GitHub. A connected Vercel project can deploy the production branch automatically; verify the deployment result rather than assuming the push went live.

## Source selection

The working source folders are Algebra 2 and Precalculus inside Documents/2026 2027 School Year on the teacher's Mac. GitHub and Vercel cannot directly read this local folder. Updating requires a local session with access to the synced source files.

There are 51 individually reviewed PDFs in the publishing allowlist. See [Algebra 2 publishing review](docs/algebra-2-publishing-review.md) for source choices, five missing matching keys, and four partial classroom scans. Raw uncompressed streams are losslessly compressed for browser downloads. Do not recursively copy source folders. The catalog records exact selections, output hashes, and page counts. The two selected Algebra blank PDFs are reviewed exceptions from the `not used` folder: their content matches the current Pages previews and corresponding completed sheets. The blank Precalculus practice omits its empty third page.

The prepared Precalculus practice key fills gaps in the classroom scan and corrects problem 7 according to the formula as printed: h(t) = 10 + 12t + 4.9t². For t > 0, h > 0, so the graph lies in Quadrant I; at t = 0 it is on the vertical axis. Original classroom files are unchanged.

## Publishing and access

Notes, completed notes, practice, and completed practice are public immediately. The slope app keeps names and work in browser memory and creates a local completion image bearing the name entered at the start, for manual Google Classroom submission. New score uploads are disabled. Existing private database records are preserved for teacher review. See [results workflow](docs/slope-results-setup.md).

Known old URLs redirect where an equivalent new destination exists. The former Unit 3 page remains accessible as legacy content. Domain DNS and Bluehost account settings are managed separately from this repository. Do not change domain or email records without a specific task to do so.

The source history allows a previous production commit to be restored if needed. Keep source documents outside the Git repository; publish only reviewed PDFs.
