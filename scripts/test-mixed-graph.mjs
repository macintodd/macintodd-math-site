import assert from 'node:assert/strict'
import {mixedModes,takeMixedProblem,makeMixedProblem,checkMixed,mixedReady} from '../src/lib/mixed-graph.ts'
import {slopePoint} from '../src/lib/graph-line.ts'
const empty={xx:'',xy:'',yx:'',yy:''},noSlope={m:'',b:''}
let queue=[],history=[]
for(let i=0;i<240;i++){
 const next=takeMixedProblem(queue,history,()=>0);queue=next.remaining;history.push({problem:next.problem,correct:true})
 if(i%4===3)assert.deepEqual(history.slice(-4).map(r=>r.problem.mode).sort(),[...mixedModes].sort())
 if(i&&i%4===0)assert.notEqual(history[i].problem.mode,history[i-1].problem.mode)
 if(i>=2){const last=history.slice(-3).map(r=>r.problem.line.rise/r.problem.line.run);assert(!(last[0]===last[1]&&last[1]===last[2]))}
}
for(const mode of mixedModes)for(let i=0;i<100;i++){
 const problem=makeMixedProblem(mode,()=>((i*37)%100)/100),line=problem.line,standard=problem.standard
 const read={x:'0',y:String(line.y),rise:String(line.rise),run:String(line.run)}
 const ints=standard?{xx:String(standard.xIntercept),xy:'0',yx:'0',yy:String(standard.yIntercept)}:empty,slopes={m:`${line.rise}/${line.run}`,b:String(line.y)}
 const points=mode==='intercepts'?[{x:standard.xIntercept,y:0},{x:0,y:standard.yIntercept}]:[{x:0,y:line.y},slopePoint(line)]
 assert(checkMixed(problem,ints,slopes,points,read).correct,mode)
 assert(!checkMixed(problem,ints,slopes,[points[0],{x:points[1].x,y:points[1].y+1}],read).correct,mode)
 assert.equal(mixedReady(problem,empty,noSlope),mode==='free')
 if(mode==='free')assert(checkMixed(problem,empty,noSlope,points).correct)
 else if(mode==='intercepts')assert(!checkMixed(problem,{...ints,xx:'999'},slopes,points).correct)
 else if(mode==='slope'){for(const wrong of [{...read,x:'1'},{...read,y:'999'},{...read,rise:'999'},{...read,run:'0'}])assert(!checkMixed(problem,ints,slopes,points,wrong).correct);assert(checkMixed(problem,ints,slopes,points,{...read,rise:String(line.rise*2),run:String(line.run*2)}).correct)}
 else{assert(!checkMixed(problem,ints,{...slopes,b:'999'},points).correct);assert(!checkMixed(problem,ints,{...slopes,m:'999'},points).correct)}
 if(mode==='intercepts'||mode==='convert')assert.equal(problem.form,'standard')
 if(mode==='slope')assert.equal(problem.form,'slope')
}
assert.equal(makeMixedProblem('free',()=>0).form,'standard');assert.equal(makeMixedProblem('free',()=>.9).form,'slope')
console.log('Passed: balanced shuffled task groups, no boundary task repeats or three equal slopes, 400 method/graph checks, missing/wrong entries and open-ended graph-only validation.')
