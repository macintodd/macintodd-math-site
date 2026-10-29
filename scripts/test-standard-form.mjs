import assert from 'node:assert/strict'
import { generateStandardEquation,checkStandard,standardText } from '../src/lib/standard-form.ts'
import { isCorrect } from '../src/lib/slope.ts'
let recent=[]
for(let i=0;i<2000;i++){
 const p=generateStandardEquation(Math.random,recent)
 assert(Number.isInteger(p.a)&&Number.isInteger(p.b)&&Number.isInteger(p.c));assert(p.a>0&&p.b!==0&&p.c!==0)
 assert.equal(Math.abs(p.c%p.a),0);assert.equal(Math.abs(p.c%p.b),0)
 assert.equal(p.a*p.xIntercept,p.c);assert.equal(p.b*p.yIntercept,p.c)
 assert(Math.abs(p.xIntercept)<=8&&Math.abs(p.yIntercept)<=8)
 const entries={xx:String(p.xIntercept),xy:'0',yx:'0',yy:String(p.yIntercept)},points=[{x:p.xIntercept,y:0},{x:0,y:p.yIntercept}]
 assert(checkStandard(p,entries,points).correct);assert(checkStandard(p,entries,points.toReversed()).correct)
 assert(!checkStandard(p,{...entries,xx:'0'},points).xCorrect)
 assert(!checkStandard(p,{...entries,yy:'0'},points).yCorrect)
 assert(!checkStandard(p,{...entries,xy:'1'},points).xCorrect)
 assert(!checkStandard(p,{...entries,yx:'1'},points).yCorrect)
 assert(!checkStandard(p,entries,[points[0],points[0]]).graphCorrect)
 assert(!checkStandard(p,entries,[points[0],{x:1,y:1}]).graphCorrect)
 if(recent.length>=2) assert(!(isCorrect(p.line,recent.at(-1))&&isCorrect(p.line,recent.at(-2))))
 assert(standardText(p).includes(' = '));assert(!standardText(p).includes('+ -'))
 recent.push(p.line)
}
console.log('Passed: 2,000 standard equations, exact integer intercepts, signed divisibility, ordered-pair checks, intercept plotting, slope repeat prevention.')
