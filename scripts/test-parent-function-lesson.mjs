import assert from 'node:assert/strict'
import katex from 'katex'
import vm from 'node:vm'
import {freshParentLesson,parentLessonReducer as reduce,parentLessonScore as score,parentLessonMastered as mastered,lessonExamples,lessonValue,lessonEquation,evaluationWork,parentLessonSnapshot,readParentLessonSnapshot,parentLessonStars,parentLessonInfo,parentLessonOrder} from '../src/lib/parent-function-lesson.ts'
import {familyIds} from '../src/lib/function-family-graphs.ts'
import {parentGraphCheck,parentGraphExamples} from '../src/lib/graph-parent-functions.ts'
import {readStarTrail} from '../src/lib/function-family-stars.ts'
import {lessonBridgeBootstrap} from '../src/lib/mathboard/lesson-bridge.ts'
import {spanishText} from '../src/lib/beta-spanish.ts'
const start=seed=>{let s=freshParentLesson();for(const [field,value] of [['first','Test'],['last','Student'],['hour','1']])s=reduce(s,{type:'identity',field,value});return reduce(s,{type:'start',seed})}
function graph(s,{hint=false,miss=false}={}){if(hint)s=reduce(s,{type:'hint'});for(const p of lessonExamples(s.question))s=reduce(s,{type:'point',point:miss&&p.x===0?{x:0,y:9}:p});return reduce(s,{type:'check'})}
function evaluate(s,miss=false){s=reduce(s,{type:'input',value:String(lessonValue(s.question)+(miss?1:0))});return reduce(s,{type:'check'})}
function valid(s){const snapshot=parentLessonSnapshot(s,'es',12);assert.deepEqual(readParentLessonSnapshot(JSON.parse(JSON.stringify(snapshot))),snapshot);assert.deepEqual(readStarTrail(parentLessonStars(s)).completed,s.runs)}
const labels=new Set(),evalFamilies=new Set()
for(const seed of [0,1,17,71,12345,0xffffffff]){
 assert.deepEqual(new Set(parentLessonOrder(seed)),new Set(familyIds))
 let s=start(seed),graphs=0,evals=0
 for(let step=0;s.scene==='practice'&&step<100;step++){
  labels.add(s.question.label);assert(familyIds.includes(s.question.family));assert(!lessonEquation(s.question).includes('sqrt'))
  if(s.question.kind==='graph'){s=graph(s);graphs++}else{evalFamilies.add(s.question.family);const x=s.question.input,f=s.question.family;const expected=f==='constant'?1:f==='linear'?x:f==='absolute'?Math.abs(x):f==='quadratic'?x*x:x*x*x;assert.equal(lessonValue(s.question),expected);s=evaluate(s);evals++}
  katex.renderToString(lessonEquation(s.question),{throwOnError:true});for(const tex of Object.values(evaluationWork(s.question)))katex.renderToString(tex,{throwOnError:true})
  assert.equal(reduce(s,{type:'check'}),s,'duplicate checks grant no second result');valid(s)
  s=reduce(s,{type:'next'});valid(s)
 }
 assert.equal(s.scene,'complete');assert(mastered(s));assert.equal(score(s),10);assert.equal(graphs,10);assert.equal(evals,5);assert(familyIds.every(f=>s.credits[f]===2))
}
assert.deepEqual(labels,new Set(['f','g','h','y']));assert.deepEqual(evalFamilies,new Set(familyIds))
let s=start(71),family=s.question.family
s=graph(s,{miss:true});assert.equal(s.result,'wrong');assert.equal(score(s),0);assert.equal(s.credits[family],0);valid(s)
s=reduce(s,{type:'next'});assert.equal(s.question.kind,'evaluate');assert.equal(s.question.family,family)
// Invalid notation never creates an assessed miss or a deduction.
for(const value of ['', '-', '2.5','answer']){const invalid=reduce(reduce(s,{type:'input',value}),{type:'check'});assert(invalid.invalid);assert.equal(invalid.evalAttempts,0);assert.equal(invalid.debt,0)}
s=evaluate(s,true);assert.equal(s.debt,1);s=reduce(s,{type:'next'});const previous=s.question
s=evaluate(s,true);assert.equal(s.debt,2);s=reduce(s,{type:'next'});assert.notDeepEqual(s.question,previous)
s=evaluate(s);assert.equal(s.debt,1);s=reduce(s,{type:'next'});assert.equal(s.question.kind,'evaluate')
s=evaluate(s,true);assert.equal(s.debt,2);s=reduce(s,{type:'next'})
s=evaluate(s);assert.equal(s.debt,1);s=reduce(s,{type:'next'});s=evaluate(s);assert.equal(s.debt,0);assert.equal(s.recovered,3);s=reduce(s,{type:'next'});assert.equal(s.question.kind,'graph');valid(s)
// Hints teach but cannot bypass either required no-hint graph.
s=graph(s,{hint:true});assert.equal(s.result,'guided');assert.equal(score(s),0);assert(familyIds.every(f=>s.credits[f]===0));s=reduce(s,{type:'next'});assert.equal(s.question.kind,'evaluate');s=evaluate(s);s=reduce(s,{type:'next'})
for(let step=0;s.scene==='practice'&&step<100;step++){s=s.question.kind==='graph'?graph(s):evaluate(s);s=reduce(s,{type:'next'});valid(s)}
assert(mastered(s));assert.equal(score(s),10);assert(s.graphAttempts>10);assert(familyIds.every(f=>s.credits[f]===2))
// A banked graph point is deducted on a miss and returned on the following correct evaluation.
let bank=graph(start(17));assert.equal(score(bank),1);bank=reduce(bank,{type:'next'});assert.equal(bank.question.kind,'evaluate');bank=evaluate(bank,true);assert.equal(score(bank),0);bank=reduce(bank,{type:'next'});bank=evaluate(bank);assert.equal(score(bank),1);valid(bank)
// Report finality is explicit and requires both ratings and a current-language local image.
let report=reduce(bank,{type:'report',now:Date.now()});assert.equal(parentLessonSnapshot(report,'en',0).isComplete,false)
report=reduce(report,{type:'completion',value:{confidence:4,difficulty:3,record:{image:'data:image/png;base64,test',language:'en',identity:'Test'},notice:false,error:''}});assert.equal(parentLessonSnapshot(report,'en',0).isComplete,true);assert.equal(parentLessonSnapshot(report,'es',0).isComplete,false);valid(report)
for(const mutate of [v=>v.customState.state.credits.cubic=3,v=>v.customState.state.debt=99,v=>v.customState.state.question.family='squareRoot',v=>v.customState.state.scratch=[{id:1,path:'<script>',erase:false}],v=>v.customState.state.points=[{x:0,y:0},{x:0,y:0}]]){const snap=JSON.parse(JSON.stringify(parentLessonSnapshot(report,'en',0)));mutate(snap);assert.equal(readParentLessonSnapshot(snap),null)}
const window={location:{pathname:'/apps/beta/graph-evaluate-parent-functions',search:''},addEventListener(){}}
vm.runInNewContext(lessonBridgeBootstrap,{window,URLSearchParams});assert.equal(typeof window.mathBoardAppletSetState,'function');const snap=parentLessonSnapshot(bank,'en',0);window.mathBoardAppletSetState(snap);let restored;window.mathBoardLessonBridge.listen(v=>{restored=readParentLessonSnapshot(v);return !!restored});assert.deepEqual(restored,snap);assert.equal(window.mathBoardLessonBridge.canPublish(),false)
for(const text of [parentLessonInfo[1].value,parentLessonInfo[2].value,'3. Graphing and Evaluating Parent Functions','How independently can you graph and evaluate constant, linear, absolute value, quadratic, and cubic parent functions?'])assert.notEqual(spanishText(text),text,text)
// Parent examples check the real five-family geometry using the existing checker.
for(const f of familyIds){const q={family:f,constant:1};assert(parentGraphCheck(q,parentGraphExamples(q)).correct)}
console.log('Passed five-family/two-graph mastery, five balanced evaluations per perfect run/all notations, negative-input arithmetic/KaTeX, missed/assisted graph requeue, repeated evaluation debt/recovery, no credit duplication, partial/final native reports, quiet early restore, malformed snapshots, stars and Spanish.')
