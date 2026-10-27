import { precalculusLessons } from './precalculus.ts'
export type CourseId = 'algebra-2' | 'precalculus'
export type Step = { math: string; explanation: string }
export type Example = { id: string; title: string; category: string; prompt: string; steps: Step[]; points?: { x: number; y: number; label: string }[]; triangle?: boolean }
export type Lesson = {
  reviewGuide?: { instructions: string[]; lessonSlugs: string[]; practiceUrl: string; practiceTitle: string; privacyUrl: string; privacyNote: string }; indexLabel?: string; materialSet?: 'resources'; materialsNote?: string; followUpOf?: string; sortOrder?: number; course: CourseId; unitSlug: string; slug: string; title: string; unit: string; number: string; description: string;
  goals: string[]; prerequisites: string; concepts: { title: string; text: string; formula?: string; note?: string }[];
  videos: { id: string; title: string; author: string }[]; examples: Example[];
  materials: { additional?: { file: string; contentsLabel?: string; label: string; description: string; pages: number }[]; file?: string; label?: string; unavailableReason?: string; title: string; description: string; pages: number; kind: string }[];
  check?: { question: string; answer: string; explanation: string }; practiceApp?: string;
}
const t = String.raw
export const courses = [
  { id: 'algebra-2' as const, title: 'Algebra 2', kicker: 'BUILD YOUR FOUNDATION', description: 'Find the patterns. Understand the operations. Build confidence with equations and functions.' },
  { id: 'precalculus' as const, title: 'Precalculus', kicker: 'EXPAND YOUR PERSPECTIVE', description: 'Connect algebra and geometry. Explore functions, coordinates, and the ideas that come next.' },
]
const originalLessons: Lesson[] = [
  {
    course: 'algebra-2', unitSlug: 'unit-1a', slug: 'one-step-equations', title: 'One-step equations', unit: 'Unit 1A', number: 'Lesson 1',
    description: 'Keep the equation balanced. Use inverse operations to get the variable alone—and explain why each step works.',
    prerequisites: 'Signed-number arithmetic, order of operations, and adding and multiplying fractions.',
    goals: ['Solve addition, subtraction, multiplication, and division equations.', 'Use reciprocals when the coefficient is a fraction.', 'Name the property of equality and check the solution in the original equation.'],
    concepts: [
      { title: 'An equation is a balance.', text: 'The two sides represent the same value. Keep them equal by doing the same operation to both sides. The goal is to write the variable by itself.', formula: t`\begin{array}{rrcr}x&+4&=&9\\&\underline{\color{#176b58}{-4}}&&\underline{\color{#176b58}{-4}}\\x&&=&5\end{array}`, note: 'Subtracting 4 from both sides is the Subtraction Property of Equality.' },
      { title: 'Undo the operation, not the number.', text: 'Addition and subtraction undo each other. Multiplication and division undo each other. Ask what is being done to the variable, then apply the inverse operation to both sides.', formula: t`x+a=b\Rightarrow x=b-a \qquad ax=b\Rightarrow x=\frac{b}{a}\ (a\ne0)`, note: 'Division by zero is never allowed. For a fractional coefficient, multiply by its reciprocal.' },
      { title: 'Write the property. Then check.', text: 'Use the Addition, Subtraction, Multiplication, or Division Property of Equality to justify your step. If your result is written with the variable on the right, use the Symmetric Property to switch sides. Substitute the solution into the original equation to check.', formula: t`5=x\quad\Longleftrightarrow\quad x=5` },
    ],
    videos: [
      { id: 'jWpiMu5LNdg', title: 'One-step addition and subtraction equations', author: 'Khan Academy' },
      { id: 'a3acutLstF8', title: 'One-step multiplication and division with fractions and decimals', author: 'Khan Academy' },
    ],
    materials: [
      { file: 'algebra-2/one-step-equations/notes.pdf', title: 'Blank notes', description: 'Follow along and show each property of equality.', pages: 2, kind: 'NOTES' },
      { file: 'algebra-2/one-step-equations/completed-notes.pdf', title: 'Completed notes', description: 'The annotated classroom notes, with worked solutions.', pages: 2, kind: 'WORKED NOTES' },
      { file: 'algebra-2/one-step-equations/practice.pdf', title: 'Practice', description: '27 problems: equations, fractions, and prerequisite review.', pages: 2, kind: 'TRY IT YOURSELF' },
      { file: 'algebra-2/one-step-equations/completed-practice.pdf', title: 'Completed practice', description: 'The scanned classroom answer sheet. Show your work first, then compare.', pages: 2, kind: 'ANSWER SHEET' },
    ],
    examples: [
      { id: 'addition', title: 'Undo addition', category: 'PRACTICE 1, 6, 11', prompt: 'Solve x + 4 = 9 and state the property used.', steps: [
        { math: t`x+4=9`, explanation: 'The variable has 4 added to it. Undo addition by subtracting 4.' },
        { math: t`\begin{array}{rrcr}x&+4&=&9\\&\underline{\color{#176b58}{-4}}&&\underline{\color{#176b58}{-4}}\end{array}`, explanation: 'Subtract 4 from both sides: Subtraction Property of Equality.' },
        { math: t`\begin{array}{rrcr}x&+4&=&9\\&\underline{-4}&&\underline{-4}\\x&&=&5\end{array}`, explanation: 'Check: 5 + 4 = 9. Both sides are 9.' },
      ] },
      { id: 'subtraction', title: 'Undo subtraction', category: 'PRACTICE 2, 5', prompt: 'Solve x − 3 = 6.', steps: [
        { math: t`x-3=6`, explanation: 'Subtracting 3 is undone by adding 3.' },
        { math: t`\begin{array}{rrcr}x&-3&=&6\\&\underline{\color{#176b58}{+3}}&&\underline{\color{#176b58}{+3}}\end{array}`, explanation: 'Add 3 to both sides: Addition Property of Equality.' },
        { math: t`\begin{array}{rrcr}x&-3&=&6\\&\underline{+3}&&\underline{+3}\\x&&=&9\end{array}`, explanation: 'Check: 9 − 3 = 6.' },
      ] },
      { id: 'multiplication', title: 'Undo multiplication', category: 'PRACTICE 3, 22', prompt: 'Solve 6x = 18.', steps: [
        { math: t`6x=18`, explanation: '6x means 6 multiplied by x. Undo multiplication with division.' },
        { math: t`\frac{6x}{\color{#176b58}{6}}=\frac{18}{\color{#176b58}{6}}`, explanation: 'Divide both sides by 6: Division Property of Equality.' },
        { math: t`\boxed{x=3}`, explanation: 'Check: 6(3) = 18.' },
      ] },
      { id: 'division', title: 'Undo division', category: 'PRACTICE 4, 12, 16', prompt: 'Solve x/3 = 5.', steps: [
        { math: t`\frac{x}{3}=5`, explanation: 'The variable is divided by 3. Multiply by 3 to undo it.' },
        { math: t`\color{#176b58}{3}\left(\frac{x}{3}\right)=\color{#176b58}{3}(5)`, explanation: 'Multiply both sides by 3: Multiplication Property of Equality.' },
        { math: t`\boxed{x=15}`, explanation: 'Check: 15 ÷ 3 = 5.' },
      ] },
      { id: 'reversed', title: 'The variable can be on either side', category: 'PRACTICE 7–10, 24', prompt: 'Solve 8 = x/2. Give the answer as x = a number.', steps: [
        { math: t`8=\frac{x}{2}`, explanation: 'The location of the variable does not change the inverse operation.' },
        { math: t`\begin{aligned}2(8)&=2\left(\frac{x}{2}\right)\\16&=x\end{aligned}`, explanation: 'Multiply both sides by 2: Multiplication Property of Equality.' },
        { math: t`\boxed{x=16}`, explanation: 'Switch sides using the Symmetric Property. Check: 8 = 16/2.' },
      ] },
      { id: 'fraction-addition', title: 'Add or subtract a fraction', category: 'PRACTICE 13, 14, 17', prompt: 'Solve x − 1/2 = 1/4.', steps: [
        { math: t`x-\frac12=\frac14`, explanation: 'Undo subtraction by adding 1/2 to both sides.' },
        { math: t`\begin{array}{rrcr}x&-\frac12&=&\frac14\\&\underline{\color{#176b58}{+\frac12}}&&\underline{\color{#176b58}{+\frac12}}\end{array}`, explanation: 'Addition Property of Equality. Use a common denominator on the right.' },
        { math: t`\begin{array}{rrcr}x&-\frac24&=&\frac14\\&\underline{+\frac24}&&\underline{+\frac24}\\x&&=&\frac34\end{array}`, explanation: 'Check: 3/4 − 1/2 = 3/4 − 2/4 = 1/4.' },
      ] },
      { id: 'fraction-coefficient', title: 'Use a reciprocal', category: 'PRACTICE 15, 18, 23', prompt: 'Solve (2/5)x = 6.', steps: [
        { math: t`\frac25x=6`, explanation: 'The coefficient 2/5 multiplies x. Its reciprocal is 5/2.' },
        { math: t`\frac52\cdot\frac25x=\frac52\cdot6`, explanation: 'Multiply both sides by 5/2: Multiplication Property of Equality.' },
        { math: t`\begin{aligned}x&=\frac{30}{2}\\x&=\boxed{15}\end{aligned}`, explanation: 'The reciprocal makes the coefficient 1. Check: (2/5)(15) = 6.' },
      ] },
      { id: 'order-of-operations', title: 'Review: evaluate a numerical expression', category: 'PRACTICE 19–20', prompt: 'Evaluate 2 · 3² − 5(6 − 4).', steps: [
        { math: t`2\cdot3^2-5(6-4)`, explanation: 'Start with grouping and exponents.' },
        { math: t`\begin{aligned}&2\cdot9-5(2)\\&18-10\end{aligned}`, explanation: 'Calculate the power and parentheses, then multiply.' },
        { math: t`\boxed{8}`, explanation: 'Subtract last. A fraction bar is also grouping: evaluate its numerator before dividing.' },
      ] },
      { id: 'formula-substitution', title: 'Review: substitute into a formula', category: 'PRACTICE 21', prompt: 'Find P = nRT/V for n = 0.65, R = 0.08, T = 293, and V = 14.', steps: [
        { math: t`P=\frac{nRT}{V}`, explanation: 'Replace each letter with its given value. Keep the whole numerator grouped.' },
        { math: t`\begin{aligned}P&=\frac{(0.65)(0.08)(293)}{14}\\P&=\frac{15.236}{14}\end{aligned}`, explanation: 'Multiply the numerator before dividing by the denominator.' },
        { math: t`P\approx\boxed{1.09}`, explanation: 'Round at the end. The numerical result is about 1.09 in the units implied by the supplied constants.' },
      ] },
      { id: 'circumference', title: 'Review: a formula with units', category: 'PRACTICE 25', prompt: 'A tire has a radius of 13 inches. How far does it travel in one revolution?', steps: [
        { math: t`C=2\pi r`, explanation: 'One full revolution covers one circumference.' },
        { math: t`\begin{aligned}C&=2\pi(13)\\C&=26\pi\text{ inches}\end{aligned}`, explanation: 'Substitute the radius. Keep π until the final calculation.' },
        { math: t`C\approx\boxed{81.7\text{ inches}}`, explanation: 'Round to one decimal place and include units.' },
      ] },
      { id: 'distribute', title: 'Review: distribute and combine like terms', category: 'PRACTICE 26–27', prompt: 'Simplify −3(2x − 4) + 5x − 2.', steps: [
        { math: t`-3(2x-4)+5x-2`, explanation: 'Multiply every term inside the parentheses by −3.' },
        { math: t`-6x+12+5x-2`, explanation: 'A negative times a negative is positive. This is the Distributive Property.' },
        { math: t`\begin{aligned}&(-6x+5x)+(12-2)\\&\boxed{-x+10}\end{aligned}`, explanation: 'Combine variable terms with variable terms and constants with constants. This is an expression to simplify, not an equation to solve.' },
      ] },
    ],
    check: { question: 'Your turn: solve −4 = x + 7. Which property do you use?', answer: t`\begin{array}{rcrr}-4&=&x&+7\\\underline{-7}&&&\underline{-7}\\-11&=&x&\end{array}\qquad\begin{aligned}x&=-11\end{aligned}`, explanation: 'Subtract 7 from both sides: Subtraction Property of Equality. This gives −11 = x. Use the Symmetric Property to write x = −11. Check: −11 + 7 = −4.' },
    practiceApp: '/apps/one-step-solver',
  },
  {
    course: 'precalculus', unitSlug: 'unit-1', slug: 'rectangular-coordinates', title: 'Rectangular coordinates', unit: 'Unit 1', number: 'Lesson 1 · Section 1.1',
    description: 'Give every point a place. Use coordinates to describe position, measure distance, and find the halfway point.',
    prerequisites: 'Signed numbers, absolute value, simplifying square roots, and the Pythagorean Theorem.',
    goals: ['Plot ordered pairs and identify quadrants and axes.', 'Use distance and midpoint formulas, including exact radical answers.', 'Verify right triangles and interpret coordinates in real situations.'],
    concepts: [
      { title: 'An ordered pair gives two directions.', text: 'In (x, y), move horizontally first and vertically second. Positive x moves right; negative x moves left. Positive y moves up; negative y moves down. The origin is (0, 0).', formula: t`\mathrm{I}:(+,+)\quad\mathrm{II}:(-,+)\quad\mathrm{III}:(-,-)\quad\mathrm{IV}:(+,-)`, note: 'A point on either axis is not in a quadrant. Points (0, y) lie on the y-axis; points (x, 0) lie on the x-axis.' },
      { title: 'Distance comes from a right triangle.', text: 'The horizontal and vertical changes form the legs of a right triangle. Use the Pythagorean Theorem to find the straight-line distance. Square each change before adding; do not add the changes first.', formula: t`d=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}`, note: 'Simplify the radical completely. For this practice sheet, give a two-decimal approximation when the radical cannot be simplified further.' },
      { title: 'A midpoint is an average in each direction.', text: 'Average the x-coordinates together, then average the y-coordinates together. Keep the answer as an ordered pair. In an application, interpret both coordinates and include units.', formula: t`M=\left(\frac{x_1+x_2}{2},\frac{y_1+y_2}{2}\right)` },
    ],
    videos: [
      { id: 'TkRdszaMwH8', title: 'The rectangular coordinate system and plotting', author: 'Professor Leonard' },
      { id: 'nyZuite17Pc', title: 'Distance formula', author: 'Khan Academy' },
      { id: 'Ez_-RwV9WVo', title: 'Midpoint formula', author: 'Khan Academy' },
    ],
    materials: [
      { file: 'precalculus/rectangular-coordinates/notes.pdf', title: 'Blank notes', description: 'Coordinate vocabulary, distance, midpoint, and applications.', pages: 2, kind: 'NOTES' },
      { file: 'precalculus/rectangular-coordinates/completed-notes.pdf', title: 'Completed notes', description: 'The annotated classroom lesson and worked examples.', pages: 2, kind: 'WORKED NOTES' },
      { file: 'precalculus/rectangular-coordinates/practice.pdf', title: 'Practice', description: '18 problems across plotting, distance, midpoint, and applications.', pages: 2, kind: 'TRY IT YOURSELF' },
      { file: 'precalculus/rectangular-coordinates/completed-practice.pdf', title: 'Completed practice', description: 'A complete checked answer guide, including plotting and the correction to problem 7.', pages: 3, kind: 'ANSWER GUIDE' },
    ],
    examples: [
      { id: 'plot', title: 'Plot a point and identify its quadrant', category: 'GROUP A · PRACTICE 1–6', prompt: 'Plot (3, −5), then name its quadrant.', points: [{ x: 3, y: -5, label: 'A (3, −5)' }], steps: [
        { math: t`(x,y)=(3,-5)`, explanation: 'Start at the origin. The first coordinate controls horizontal movement.' },
        { math: t`x=3\quad\text{(right 3)}`, explanation: 'Move 3 units right along the x-axis.' },
        { math: t`y=-5\quad\text{(down 5)}`, explanation: 'Move 5 units down. Mark the point at (3, −5).' },
        { math: t`(+,-)\ \Longrightarrow\ \boxed{\text{Quadrant IV}}`, explanation: 'Positive x and negative y place the point in the lower-right quadrant.' },
      ] },
      { id: 'axis', title: 'Recognize an axis point', category: 'GROUP A · PRACTICE 4', prompt: 'Where is (0, 7)?', steps: [
        { math: t`(0,7)`, explanation: 'The x-coordinate is zero, so there is no horizontal movement.' },
        { math: t`x=0\ \Longrightarrow\ \boxed{\text{on the }y\text{-axis}}`, explanation: 'Move up 7 units. The point is on an axis, not in a quadrant.' },
      ] },
      { id: 'context', title: 'Let the meaning of the coordinates guide you', category: 'GROUP A · PRACTICE 7', prompt: 'For h(t) = 10 + 12t + 4.9t², where do the points lie when t is elapsed time?', steps: [
        { math: t`(t,h)\quad\text{with}\quad t\ge0`, explanation: 'Elapsed time is nonnegative, so only the right half of the coordinate plane is relevant.' },
        { math: t`h(0)=10,\qquad h(t)>0\text{ for }t\ge0`, explanation: 'For the formula printed on the sheet, every term is nonnegative when t ≥ 0, and the constant term is 10.' },
        { math: t`\boxed{\text{Quadrant I for }t>0}`, explanation: 'At t = 0, the point (0, 10) is on the positive vertical axis. For positive time, both coordinates are positive.' },
      ] },
      { id: 'distance', title: 'Find a distance', category: 'GROUP B · PRACTICE 8, 10, 11', prompt: 'Find the distance between (1, 2) and (4, 6).', points: [{ x: 1, y: 2, label: 'A (1, 2)' }, { x: 4, y: 6, label: 'B (4, 6)' }], triangle: true, steps: [
        { math: t`\Delta x=4-1=3,\quad\Delta y=6-2=4`, explanation: 'Find the horizontal and vertical changes. These are the legs of a right triangle.' },
        { math: t`d=\sqrt{(4-1)^2+(6-2)^2}`, explanation: 'Substitute into the Distance Formula.' },
        { math: t`\begin{aligned}d&=\sqrt{3^2+4^2}\\d&=\sqrt{25}\\d&=\boxed{5}\end{aligned}`, explanation: 'Square, add, and take the square root. Distance is nonnegative.' },
      ] },
      { id: 'radical', title: 'Simplify a radical—or approximate at the end', category: 'GROUP B · PRACTICE 9 + NOTES WARM-UP', prompt: 'Compare √72 with the distance from (−3, 1) to (2, −1).', steps: [
        { math: t`\begin{aligned}\sqrt{72}&=\sqrt{36\cdot2}\\&=\boxed{6\sqrt2}\end{aligned}`, explanation: 'Look for a perfect-square factor. This radical simplifies, so keep the simplified exact form.' },
        { math: t`d=\sqrt{(2-(-3))^2+(-1-1)^2}`, explanation: 'For the two points, subtract carefully. A double negative becomes addition.' },
        { math: t`\begin{aligned}d&=\sqrt{25+4}\\d&=\sqrt{29}\\d&\approx\boxed{5.39}\end{aligned}`, explanation: '29 has no perfect-square factor greater than 1. Keep √29 in your work and round the final result to two decimals, as the practice directs.' },
      ] },
      { id: 'midpoint', title: 'Find the halfway point', category: 'GROUP C · PRACTICE 12–15', prompt: 'Find the midpoint of (−4, 6) and (2, −2).', steps: [
        { math: t`M=\left(\frac{x_1+x_2}{2},\frac{y_1+y_2}{2}\right)`, explanation: 'Average the horizontal coordinates and vertical coordinates separately.' },
        { math: t`M=\left(\frac{-4+2}{2},\frac{6+(-2)}{2}\right)`, explanation: 'Keep each coordinate in its own fraction.' },
        { math: t`\begin{aligned}M&=\left(\frac{-2}{2},\frac{4}{2}\right)\\M&=\boxed{(-1,2)}\end{aligned}`, explanation: 'The midpoint is an ordered pair, not a distance.' },
      ] },
      { id: 'triangle', title: 'Verify a right triangle', category: 'GROUP D · PRACTICE 16', prompt: 'Use A(1, 1), B(4, 1), and C(4, 5) to verify a right triangle.', steps: [
        { math: t`AB=|4-1|=3,\quad BC=|5-1|=4`, explanation: 'AB is horizontal and BC is vertical. Find their lengths using absolute differences.' },
        { math: t`\begin{aligned}AC&=\sqrt{(4-1)^2+(5-1)^2}\\AC&=\sqrt{9+16}\\AC&=5\end{aligned}`, explanation: 'Use the Distance Formula for the slanted side. It is the longest side.' },
        { math: t`3^2+4^2=9+16=25=5^2`, explanation: 'The side lengths satisfy a² + b² = c². By the converse of the Pythagorean Theorem, the triangle is right, with its right angle at B.' },
      ] },
      { id: 'estimate', title: 'Estimate a value using a midpoint', category: 'GROUP D · PRACTICE 17', prompt: 'Sales were $8.2 million in 2019 and $11.6 million in 2023. Estimate 2021 sales assuming a linear trend.', steps: [
        { math: t`(2019,8.2),\quad(2023,11.6)`, explanation: 'Treat the year as x and sales in millions of dollars as y.' },
        { math: t`M=\left(\frac{2019+2023}{2},\frac{8.2+11.6}{2}\right)`, explanation: '2021 is halfway between 2019 and 2023, so average the sales values.' },
        { math: t`M=(2021,9.9)`, explanation: 'The estimate is $9.9 million in 2021. This midpoint estimate relies on the stated linear-trend assumption.' },
      ] },
      { id: 'map', title: 'Turn map units into real distance', category: 'GROUP D · PRACTICE 18', prompt: 'Entrances are at (2, 3) and (14, 8). Each map unit represents 100 meters.', steps: [
        { math: t`\Delta x=14-2=12,\quad\Delta y=8-3=5`, explanation: 'First calculate distance in map units.' },
        { math: t`\begin{aligned}d&=\sqrt{12^2+5^2}\\d&=\sqrt{169}\\d&=13\end{aligned}`, explanation: 'The straight-line distance is 13 map units, not 13 meters.' },
        { math: t`13\text{ units}\cdot\frac{100\text{ m}}{1\text{ unit}}=\boxed{1300\text{ m}}`, explanation: 'Multiply by the scale factor. State the result in meters.' },
      ] },
    ],
    check: { question: 'Your turn: find the midpoint of (3, −1) and (−9, 5).', answer: t`\boxed{(-3,2)}`, explanation: 'Average x: (3 − 9)/2 = −3. Average y: (−1 + 5)/2 = 2. The midpoint is (−3, 2).' },
  },
]
// Added from individually reviewed classroom materials. Missing documents stay explicit.
const additionalAlgebraLessons: Lesson[] = [
  {
    "course": "algebra-2",
    "unitSlug": "unit-1a",
    "slug": "formula-substitution",
    "title": "Formula substitution and order of operations",
    "unit": "Unit 1A",
    "number": "Lesson 0",
    "description": "Replace variables with given values, follow the order of operations, and report answers with units.",
    "goals": [
      "Substitute values using parentheses.",
      "Choose geometry formulas and interpret units."
    ],
    "prerequisites": "Earlier lessons in this unit and signed-number arithmetic.",
    "concepts": [],
    "examples": [],
    "videos": [
      {
        "id": "AJNDeVt9UOo",
        "title": "Evaluating expressions with substitution",
        "author": "Khan Academy"
      },
      {
        "id": "tC1SfxRvtmM",
        "title": "Using substitution in a formula",
        "author": "Khan Academy"
      }
    ],
    "materials": [
      {
        "file": "algebra-2/formula-substitution/notes.pdf",
        "title": "notes",
        "description": "Selected classroom handout.",
        "kind": "notes",
        "pages": 2
      },
      {
        "file": "algebra-2/formula-substitution/completed-notes.pdf",
        "title": "completed-notes",
        "description": "Classroom annotations; some exercises are unfinished.",
        "kind": "completed-notes",
        "pages": 2,
        "label": "Classroom Notes (partial)"
      },
      {
        "file": "algebra-2/formula-substitution/practice.pdf",
        "title": "practice",
        "description": "Selected classroom handout.",
        "kind": "practice",
        "pages": 2
      },
      {
        "file": "algebra-2/formula-substitution/completed-practice.pdf",
        "title": "completed-practice",
        "description": "Classroom annotations; some exercises are unfinished.",
        "kind": "completed-practice",
        "pages": 2,
        "label": "Classroom Practice (partial)"
      }
    ]
  },
  {
    "course": "algebra-2",
    "unitSlug": "unit-1a",
    "slug": "two-step-equations",
    "title": "Two-step equations",
    "unit": "Unit 1A",
    "number": "Lesson 2",
    "description": "Undo two operations while keeping both sides of an equation balanced.",
    "goals": [
      "Solve two-step equations, including fraction coefficients.",
      "Justify operations with properties of equality."
    ],
    "prerequisites": "Earlier lessons in this unit and signed-number arithmetic.",
    "concepts": [],
    "examples": [],
    "videos": [
      {
        "id": "_y_Q3_B2Vh8",
        "title": "Solving two-step equations",
        "author": "Khan Academy"
      }
    ],
    "materials": [
      {
        "file": "algebra-2/two-step-equations/notes.pdf",
        "title": "notes",
        "description": "Selected classroom handout.",
        "kind": "notes",
        "pages": 2
      },
      {
        "file": "algebra-2/two-step-equations/completed-notes.pdf",
        "title": "completed-notes",
        "description": "Selected classroom handout.",
        "kind": "completed-notes",
        "pages": 2
      },
      {
        "file": "algebra-2/two-step-equations/practice.pdf",
        "title": "practice",
        "description": "Selected classroom handout.",
        "kind": "practice",
        "pages": 2
      },
      {
        "file": "algebra-2/two-step-equations/completed-practice.pdf",
        "title": "completed-practice",
        "description": "Selected classroom handout.",
        "kind": "completed-practice",
        "pages": 2
      }
    ]
  },
  {
    "course": "algebra-2",
    "unitSlug": "unit-1a",
    "slug": "variables-on-both-sides",
    "title": "Variables on both sides",
    "unit": "Unit 1A",
    "number": "Lesson 3",
    "description": "Combine like terms and collect variable terms before solving an equation.",
    "goals": [
      "Simplify each side before moving terms.",
      "Solve equations with a variable in more than one position."
    ],
    "prerequisites": "Earlier lessons in this unit and signed-number arithmetic.",
    "concepts": [],
    "examples": [],
    "videos": [
      {
        "id": "XoEn1LfVoTo",
        "title": "Solving a more complicated equation",
        "author": "Khan Academy"
      }
    ],
    "materials": [
      {
        "file": "algebra-2/variables-on-both-sides/notes.pdf",
        "title": "notes",
        "description": "Selected classroom handout.",
        "kind": "notes",
        "pages": 2
      },
      {
        "title": "completed-notes",
        "description": "A matching completed sheet has not been located in the shared folder.",
        "kind": "completed-notes",
        "pages": 0,
        "unavailableReason": "A matching completed sheet has not been located in the shared folder."
      },
      {
        "file": "algebra-2/variables-on-both-sides/practice.pdf",
        "title": "practice",
        "description": "Selected classroom handout.",
        "kind": "practice",
        "pages": 2
      },
      {
        "file": "algebra-2/variables-on-both-sides/completed-practice.pdf",
        "title": "completed-practice",
        "description": "Selected classroom handout.",
        "kind": "completed-practice",
        "pages": 2
      }
    ]
  },
  {
    "course": "algebra-2",
    "unitSlug": "unit-1a",
    "slug": "distributive-property",
    "title": "The distributive property",
    "unit": "Unit 1A",
    "number": "Lesson 4",
    "description": "Distribute to every term, simplify, and solve the resulting equation.",
    "goals": [
      "Distribute positive, negative, and fractional factors.",
      "Combine like terms and solve multi-step equations."
    ],
    "prerequisites": "Earlier lessons in this unit and signed-number arithmetic.",
    "concepts": [],
    "examples": [],
    "videos": [
      {
        "id": "YZBStgZGyDY",
        "title": "Solving equations with the distributive property",
        "author": "Khan Academy"
      }
    ],
    "materials": [
      {
        "file": "algebra-2/distributive-property/notes.pdf",
        "title": "notes",
        "description": "Selected classroom handout.",
        "kind": "notes",
        "pages": 2
      },
      {
        "file": "algebra-2/distributive-property/completed-notes.pdf",
        "title": "completed-notes",
        "description": "Selected classroom handout.",
        "kind": "completed-notes",
        "pages": 2
      },
      {
        "file": "algebra-2/distributive-property/practice.pdf",
        "title": "practice",
        "description": "Selected classroom handout.",
        "kind": "practice",
        "pages": 2
      },
      {
        "file": "algebra-2/distributive-property/completed-practice.pdf",
        "title": "completed-practice",
        "description": "Selected classroom handout.",
        "kind": "completed-practice",
        "pages": 2
      }
    ]
  },
  {
    "course": "algebra-2",
    "unitSlug": "unit-1a",
    "slug": "linear-inequalities",
    "title": "Evaluate, solve, and graph inequalities",
    "unit": "Unit 1A",
    "number": "Lesson 5",
    "description": "Evaluate inequalities, solve them, and represent the solution set on a number line.",
    "goals": [
      "Reverse the inequality when multiplying or dividing by a negative.",
      "Use open or closed endpoints and the correct shading."
    ],
    "prerequisites": "Earlier lessons in this unit and signed-number arithmetic.",
    "concepts": [],
    "examples": [],
    "videos": [
      {
        "id": "y7QLay8wrW8",
        "title": "Solving a two-step inequality",
        "author": "Khan Academy"
      },
      {
        "id": "PNXozoJWsWc",
        "title": "Multiplying and dividing with inequalities",
        "author": "Khan Academy"
      }
    ],
    "materials": [
      {
        "file": "algebra-2/linear-inequalities/notes.pdf",
        "title": "notes",
        "description": "Selected classroom handout.",
        "kind": "notes",
        "pages": 2
      },
      {
        "file": "algebra-2/linear-inequalities/completed-notes.pdf",
        "title": "completed-notes",
        "description": "Classroom annotations; some exercises are unfinished.",
        "kind": "completed-notes",
        "pages": 2,
        "label": "Classroom Notes (partial)"
      },
      {
        "file": "algebra-2/linear-inequalities/practice.pdf",
        "title": "practice",
        "description": "Selected classroom handout.",
        "kind": "practice",
        "pages": 2
      },
      {
        "title": "completed-practice",
        "description": "A matching completed sheet has not been located in the shared folder.",
        "kind": "completed-practice",
        "pages": 0,
        "unavailableReason": "A matching completed sheet has not been located in the shared folder."
      }
    ]
  },
  {
    "course": "algebra-2",
    "unitSlug": "unit-1a",
    "slug": "writing-solving-equations-inequalities",
    "title": "Writing and solving equations and inequalities",
    "unit": "Unit 1A",
    "number": "Lesson 6",
    "description": "Define a variable, build an expression, and choose an equation or inequality to model a situation.",
    "goals": [
      "Distinguish exactly, at most, and at least.",
      "Solve a model and interpret the result in context."
    ],
    "prerequisites": "Earlier lessons in this unit and signed-number arithmetic.",
    "concepts": [],
    "examples": [],
    "videos": [
      {
        "id": "xKH1Evwu150",
        "title": "Linear equation word problem",
        "author": "Khan Academy"
      },
      {
        "id": "y7QLay8wrW8",
        "title": "Solving a two-step inequality",
        "author": "Khan Academy"
      }
    ],
    "materials": [
      {
        "file": "algebra-2/writing-solving-equations-inequalities/notes.pdf",
        "title": "notes",
        "description": "Selected classroom handout.",
        "kind": "notes",
        "pages": 2
      },
      {
        "file": "algebra-2/writing-solving-equations-inequalities/completed-notes.pdf",
        "title": "completed-notes",
        "description": "Selected classroom handout.",
        "kind": "completed-notes",
        "pages": 2
      },
      {
        "file": "algebra-2/writing-solving-equations-inequalities/practice.pdf",
        "title": "practice",
        "description": "Selected classroom handout.",
        "kind": "practice",
        "pages": 2
      },
      {
        "file": "algebra-2/writing-solving-equations-inequalities/completed-practice.pdf",
        "title": "completed-practice",
        "description": "Selected classroom handout.",
        "kind": "completed-practice",
        "pages": 2
      }
    ]
  },
  {
    "course": "algebra-2",
    "unitSlug": "unit-1a",
    "slug": "compound-inequalities",
    "title": "Compound inequalities",
    "unit": "Unit 1A",
    "number": "Lesson 7",
    "description": "Solve AND and OR inequalities and show their intersections or unions.",
    "goals": [
      "Solve both parts of a compound inequality.",
      "Graph the combined solution set."
    ],
    "prerequisites": "Earlier lessons in this unit and signed-number arithmetic.",
    "concepts": [],
    "examples": [],
    "videos": [
      {
        "id": "A3xPhzs-KBI",
        "title": "Compound inequalities",
        "author": "Khan Academy"
      }
    ],
    "materials": [
      {
        "file": "algebra-2/compound-inequalities/notes.pdf",
        "title": "notes",
        "description": "Selected classroom handout.",
        "kind": "notes",
        "pages": 2
      },
      {
        "file": "algebra-2/compound-inequalities/completed-notes.pdf",
        "title": "completed-notes",
        "description": "Selected classroom handout.",
        "kind": "completed-notes",
        "pages": 2
      },
      {
        "file": "algebra-2/compound-inequalities/practice.pdf",
        "title": "practice",
        "description": "Selected classroom handout.",
        "kind": "practice",
        "pages": 2
      },
      {
        "file": "algebra-2/compound-inequalities/completed-practice.pdf",
        "title": "completed-practice",
        "description": "Selected classroom handout.",
        "kind": "completed-practice",
        "pages": 2
      }
    ]
  },
  {
    "course": "algebra-2",
    "unitSlug": "unit-1a",
    "slug": "compound-inequality-applications",
    "title": "Writing compound inequalities",
    "unit": "Unit 1A",
    "number": "Lesson 8",
    "description": "Translate real-world limits into compound inequalities and simplify special cases.",
    "goals": [
      "Write inside intervals with AND and outside intervals with OR.",
      "Recognize overlapping sets, no solution, and all real numbers."
    ],
    "prerequisites": "Earlier lessons in this unit and signed-number arithmetic.",
    "concepts": [],
    "examples": [],
    "videos": [
      {
        "id": "A3xPhzs-KBI",
        "title": "Compound inequalities",
        "author": "Khan Academy"
      }
    ],
    "materials": [
      {
        "file": "algebra-2/compound-inequality-applications/notes.pdf",
        "title": "notes",
        "description": "Selected classroom handout.",
        "kind": "notes",
        "pages": 2
      },
      {
        "file": "algebra-2/compound-inequality-applications/completed-notes.pdf",
        "title": "completed-notes",
        "description": "Selected classroom handout.",
        "kind": "completed-notes",
        "pages": 2
      },
      {
        "file": "algebra-2/compound-inequality-applications/practice.pdf",
        "title": "practice",
        "description": "Selected classroom handout.",
        "kind": "practice",
        "pages": 2
      },
      {
        "file": "algebra-2/compound-inequality-applications/completed-practice.pdf",
        "title": "completed-practice",
        "description": "Classroom annotations; some exercises are unfinished.",
        "kind": "completed-practice",
        "pages": 2,
        "label": "Classroom Practice (partial)"
      }
    ]
  },
  {
    "course": "algebra-2",
    "unitSlug": "unit-1a",
    "slug": "absolute-value-equations",
    "title": "Absolute value equations",
    "unit": "Unit 1A",
    "number": "Lesson 9",
    "description": "Interpret absolute value as distance, isolate the absolute value, and solve both cases.",
    "goals": [
      "Solve absolute value equations and check both candidates.",
      "Recognize two, one, or no solutions."
    ],
    "prerequisites": "Earlier lessons in this unit and signed-number arithmetic.",
    "concepts": [],
    "examples": [],
    "videos": [
      {
        "id": "frBJEYvyd-8",
        "title": "Absolute value and number lines",
        "author": "Khan Academy"
      },
      {
        "id": "u6zDpUL5RkU",
        "title": "Absolute value equations",
        "author": "Khan Academy"
      }
    ],
    "materials": [
      {
        "file": "algebra-2/absolute-value-equations/notes.pdf",
        "title": "notes",
        "description": "Selected classroom handout.",
        "kind": "notes",
        "pages": 2
      },
      {
        "title": "completed-notes",
        "description": "The available classroom notes use an earlier worksheet; a matching key for these revised notes has not been located.",
        "kind": "completed-notes",
        "pages": 0,
        "unavailableReason": "The available classroom notes use an earlier worksheet; a matching key for these revised notes has not been located."
      },
      {
        "file": "algebra-2/absolute-value-equations/practice.pdf",
        "title": "practice",
        "description": "Selected classroom handout.",
        "kind": "practice",
        "pages": 2
      },
      {
        "file": "algebra-2/absolute-value-equations/completed-practice.pdf",
        "title": "completed-practice",
        "description": "Selected classroom handout.",
        "kind": "completed-practice",
        "pages": 2
      }
    ]
  },
  {
    "course": "algebra-2",
    "unitSlug": "unit-1a",
    "slug": "absolute-value-inequalities",
    "title": "Absolute value inequalities",
    "unit": "Unit 1A",
    "number": "Lesson 10",
    "description": "Use distance to decide whether an absolute value inequality describes an inside or outside interval.",
    "goals": [
      "Isolate absolute value before splitting into cases.",
      "Solve and graph absolute value inequalities, including special cases."
    ],
    "prerequisites": "Earlier lessons in this unit and signed-number arithmetic.",
    "concepts": [],
    "examples": [],
    "videos": [
      {
        "id": "ZJvOGkykJ44",
        "title": "Absolute Value Inequalities - How To Solve It",
        "author": "The Organic Chemistry Tutor"
      }
    ],
    "materials": [
      {
        "file": "algebra-2/absolute-value-inequalities/notes.pdf",
        "title": "notes",
        "description": "Selected classroom handout.",
        "kind": "notes",
        "pages": 2
      },
      {
        "file": "algebra-2/absolute-value-inequalities/completed-notes.pdf",
        "title": "completed-notes",
        "description": "Selected classroom handout.",
        "kind": "completed-notes",
        "pages": 2
      },
      {
        "file": "algebra-2/absolute-value-inequalities/practice.pdf",
        "title": "practice",
        "description": "Selected classroom handout.",
        "kind": "practice",
        "pages": 2
      },
      {
        "file": "algebra-2/absolute-value-inequalities/completed-practice.pdf",
        "title": "completed-practice",
        "description": "Selected classroom handout.",
        "kind": "completed-practice",
        "pages": 2
      }
    ]
  },
  {
    "course": "algebra-2",
    "unitSlug": "unit-1b",
    "slug": "function-notation",
    "title": "Function notation",
    "unit": "Unit 1B",
    "number": "Lesson 1",
    "description": "Read function notation and evaluate functions at numbers or variable expressions.",
    "goals": [
      "Identify inputs and outputs.",
      "Substitute numbers and expressions using proper function notation."
    ],
    "prerequisites": "Earlier lessons in this unit and signed-number arithmetic.",
    "concepts": [],
    "examples": [],
    "videos": [
      {
        "id": "kvGsIo1TmsM",
        "title": "What is a function?",
        "author": "Khan Academy"
      },
      {
        "id": "E9YEUQR9NAU",
        "title": "Evaluating Functions",
        "author": "Khan Academy"
      }
    ],
    "materials": [
      {
        "file": "algebra-2/function-notation/notes.pdf",
        "title": "notes",
        "description": "Selected classroom handout.",
        "kind": "notes",
        "pages": 2
      },
      {
        "file": "algebra-2/function-notation/completed-notes.pdf",
        "title": "completed-notes",
        "description": "Selected classroom handout.",
        "kind": "completed-notes",
        "pages": 2
      },
      {
        "file": "algebra-2/function-notation/practice.pdf",
        "title": "practice",
        "description": "Selected classroom handout.",
        "kind": "practice",
        "pages": 2
      },
      {
        "file": "algebra-2/function-notation/completed-practice.pdf",
        "title": "completed-practice",
        "description": "Selected classroom handout.",
        "kind": "completed-practice",
        "pages": 2
      }
    ]
  },
  {
    "course": "algebra-2",
    "unitSlug": "unit-1b",
    "slug": "slope-rate-of-change",
    "title": "Slope and rate of change",
    "unit": "Unit 1B",
    "number": "Lesson 2",
    "description": "Find slope and average rate of change using points, graphs, tables, and formulas.",
    "goals": [
      "Distinguish positive, negative, zero, and undefined slope.",
      "Calculate average rate of change over an interval and interpret its units."
    ],
    "prerequisites": "Earlier lessons in this unit and signed-number arithmetic.",
    "concepts": [],
    "examples": [],
    "videos": [
      {
        "id": "MeU-KzdCBps",
        "title": "Introduction to slope",
        "author": "Khan Academy"
      },
      {
        "id": "TEXSW-o8674",
        "title": "Average rate of change from a graph",
        "author": "Khan Academy"
      },
      {
        "id": "U1lQbh21y1k",
        "title": "Average rate of change from a table",
        "author": "Khan Academy"
      }
    ],
    "materials": [
      {
        "file": "algebra-2/slope-rate-of-change/notes.pdf",
        "title": "notes",
        "description": "Selected classroom handout.",
        "kind": "notes",
        "pages": 2
      },
      {
        "title": "completed-notes",
        "description": "A matching completed sheet has not been located in the shared folder.",
        "kind": "completed-notes",
        "pages": 0,
        "unavailableReason": "A matching completed sheet has not been located in the shared folder."
      },
      {
        "file": "algebra-2/slope-rate-of-change/practice.pdf",
        "title": "practice",
        "description": "Selected classroom handout.",
        "kind": "practice",
        "pages": 2
      },
      {
        "title": "completed-practice",
        "description": "A matching completed sheet has not been located in the shared folder.",
        "kind": "completed-practice",
        "pages": 0,
        "unavailableReason": "A matching completed sheet has not been located in the shared folder."
      }
    ],
    "practiceApp": "/apps/slope"
  }
]
const functionNotation = additionalAlgebraLessons.find(lesson => lesson.slug === 'function-notation')!
const functionNotationPractice: Lesson = {
  ...functionNotation,
  slug: 'function-notation-practice-2', title: 'Function notation — More practice 2', number: 'Practice 2',
  followUpOf: 'function-notation', sortOrder: 1.5,
  description: 'More practice with function notation following Lesson 1. Review the lesson videos and compare your work with the completed handout.',
  materials: [
    { ...functionNotation.materials[0], label: 'Lesson 1 Blank Notes' },
    { ...functionNotation.materials[1], label: 'Lesson 1 Completed Notes' },
    { file: 'algebra-2/function-notation/practice-2.pdf', label: 'Blank Practice 2', title: 'Blank Practice 2', description: 'Blank second Function Notation practice, problems 1-23.', kind: 'practice', pages: 2 },
    { file: 'algebra-2/function-notation/completed-practice-2.pdf', label: 'Completed Practice 2', title: 'Completed Practice 2', description: 'Second Function Notation practice with classroom solutions, problems 1-23.', kind: 'completed-practice', pages: 2 },
  ],
}
export const lessons: Lesson[] = [...originalLessons, ...additionalAlgebraLessons, functionNotationPractice, ...precalculusLessons].sort((a, b) =>
  a.course.localeCompare(b.course) || a.unitSlug.localeCompare(b.unitSlug) ||
  (a.sortOrder ?? Number(a.number.match(/\d+/)?.[0] ?? 0)) - (b.sortOrder ?? Number(b.number.match(/\d+/)?.[0] ?? 0))
)
export function getLesson(course: string, slug: string) { return lessons.find(l => l.course === course && l.slug === slug) }
