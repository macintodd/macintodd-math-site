# Parent Function Challenge

Published at `/apps/function-families`, linked from Practice apps. The teacher supplied the working standalone HTML; it is retained in `public/widgets/function-families.html` and isolated inside a full-viewport sandboxed iframe. The host header/footer are hidden only on this route. No third-party dependencies or changes to the other apps.

Seven families: linear, quadratic, cubic, square root, rational, greatest integer, constant. Preserve the original three 60-second rounds (graphs, equations, mixed), 10 points per correct answer, no immediate repeated family, paused timer and explanation after mistakes, replay, sound/star feedback, and local canvas results image.

The graph scales as a square into the available viewport height. Seven 46px answer buttons form a single row in landscape; Next and timer/question/score share the last row. Smaller phones use four columns and natural scrolling. Verified at 1024×768 and 1024×650, including the site's embedded route.

First/last name and class hour (3,6,7,8) stay in memory only. Identity is visible in the game header and each post-entry overlay and appears on the results image. No requests transmit names, scores, or answers, and no browser storage is used. CSP blocks outgoing connections. Students download or save the image and submit to Classroom themselves.

Validation: `node scripts/test-function-families.mjs`, lint, typecheck, production build, content check, site/PDF smoke checks, and browser review of graph, answers, timer, and feedback.
