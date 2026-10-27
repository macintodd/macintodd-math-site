import type { Lesson } from "./lessons"

export type VocabularyTerm = { id: string; term: string; definition: string }

export const vocabulary: Record<string, VocabularyTerm> = {
  "variable": {
    "id": "variable",
    "term": "Variable",
    "definition": "A letter or symbol that represents a number whose value may vary or be unknown."
  },
  "constant": {
    "id": "constant",
    "term": "Constant",
    "definition": "A value that does not change in the expression or situation being considered."
  },
  "coefficient": {
    "id": "coefficient",
    "term": "Coefficient",
    "definition": "A number multiplying a variable or variable expression. In −3x, the coefficient of x is −3."
  },
  "term": {
    "id": "term",
    "term": "Term",
    "definition": "A part of an expression separated by addition or subtraction. In 3x − 5, the terms are 3x and −5."
  },
  "expression": {
    "id": "expression",
    "term": "Expression",
    "definition": "Numbers, variables, and operations combined without an equality or inequality statement."
  },
  "equation": {
    "id": "equation",
    "term": "Equation",
    "definition": "A statement that two expressions have the same value."
  },
  "solution": {
    "id": "solution",
    "term": "Solution",
    "definition": "A value that makes an equation or inequality true when substituted for the variable."
  },
  "inverse-operations": {
    "id": "inverse-operations",
    "term": "Inverse operations",
    "definition": "Operations that undo each other, such as addition and subtraction, or multiplication and division by the same nonzero number."
  },
  "reciprocal": {
    "id": "reciprocal",
    "term": "Reciprocal",
    "definition": "For a nonzero number a, the number 1/a. Their product is 1."
  },
  "property-of-equality": {
    "id": "property-of-equality",
    "term": "Property of equality",
    "definition": "A rule that keeps an equation true when the same number is added to, subtracted from, or multiplied on both sides, or both sides are divided by the same nonzero number."
  },
  "formula": {
    "id": "formula",
    "term": "Formula",
    "definition": "An equation expressing a relationship among quantities, such as A = lw."
  },
  "substitution": {
    "id": "substitution",
    "term": "Substitution",
    "definition": "Replacing a variable or expression with an equal value or expression."
  },
  "order-of-operations": {
    "id": "order-of-operations",
    "term": "Order of operations",
    "definition": "The agreed order for evaluating expressions: grouping, exponents, multiplication and division from left to right, then addition and subtraction from left to right."
  },
  "like-terms": {
    "id": "like-terms",
    "term": "Like terms",
    "definition": "Terms with exactly the same variable factors and exponents. For example, 3x and −2x are like terms."
  },
  "distributive-property": {
    "id": "distributive-property",
    "term": "Distributive property",
    "definition": "Multiplying a sum by a number gives the same result as multiplying each term: a(b + c) = ab + ac."
  },
  "identity": {
    "id": "identity",
    "term": "Identity",
    "definition": "An equation true for every value in its domain, such as 2(x + 1) = 2x + 2."
  },
  "contradiction": {
    "id": "contradiction",
    "term": "Contradiction",
    "definition": "A statement that cannot be true. If solving an equation produces 0 = 5, the original equation has no solution."
  },
  "inequality": {
    "id": "inequality",
    "term": "Inequality",
    "definition": "A comparison using <, >, ≤, or ≥. Multiplying or dividing both sides by a negative number reverses the inequality sign."
  },
  "solution-set": {
    "id": "solution-set",
    "term": "Solution set",
    "definition": "All values that make a statement true."
  },
  "interval-notation": {
    "id": "interval-notation",
    "term": "Interval notation",
    "definition": "A way to describe sets of real numbers with endpoints. Parentheses exclude an endpoint; brackets include it. Infinity always uses a parenthesis."
  },
  "compound-inequality": {
    "id": "compound-inequality",
    "term": "Compound inequality",
    "definition": "Two inequalities joined by “and” or “or.” An “and” solution must satisfy both; an “or” solution satisfies at least one."
  },
  "intersection": {
    "id": "intersection",
    "term": "Intersection",
    "definition": "Values common to both sets; used for an “and” compound inequality."
  },
  "union": {
    "id": "union",
    "term": "Union",
    "definition": "Values in either set or both; used for an “or” compound inequality."
  },
  "absolute-value": {
    "id": "absolute-value",
    "term": "Absolute value",
    "definition": "A number’s distance from zero on the number line, written |x|. Absolute value is never negative."
  },
  "extraneous-solution": {
    "id": "extraneous-solution",
    "term": "Extraneous solution",
    "definition": "A candidate answer produced during solving that does not satisfy the original problem; checking rejects it."
  },
  "function": {
    "id": "function",
    "term": "Function",
    "definition": "A relationship assigning exactly one output to each input in its domain. Different inputs may have the same output."
  },
  "function-notation": {
    "id": "function-notation",
    "term": "Function notation",
    "definition": "Notation such as f(x) for the output of function f at input x. It means a function value, not f multiplied by x."
  },
  "input": {
    "id": "input",
    "term": "Input",
    "definition": "A value supplied to a function; usually represented by the independent variable x."
  },
  "output": {
    "id": "output",
    "term": "Output",
    "definition": "The value produced by a function for a given input; often written y or f(x)."
  },
  "domain": {
    "id": "domain",
    "term": "Domain",
    "definition": "The set of all allowed input values of a function or relation."
  },
  "range": {
    "id": "range",
    "term": "Range",
    "definition": "The set of all output values actually produced by a function or relation."
  },
  "vertical-line-test": {
    "id": "vertical-line-test",
    "term": "Vertical line test",
    "definition": "A graph represents y as a function of x exactly when no vertical line intersects the graph more than once."
  },
  "slope": {
    "id": "slope",
    "term": "Slope",
    "definition": "The change in y divided by the corresponding nonzero change in x: m = (y₂ − y₁)/(x₂ − x₁). Vertical lines have undefined slope; horizontal lines have slope zero."
  },
  "rate-of-change": {
    "id": "rate-of-change",
    "term": "Rate of change",
    "definition": "The change in one quantity divided by the corresponding change in another, with units such as dollars per hour. A line has a constant rate of change equal to its slope."
  },
  "average-rate-of-change": {
    "id": "average-rate-of-change",
    "term": "Average rate of change",
    "definition": "The change in output over an interval divided by the change in input: [f(b) − f(a)]/(b − a), where a ≠ b. It is the slope of the secant line through the endpoints."
  },
  "ordered-pair": {
    "id": "ordered-pair",
    "term": "Ordered pair",
    "definition": "Two numbers (x, y) identifying a point: the first gives horizontal position and the second gives vertical position."
  },
  "coordinate-plane": {
    "id": "coordinate-plane",
    "term": "Coordinate plane",
    "definition": "A plane with perpendicular horizontal x- and vertical y-axes used to locate points."
  },
  "origin": {
    "id": "origin",
    "term": "Origin",
    "definition": "The point (0, 0), where the coordinate axes intersect."
  },
  "quadrant": {
    "id": "quadrant",
    "term": "Quadrant",
    "definition": "One of the four regions formed by the axes, numbered I, II, III, IV counterclockwise from the upper right. Points on an axis are not in any quadrant."
  },
  "x-intercept": {
    "id": "x-intercept",
    "term": "X intercept",
    "definition": "A point where a graph meets the x-axis, so y = 0. Its x-coordinate is also a zero of the function when the graph represents a function."
  },
  "y-intercept": {
    "id": "y-intercept",
    "term": "Y intercept",
    "definition": "A point where a graph meets the y-axis, so x = 0."
  },
  "distance-formula": {
    "id": "distance-formula",
    "term": "Distance formula",
    "definition": "The distance between (x₁, y₁) and (x₂, y₂) is √[(x₂ − x₁)² + (y₂ − y₁)²]."
  },
  "midpoint": {
    "id": "midpoint",
    "term": "Midpoint",
    "definition": "The point halfway between two points: ((x₁ + x₂)/2, (y₁ + y₂)/2)."
  },
  "circle": {
    "id": "circle",
    "term": "Circle",
    "definition": "The set of points at a fixed positive distance r from a center (h, k). Its equation is (x − h)² + (y − k)² = r²."
  },
  "symmetry": {
    "id": "symmetry",
    "term": "Symmetry",
    "definition": "A graph has symmetry when a reflection or rotation maps it onto itself. Common tests use the x-axis, y-axis, or origin."
  },
  "linear-equation": {
    "id": "linear-equation",
    "term": "Linear equation",
    "definition": "An equation whose graph is a straight line, such as Ax + By = C, where A and B are not both zero."
  },
  "slope-intercept-form": {
    "id": "slope-intercept-form",
    "term": "Slope intercept form",
    "definition": "The equation y = mx + b, where m is the slope and (0, b) is the y-intercept. Vertical lines cannot be written in this form."
  },
  "point-slope-form": {
    "id": "point-slope-form",
    "term": "Point slope form",
    "definition": "The equation y − y₁ = m(x − x₁) for a line with slope m through (x₁, y₁)."
  },
  "parallel-lines": {
    "id": "parallel-lines",
    "term": "Parallel lines",
    "definition": "Distinct lines in a plane that never intersect. Nonvertical parallel lines have equal slopes; all vertical lines are parallel to one another."
  },
  "perpendicular-lines": {
    "id": "perpendicular-lines",
    "term": "Perpendicular lines",
    "definition": "Lines meeting at a right angle. Their slopes have product −1 when both slopes are defined; a horizontal and a vertical line are also perpendicular."
  },
  "linear-model": {
    "id": "linear-model",
    "term": "Linear model",
    "definition": "A straight-line relationship used to represent a situation with a constant rate of change and a starting value."
  },
  "factor": {
    "id": "factor",
    "term": "Factor",
    "definition": "A number or expression multiplied by another to form a product. Factoring rewrites an expression as a product."
  },
  "greatest-common-factor": {
    "id": "greatest-common-factor",
    "term": "Greatest common factor",
    "definition": "The largest common numerical factor together with all variable factors shared by every term, using each variable’s smallest exponent."
  },
  "polynomial": {
    "id": "polynomial",
    "term": "Polynomial",
    "definition": "A sum of terms with real coefficients and variables raised only to nonnegative integer powers."
  },
  "zero-product-property": {
    "id": "zero-product-property",
    "term": "Zero product property",
    "definition": "If a product equals zero, at least one factor equals zero. For example, ab = 0 implies a = 0 or b = 0."
  },
  "difference-quotient": {
    "id": "difference-quotient",
    "term": "Difference quotient",
    "definition": "The expression [f(x + h) − f(x)]/h, where h ≠ 0 and the function values exist. It gives an average rate of change between x and x + h."
  },
  "increasing": {
    "id": "increasing",
    "term": "Increasing",
    "definition": "A function is increasing on an interval when its outputs get larger as inputs increase through that interval."
  },
  "decreasing": {
    "id": "decreasing",
    "term": "Decreasing",
    "definition": "A function is decreasing on an interval when its outputs get smaller as inputs increase through that interval."
  },
  "relative-extremum": {
    "id": "relative-extremum",
    "term": "Relative extremum",
    "definition": "A local maximum or minimum: an output at least as large as, or at most as large as, nearby outputs in the domain."
  },
  "absolute-extremum": {
    "id": "absolute-extremum",
    "term": "Absolute extremum",
    "definition": "An absolute maximum or minimum is the greatest or least output over the entire domain being considered. It may not exist."
  },
  "zero": {
    "id": "zero",
    "term": "Zero",
    "definition": "An input x for which f(x) = 0. On the graph, it is the x-coordinate of an x-intercept."
  },
  "even-function": {
    "id": "even-function",
    "term": "Even function",
    "definition": "A function satisfying f(−x) = f(x) for every x in its domain, with −x also in the domain. Its graph is symmetric about the y-axis."
  },
  "odd-function": {
    "id": "odd-function",
    "term": "Odd function",
    "definition": "A function satisfying f(−x) = −f(x) for every x in its domain, with −x also in the domain. Its graph is symmetric about the origin."
  },
  "graphing-window": {
    "id": "graphing-window",
    "term": "Graphing window",
    "definition": "The visible ranges of x- and y-values on a graphing calculator. A poor window can hide intercepts, turning points, or important behavior."
  }
}

const lessonTerms: Record<string, string[]> = {
  "one-step-equations": [
    "equation",
    "variable",
    "coefficient",
    "solution",
    "inverse-operations",
    "reciprocal",
    "property-of-equality"
  ],
  "formula-substitution": [
    "formula",
    "substitution",
    "variable",
    "order-of-operations",
    "expression"
  ],
  "two-step-equations": [
    "equation",
    "coefficient",
    "constant",
    "inverse-operations",
    "solution"
  ],
  "variables-on-both-sides": [
    "like-terms",
    "property-of-equality",
    "identity",
    "contradiction",
    "solution"
  ],
  "distributive-property": [
    "distributive-property",
    "term",
    "like-terms",
    "coefficient",
    "equation"
  ],
  "linear-inequalities": [
    "inequality",
    "solution-set",
    "interval-notation"
  ],
  "writing-solving-equations-inequalities": [
    "variable",
    "equation",
    "inequality",
    "solution-set",
    "linear-model"
  ],
  "compound-inequalities": [
    "compound-inequality",
    "intersection",
    "union",
    "interval-notation"
  ],
  "compound-inequality-applications": [
    "compound-inequality",
    "intersection",
    "union",
    "solution-set"
  ],
  "absolute-value-equations": [
    "absolute-value",
    "equation",
    "solution",
    "extraneous-solution"
  ],
  "absolute-value-inequalities": [
    "absolute-value",
    "inequality",
    "compound-inequality",
    "interval-notation"
  ],
  "function-notation": [
    "function",
    "function-notation",
    "input",
    "output",
    "domain",
    "range",
    "substitution"
  ],
  "function-notation-practice-2": [
    "function",
    "function-notation",
    "input",
    "output",
    "substitution"
  ],
  "slope-rate-of-change": [
    "slope",
    "rate-of-change",
    "average-rate-of-change",
    "ordered-pair",
    "linear-model"
  ],
  "algebra-review-ti84": [
    "expression",
    "order-of-operations",
    "substitution",
    "factor",
    "graphing-window"
  ],
  "rectangular-coordinates": [
    "coordinate-plane",
    "ordered-pair",
    "origin",
    "quadrant",
    "distance-formula",
    "midpoint",
    "circle"
  ],
  "graphs-of-equations": [
    "ordered-pair",
    "x-intercept",
    "y-intercept",
    "symmetry",
    "circle",
    "graphing-window"
  ],
  "linear-equations-two-variables": [
    "linear-equation",
    "slope",
    "rate-of-change",
    "slope-intercept-form",
    "point-slope-form",
    "parallel-lines",
    "perpendicular-lines",
    "linear-model"
  ],
  "explore-symmetry": [
    "symmetry",
    "even-function",
    "odd-function"
  ],
  "review-sections-1-1-to-1-3": [
    "distance-formula",
    "midpoint",
    "circle",
    "x-intercept",
    "y-intercept",
    "symmetry",
    "slope",
    "rate-of-change",
    "point-slope-form"
  ],
  "factoring-packet": [
    "factor",
    "greatest-common-factor",
    "polynomial",
    "zero-product-property"
  ],
  "expression-substitution": [
    "function-notation",
    "substitution",
    "expression",
    "difference-quotient"
  ],
  "function-notation-domain": [
    "function",
    "function-notation",
    "domain",
    "range",
    "substitution",
    "difference-quotient"
  ],
  "domain-range-graphs": [
    "domain",
    "range",
    "interval-notation",
    "vertical-line-test"
  ],
  "increasing-decreasing": [
    "increasing",
    "decreasing",
    "relative-extremum",
    "absolute-extremum",
    "zero",
    "interval-notation"
  ],
  "average-rate-even-odd": [
    "average-rate-of-change",
    "rate-of-change",
    "even-function",
    "odd-function",
    "symmetry"
  ],
  "review-analyzing-graphs": [
    "domain",
    "range",
    "increasing",
    "decreasing",
    "relative-extremum",
    "absolute-extremum",
    "zero",
    "average-rate-of-change",
    "even-function",
    "odd-function"
  ],
  "unit-1-test-review": [
    "domain",
    "range",
    "function-notation",
    "slope",
    "average-rate-of-change",
    "increasing",
    "decreasing",
    "relative-extremum",
    "even-function",
    "odd-function",
    "symmetry",
    "circle"
  ]
}

export function getLessonVocabulary(slug: string): VocabularyTerm[] {
  return (lessonTerms[slug] ?? []).map(id => vocabulary[id])
}

export function getCourseVocabulary(courseLessons: Lesson[]): VocabularyTerm[] {
  const ids = new Set(courseLessons.flatMap(lesson => (lessonTerms[lesson.slug] ?? [])))
  return [...ids].map(id => vocabulary[id]).sort((a, b) => a.term.localeCompare(b.term))
}
