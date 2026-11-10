import {parseLinearExpression} from './line-equation.ts'
import {focusedProblem,type ActivityProblem} from './linear-focused.ts'
import {generateProblem} from './write-linear.ts'
import {slopeTex} from './point-slope.ts'
export type MixedKind='givens'|'graph'|'point-slope'|'two-points'|'intercept-point'
export type MixedProblem=ActivityProblem & {kind:MixedKind}
export type MixedResult={correct:boolean;hints:number;points:number;kind:MixedKind;retry?:boolean}
const pick=(n:number,rng:()=>number)=>Math.min(n-1,Math.floor(rng()*n))
export function mixedSet(rng=Math.random):MixedProblem[]{
 const kinds:MixedKind[]=['givens','graph','point-slope','two-points','intercept-point']
 const deck=[...kinds,...kinds];for(let i=deck.length-1;i>0;i--){const j=pick(i+1,rng);[deck[i],deck[j]]=[deck[j],deck[i]]}
 let recent:number|undefined
 return deck.map(kind=>{const p=kind==='two-points'?focusedProblem(4,false,rng,recent):generateProblem(kind==='givens'?1:kind==='graph'?2:3,false,rng,recent);recent=p.line.rise/p.line.run;return {...p,kind,...(kind==='intercept-point'?{secondPoint:{x:0,y:p.line.y}}:{})}})
}
export function mixedHints(p:MixedProblem):string[]{
 if(p.kind==='givens')return ['Use y = mx + b. The slope is m; the y-intercept supplies b.','Multiply the slope by x, then add the y-intercept. Keep the signs.']
 if(p.kind==='graph')return ['Find where the line crosses the y-axis. Record that point as (0, b).','Choose two integer points. Count signed rise and run from left to right; slope is rise divided by run.','Use y = mx + b. Put the slope beside x and the y-intercept at the end.']
 if(p.kind==='intercept-point')return ['One point has x = 0. Its y-coordinate is your y-intercept, b.','Calculate slope: subtract y-values on top and x-values on the bottom, in the same point order.','Use your slope and intercept in y = mx + b.']
 if(p.kind==='point-slope')return ['Use y − y₁ = m(x − x₁) with the given point and slope.','Distribute the slope to both terms inside the parentheses.','Undo the subtraction beside y, then combine constants to write y = mx + b.']
 return ['Calculate m = (y₂ − y₁)/(x₂ − x₁). Keep the same point order in both subtractions.','Use either point with your slope in y − y₁ = m(x − x₁).','Distribute, then isolate y and combine constants.']
}
export function mixedCredit(correct:boolean,hints:number,retry=false){return correct?Math.round(Math.max(0,(retry?.5:1)-Math.max(0,hints)*.2)*100)/100:0}
export function mixedScore(results:MixedResult[]){return results.reduce((sum,r)=>sum+r.points,0)}
export function mixedPrompt(p:MixedProblem){const point=`(${p.point.x}, ${p.point.y})`;return p.kind==='graph'?'Write the equation of the graphed line in slope-intercept form.':p.kind==='givens'?`Write the equation with slope m=${slopeTex(p.line)} and y-intercept (0, ${p.line.y}).`:p.kind==='point-slope'?`Write the equation through ${point} with slope m=${slopeTex(p.line)}.`:`Write the equation through ${point} and (${p.secondPoint!.x}, ${p.secondPoint!.y}).`}
export const mixedPraise=['That line is so sharp, the graph paper asked for an autograph.','You connected the dots. The dots are impressed.','Your equation and that line are officially on speaking terms.','Slope, meet intercept. Another excellent introduction!','That equation fits the line better than a ski boot.','Somewhere, a confused coordinate just found its purpose.','You found the line. No detective hat required.','The x and y are getting along beautifully.','That was a straight-up excellent equation.','Your algebra just earned a tiny standing ovation.']

/** Diagnose the submitted equation without revealing the answer before a retry. */
export function mixedCorrection(answer:string,p:MixedProblem){
 const value=parseLinearExpression(answer),m=p.line.rise/p.line.run
 if(!/x/i.test(answer))return 'Your slope needs an x beside it. Check the slope, then use your point to recalculate b. You have one retry.'
 if(!value||Math.abs(value.m-m)>1e-8)return 'Check your slope first: keep rise over run and subtract coordinates in the same order. Then use your point to recalculate b. You have one retry.'
 return 'Your slope is correct! Check your point and its signs. Substitute its coordinates into y = mx + b and recalculate b. You have one retry.'
}
