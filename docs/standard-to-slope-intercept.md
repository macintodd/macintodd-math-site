# Standard form to Slope Intercept

Route: `/apps/graph-standard-slope`, linked from Practice apps. Reuses the existing graphing practice component, scratch pad, equation generator, coordinate grid, feedback animations, scoring, and local named results image. Existing intercept and slope-intercept apps retain their own entry forms and validators.

Students enter first/last name and class hour, receive Ax + By = C, write on the scratch pad, and enter m and b in y = [m]x + [b]. Valid numbers unlock Graph without revealing whether they are correct. Fractions and decimals are accepted. Students select any two distinct integer points, draw the line, then check. A star requires both coefficients and the graph to be correct. Mistakes reveal the correct graph/slope triangle and, when the conversion is wrong, vertically arranged subtraction and division work. Next equation resets entries, points, and scratch work.

Same scoring as the other graphing apps: at least 10 correct and a best streak of 6 earns full credit; after 10 correct students may submit, with one point deducted per missing best-streak step. Name, hour, answers, and results remain in memory only; locally generated named PNGs are submitted to Classroom manually.

Validation: `node --experimental-strip-types scripts/test-standard-slope.mjs`, existing standard-form and graph-line regression suites, lint/build/typecheck/content checks, route/PDF smoke checks, and browser review of scratch/graph switching and correct/incorrect answers.
