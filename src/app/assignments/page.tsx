export default function AssignmentsPage() {
  const assignments = [
    {
      id: 'unit1',
      title: 'Unit 1: Linear Functions',
      description: 'Practice with linear equations, slope, and graphing',
      dueDate: '2025-08-15',
      status: 'completed',
      topics: ['Slope-intercept form', 'Point-slope form', 'Graphing lines']
    },
    {
      id: 'unit2',
      title: 'Unit 2: Systems of Equations',
      description: 'Solving systems using substitution, elimination, and graphing',
      dueDate: '2025-08-25',
      status: 'completed',
      topics: ['Substitution method', 'Elimination method', 'Graphing systems']
    },
    {
      id: 'unit3',
      title: 'Unit 3: Quadratic Functions',
      description: 'Exploring parabolas, factoring, and the quadratic formula',
      dueDate: '2025-09-05',
      status: 'current',
      topics: ['Standard form', 'Vertex form', 'Factoring', 'Quadratic formula']
    },
    {
      id: 'unit4',
      title: 'Unit 4: Exponential Functions',
      description: 'Understanding exponential growth and decay',
      dueDate: '2025-09-15',
      status: 'upcoming',
      topics: ['Exponential growth', 'Exponential decay', 'Compound interest']
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
