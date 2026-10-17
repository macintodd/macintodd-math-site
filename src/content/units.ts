import type { CourseId } from './lessons'

export type Unit = {
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
    introduction: 'Use the rules of arithmetic to explain, represent, and solve problems. These foundations support the equations, inequalities, and functions that follow in Algebra 2.',
    skills: [
      'Evaluate expressions accurately with signed numbers and fractions.',
      'Use inverse operations to isolate a variable and justify each step.',
      'Check a solution by substituting it into the original equation.',
      'Connect a mathematical statement to the quantities in a real situation.',
    ],
    relevance: [
      { title: 'Make a budget', text: 'An equation can represent a starting balance, a purchase, and the money left over. Working backward helps you find an unknown cost or how much you need to save.' },
      { title: 'Compare prices and rates', text: 'Multiplication and division connect a total price to a price per item, or a distance to a travel time. Solving for a missing quantity makes comparisons more useful.' },
      { title: 'Understand a formula', text: 'Formulas connect measurements in science, construction, cooking, and everyday planning. Knowing what each variable means helps you choose the right operation and check whether an answer is reasonable.' },
    ],
  },
  {
    course: 'precalculus',
    slug: 'unit-1',
    number: '1',
    title: 'Coordinates, Graphs & Functions',
    introduction: 'Connect algebraic information to a visual picture. Begin with position, distance, and midpoint, then use graphs and functions to describe how quantities relate.',
    skills: [
      'Read and plot ordered pairs, including points on an axis.',
      'Use distance and midpoint to describe a segment in the coordinate plane.',
      'Relate horizontal and vertical changes to the Pythagorean Theorem.',
      'Interpret a graph’s coordinates and units in the context of a situation.',
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
