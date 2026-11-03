import assert from 'node:assert/strict'
import katex from 'katex'
import {generateIntroPointSlope,emptyPlacements,placeQuantity,placementsCorrect,quantityTex,checkDistribution,finalEquation} from '../src/lib/intro-point-slope.ts'
let history=[]
for(let i=0;i<600;i++){
 let call=0;const p=generateIntroPointSlope(()=>((i*17+call++*31)%100)/100,history)
 assert(p.point.x!==0);assert(Number.isInteger(p.point.x)&&Number.isInteger(p.point.y));assert(Math.abs(p.point.y-p.line.rise/p.line.run*p.point.x-p.line.y)<1e-8)
 let slots=placeQuantity(emptyPlacements(),'y1','y');slots=placeQuantity(slots,'m','m');slots=placeQuantity(slots,'x1','x');assert(placementsCorrect(p,slots));const moved=placeQuantity(slots,'m','x');assert.equal(moved.x1,null);assert.equal(moved.m,'x');assert(!placementsCorrect(p,moved))
 assert(checkDistribution(p,`${p.line.rise}/${p.line.run}`,String(-p.line.rise/p.line.run*p.point.x)));assert(!checkDistribution(p,'999','999'));assert(finalEquation(`y=${p.line.rise}/${p.line.run}x+(${p.line.y})`,p.line));assert(!finalEquation('y=999',p.line));for(const q of ['m','x','y'])katex.renderToString(quantityTex(p,q),{throwOnError:true})
 if(history.length>=2){const values=[...history.slice(-2).map(r=>r.line.rise/r.line.run),p.line.rise/p.line.run];assert(!(values[0]===values[1]&&values[1]===values[2]))}history.push({line:p.line,attempts:1,correct:true})
}
console.log('Passed 600 signed point/slope problems, token moves, placement validation, distribution, full equations, LaTeX and slope repetition prevention.')
