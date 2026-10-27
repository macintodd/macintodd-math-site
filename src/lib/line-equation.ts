import { fraction, generateLine, isCorrect, type Line } from './slope.ts'

/** Keep the intercept on an integer grid intersection, with two or more visible points. */
export function generateEquationLine(random = Math.random, recent: Line[] = []): Line {
  const slope = generateLine(random, recent)
  return { rise: slope.rise, run: slope.run, x: 0, y: Math.floor(random() * 11) - 5 }
}

type Linear = { m: number; b: number }
/** Small arithmetic grammar, never JavaScript evaluation. Accepts equivalent linear forms. */
export function parseLinearExpression(answer: string): Linear | null {
  const input = answer.toLowerCase().replace(/−/g, '-').replace(/×|·/g, '*').replace(/\s/g, '').replace(/^(?:f\(x\)|y)=/, '')
  if (!input || input.length > 100 || /[^\d.x+\-*/()]/.test(input)) return null
  const tokens = input.match(/(?:\d+(?:\.\d*)?|\.\d+)|[x+\-*/()]/g) ?? []
  if (tokens.join('') !== input) return null
  let index = 0
  function primary(): Linear {
    const token = tokens[index++]
    if (token === '+' || token === '-') {
      const value = primary(), sign = token === '-' ? -1 : 1
      return { m: sign * value.m, b: sign * value.b }
    }
    if (token === 'x') return { m: 1, b: 0 }
    if (token === '(') {
      const value = sum()
      if (tokens[index++] !== ')') throw Error('Missing parenthesis')
      return value
    }
    if (!token || !/^\d|^\.\d/.test(token)) throw Error('Expected a number or x')
    return { m: 0, b: Number(token) }
  }
  function product(): Linear {
    let left = primary()
    while (index < tokens.length) {
      const next = tokens[index]
      const implicit = next === 'x' || next === '('
      if (next !== '*' && next !== '/' && !implicit) break
      if (!implicit) index++
      const right = primary()
      if (next === '/') {
        if (right.m !== 0 || right.b === 0) throw Error('Only a nonzero constant denominator is allowed')
        left = { m: left.m / right.b, b: left.b / right.b }
      } else {
        if (left.m !== 0 && right.m !== 0) throw Error('Not linear')
        left = { m: left.m * right.b + right.m * left.b, b: left.b * right.b }
      }
    }
    return left
  }
  function sum(): Linear {
    let left = product()
    while (tokens[index] === '+' || tokens[index] === '-') {
      const sign = tokens[index++] === '+' ? 1 : -1, right = product()
      left = { m: left.m + sign * right.m, b: left.b + sign * right.b }
    }
    return left
  }
  try {
    const value = sum()
    return index === tokens.length && Number.isFinite(value.m) && Number.isFinite(value.b) ? value : null
  } catch { return null }
}
export function equationText(line: Line) {
  const m = fraction(line.rise, line.run)
  const variable = line.rise === 0 ? '' : line.rise === line.run ? 'x' : line.rise === -line.run ? '−x' : `${m}x`
  return variable ? `${variable}${line.y > 0 ? ` + ${line.y}` : line.y < 0 ? ` − ${-line.y}` : ''}` : String(line.y)
}
export type EquationAnswer = { interceptX: string; interceptY: string; rise: string; run: string; equation: string }
export function checkEquationAnswer(line: Line, answer: EquationAnswer) {
  const integer = (text: string) => /^-?\d{1,3}$/.test(text)
  const equation = parseLinearExpression(answer.equation)
  const interceptCorrect = integer(answer.interceptX) && integer(answer.interceptY) && Number(answer.interceptX) === 0 && Number(answer.interceptY) === line.y
  const slopeCorrect = integer(answer.rise) && integer(answer.run) && isCorrect(line, { rise: Number(answer.rise), run: Number(answer.run) })
  const equationCorrect = !!equation && Math.abs(equation.m - line.rise / line.run) < 1e-9 && Math.abs(equation.b - line.y) < 1e-9
  return { interceptCorrect, slopeCorrect, equationCorrect, correct: interceptCorrect && slopeCorrect && equationCorrect }
}
export type EquationRecord = { line: Line; attempts: number; correct: boolean }
export function equationProgress(records: EquationRecord[]) {
  let correct = 0, firstTry = 0, streak = 0, bestStreak = 0, attempts = 0
  for (const record of records) {
    attempts += record.attempts
    if (record.correct) correct++
    if (record.correct && record.attempts === 1) { firstTry++; streak++; bestStreak = Math.max(bestStreak, streak) }
    else streak = 0
  }
  const missingStreak = Math.max(0, 5 - bestStreak)
  const score = Math.max(0, Math.min(10, correct) - missingStreak)
  return { correct, firstTry, streak, bestStreak, attempts, score, completed: correct >= 10 && bestStreak >= 5, canSubmit: correct >= 10 || bestStreak >= 5 }
}
