import assert from 'node:assert/strict'
import {freshEquationState,equationReducer as reduce,activeEquationQuestion,equationSnapshot,readEquationSnapshot,equationStarDisplay,equationScore,availableStreakKeeps,canKeepStreak} from '../src/lib/function-family-equation-state.ts'
import {readStarTrail} from '../src/lib/function-family-stars.ts'
let now=10000
function start(){let s=freshEquationState();for(const [field,value] of [['first','Test'],['last','Student'],['hour','3']])s=reduce(s,{type:'identity',field,value});return reduce(s,{type:'start',seed:71})}
function answer(s,right=true){return reduce(s,{type:'answer',family:right?activeEquationQuestion(s).family:['constant','linear','absolute','quadratic','cubic'].find(f=>f!==activeEquationQuestion(s).family),now:now+=4000})}
function next(s){return reduce(s,{type:'tick',now:now+=4000})}
function valid(s){const snap=equationSnapshot(s,'en',23);assert.deepEqual(readEquationSnapshot(JSON.parse(JSON.stringify(snap))),snap);const p=s[s.phase];assert.deepEqual(readStarTrail(equationStarDisplay(s)).completed,p.completed)}
let s=start();valid(s)
for(let i=0;i<10;i++){assert.equal(activeEquationQuestion(s).kind,'parent');s=answer(s);assert.equal(reduce(s,{type:'answer',family:'linear',now}),s);valid(s);s=next(s)}
assert.equal(s.scene,'parent-ready');assert.equal(equationScore(s),5)
const intro=s
s=reduce(s,{type:'advanced'});assert.equal(s.phase,'advanced');assert.equal(s.advanced.streak,0);assert.deepEqual(readStarTrail(equationStarDisplay(s)).completed,[])
for(let i=0;i<5;i++){assert.equal(activeEquationQuestion(s).kind,'single');s=answer(s);assert.equal(activeEquationQuestion(s).kind,'single');s=next(s);valid(s)}
assert.equal(s.multiUnlocked,true);assert.equal(activeEquationQuestion(s).kind,'multi')
const before=s
s=answer(s,false);assert.equal(s.advanced.streak,0);assert.deepEqual(s.advanced.completed,[5]);assert(canKeepStreak(s));valid(s)
s=next(s);assert(canKeepStreak(s));const attempts=s.advanced.attempts,correct=s.advanced.correct
s=reduce(s,{type:'keep',now});assert.equal(s.advanced.streak,5);assert.equal(s.advanced.attempts,attempts);assert.equal(s.advanced.correct,correct);assert.deepEqual(s.advanced.completed,[]);assert.equal(s.keepsUsed,1);assert.equal(availableStreakKeeps(s),0);assert.equal(reduce(s,{type:'keep',now}),s);valid(s)
for(let i=0;i<5;i++){assert.equal(activeEquationQuestion(s).kind,'multi');s=answer(s);s=next(s);valid(s)}
assert.equal(s.scene,'complete');assert.equal(equationScore(s),10)
s=reduce(s,{type:'report',now});assert.equal(equationSnapshot(s,'en',0).isComplete,false)
s=reduce(s,{type:'completion',value:{confidence:5,difficulty:3,record:{image:'data:image/png;base64,abc',language:'en',identity:'Test'},notice:false,error:''}});assert.equal(equationSnapshot(s,'en',0).isComplete,true);assert.equal(equationSnapshot(s,'es',0).isComplete,false);valid(s)
assert.equal(readEquationSnapshot({...equationSnapshot(s,'en',0),app:'foreign'}),null)
for(const mutate of [v=>v.customState.state.advanced.streak=11,v=>v.customState.state.keepsUsed=900,v=>v.customState.state.advanced.completed=[99],v=>v.customState.state.pendingKeep={phase:'advanced',index:0,streak:2,completedBefore:0}]){const v=JSON.parse(JSON.stringify(equationSnapshot(s,'en',0)));mutate(v);assert.equal(readEquationSnapshot(v),null)}
let missed=answer(before,false);missed=next(missed);missed=answer(missed);assert.equal(canKeepStreak(missed),false);assert.equal(activeEquationQuestion(missed).kind,'multi')
let earning=reduce(intro,{type:'advanced'});for(let i=0;i<8;i++)earning=next(answer(earning));assert.equal(earning.keepsEarned,2);assert.equal(availableStreakKeeps(earning),2)
assert.equal(equationScore(freshEquationState()),0)
console.log('Passed both 10-answer gates, quiet snapshots, hidden progression latch, duplicate answers, phase star reset, Keep recovery/expiry/accounting, final reflections and invalid states.')
// Parent completion secures five points through every advanced answer/miss/report.
let partial=start();for(let i=0;i<3;i++)partial=next(answer(partial));assert.equal(equationScore(partial),1.5)
let low=reduce(intro,{type:'advanced'});low=next(answer(low));assert.equal(equationScore(low),5)
low=answer(low,false);low=reduce(low,{type:'keep',now});assert.equal(equationSnapshot(low,'en',0).longestStreak,10)
assert.equal(low.advanced.naturalStreak,0);assert.equal(low.advanced.streak,1)
// Early bootstrap registers this app with or without a native object, without changing the installer.
const {default:vm}=await import('node:vm')
const {lessonBridgeBootstrap}=await import('../src/lib/mathboard/lesson-bridge.ts')
for(const native of [true,false]){
 const window={location:{pathname:'/apps/beta/function-family-equations',search:''},addEventListener(){}}
 if(native)window.MathBoardApplet={}
 vm.runInNewContext(lessonBridgeBootstrap,{window,URLSearchParams})
 assert.equal(typeof window.mathBoardAppletSetState,'function')
 const sent=equationSnapshot(before,'es',12);window.mathBoardAppletSetState(sent)
 let received;window.mathBoardLessonBridge.listen(s=>{received=s;return !!readEquationSnapshot(s)})
 assert.deepEqual(received,sent);assert.equal(window.mathBoardLessonBridge.canPublish(),false)
}
const {spanishText}=await import('../src/lib/beta-spanish.ts')
const {equationFamilyInfo}=await import('../src/lib/function-family-equation-info.ts')
for(const text of ['2. Identify Function Family by Equation','How independently can you identify constant, linear, absolute value, quadratic, and cubic function families from equations?',...equationFamilyInfo.map(x=>x.value)])assert.notEqual(spanishText(text),text,text)
console.log('Passed partial/advanced grades, honest unassisted run counters, document-head route callback/queue, and new card/reflection Spanish.')

let floor=reduce(intro,{type:'advanced'})
for(let n=0;n<=10;n++){
 assert.equal(equationScore(floor),Math.max(5,n))
 const snap=equationSnapshot(floor,'en',0)
 assert.equal(snap.score,Math.max(5,n));assert.equal(snap.scoreDisplay,`${Math.max(5,n)}/10`)
 valid(floor)
 if(n<10)floor=next(answer(floor))
}
let fallen=next(answer(before,false));assert.equal(equationScore(fallen),5)
let six=next(answer(before));six=next(answer(six,false));assert.equal(equationScore(six),6)
let early=reduce(low,{type:'report',now})
early=reduce(early,{type:'completion',value:{confidence:4,difficulty:3,record:{image:'data:image/png;base64,old',language:'en',identity:'Test'},notice:false,error:''}})
const oldRecord=equationSnapshot(early,'en',0);oldRecord.score=1;oldRecord.scoreDisplay='1/10'
const restored=readEquationSnapshot(oldRecord)
assert.equal(restored.score,5);assert.equal(restored.isComplete,false);assert.equal(restored.customState.state.completion.record,null)
assert.equal(restored.customState.state.completion.confidence,4);assert.deepEqual(restored.customState.state.advanced,early.advanced)
assert.equal(readEquationSnapshot(equationSnapshot(early,'en',0)).isComplete,true)
console.log('Passed secured five-point minimum at advanced streaks 0–10, misses, native/report scores, compatible restoration and stale-score image invalidation.')
let eightAnswered=start();for(let n=0;n<8;n++)eightAnswered=next(answer(eightAnswered,false))
assert.equal(eightAnswered.parents.correct,0);assert.equal(eightAnswered.keepsEarned,1);assert.equal(canKeepStreak(eightAnswered),false)
const viewing=answer(start());assert.equal(viewing.nextAt-now,3000)
assert.equal(reduce(viewing,{type:'tick',now:viewing.nextAt-1}),viewing)
assert.equal(reduce(viewing,{type:'tick',now:viewing.nextAt}).parents.selected,null)
const correction=answer(start(),false);assert.equal(correction.nextAt-now,4000)
assert.equal(reduce(correction,{type:'tick',now:correction.nextAt-1}),correction)
console.log('Passed graph review pauses before automatic progression after both correct and incorrect answers.')
