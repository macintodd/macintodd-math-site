# Math rendering

Use the shared Math component for a LaTeX formula and MathText for prose containing explicit `$...$` inline formulas. Vocabulary indexes and lesson definition pop-outs share MathText; author formulas in vocabulary.ts with these delimiters. Do not infer formulas from names, student answers, or arbitrary prose. The content check validates every marked vocabulary formula with KaTeX in strict mode.

Parent Function Challenge renders generated LaTeX with the same installed KaTeX version. Its square roots cover the entire radicand, fractions stack, powers are superscripts, and greatest integer expressions use double square brackets. The game continues to use its existing numerical functions for graphing and answer classification.

The sandboxed iframe loads /vendor/katex assets from this site. Font data is embedded in its stylesheet to avoid cross-origin font requests from the opaque sandbox origin. No CDN, external fonts, or remote math rendering is used. The content security policy keeps connect-src 'none' and its existing sandbox permissions. Regenerate the committed bundle with `node scripts/bundle-widget-katex.mjs` after upgrading KaTeX; retain its MIT license. Vendored code is excluded from application lint.

Validation includes game rounds, scoring, replay and local export, plus 630 combinations of equation family, coefficient, translation and form rendered with real KaTeX. Strict vocabulary checks and the production build cover both vocabulary indexes and the shared pop-outs.
