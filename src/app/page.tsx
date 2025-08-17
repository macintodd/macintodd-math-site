import { getUnitsWithStatus, CURRENT_UNIT, UNITS } from '../config/units'

export default function Home() {
  const unitsWithStatus = getUnitsWithStatus()
  const currentUnit = UNITS.find(unit => unit.id === CURRENT_UNIT)
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="text-center py-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Algebra 2
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Lesson Videos, Assignments, and Practice Apps
        </p>
        <div className="flex justify-center space-x-4">
          <a 
            href="/assignments" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Assignments
          </a>
          <a 
            href="/apps" 
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Practice Apps
          </a>
        </div>
      </section>

      {/* Quick Links */}
      <section className="grid md:grid-cols-4 gap-6">
        <div className="assignment-card">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Latest Assignment</h3>
          <p className="text-gray-600 mb-4">Unit {currentUnit?.unit}: {currentUnit?.title}</p>
          <a href={`/assignments/unit${currentUnit?.id?.toLowerCase()}`} className="text-blue-600 hover:text-blue-800">
            View Assignment →
          </a>
        </div>

        <div className="app-card">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Practice App</h3>
          <p className="text-gray-600 mb-4">Factoring Quadratics</p>
          <a href="/apps/factoring" className="text-green-600 hover:text-green-800">
            Start Practice →
          </a>
        </div>

        <div className="math-container">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Your Progress</h3>
          <p className="text-gray-600 mb-4">Track your learning journey</p>
          <a href="/progress" className="text-blue-600 hover:text-blue-800">
            View Progress →
          </a>
        </div>

        <div className="resource-card bg-purple-50 border-2 border-purple-300 rounded-lg p-6 flex flex-col justify-between">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Teaching Resources</h3>
          <p className="text-gray-700 mb-4">Tools for teachers and worksheet creation</p>
          <a href="/resources" className="text-purple-700 hover:underline font-medium mt-auto">
            Go to Resources →
          </a>
        </div>
      </section>

      {/* Recent Units */}
      <section>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Course Units</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {unitsWithStatus.map((unit) => (
            <div 
              key={unit.unit}
              className={`p-4 rounded-lg border-2 ${
                unit.status === 'current' 
                  ? 'border-blue-500 bg-blue-50' 
                  : unit.status === 'completed'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <h4 className="font-bold">Unit {unit.unit}</h4>
              <p className="text-sm text-gray-600">{unit.title}</p>
              <span className={`text-xs px-2 py-1 rounded ${
                unit.status === 'current' 
                  ? 'bg-blue-200 text-blue-800' 
                  : unit.status === 'completed'
                  ? 'bg-green-200 text-green-800'
                  : 'bg-gray-200 text-gray-800'
              }`}>
                {unit.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
