export default function AssignmentsPage() {
  const assignments = [
    {
      id: 'unit1a',
      title: 'Unit 1A: Foundations of Algebra 2 - Part 1',
      description: 'Review essential algebra skills and introduce advanced concepts',
      dueDate: '2025-08-15',
      status: 'completed',
      topics: ['Solving equations', 'Graphing basics', 'Function notation', 'Domain and range']
    },
    {
      id: 'unit1b',
      title: 'Unit 1B: Foundations of Algebra 2 - Part 2',
      description: 'Advanced algebraic techniques and function transformations',
      dueDate: '2025-08-25',
      status: 'completed',
      topics: ['Function transformations', 'Inverse functions', 'Composition of functions', 'Piecewise functions']
    },
    {
      id: 'unit2',
      title: 'Unit 2: Quadratic Functions',
      description: 'Exploring parabolas, vertex form, and graphing quadratics',
      dueDate: '2025-09-05',
      status: 'current',
      topics: ['Standard form', 'Vertex form', 'Graphing parabolas', 'Axis of symmetry', 'Maximum/minimum values']
    },
    {
      id: 'unit3',
      title: 'Unit 3: Quadratic Equations',
      description: 'Solving quadratic equations using various methods',
      dueDate: '2025-09-15',
      status: 'upcoming',
      topics: ['Factoring', 'Quadratic formula', 'Completing the square', 'Discriminant', 'Complex solutions']
    },
    {
      id: 'unit4a',
      title: 'Unit 4A: Polynomial Functions - Part 1',
      description: 'Introduction to polynomial functions and their properties',
      dueDate: '2025-09-25',
      status: 'upcoming',
      topics: ['Polynomial basics', 'End behavior', 'Zeros and factors', 'Graphing polynomials']
    },
    {
      id: 'unit4b',
      title: 'Unit 4B: Polynomial Functions - Part 2',
      description: 'Advanced polynomial operations and applications',
      dueDate: '2025-10-05',
      status: 'upcoming',
      topics: ['Polynomial division', 'Remainder theorem', 'Rational root theorem', 'Real-world applications']
    }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Assignments</h2>
        <p className="text-lg text-gray-600">
          Complete assignments to master Algebra 2 concepts
        </p>
      </div>

      <div className="grid gap-6">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="assignment-card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {assignment.title}
                </h3>
                <p className="text-gray-600 mb-3">{assignment.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                assignment.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : assignment.status === 'current'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {assignment.status}
              </span>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Topics Covered:</h4>
              <div className="flex flex-wrap gap-2">
                {assignment.topics.map((topic, index) => (
                  <span 
                    key={index}
                    className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
              <a
                href={`/assignments/${assignment.id}`}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  assignment.status === 'upcoming'
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {assignment.status === 'completed' ? 'Review' : 
                 assignment.status === 'current' ? 'Start Assignment' : 'Coming Soon'}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
