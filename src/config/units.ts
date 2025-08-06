// Centralized unit configuration
// Only update the CURRENT_UNIT to change status across the entire site

export const CURRENT_UNIT = '1A'

export const UNITS = [
  {
    id: '1A',
    unit: '1A',
    title: 'Foundations of Algebra 2 - Part 1',
    description: 'Review essential algebra skills and introduce advanced concepts',
    dueDate: '2025-08-15',
    topics: ['Solving equations', 'Graphing basics', 'Function notation', 'Domain and range']
  },
  {
    id: '1B',
    unit: '1B',
    title: 'Foundations of Algebra 2 - Part 2',
    description: 'Advanced algebraic techniques and function transformations',
    dueDate: '2025-08-25',
    topics: ['Function transformations', 'Inverse functions', 'Composition of functions', 'Piecewise functions']
  },
  {
    id: '2',
    unit: '2',
    title: 'Quadratic Functions',
    description: 'Exploring parabolas, vertex form, and graphing quadratics',
    dueDate: '2025-09-05',
    topics: ['Standard form', 'Vertex form', 'Graphing parabolas', 'Axis of symmetry', 'Maximum/minimum values']
  },
  {
    id: '3',
    unit: '3',
    title: 'Quadratic Equations',
    description: 'Solving quadratic equations using various methods',
    dueDate: '2025-09-15',
    topics: ['Factoring', 'Quadratic formula', 'Completing the square', 'Discriminant', 'Complex solutions']
  },
  {
    id: '4A',
    unit: '4A',
    title: 'Polynomial Functions - Part 1',
    description: 'Introduction to polynomial functions and their properties',
    dueDate: '2025-09-25',
    topics: ['Polynomial basics', 'End behavior', 'Zeros and factors', 'Graphing polynomials']
  },
  {
    id: '4B',
    unit: '4B',
    title: 'Polynomial Functions - Part 2',
    description: 'Advanced polynomial operations and applications',
    dueDate: '2025-10-05',
    topics: ['Polynomial division', 'Remainder theorem', 'Rational root theorem', 'Real-world applications']
  },
  {
    id: '5',
    unit: '5',
    title: 'Rational Exponents & Radical Functions',
    description: 'Working with radical expressions and rational exponents',
    dueDate: '2025-10-15',
    topics: ['Radical expressions', 'Rational exponents', 'Solving radical equations', 'Function transformations']
  },
  {
    id: '6',
    unit: '6',
    title: 'Exponential & Logarithmic Functions',
    description: 'Exploring exponential growth and logarithmic relationships',
    dueDate: '2025-10-25',
    topics: ['Exponential functions', 'Logarithmic functions', 'Properties of logs', 'Applications']
  }
]

// Helper function to get unit status based on current unit
export function getUnitStatus(unitId: string): 'completed' | 'current' | 'upcoming' {
  const currentIndex = UNITS.findIndex(unit => unit.id === CURRENT_UNIT)
  const unitIndex = UNITS.findIndex(unit => unit.id === unitId)
  
  if (unitIndex < currentIndex) {
    return 'completed'
  } else if (unitIndex === currentIndex) {
    return 'current'
  } else {
    return 'upcoming'
  }
}

// Get units with their calculated status
export function getUnitsWithStatus() {
  return UNITS.map(unit => ({
    ...unit,
    status: getUnitStatus(unit.id)
  }))
}
