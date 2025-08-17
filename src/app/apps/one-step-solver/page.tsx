"use client";
import React, { useState, useEffect } from "react";
import Equation from "./Equation";

// Types for future user/score integration
interface User {
  id: string;
  name: string;
}

interface Attempt {
  equation: string;
  correctOperation: string;
  correctNumber: number;
  userOperation: string;
  userNumber: number;
  isCorrect: boolean;
}

// Helper to generate a random one-step equation
function generateEquation(level = 1) {
  const types = ["add", "subtract", "multiply", "divide"];
  const letters = ["x", "y", "z", "a", "b", "m", "n"];
  let equation = "", correctOperation = "", correctNumber = 0, x = 0, n = 0, variable = "x";
  let attempts = 0;
  while (true) {
    attempts++;
    if (attempts > 10) break; // fail-safe to avoid infinite loop
    const type = types[Math.floor(Math.random() * types.length)];
    variable = level === 2 ? letters[Math.floor(Math.random() * letters.length)] : "x";
    const varOnRight = level === 2 ? Math.random() < 0.5 : false;
    switch (type) {
      case "add":
        n = Math.floor(Math.random() * 10) + 1;
        x = Math.floor(Math.random() * 20) + 1;
        if (varOnRight) {
          equation = `${x + n} = ${variable} + ${n}`;
        } else {
          equation = `${variable} + ${n} = ${x + n}`;
        }
        correctOperation = "subtract";
        correctNumber = n;
        break;
      case "subtract":
        n = Math.floor(Math.random() * 10) + 1;
        x = Math.floor(Math.random() * 20) + n + 1;
        if (varOnRight) {
          equation = `${x - n} = ${variable} - ${n}`;
        } else {
          equation = `${variable} - ${n} = ${x - n}`;
        }
        correctOperation = "add";
        correctNumber = n;
        break;
      case "multiply":
        n = Math.floor(Math.random() * 10) + 2;
        x = Math.floor(Math.random() * 10) + 1;
        if (varOnRight) {
          equation = `${n * x} = ${n}${variable}`;
        } else {
          equation = `${n}${variable} = ${n * x}`;
        }
        correctOperation = "divide";
        correctNumber = n;
        break;
      case "divide":
        n = Math.floor(Math.random() * 10) + 2;
        x = n * (Math.floor(Math.random() * 10) + 2);
        if (varOnRight) {
          equation = `${x / n} = ${variable} / ${n}`;
        } else {
          equation = `${variable} / ${n} = ${x / n}`;
        }
        correctOperation = "multiply";
        correctNumber = n;
        break;
    }
    // Validation: must contain the variable (e.g., x, y, etc.) and not be just numbers
    // This ensures the chosen variable is present somewhere in the equation string
    if (
      equation.includes(variable) &&
      /[=]/.test(equation) &&
      !/^\d+ = \d+$/.test(equation)
    ) {
      break;
    }
  }
  console.log("Generated equation:", equation);
  return { equation, correctOperation, correctNumber };
}

function toLatex(equation: string) {
  // Convert division to LaTeX fractions, keep other equations readable
  // x / n = m  =>  \frac{x}{n} = m
  let match = equation.match(/([a-zA-Z]) \/ (\d+) = ([-\d]+)/);
  if (match) {
    return `\\frac{${match[1]}}{${match[2]}} = ${match[3]}`;
  }
  // m = x / n  =>  m = \frac{x}{n}
  match = equation.match(/([-\d]+) = ([a-zA-Z]) \/ (\d+)/);
  if (match) {
    return `${match[1]} = \\frac{${match[2]}}{${match[3]}}`;
  }
  // n x = m  =>  n x = m (add \cdot for multiplication if needed)
  return equation.replace(/\*/g, ' \\cdot ');
}

export default function OneStepSolverApp() {
  // Placeholder for user (for future Google login)
  const [user] = useState<User | null>(null);
  const [problem, setProblem] = useState<any>(null);
  const [userOperation, setUserOperation] = useState("");
  const [userNumber, setUserNumber] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(1);

  useEffect(() => {
    setProblem(generateEquation(difficulty));
  }, [difficulty]);

  function checkAnswer() {
    if (!problem) return;
    const isCorrect =
      userOperation === problem.correctOperation &&
      Number(userNumber) === problem.correctNumber;
    setFeedback(
      isCorrect
        ? "✅ Correct!"
        : `❌ Incorrect. The correct answer is to ${problem.correctOperation} ${problem.correctNumber}`
    );
    setAttempts([
      ...attempts,
      {
        equation: problem.equation,
        correctOperation: problem.correctOperation,
        correctNumber: problem.correctNumber,
        userOperation,
        userNumber: Number(userNumber),
        isCorrect,
      },
    ]);
    setScore(s => s + (isCorrect ? 1 : -1));
  }

  function nextProblem() {
    setProblem(generateEquation(difficulty));
    setUserOperation("");
    setUserNumber("");
    setFeedback(null);
  }

  if (!problem) return null;

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">One-Step Equation Solver</h2>
      <p className="mb-6 text-gray-600">Choose the operation and number that solves for <b>x</b> in the equation below.</p>
      <div className="flex items-center gap-4 mb-4">
        <span className="text-lg font-bold text-blue-700">Score: {score}</span>
        <label className="ml-4 font-medium text-gray-700">
          Difficulty:
          <select
            className="ml-2 border rounded px-2 py-1"
            value={difficulty}
            onChange={e => setDifficulty(Number(e.target.value))}
          >
            <option value={1}>Level 1</option>
            <option value={2}>Level 2</option>
            <option value={3} disabled>Level 3 (coming soon)</option>
          </select>
        </label>
      </div>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="text-lg font-mono mb-4 border-2 border-blue-300 rounded bg-blue-50 px-6 py-4 flex justify-center items-center">
          <Equation latex={toLatex(problem.equation)} />
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
          <select
            className="border rounded px-3 py-2"
            value={userOperation}
            onChange={e => setUserOperation(e.target.value)}
          >
            <option value="">Select operation</option>
            <option value="add">Add</option>
            <option value="subtract">Subtract</option>
            <option value="multiply">Multiply</option>
            <option value="divide">Divide</option>
          </select>
          <input
            type="number"
            className="border rounded px-3 py-2 w-32"
            placeholder="Number"
            value={userNumber}
            onChange={e => setUserNumber(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={checkAnswer}
            disabled={!userOperation || !userNumber}
          >
            Check
          </button>
        </div>
        {feedback && (
          <div className="mb-4 text-lg font-semibold">
            {feedback}
            <button
              className="ml-4 text-blue-600 underline"
              onClick={nextProblem}
            >
              Next Problem
            </button>
          </div>
        )}
      </div>
      <div>
        <h3 className="font-bold mb-2">Your Attempts</h3>
        <ul className="space-y-1 text-sm">
          {attempts.slice(-5).map((a, i) => (
            <li key={i} className={a.isCorrect ? "text-green-700" : "text-red-700"}>
              {a.equation}: You chose {a.userOperation} {a.userNumber} — {a.isCorrect ? "Correct" : "Incorrect"}
            </li>
          ))}
        </ul>
      </div>
      {/* Placeholder for future Google login and score storage */}
    </div>
  );
}
