import type { CourseId } from './lessons'

export type Unit = {
  current?: boolean
  course: CourseId
  slug: string
  number: string
  title: string
  introduction: string
  skills: string[]
  relevance: { title: string; text: string }[]
}

// Add units to the contents only when their first lesson is ready to publish.
export const units: Unit[] = [
  {
    course: 'algebra-2',
    slug: 'unit-1a',
    number: '1A',
    title: 'Foundations of Algebra 2',
    introduction: 'Build from formula substitution and one-step equations to multi-step equations, compound inequalities, and absolute value. Explain your steps, graph solution sets, and use algebra to describe real situations.',
    skills: [
      'Evaluate expressions accurately with signed numbers and fractions.',
      'Use inverse operations to isolate a variable and justify each step.',
      'Check a solution by substituting it into the original equation.',
      'Connect a mathematical statement to the quantities in a real situation.',
      'Solve and graph linear, compound, and absolute value inequalities.',
      'Model real-world limits and interpret solution sets.',
    ],
    relevance: [
      { title: 'Make a budget', text: 'An equation can represent a starting balance, a purchase, and the money left over. Working backward helps you find an unknown cost or how much you need to save.' },
      { title: 'Compare prices and rates', text: 'Multiplication and division connect a total price to a price per item, or a distance to a travel time. Solving for a missing quantity makes comparisons more useful.' },
      { title: 'Understand a formula', text: 'Formulas connect measurements in science, construction, cooking, and everyday planning. Knowing what each variable means helps you choose the right operation and check whether an answer is reasonable.' },
    ],
  },
{
  "course": "algebra-2",
  "slug": "unit-1b",
  "current": true,
  "number": "1B",
  "title": "Functions, Slope & Rate of Change",
  "introduction": "Connect the equations and inequalities from Unit 1A to functions. Use function notation to track inputs and outputs, then describe how quantities change using slope and average rate of change.",
  "skills": [
    "Read function notation and evaluate functions at numerical or algebraic inputs.",
    "Recognize how inputs, outputs, domain, and range describe a situation.",
    "Find slope from points and graphs, including horizontal and vertical lines.",
    "Calculate average rate of change from a formula, graph, or table and interpret the units."
  ],
  "relevance": [
    {
      "title": "Compare service plans",
      "text": "A function can connect data use or miles traveled to total cost. Its rate of change tells you the charge for one additional unit."
    },
    {
      "title": "Describe a trend",
      "text": "A table or graph can record savings, population, or water levels. Average rate of change tells you how quickly the quantity rises or falls over an interval."
    },
    {
      "title": "Make a prediction",
      "text": "Function notation keeps inputs and outputs clear when using a model. Check the domain and units before interpreting a prediction."
    }
  ]
},
  {
    course: 'precalculus',
    slug: 'unit-1',
    current: true,
    number: '1',
    title: 'Coordinates, Graphs & Functions',
    introduction: 'Connect algebraic information to a visual picture. Begin with position, distance, and midpoint, then use graphs and functions to describe how quantities relate.',
    skills: [
      'Read and plot ordered pairs, including points on an axis.',
      'Use distance and midpoint to describe a segment in the coordinate plane.',
      'Relate horizontal and vertical changes to the Pythagorean Theorem.',
      'Interpret a graph’s coordinates and units in the context of a situation.',
      'Sketch equations, use intercepts and symmetry, and model with lines and circles.',
      'Evaluate functions at numbers and expressions and find their domains and ranges.',
      'Describe zeros, increasing and decreasing intervals, and relative extrema.',
      'Interpret average rate of change and identify even and odd functions.',
    ],
    relevance: [
      { title: 'Read a map', text: 'Coordinates describe where something is. Distance and scale help estimate how far apart two places are; a midpoint identifies a location halfway between them.' },
      { title: 'Make sense of data', text: 'Graphs can show time and temperature, a trip’s distance, or changing sales. Reading the axes and units turns a picture into useful information.' },
      { title: 'Design and plan', text: 'Coordinates are used to place objects in digital drawings, games, and construction plans. Distance, midpoint, and right triangles help organize a design precisely.' },
    ],
  },
]
export function getUnit(course: string, slug: string) {
  return units.find(unit => unit.course === course && unit.slug === slug)
}
