import assert from 'node:assert/strict'
import { correctGraph,lineEnds,slopePoint,graphProgress,onLine } from '../src/lib/graph-line.ts'
import { generateEquationLine } from '../src/lib/line-equation.ts'
for(let i=0;i<1500;i++){
 const line=generateEquationLine(),a={x:0,y:line.y},b=slopePoint(line)
 assert(Number.isInteger(b.x)&&Number.isInteger(b.y)&&Math.abs(b.x)<=10&&Math.abs(b.y)<=10)
 assert(correctGraph(line,[a,b]));assert(correctGraph(line,[b,a]));assert(!correctGraph(line,[a,a]));assert(!correctGraph(line,[a]));assert(!correctGraph(line,[a,{x:b.x,y:b.y+1}]))
 const ends=lineEnds(a,b);assert.equal(ends.length,2)
 for(const p of ends){assert(Math.abs(p.x)<=10+1e-8&&Math.abs(p.y)<=10+1e-8);assert(Math.abs(Math.abs(p.x)-10)<1e-8||Math.abs(Math.abs(p.y)-10)<1e-8);assert(Math.abs((p.y-line.y)*line.run-p.x*line.rise)<1e-7)}
}
assert.deepEqual(lineEnds({x:2,y:1},{x:2,y:3}),[{x:2,y:-10},{x:2,y:10}])
assert.deepEqual(lineEnds({x:-1,y:4},{x:3,y:4}),[{x:-10,y:4},{x:10,y:4}])
assert.deepEqual(lineEnds({x:0,y:0},{x:0,y:0}),[])
assert(onLine({rise:0,run:1,x:0,y:3},{x:7,y:3}))
let p=graphProgress([true,true,true,true,false,true,true,true,true,false,true,true]);assert.equal(p.correct,10);assert.equal(p.bestStreak,4);assert.equal(p.score,8);assert(p.canSubmit);assert(!p.completed)
p=graphProgress([...Array(6).fill(true),false,...Array(4).fill(true)]);assert(p.completed);assert.equal(p.score,10);assert.equal(p.bestStreak,6);assert.equal(p.streak,4)
p=graphProgress(Array(6).fill(true));assert(!p.canSubmit);assert(!p.completed);assert.equal(p.score,6)
console.log('Passed: 1,500 graph checks, clipping including vertical/horizontal lines, wrong and duplicate points, six-streak scoring and completion.')
