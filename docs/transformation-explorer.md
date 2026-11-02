# Transformation Explorer

/apps/transformations is an ungraded local exploration for Algebra 2 and Precalculus. Students enter first name, last name and class hour (2, 3, 4, 6, 7 or 8), select any nonempty subset of a, b, h and k, and explore g(x)=a f(b(x-h))+k. Unselected parameters take identity values. The linear parent is the default; absolute value, quadratic, square root, cubic and rational parents are also available.

The selected model, substituted parent expression and live numerical formula are rendered with KaTeX. Parent graphs are dashed blue and transformed graphs solid orange. Axes use equal scales, with windows of ±10 and ±20. Both curves clip to the window; rational branches never connect across the asymptote. Domain exclusions are preserved even for a=0; an open circle marks the rational hole.

The a slider runs −4 to 4 by quarters, h/k run −6 to 6 by halves. The b slider uses twelve signed nonzero values from −4 through 4 including ±1/2 and ±1/4. Zero is deliberately excluded and explained, since horizontal point mapping requires b≠0. Reset restores identity values. Changing the selected parameters returns to a menu without losing identity or recorded views.

“Follow a point” maps (t,f(t)) to (t/b+h,a f(t)+k); selecting a row highlights corresponding points on the graph. Parent sample inputs respect square root and rational domains. “Same input” separately compares x,f(x),g(x), with an em dash for undefined values. Tables round to three decimals. This distinction prevents horizontal scaling from being misrepresented as simply changing the output at a fixed input.

Students may record the current family, parameters and an optional observation. The named report records families tried, views and observations, and completion date. PNG export wraps long text. This is an investigation, not a numerical score or mastery test. State is memory-only: no backend, browser persistence or student-data transmission. Next-student reset clears all state.

Validation: 6,525 point mappings across all families and signed parameter combinations; strict LaTeX for all 15 parameter subsets; rational branch separation; actual component events for entry/menu/sliders/family changes/table modes/tracked points/recording/named export/reset. Normal lint/build/type/content checks and catalog tests also apply. Browser visual checks are unavailable in this environment; landscape iPad layout requires visual confirmation.
