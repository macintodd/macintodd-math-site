import assert from 'node:assert/strict'
import * as p from '../src/lib/parallel-practice.ts'
import {blankLessonRecord,parallelNotes} from '../src/lib/parallel-lesson.ts'
const save=x=>p.saveStudentLesson(x,'Maya','Student','4')
const load=x=>p.loadStudentLesson(x,'Maya','Student','4')
let session=p.skipParallelWarmup(p.newStudentLesson(),123)
assert.equal(session.records.length,parallelNotes.length+1)
assert.equal(session.records[session.index].practiceStage,2)
assert(session.records.every(r=>!r.solved))
assert.equal(load(save(session)).warmupSkipped,true)
assert.deepEqual(p.skipParallelWarmup(session,999),session)
// Partial guided work and seed survive, including an unfinished abandoned warm-up.
let partial=p.startParallelPractice(p.newStudentLesson(),234)
partial.records[0]={...blankLessonRecord(),solved:true,attempts:2}
partial.records.at(-1).attempts=3
partial=p.skipParallelWarmup(partial,999)
const restored=load(save(partial))
assert.equal(restored.practiceSeed,234)
assert.equal(restored.records[0].attempts,2)
assert.equal(restored.records[parallelNotes.length].attempts,3)
assert.equal(restored.records.at(-1).practiceStage,2)
assert.throws(()=>p.loadStudentLesson(save(partial),'Other','Student','4'))
assert.throws(()=>p.loadStudentLesson(save(partial),'Maya','Student','7'))
assert.throws(()=>load(save(partial)+'a'))
// Independent misses must still rebuild the streak, followed by standard-form practice.
for(const miss of [true,false,false,false,false]){
 const record=session.records.at(-1)
 record.solved=true;record.attempts=miss?2:1;record.practiceMiss=miss
 const next=p.followingPracticeStage(session.records,record.practiceStage)
 if(next===null){session.completedAt=1800000000000;break}
 session.records.push({...blankLessonRecord(),practiceStage:next});session.index++
 session=load(save(session))
}
assert(session.completedAt)
assert.equal(p.practiceStreak(session.records,2),2)
assert.equal(p.practiceStreak(session.records,3),2)
assert.equal(load(save(session)).completedAt,session.completedAt)
assert(session.records.slice(0,parallelNotes.length).every(r=>!r.solved))
// Optional notes may be revisited out of order without breaking the new resume format.
session.records[3]={...blankLessonRecord(),solved:true,attempts:1}
assert(load(save(session)).records[3].solved)
assert.equal(p.skipParallelWarmup(session,999).completedAt,session.completedAt)
console.log('Passed optional warm-up skips, preserved work/seed, identity/checksum validation, independent and standard-form gates, completion, and resume round trips.')
