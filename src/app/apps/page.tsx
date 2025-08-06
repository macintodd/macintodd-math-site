export default function AppsPage() {
  const mathApps = [
    {
      id: 'factoring',
      title: 'Factoring Practice',
      description: 'Interactive tool to practice factoring quadratic expressions',
      difficulty: 'Intermediate',
      unit: 'Unit 3',
      icon: '🧮',
      available: true
    },
    {
      id: 'quadratic-formula',
      title: 'Quadratic Formula Calculator',
      description: 'Step-by-step solver for quadratic equations',
      difficulty: 'Intermediate',
      unit: 'Unit 3',
      icon: '📐',
      available: true
    },
    {
      id: 'graphing-lines',
      title: 'Linear Function Grapher',
      description: 'Interactive graphing tool for linear functions',
      difficulty: 'Beginner',
      unit: 'Unit 1',
      icon: '📈',
      available: true
    },
    {
      id: 'systems-solver',
      title: 'Systems of Equations Solver',
      description: 'Visual solver for systems of linear equations',
      difficulty: 'Intermediate',
      unit: 'Unit 2',
      icon: '⚖️',
      available: true
    },
    {
      id: 'exponential-growth',
      title: 'Exponential Growth Simulator',
      description: 'Explore exponential functions and real-world applications',
      difficulty: 'Advanced',
      unit: 'Unit 4',
      icon: '📊',
      available: false
    },
    {
      id: 'polynomial-operations',
      title: 'Polynomial Calculator',
      description: 'Practice adding, subtracting, and multiplying polynomials',
      difficulty: 'Intermediate',
      unit: 'Unit 5',
      icon: '🔢',
      available: false
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Math Apps</h2>
        <p className="text-lg text-gray-600">
          Interactive tools to practice and master Algebra 2 concepts
        </p>
      </div>

      {/* Filter/Stats Section */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div>
            <h3 className="text-2xl font-bold text-blue-600">
              {mathApps.filter(app => app.available).length}
            </h3>
            <p className="text-gray-600">Available Apps</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-green-600">
              {mathApps.filter(app => app.available && app.difficulty === 'Beginner').length}
            </h3>
            <p className="text-gray-600">Beginner Level</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-yellow-600">
              {mathApps.filter(app => app.available && app.difficulty === 'Intermediate').length}
            </h3>
            <p className="text-gray-600">Intermediate Level</p>
          </div>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mathApps.map((app) => (
          <div 
            key={app.id} 
            className={`app-card relative ${!app.available ? 'opacity-60' : ''}`}
          >
            {!app.available && (
              <div className="absolute top-4 right-4">
                <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs">
                  Coming Soon
                </span>
              </div>
            )}
            
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{app.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{app.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{app.description}</p>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                {app.unit}
              </span>
              <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(app.difficulty)}`}>
                {app.difficulty}
              </span>
            </div>

            <div className="text-center">
              {app.available ? (
                <a
                  href={`/apps/${app.id}`}
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Launch App
                </a>
              ) : (
                <button
                  disabled
                  className="bg-gray-300 text-gray-500 px-4 py-2 rounded cursor-not-allowed"
                >
                  Coming Soon
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Help Section */}
      <div className="math-container">
        <h3 className="text-xl font-bold mb-4">How to Use Math Apps</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Getting Started:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Click "Launch App" to open an interactive tool</li>
              <li>• Follow the on-screen instructions</li>
              <li>• Practice as many problems as you need</li>
              <li>• Your progress is automatically saved</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Tips for Success:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Start with easier difficulty levels</li>
              <li>• Take your time to understand each step</li>
              <li>• Use the hints when you get stuck</li>
              <li>• Review related assignment material</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
