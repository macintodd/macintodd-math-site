import assert from 'node:assert/strict'
import katex from 'katex'
import { screens,poolGraph,poolEmptyHours,poolVolume,plane } from '../src/content/mathboard/session-one.ts'
import { initialState,numeric,evaluate,lineCorrect,clipLine,safeIndex,restoreState } from '../src/lib/mathboard/model.ts'
import { editAnswer } from '../src/lib/mathboard/keypad.ts'
import { move2048,start2048 } from '../src/lib/mathboard/game.ts'
import { readConfig,released,unlock } from '../src/lib/mathboard/config.ts'
process.env.RESULTS_TEACHER_PASSWORD='local-automated-test-password-not-production'
for(const [text,answer] of [['1/2',.5],['-5/3',-5/3],['-0.25',-.25],['.5',.5],['3/-2',-1.5]])assert.equal(numeric(text),answer)
for(const text of ['','-','1/0','2/','2.3.4','alert(1)'])assert.equal(numeric(text),null)
assert.equal(new Set(screens.map(s=>s.id)).size,screens.length)
let s=initialState('Test Student','3','test')
for(const screen of screens){
 if(screen.equation)katex.renderToString(screen.equation,{throwOnError:true})
 if(screen.kind==='checkpoint')continue
 const state={...s,values:Object.fromEntries((screen.fields??[]).map(f=>[f.id,String(f.answer)])),choice:screen.correctChoice??null,visited:[0,1,5,10,poolEmptyHours],drawn:true,movement:screen.movement??{x:0,y:0},points:screen.target?[screen.target]:screen.line?[{x:0,y:screen.line.b},{x:3,y:3*screen.line.m+screen.line.b}]:[],units:['gallons','hour']}
 if(screen.kind==='rate')state.values={change:'-1440',hours:'2'}
 assert(evaluate(screen,state).correct,screen.id)
 const empty=evaluate(screen,{...s,units:['','']});if(screen.kind!=='connect')assert(!empty.correct,screen.id+' rejects empty')
}
const rate=screens.find(s=>s.id==='rate');assert(evaluate(rate,{...s,values:{change:'-720',hours:'1'},units:['','']}).correct)
assert(lineCorrect([{x:1,y:2.5},{x:3,y:3.5}],.5,2));assert(!lineCorrect([{x:1,y:2.5},{x:1,y:2.5}],.5,2));assert(!lineCorrect([{x:1,y:2.5},{x:3,y:3.6}],.5,2))
const cp1=screens.findIndex(s=>s.checkpoint===1),cp2=screens.findIndex(s=>s.checkpoint===2)
assert.equal(safeIndex(screens.length-1,[]),cp1);assert.equal(safeIndex(screens.length-1,[1]),cp2);assert.equal(safeIndex(screens.length-1,[1,2]),screens.length-1)
const config=readConfig()
assert.deepEqual(config.hours,['1','2','3','4','5','6','7','8']);assert.deepEqual(released(config,{}),[])
assert.throws(()=>unlock(config,1,'wrong',{}));assert(unlock(config,1,'linear',{}));assert.throws(()=>unlock(config,2,'Linear',{}))
const g1=unlock(config,1,'Linear',{});assert.deepEqual(released(config,{'1':g1}),[1]);assert.deepEqual(released(config,{'1':'forged'}),[])
const g2=unlock(config,2,'Linear',{'1':g1});assert.deepEqual(released(config,{'1':g1,'2':g2}),[1,2]);assert.deepEqual(readConfig('old-link'),config)
s.values={m:'-5/3',b:'-10'};s.points=[{x:0,y:4}];s.game={board:start2048(()=>.2),score:4};assert.deepEqual(restoreState(JSON.parse(JSON.stringify(s))),s);assert.equal(restoreState({version:0}),null)
let b=Array(16).fill(0);b[0]=2;b[1]=2;b[2]=2;b[3]=2;let move=move2048(b,'left');assert.deepEqual(move.board.slice(0,4),[4,4,0,0]);assert.equal(move.gained,8);assert(move.changed)
b[0]=4;b[1]=4;b[2]=8;b[3]=0;move=move2048(b,'left');assert.deepEqual(move.board.slice(0,4),[8,8,0,0]);assert.equal(move.gained,8)
assert.equal(poolGraph.ylabel,'Volume (gallons)');assert.equal(poolVolume(0),15000);assert.equal(poolVolume(10),7800);assert.equal(poolVolume(poolEmptyHours),0);assert.equal(poolVolume(30),0);assert.deepEqual(clipLine(.5,2,plane),[{x:-10,y:-3},{x:10,y:7}]);assert(clipLine(-720,15000,poolGraph).every(p=>p.x>=0))
for(const screen of screens)if(screen.graph==='pool')assert(!screen.note,'No opening paper-writing prompts')
console.log(`Passed: ${screens.length} lesson screens; fractions, targeted checks, equivalent graphs, fixed Linear checkpoint gates, tampering/reload clamps, local resume, and 2048 merges.`)

// Keypad edits honor the caret and selected range, including repeated middle edits.
assert.deepEqual(editAnswer('15000','back',3,3),{value:'1500',caret:2})
assert.deepEqual(editAnswer('1234','back',2,2),{value:'134',caret:1})
assert.deepEqual(editAnswer('1234','back',1,3),{value:'14',caret:1})
assert.deepEqual(editAnswer('1234','9',2,2),{value:'12934',caret:3})
assert.deepEqual(editAnswer('1234','9',1,3),{value:'194',caret:2})
assert.deepEqual(editAnswer('1234','back',0,0),{value:'1234',caret:0})
assert.deepEqual(editAnswer('1234','sign',2,2),{value:'-1234',caret:3})
assert.deepEqual(editAnswer('-1234','sign',3,3),{value:'1234',caret:2})
assert.deepEqual(editAnswer('1234','clear',2,2),{value:'',caret:0})
