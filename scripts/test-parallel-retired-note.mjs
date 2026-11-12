import assert from 'node:assert/strict'
import {parallelNotes,parallelLesson,blankLessonRecord,saveLesson,loadLesson} from '../src/lib/parallel-lesson.ts'
import {newStudentLesson,studentProblem,startParallelPractice,saveStudentLesson,loadStudentLesson,followingPracticeStage} from '../src/lib/parallel-practice.ts'
import {normalizeParallelSnapshot,isParallelLessonDisplayState} from '../src/lib/parallel-lesson-mirror.ts'
assert.deepEqual(parallelNotes.map(q=>q.id),['P1','P2a','P2b','P3','P4']);assert.equal(parallelLesson[3].id,'P2c','Legacy code catalog must stay stable');
const done=(attempts=1)=>({...blankLessonRecord(),solved:true,attempts});
for(let count=0;count<=6;count++){
 const old={index:Math.min(count,11),records:parallelLesson.map((_,i)=>i<count?done(i+1):blankLessonRecord()),completedAt:null};
 const restored=loadStudentLesson(saveLesson(old,'Maya','Student','4'),'Maya','Student','4');
 const expected=parallelNotes.map(q=>old.records[parallelLesson.findIndex(v=>v.id===q.id)]);
 assert.equal(restored.records.length,5);assert.deepEqual(restored.records.map(r=>r.solved),expected.map(r=>r.solved));assert.deepEqual(restored.records.map(r=>r.attempts),expected.map(r=>r.attempts));
 assert.notEqual(studentProblem(restored,restored.index).id,'P2c');if(count===3||count===4)assert.equal(studentProblem(restored,restored.index).id,'P3');
}
for(let count=0;count<=5;count++){
 const p={...newStudentLesson(),index:Math.min(count,4),records:parallelNotes.map((_,i)=>i<count?done(i+1):blankLessonRecord())};
 const code=saveStudentLesson(p,'Maya','Student','4'),legacy=loadLesson(code,'Maya','Student','4'),restored=loadStudentLesson(code,'Maya','Student','4');
 assert.equal(legacy.records[3].solved,count>=3);assert.deepEqual(restored.records.map(r=>r.attempts),p.records.map(r=>r.attempts));assert.deepEqual(restored.records.map(r=>r.solved),p.records.map(r=>r.solved));
}
const notes={...newStudentLesson(),records:parallelNotes.map(()=>done())};let p=startParallelPractice(notes,345),stage=0;
for(let i=0;i<9;i++){const r=p.records.at(-1);Object.assign(r,done(),{practiceStage:stage});const next=followingPracticeStage(p.records,stage);if(next===null){p.completedAt=Date.now();break}stage=next;p.records.push({...blankLessonRecord(),practiceStage:stage});p.index=p.records.length-1}
const restored=loadStudentLesson(saveStudentLesson(p,'Maya','Student','4'),'Maya','Student','4');assert.equal(restored.practiceSeed,345);assert.deepEqual(restored.records.map(r=>r.practiceStage),p.records.map(r=>r.practiceStage));assert.equal(restored.records.length,p.records.length);
// Native snapshots from the old six-note client remap indexes and keep the practice tail.
const base={app:'parallel-perpendicular-classroom',version:1,teacher:false,language:'en',screen:'lesson'};
for(const oldIndex of [0,2,3,4,5,6]){
 const records=parallelLesson.slice(0,6).map(()=>done());if(oldIndex===6)records.push({...blankLessonRecord(),practiceStage:0});
 const snapshot=normalizeParallelSnapshot({...base,p:{index:oldIndex,records,completedAt:null,...(oldIndex===6?{practiceSeed:345}:{})},graphMirror:{problemId:parallelLesson[oldIndex]?.id}});
 assert(isParallelLessonDisplayState(snapshot));assert.equal(snapshot.p.index,oldIndex>3?oldIndex-1:oldIndex);assert.equal(snapshot.p.records.length,records.length-1);if(oldIndex===3)assert.equal(snapshot.graphMirror,null);
}
const current={...base,p:startParallelPractice(notes,345)};assert.equal(normalizeParallelSnapshot(current),current);
console.log('Passed five active notes, retired P2c exclusion, old/new PPL mapping, practice history completion and old MathBoard snapshot migration.');
// A code issued before this change may contain six notes plus compact generated practice.
const oldNotes={index:5,records:parallelLesson.map((_,i)=>i<6?done():blankLessonRecord()),completedAt:null};
const oldHistory=Array.from({length:9},()=> '11').join('-'),minutes=Math.floor(Date.now()/60000),payload=[saveLesson(oldNotes,'Maya','Student','4').toLowerCase(),(345).toString(36),minutes.toString(36),oldHistory].join('.');
let checksum=17;for(const c of payload)checksum=(Math.imul(checksum,31)+c.charCodeAt(0))>>>0;
const oldPractice=loadStudentLesson(payload+'.'+checksum.toString(36),'Maya','Student','4');assert.equal(oldPractice.records.length,14);assert(oldPractice.records.every(r=>r.solved));assert.equal(oldPractice.completedAt,minutes*60000);assert.equal(studentProblem(oldPractice,5).id,'Practice 1');
console.log('Passed pre-removal six-note practice-code completion history.');
