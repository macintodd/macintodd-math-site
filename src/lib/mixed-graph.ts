import {generateEquationLine} from './line-equation.ts'
import {generateStandardEquation,checkStandard,type StandardEquation,type InterceptEntries} from './standard-form.ts'
import {coefficient,checkStandardSlope,type SlopeEntries} from './standard-slope.ts'
import {correctGraph,type GridPoint} from './graph-line.ts'
import type {Line} from './slope.ts'
export const mixedModes=['intercepts','convert','slope','free'] as const
export type MixedMode=typeof mixedModes[number]
export type MixedProblem={mode:MixedMode;form:'standard'|'slope';line:Line;standard?:StandardEquation}
export type MixedResult={problem:MixedProblem;correct:boolean}
export const mixedNames:Record<MixedMode,string>={intercepts:'Find x- and y-intercepts',convert:'Rewrite in slope-intercept form',slope:'Find slope and y-intercept',free:'Graph with your own method'}
export function makeMixedProblem(mode:MixedMode,random=Math.random,recent:Line[]=[]):MixedProblem{
 const form=mode==='intercepts'||mode==='convert'||mode==='free'&&random()<.5?'standard':'slope'
 if(form==='standard'){const standard=generateStandardEquation(random,recent);return {mode,form,line:standard.line,standard}}
 return {mode,form,line:generateEquationLine(random,recent)}
}
export function takeMixedProblem(queue:MixedMode[],history:MixedResult[],random=Math.random){
 const deck=[...queue];if(!deck.length){deck.push(...mixedModes);for(let i=deck.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]]}if(deck[0]===history[history.length-1]?.problem.mode)[deck[0],deck[1]]=[deck[1],deck[0]]}
 const mode=deck.shift()!;return {problem:makeMixedProblem(mode,random,history.map(r=>r.problem.line)),remaining:deck}
}
export function mixedReady(problem:MixedProblem,intercepts:InterceptEntries,slope:SlopeEntries){
 if(problem.mode==='free')return true
 if(problem.mode==='intercepts')return Object.values(intercepts).every(v=>/^-?\d{1,3}$/.test(v))
 return coefficient(slope.m)!==null&&coefficient(slope.b)!==null
}
export function checkMixed(problem:MixedProblem,intercepts:InterceptEntries,slope:SlopeEntries,points:GridPoint[]){
 let detail={xCorrect:true,yCorrect:true,mCorrect:true,bCorrect:true,graphCorrect:correctGraph(problem.line,points),correct:false}
 if(problem.mode==='intercepts'&&problem.standard)detail={...detail,...checkStandard(problem.standard,intercepts,points)}
 else if(problem.mode==='convert'&&problem.standard)detail={...detail,...checkStandardSlope(problem.standard,slope,points)}
 else if(problem.mode==='slope')detail={...detail,mCorrect:coefficient(slope.m)!==null&&Math.abs(coefficient(slope.m)!-problem.line.rise/problem.line.run)<1e-9,bCorrect:coefficient(slope.b)===problem.line.y}
 return {...detail,correct:detail.xCorrect&&detail.yCorrect&&detail.mCorrect&&detail.bCorrect&&detail.graphCorrect}
}
