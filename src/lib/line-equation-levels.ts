import {checkEquationAnswer,equationProgress,type EquationAnswer,type EquationRecord} from './line-equation.ts'
import {onLine,type GridPoint} from './graph-line.ts'
import type {Line} from './slope.ts'
export type LineLevel=1|2
export type GuidedStep='intercept'|'slope'|'equation'
export type LevelRecord=EquationRecord&{level:LineLevel;checks:number}
export function checkTappedIntercept(line:Line,point:GridPoint|null){return !!point&&point.x===0&&point.y===line.y}
export function checkGuidedSlope(line:Line,answer:EquationAnswer,second:GridPoint|null){return !!second&&(second.x!==0||second.y!==line.y)&&onLine(line,second)&&checkEquationAnswer(line,answer).slopeCorrect}
function shortLevelProgress(records:LevelRecord[]){const stats=equationProgress(records),missingStreak=Math.max(0,3-stats.bestStreak);return {...stats,score:Math.max(0,Math.round(10*Math.min(stats.correct,3)/3)-missingStreak),completed:stats.correct>=3&&stats.bestStreak>=3,canSubmit:stats.correct>=3}}
export function levelProgress(records:LevelRecord[]){const guided=shortLevelProgress(records.filter(r=>r.level===1)),independent=shortLevelProgress(records.filter(r=>r.level===2));return {guided,independent,unlocked:guided.completed,totalStars:guided.correct+independent.correct,checks:records.reduce((n,r)=>n+r.checks,0)}}
