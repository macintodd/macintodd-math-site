export default function Unit3Assignment() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Unit 3: Quadratic Functions
        </h2>
        <p className="text-lg text-gray-600">
          Master quadratic functions, factoring, and the quadratic formula
        </p>
        <div className="mt-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Current Assignment
          </span>
        </div>
      </div>

      {/* Learning Objectives */}
      <section className="math-container">
        <h3 className="text-xl font-bold mb-4">Learning Objectives</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Understand the standard form of quadratic functions: f(x) = ax² + bx + c
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Convert between standard form and vertex form
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Factor quadratic expressions using various methods
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Solve quadratic equations using the quadratic formula
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Graph quadratic functions and identify key features
          </li>
        </ul>
      </section>

      {/* Practice Problems */}
      <section>
        <h3 className="text-2xl font-bold mb-6">Practice Problems</h3>
        
        <div className="space-y-6">
          <div className="assignment-card">
            <h4 className="text-lg font-bold mb-3">Problem Set 1: Standard Form</h4>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <p className="font-medium">1. Identify the coefficients a, b, and c:</p>
                <p className="ml-4 mt-2 font-mono">f(x) = 3x² - 7x + 2</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="font-medium">2. Find the vertex of the parabola:</p>
                <p className="ml-4 mt-2 font-mono">f(x) = 2x² + 8x - 1</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="font-medium">3. Determine the axis of symmetry:</p>
                <p className="ml-4 mt-2 font-mono">f(x) = -x² + 6x + 5</p>
              </div>
            </div>
          </div>

          <div className="assignment-card">
            <h4 className="text-lg font-bold mb-3">Problem Set 2: Factoring</h4>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <p className="font-medium">4. Factor completely:</p>
                <p className="ml-4 mt-2 font-mono">x² + 7x + 12</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="font-medium">5. Factor using difference of squares:</p>
                <p className="ml-4 mt-2 font-mono">4x² - 25</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="font-medium">6. Factor the perfect square trinomial:</p>
                <p className="ml-4 mt-2 font-mono">9x² + 12x + 4</p>
              </div>
            </div>
          </div>

          <div className="assignment-card">
            <h4 className="text-lg font-bold mb-3">Problem Set 3: Quadratic Formula</h4>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <p className="font-medium">7. Solve using the quadratic formula:</p>
                <p className="ml-4 mt-2 font-mono">2x² + 5x - 3 = 0</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="font-medium">8. Find the discriminant and determine the nature of roots:</p>
                <p className="ml-4 mt-2 font-mono">x² - 4x + 4 = 0</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Apps */}
      <section>
        <h3 className="text-2xl font-bold mb-6">Practice Apps</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <a href="/apps/factoring" className="app-card">
            <h4 className="font-bold text-lg mb-2">Factoring Practice</h4>
            <p className="text-gray-600">Interactive tool to practice factoring quadratics</p>
          </a>
          <a href="/apps/quadratic-formula" className="app-card">
            <h4 className="font-bold text-lg mb-2">Quadratic Formula Calculator</h4>
            <p className="text-gray-600">Step-by-step quadratic equation solver</p>
          </a>
        </div>
      </section>

      {/* Submit Section */}
      <section className="text-center">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-xl font-bold mb-4">Ready to Submit?</h3>
          <p className="text-gray-600 mb-4">
            Complete all practice problems and submit your work for review.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Submit Assignment
          </button>
        </div>
      </section>
    </div>
  )
}
