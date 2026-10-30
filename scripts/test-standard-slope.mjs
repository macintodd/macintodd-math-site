import assert from 'node:assert/strict'
import {generateStandardEquation} from '../src/lib/standard-form.ts'
import {checkStandardSlope,coefficient} from '../src/lib/standard-slope.ts'
import {fraction} from '../src/lib/slope.ts'
import {graphProgress} from '../src/lib/graph-line.ts'
for(const [s,n] of [['-3/4',-.75],['6/8',.75],['0',0],['.5',.5],['4/-2',-2]])assert.equal(coefficient(s),n)
for(const s of ['','-','1/0','3/','x','alert(1)'])assert.equal(coefficient(s),null)
for(let i=0;i<1000;i++){
 const p=generateStandardEquation(),entries={m:fraction(p.line.rise,p.line.run),b:String(p.line.y)}
 const points=[{x:0,y:p.line.y},{x:p.xIntercept,y:0}]
 assert(checkStandardSlope(p,entries,points).correct)
 assert(checkStandardSlope(p,{...entries,m:`${p.line.rise*2}/${p.line.run*2}`},points).correct)
 assert(!checkStandardSlope(p,{...entries,m:String(-p.line.rise/p.line.run)},points).mCorrect)
 assert(!checkStandardSlope(p,{...entries,b:String(p.line.y+1)},points).bCorrect)
 assert(!checkStandardSlope(p,entries,[points[0],points[0]]).correct)
 assert(!checkStandardSlope(p,entries,[points[0],{x:points[1].x,y:1}]).graphCorrect)
}
assert.equal(graphProgress(Array(10).fill(true)).score,10)
assert.equal(graphProgress([true,true,true,true,false,true,true,true,true,false,true,true]).score,8)
console.log('Passed: 1,000 standard-to-slope conversions, equivalent fractions, separate coefficient/graph errors, and shared scoring.')
