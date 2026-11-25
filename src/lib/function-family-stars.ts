import {
  freshGraphFamilyState, graphFamilyReducer,
  type GraphFamilyState, type GraphFamilyAction,
} from './function-family-graphs.ts'

/** Presentation only. The established score, timer, and native bridge stay unchanged. */
export type StarTrail = {completed: number[]; earlierCorrect: number}
export type FamilyStarState = GraphFamilyState & {starTrail?: StarTrail; infoOpen?: boolean}

export function readStarTrail(state: GraphFamilyState): StarTrail {
  const earlierTotal = state.practice.correct - state.practice.streak
  const saved = (state as FamilyStarState).starTrail
  if (saved && Array.isArray(saved.completed) && saved.completed.length <= state.practice.attempts &&
      saved.completed.every(n => Number.isInteger(n) && n > 0 && n <= state.practice.best) &&
      Number.isInteger(saved.earlierCorrect) && saved.earlierCorrect >= 0 &&
      saved.completed.reduce((sum, n) => sum + n, saved.earlierCorrect) === earlierTotal) return saved
  // Older snapshots contain totals but not individual runs. Never invent those runs.
  return {completed: [], earlierCorrect: earlierTotal}
}

export function freshFamilyStarState(): FamilyStarState {
  return {...freshGraphFamilyState(), starTrail: {completed: [], earlierCorrect: 0}}
}

export function familyStarReducer(state: FamilyStarState, action: GraphFamilyAction | {type: 'info'; open: boolean}): FamilyStarState {
  if (action.type === 'info') return state.infoOpen === action.open ? state : {...state, infoOpen: action.open}
  const next = graphFamilyReducer(state, action)
  if (next === state) return state
  if (action.type === 'restore') return {...next, starTrail: readStarTrail(next)}
  if (action.type === 'answer' && state.scene === 'practice' &&
      next.practice.attempts === state.practice.attempts + 1 &&
      next.practice.streak === 0 && state.practice.streak > 0) {
    const trail = readStarTrail(state)
    return {...next, starTrail: {...trail, completed: [...trail.completed, state.practice.streak]}}
  }
  return next
}
