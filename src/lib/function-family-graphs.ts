import type {CompletionDisplayState} from './mathboard/display-mirror.ts'

export const familyIds = ['constant', 'linear', 'absolute', 'quadratic', 'cubic'] as const
export type FunctionFamily = typeof familyIds[number]
export const familyNames: Record<FunctionFamily, string> = {
  constant: 'Constant', linear: 'Linear', absolute: 'Absolute value',
  quadratic: 'Quadratic (square)', cubic: 'Cubic',
}
export const familyHints: Record<FunctionFamily, string> = {
  constant: 'A horizontal line has the same output for every input.',
  linear: 'A slanted straight line changes at a constant rate.',
  absolute: 'Two straight arms meet at a sharp corner.',
  quadratic: 'A smooth U-shaped curve has one turning point. It can open up or down.',
  cubic: 'An S-shaped curve bends one way, then the other. It can rise or fall.',
}
export const parentEquations: Record<FunctionFamily, string> = {
  constant: 'f(x)=1', linear: 'f(x)=x', absolute: String.raw`f(x)=\lvert x\rvert`,
  quadratic: 'f(x)=x^2', cubic: 'f(x)=x^3',
}
export const graphFamilySlug = 'beta/function-family-graphs'
export const graphFamilyTitle = '1. Identify Function Family from Graph'
export const speedDuration = 60_000
export const revealDuration = 650

export type FamilyQuestion = {
  family: FunctionFamily; a: number; b: 1; h: number; k: number
  equation: string; form: 'standard' | 'shifted'
}
function randomStream(seed: number) {
  let n = seed >>> 0
  return () => {
    n = (n + 0x6D2B79F5) >>> 0
    let t = Math.imul(n ^ (n >>> 15), 1 | n)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function numberTex(n: number) {
  if (Number.isInteger(n)) return String(n)
  const denominator = Number.isInteger(n * 2) ? 2 : 4
  return `${n < 0 ? '-' : ''}\\frac{${Math.abs(n * denominator)}}{${denominator}}`
}
function polynomial(terms: [number, string][]) {
  let result = ''
  for (const [coefficient, variable] of terms) {
    if (!coefficient) continue
    const magnitude = Math.abs(coefficient)
    result += coefficient < 0 ? '-' : result ? '+' : ''
    result += magnitude === 1 && variable ? variable : numberTex(magnitude) + variable
  }
  return result || '0'
}
export function equationFor(q: Pick<FamilyQuestion, 'family' | 'a' | 'h' | 'k' | 'form'>): string {
  const {family, a, h, k, form} = q
  if (family === 'constant') return `g(x)=${numberTex(1 + k)}`
  if (form === 'standard' && family !== 'absolute') {
    if (family === 'linear') return `g(x)=${polynomial([[a, 'x'], [k - a * h, '']])}`
    if (family === 'quadratic') return `g(x)=${polynomial([[a, 'x^2'], [-2 * a * h, 'x'], [a * h * h + k, '']])}`
    return `g(x)=${polynomial([[a, 'x^3'], [-3 * a * h, 'x^2'], [3 * a * h * h, 'x'], [k - a * h ** 3, '']])}`
  }
  const inside = polynomial([[1, 'x'], [-h, '']])
  const body = family === 'absolute' ? `\\lvert ${inside}\\rvert` : family === 'linear'
    ? h ? `(${inside})` : 'x' : `${h ? `(${inside})` : 'x'}^${family === 'quadratic' ? 2 : 3}`
  return `g(x)=${polynomial([[a, body], [k, '']])}`
}
/** Every five questions contain all five families; nonzero coefficients keep them distinct.
 * This first widget uses b=1. The series rule is b≠1 ⇒ h=0, never both at once. */
export function familyQuestion(seed: number, index: number): FamilyQuestion {
  const block = Math.floor(index / 5)
  const bagSeed = (n: number) => (seed ^ Math.imul(n + 1, 0x45D9F3B)) >>> 0
  const shuffle = randomStream(bagSeed(block))
  const last = familyIds[Math.floor(shuffle() * 5)]
  const previousLast = block ? familyIds[Math.floor(randomStream(bagSeed(block - 1))() * 5)] : null
  const starts = familyIds.filter(f => f !== last && f !== previousLast)
  const first = starts[Math.floor(shuffle() * starts.length)]
  const middle = familyIds.filter(f => f !== first && f !== last)
  for (let i = middle.length - 1; i > 0; i--) {
    const j = Math.floor(shuffle() * (i + 1)); [middle[i], middle[j]] = [middle[j], middle[i]]
  }
  const family = [first, ...middle, last][index % 5]
  const random = randomStream((seed ^ Math.imul(index + 1, 0x9E3779B9)) >>> 0)
  const pick = <T,>(items: readonly T[]) => items[Math.floor(random() * items.length)]
  const parent = index < 5 || random() < .18
  const a = parent || family === 'constant' ? 1 : pick(family === 'cubic' ? [-1, -.5, .5, 1] : [-2, -1, -.5, .5, 1, 2])
  const h = parent || family === 'constant' ? 0 : pick([-2, -1, 0, 1, 2])
  const k = parent ? 0 : pick([-3, -2, -1, 0, 1, 2, 3])
  const form = family === 'absolute' || index % 2 === 0 ? 'shifted' : 'standard'
  const q: FamilyQuestion = {family, a, b: 1, h, k, form, equation: ''}
  return {...q, equation: equationFor(q)}
}
export function familyValue(q: FamilyQuestion, x: number) {
  const u = x - q.h
  const parent = q.family === 'constant' ? 1 : q.family === 'linear' ? u : q.family === 'absolute' ? Math.abs(u) : q.family === 'quadratic' ? u * u : u * u * u
  return (q.family === 'constant' ? 1 : q.a) * parent + q.k
}
/** SVG coordinates keep equal x/y units. Clipping is visual only; the function is not truncated. */
export function familyGraphPath(q: FamilyQuestion) {
  const points: string[] = []
  // Include the exact corner/vertex so an absolute-value graph never looks rounded.
  const xs = [...new Set([...Array.from({length: 601}, (_, i) => -6 + i / 50), q.h])].sort((a, b) => a - b)
  for (const x of xs) {
    const y = familyValue(q, x)
    points.push(`${points.length ? 'L' : 'M'}${(240 + x * 34).toFixed(2)},${(240 - y * 34).toFixed(2)}`)
  }
  return points.join(' ')
}

export type GraphFamilyState = {
  scene: 'welcome' | 'practice' | 'ready' | 'speed' | 'speed-result' | 'report'
  first: string; last: string; hour: string; seed: number
  practice: {index: number; selected: FunctionFamily | null; attempts: number; correct: number; streak: number; best: number}
  speed: {round: number; index: number; selected: FunctionFamily | null; count: number; best: number; last: number | null; attempts: number; deadline: number; remainingMs: number; nextAt: number; reason: 'miss' | 'time' | 'report' | null}
  completedAt: number; reportReturn: 'practice' | 'ready' | 'speed-result'
  completion: CompletionDisplayState | null
}
export function freshGraphFamilyState(): GraphFamilyState {
  return {scene: 'welcome', first: '', last: '', hour: '', seed: 0,
    practice: {index: 0, selected: null, attempts: 0, correct: 0, streak: 0, best: 0},
    speed: {round: 0, index: 0, selected: null, count: 0, best: 0, last: null, attempts: 0, deadline: 0, remainingMs: speedDuration, nextAt: 0, reason: null},
    completedAt: 0, reportReturn: 'practice', completion: null}
}
export function activeFamilyQuestion(s: GraphFamilyState) {
  return s.scene === 'speed' || s.scene === 'speed-result' || s.scene === 'report' && s.reportReturn === 'speed-result'
    ? familyQuestion((s.seed ^ Math.imul(s.speed.round, 0x85EBCA6B)) >>> 0, s.speed.index + 5)
    : familyQuestion(s.seed, s.practice.index)
}
export type GraphFamilyAction =
  | {type: 'identity'; field: 'first' | 'last' | 'hour'; value: string}
  | {type: 'start'; seed: number}
  | {type: 'answer'; family: FunctionFamily; now: number}
  | {type: 'next'} | {type: 'ready'} | {type: 'practice'}
  | {type: 'start-speed'; now: number} | {type: 'tick'; now: number}
  | {type: 'report'; now: number} | {type: 'return'}
  | {type: 'completion'; value: CompletionDisplayState}
  | {type: 'restore'; value: GraphFamilyState}
function endedSpeed(s: GraphFamilyState, reason: 'miss' | 'time' | 'report'): GraphFamilyState {
  return {...s, scene: 'speed-result', speed: {...s.speed, reason, last: s.speed.count, best: Math.max(s.speed.best, s.speed.count), nextAt: 0, remainingMs: reason === 'time' ? 0 : s.speed.remainingMs}}
}
export function graphFamilyReducer(s: GraphFamilyState, action: GraphFamilyAction): GraphFamilyState {
  switch (action.type) {
    case 'identity': return s.scene === 'welcome' ? {...s, [action.field]: action.value.slice(0, 40)} : s
    case 'start': return s.scene !== 'welcome' || !s.first.trim() || !s.last.trim() || !s.hour.trim() ? s : {...s, scene: 'practice', seed: action.seed >>> 0}
    case 'answer': {
      if (!familyIds.includes(action.family)) return s
      if (s.scene === 'practice') {
        if (s.practice.selected) return s
        const right = action.family === activeFamilyQuestion(s).family
        const streak = right ? s.practice.streak + 1 : 0
        return {...s, practice: {...s.practice, selected: action.family, attempts: s.practice.attempts + 1,
          correct: s.practice.correct + (right ? 1 : 0), streak, best: Math.max(s.practice.best, streak)}}
      }
      if (s.scene !== 'speed') return s
      if (action.now >= s.speed.deadline) return endedSpeed(s, 'time')
      if (s.speed.selected) return s
      const right = action.family === activeFamilyQuestion(s).family
      const next: GraphFamilyState = {...s, speed: {...s.speed, selected: action.family, attempts: s.speed.attempts + 1,
        count: s.speed.count + (right ? 1 : 0), nextAt: right ? action.now + revealDuration : 0}}
      return right ? next : endedSpeed(next, 'miss')
    }
    case 'next': return s.scene === 'practice' && s.practice.selected ? {...s, practice: {...s.practice, index: s.practice.index + 1, selected: null}} : s
    case 'ready': return s.practice.best >= 10 ? {...s, scene: 'ready'} : s
    case 'practice': return {...s, scene: 'practice'}
    case 'start-speed': return s.practice.best < 10 || s.scene !== 'ready' && s.scene !== 'speed-result' ? s : {...s, scene: 'speed', speed: {...s.speed,
      round: s.speed.round + 1, index: 0, selected: null, count: 0, attempts: 0, deadline: action.now + speedDuration, remainingMs: speedDuration, nextAt: 0, reason: null}}
    case 'tick': {
      if (s.scene !== 'speed') return s
      if (action.now >= s.speed.deadline) return endedSpeed(s, 'time')
      const remainingMs = Math.ceil((s.speed.deadline - action.now) / 1000) * 1000
      const advance = s.speed.selected && s.speed.nextAt > 0 && action.now >= s.speed.nextAt
      return !advance && remainingMs === s.speed.remainingMs ? s : {...s, speed: {...s.speed, remainingMs, ...(advance ? {index: s.speed.index + 1, selected: null, nextAt: 0} : {})}}
    }
    case 'report': {
      if (s.scene === 'welcome' || s.scene === 'report') return s
      const next = s.scene === 'speed' ? endedSpeed(s, 'report') : s
      return {...next, scene: 'report', completedAt: action.now, completion: null,
        reportReturn: next.scene === 'ready' ? 'ready' : next.scene === 'speed-result' ? 'speed-result' : 'practice'}
    }
    case 'return': return {...s, scene: s.reportReturn, completion: null}
    case 'completion': return JSON.stringify(s.completion) === JSON.stringify(action.value) ? s : {...s, completion: action.value}
    case 'restore': return action.value
  }
}

export type GraphFamilySnapshot = {
  app: 'algebra2-function-family-graphs'; version: 1
  score: number; maxScore: 10; isComplete: boolean; scoreDisplay: string
  answeredItems: number; correctFirstTry: number; longestStreak: number
  extraData: {currentStreak: number; speedRoundBest: number; speedRoundLast: number | string; speedRoundCount: number; speedRoundScore: number}
  customState: {state: GraphFamilyState; language: 'en' | 'es'; scrollY: number}
}
export function graphFamilySnapshot(state: GraphFamilyState, language: 'en' | 'es', scrollY: number): GraphFamilySnapshot {
  return {app: 'algebra2-function-family-graphs', version: 1, score: Math.min(10, state.practice.best), maxScore: 10,
    isComplete: state.scene === 'report' && !!state.completion?.record && state.completion.record.language === language && state.completion.confidence > 0 && state.completion.difficulty > 0,
    scoreDisplay: `${Math.min(10, state.practice.best)}/10`,
    answeredItems: state.practice.attempts, correctFirstTry: state.practice.correct, longestStreak: state.practice.best,
    extraData: {currentStreak: state.practice.streak, speedRoundBest: Math.max(state.speed.best, state.speed.count),
      speedRoundLast: state.speed.last ?? 'Not played', speedRoundCount: state.speed.round, speedRoundScore: state.speed.count},
    customState: {state, language, scrollY}}
}
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)
const count = (v: unknown, max = 1_000_000): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= max
const choice = (v: unknown) => v === null || familyIds.includes(v as FunctionFamily)
/** Reject malformed/foreign snapshots without replacing a student's session. */
export function readGraphFamilySnapshot(value: unknown): GraphFamilySnapshot | null {
  if (!object(value) || value.app !== 'algebra2-function-family-graphs' || value.version !== 1 || !object(value.customState)) return null
  const {state: s, language, scrollY} = value.customState
  if (!object(s) || !['en', 'es'].includes(String(language)) || !count(scrollY, 10_000_000)) return null
  if (!['welcome', 'practice', 'ready', 'speed', 'speed-result', 'report'].includes(String(s.scene)) || !['practice', 'ready', 'speed-result'].includes(String(s.reportReturn))) return null
  if (![s.first, s.last, s.hour].every(v => typeof v === 'string' && v.length <= 40) || !count(s.seed, 0xFFFFFFFF) || !count(s.completedAt, Number.MAX_SAFE_INTEGER)) return null
  const p = s.practice, r = s.speed
  if (!object(p) || !object(r) || ![p.index, p.attempts, p.correct, p.streak].every(v => count(v)) || !count(p.best) || !choice(p.selected)) return null
  if ((p.correct as number) > (p.attempts as number) || (p.streak as number) > (p.correct as number)) return null
  if (![r.round, r.index, r.count, r.best, r.attempts].every(v => count(v)) || !choice(r.selected) || !(r.last === null || count(r.last))) return null
  if (!count(r.deadline, Number.MAX_SAFE_INTEGER) || !count(r.nextAt, Number.MAX_SAFE_INTEGER) || !count(r.remainingMs, speedDuration) || ![null, 'miss', 'time', 'report'].includes(r.reason as null | 'miss' | 'time' | 'report')) return null
  if (s.completion !== null) {
    const c = s.completion
    if (!object(c) || !count(c.confidence, 5) || !count(c.difficulty, 5) || typeof c.notice !== 'boolean' || typeof c.error !== 'string') return null
    if (c.record !== null && (!object(c.record) || typeof c.record.image !== 'string' || !c.record.image.startsWith('data:image/png;base64,') || typeof c.record.identity !== 'string' || !['en', 'es'].includes(String(c.record.language)))) return null
  }
  return graphFamilySnapshot(s as unknown as GraphFamilyState, language as 'en' | 'es', scrollY)
}
