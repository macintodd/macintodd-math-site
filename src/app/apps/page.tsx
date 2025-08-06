export default function AppsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Math Practice Apps</h2>
        <p className="text-lg text-gray-600">
          Interactive tools to help you master Algebra 2 concepts
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg border-2 border-green-300 bg-green-50 hover:bg-green-100 cursor-pointer">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Factoring Practice</h3>
          <p className="text-gray-600 mb-3">Interactive tool to practice factoring quadratic expressions</p>
          <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Unit 3</span>
            <span>Intermediate</span>
          </div>
          <a
            href="/apps/factoring"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700 transition-colors"
          >
            Launch App
          </a>
        </div>

        <div className="p-6 rounded-lg border-2 border-gray-300 bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Quadratic Formula Calculator</h3>
          <p className="text-gray-600 mb-3">Step-by-step solver for quadratic equations</p>
          <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Unit 3</span>
            <span>Advanced</span>
          </div>
          <button
            disabled
            className="inline-block bg-gray-400 text-white px-4 py-2 rounded font-medium cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>

        <div className="p-6 rounded-lg border-2 border-gray-300 bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Polynomial Grapher</h3>
          <p className="text-gray-600 mb-3">Visualize polynomial functions and their properties</p>
          <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Unit 4A</span>
            <span>Intermediate</span>
          </div>
          <button
            disabled
            className="inline-block bg-gray-400 text-white px-4 py-2 rounded font-medium cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>

        <div className="p-6 rounded-lg border-2 border-gray-300 bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Exponential Explorer</h3>
          <p className="text-gray-600 mb-3">Interactive exploration of exponential and logarithmic functions</p>
          <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Unit 6</span>
            <span>Advanced</span>
          </div>
          <button
            disabled
            className="inline-block bg-gray-400 text-white px-4 py-2 rounded font-medium cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>
      </div>

      <div className="text-center">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-xl font-bold mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            Each app includes built-in hints and step-by-step guidance to help you learn.
          </p>
          <p className="text-sm text-gray-500">
            Your progress in these apps will be tracked for assignment completion.
          </p>
        </div>
      </div>
    </div>
  )
}
