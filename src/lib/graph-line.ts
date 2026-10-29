import type { Line } from './slope.ts'
export type GridPoint = { x: number; y: number }
export function onLine(line: Line, point: GridPoint) {
  return (point.y - line.y) * line.run === (point.x - line.x) * line.rise
}
export function correctGraph(line: Line, selected: GridPoint[]) {
  return selected.length === 2 && (selected[0].x !== selected[1].x || selected[0].y !== selected[1].y) && selected.every(point => onLine(line, point))
}
/** Clip an infinite line to the square, ordered left-to-right (bottom-to-top for vertical lines). */
export function lineEnds(a: GridPoint, b: GridPoint): GridPoint[] {
  const dx = b.x - a.x, dy = b.y - a.y
  if (!dx && !dy) return []
  const hits: GridPoint[] = []
  function add(x: number, y: number) {
    if (x >= -10 - 1e-8 && x <= 10 + 1e-8 && y >= -10 - 1e-8 && y <= 10 + 1e-8 && !hits.some(p => Math.abs(p.x-x)<1e-8 && Math.abs(p.y-y)<1e-8)) hits.push({x,y})
  }
  if (dx) for(const x of [-10,10]) add(x,a.y+(x-a.x)*dy/dx)
  if (dy) for(const y of [-10,10]) add(a.x+(y-a.y)*dx/dy,y)
  return hits.sort((p,q)=>p.x-q.x || p.y-q.y)
}
export function slopePoint(line: Line): GridPoint {
  const direction = Math.abs(line.y + line.rise) <= 10 ? 1 : -1
  return { x: line.x + direction * line.run, y: line.y + direction * line.rise }
}
export function graphProgress(results: boolean[]) {
  let correct=0, streak=0, bestStreak=0
  for(const result of results) {
    if(result) {correct++;streak++;bestStreak=Math.max(bestStreak,streak)} else streak=0
  }
  const deduction=Math.max(0,6-bestStreak)
  return {correct,streak,bestStreak,deduction,score:Math.max(0,Math.min(10,correct)-deduction),completed:correct>=10 && bestStreak>=6,canSubmit:correct>=10}
}
