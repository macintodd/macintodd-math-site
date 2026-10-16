'use client'

import { useState, useEffect, useRef } from 'react'
import { canonicalFactors } from '@/lib/factoring'

interface Problem {
  id: number
  expression: string
  answer: string
  hint: string
}

export default function FactoringApp() {
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [answered, setAnswered] = useState(false)
  const locked = useRef(false)

  const problems: Problem[] = [
    {
      id: 1,
      expression: 'x² + 5x + 6',
      answer: '(x + 2)(x + 3)',
      hint: 'Look for two numbers that multiply to 6 and add to 5'
    },
    {
      id: 2,
      expression: 'x² - 7x + 12',
      answer: '(x - 3)(x - 4)',
      hint: 'Look for two numbers that multiply to 12 and add to -7'
    },
    {
      id: 3,
      expression: 'x² - 9',
      answer: '(x + 3)(x - 3)',
      hint: 'This is a difference of squares: a² - b²'
    },
    {
      id: 4,
      expression: '2x² + 8x + 6',
      answer: '2(x + 1)(x + 3)',
      hint: 'First factor out the GCF, then factor the remaining trinomial'
    },
    {
      id: 5,
      expression: 'x² + 6x + 9',
      answer: '(x + 3)²',
      hint: 'This is a perfect square trinomial: a² + 2ab + b²'
    }
  ]

  useEffect(() => {
    // Initialize random practice only after mounting in the browser.
    generateNewProblem()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function generateNewProblem() {
    const randomProblem = problems[Math.floor(Math.random() * problems.length)]
    setCurrentProblem(randomProblem)
    setUserAnswer('')
    setFeedback('')
    setShowHint(false)
    setAnswered(false)
    locked.current = false
  }

  const checkAnswer = () => {
    if (!currentProblem || locked.current || !userAnswer.trim()) return

    setAttempts(a => a + 1)
    
    // Normalize answers for comparison (remove spaces, convert to lowercase)
    const userNormalized = canonicalFactors(userAnswer)
    const correctNormalized = canonicalFactors(currentProblem.answer)
    
    if (userNormalized !== null && userNormalized === correctNormalized) {
      setFeedback('Correct! Well done! 🎉')
      setScore(s => s + 1)
      locked.current = true
      setAnswered(true)
    } else {
      setFeedback(`Not quite right. Try again! The correct answer is: ${currentProblem.answer}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer()
    }
  }

  if (!currentProblem) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Factoring Practice
        </h2>
        <p className="text-lg text-gray-600">
          Practice factoring quadratic expressions
        </p>
        <div className="mt-4 flex justify-center space-x-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{score}</div>
            <div className="text-sm text-gray-600">Correct</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{attempts}</div>
            <div className="text-sm text-gray-600">Attempts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
        </div>
      </div>

      {/* Problem Card */}
      <div className="math-container">
        <h3 className="text-xl font-bold mb-4">Factor the expression:</h3>
        <div className="text-center">
          <div className="text-3xl font-mono font-bold text-blue-600 mb-6">
            {currentProblem.expression}
          </div>
          
          <div className="space-y-4">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={handleKeyPress}
              aria-label="Your factored expression"
              disabled={answered}
              placeholder="Enter your factored form (e.g., (x + 2)(x + 3))"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={checkAnswer}
                disabled={answered || !userAnswer.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Check Answer
              </button>
              <button
                onClick={() => setShowHint(!showHint)}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
              <button
                onClick={generateNewProblem}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                New Problem
              </button>
            </div>
          </div>
        </div>

        {/* Hint */}
        {showHint && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-bold text-yellow-800 mb-2">💡 Hint:</h4>
            <p className="text-yellow-700">{currentProblem.hint}</p>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className={`mt-6 p-4 rounded-lg ${
            feedback.includes('Correct') 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <p className="font-medium">{feedback}</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="assignment-card">
        <h3 className="text-lg font-bold mb-3">How to Factor:</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <strong>1. Simple Trinomials (x² + bx + c):</strong>
            <p className="ml-4">Find two numbers that multiply to c and add to b</p>
          </div>
          <div>
            <strong>2. Difference of Squares (a² - b²):</strong>
            <p className="ml-4">Factors as (a + b)(a - b)</p>
          </div>
          <div>
            <strong>3. Perfect Square Trinomials:</strong>
            <p className="ml-4">a² + 2ab + b² = (a + b)²</p>
          </div>
          <div>
            <strong>4. Factor out GCF first:</strong>
            <p className="ml-4">Always look for common factors before applying other methods</p>
          </div>
        </div>
      </div>

      {/* Progress would be logged to Google Sheets here */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Scores are for this visit only. They reset when you leave or reload.
        </p>
      </div>
    </div>
  )
}
