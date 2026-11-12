import {blankLessonRecord,loadLesson,parallelLesson,parallelNotes,saveLesson,lessonNumber,type LessonProblem,type LessonProgress,type LessonRecord,type PracticeStage} from './parallel-lesson.ts'

export const practiceGoals=[3,2,2,2] as const
export const practiceTitles=['Graph and check','Build point-slope form','Independent practice','Standard form'] as const
export const standardHints=[
 'Rewrite the given equation in slope-intercept form.',
 'Subtract the x-term from both sides.',
 'Divide every term by the coefficient of y.',
] as const

const fractionalSlopes=[[1,2],[-1,2],[2,3],[-2,3],[3,2],[-3,2]] as const
const graphSlopes=[...fractionalSlopes,[1,1],[-1,1],[2,1],[-2,1]] as const
const allSlopes=[...graphSlopes,[3,1],[-3,1],[5,1],[-5,1]] as const
const coefficient=(n:number)=>n===1?'':n===-1?'-':String(n)

export function parallelPracticeProblem(seed:number,serial:number,stage:PracticeStage):LessonProblem{
 let state=(seed+Math.imul(serial+1,0x9e3779b9))|0
 function pick(size:number){
  state=(state+0x6d2b79f5)|0
  let bits=Math.imul(state^state>>>15,state|1)
  bits^=bits+Math.imul(bits^bits>>>7,bits|61)
  return ((bits^bits>>>14)>>>0)%size
 }
 const slopes=stage===0?graphSlopes:stage===3?fractionalSlopes:allSlopes
 const [rise,run]=slopes[(serial+seed%slopes.length)%slopes.length]
 const range=stage===0?4:9
 const b=pick(2*range+1)-range
 const offset=1+pick(2*range)
 const givenB=(b+range+offset)%(2*range+1)-range
 const multiples=stage===0?[-2,-1,1,2]:[-4,-3,-2,-1,1,2,3,4]
 const k=multiples[pick(multiples.length)],m=rise/run
 return {
  id:`Practice ${serial+1}`,slide:5+stage,relation:'parallel',kind:stage===0?'triple':'independent',
  given:{m,b:givenB},point:{x:run*k,y:rise*k+b},answer:{m,b},
  ...(stage===3?{standardForm:`${coefficient(-rise)}x+${run}y=${run*givenB}`}:{}),
 }
}

export function newStudentLesson():LessonProgress{
 return {index:0,records:parallelNotes.map(blankLessonRecord),completedAt:null}
}

export function studentProblem(p:LessonProgress|null,index:number):LessonProblem{
 return parallelNotes[index]??parallelPracticeProblem(p?.practiceSeed??0,index-parallelNotes.length,p?.records[index]?.practiceStage??0)
}

export function startParallelPractice(p:LessonProgress,seed:number):LessonProgress{
 return {...p,index:parallelNotes.length,practiceSeed:seed,records:[...p.records,{...blankLessonRecord(),practiceStage:0}]}
}

export function practiceStreak(records:LessonRecord[],stage:PracticeStage):number{
 let streak=0
 for(const record of records){
  if(record.practiceStage!==stage)continue
  if(record.practiceMiss||record.hintsUsed)streak=0
  else if(record.solved)streak++
 }
 return streak
}

export function followingPracticeStage(records:LessonRecord[],stage:PracticeStage):PracticeStage|null{
 if(practiceStreak(records,stage)<practiceGoals[stage])return stage
 return stage===3?null:(stage+1) as PracticeStage
}

function confirmedRecord(q:LessonProblem,record:LessonRecord):LessonRecord{
 if(!record.solved)return record
 return {...record,blue:lessonNumber(q.given.m),red:lessonNumber(q.answer.m),equation:`y=${lessonNumber(q.answer.m)}x${q.answer.b<0?'-':'+'}${Math.abs(q.answer.b)}`,blueCorrect:true,redCorrect:true,line:q.answer}
}

const checksum=(value:string)=>{let n=17;for(const c of value)n=(Math.imul(n,31)+c.charCodeAt(0))>>>0;return n.toString(36)}
const invalid=()=>Error('The saved progress is inconsistent.')

export function saveStudentLesson(p:LessonProgress,first:string,last:string,hour:string):string{
 // Keep the original notes checkpoint and add compact practice data.
 const records=parallelLesson.map(q=>{const index=parallelNotes.findIndex(note=>note.id===q.id);if(index>=0)return p.records[index];if(q.id==='P2c'&&p.records.slice(0,3).every(r=>r.solved))return {...blankLessonRecord(),solved:true,attempts:1};return blankLessonRecord()})
 const notes=saveLesson({...p,records,completedAt:null},first,last,hour)
 if(p.practiceSeed===undefined)return notes
 const history=p.records.slice(parallelNotes.length).map(r=>{
  const flags=(r.solved?1:0)+(r.practiceMiss?2:0)+(r.hintsUsed??0)*4
  return flags.toString(16)+r.attempts.toString(36)
 }).join('-')
 const payload=[notes.toLowerCase(),p.practiceSeed.toString(36),Math.floor((p.completedAt??0)/60000).toString(36),history].join('.')
 return payload+'.'+checksum(payload)
}

export function loadStudentLesson(code:string,first:string,last:string,hour:string):LessonProgress{
 const clean=code.trim().replace(/\s/g,'').toLowerCase()
 const [notes,seed,time,history,check,...extra]=clean.split('.')
 const legacy=loadLesson(notes,first,last,hour)
 const records=parallelNotes.map(q=>legacy.records[parallelLesson.findIndex(old=>old.id===q.id)])
 const firstUnsolved=records.findIndex(r=>!r.solved)
 const initial={index:firstUnsolved<0?records.length-1:firstUnsolved,records,completedAt:null}
 if(seed===undefined)return initial
 const payload=[notes,seed,time,history].join('.')
 if(firstUnsolved>=0||extra.length||!history||check!==checksum(payload)||!/^\w+$/.test(seed)||!/^\w+$/.test(time))throw invalid()
 const practiceSeed=parseInt(seed,36),minutes=parseInt(time,36)
 if(!Number.isSafeInteger(practiceSeed)||practiceSeed<0||practiceSeed>0xffffffff||practiceSeed.toString(36)!==seed||!Number.isSafeInteger(minutes)||minutes<0||minutes>=2**32||minutes.toString(36)!==time)throw invalid()
 const entries=history.split('-')
 let stage:PracticeStage|null=0
 for(const [serial,entry] of entries.entries()){
  if(stage===null||! /^[0-9a-f][0-9a-z]+$/.test(entry))throw invalid()
  const flags=parseInt(entry[0],16),attempts=parseInt(entry.slice(1),36),solved=!!(flags&1),hintsUsed=flags>>2
  if(!Number.isSafeInteger(attempts)||solved&&attempts<1||!solved&&serial!==entries.length-1||hintsUsed&&stage!==3)throw invalid()
  const q=parallelPracticeProblem(practiceSeed,serial,stage)
  records.push(confirmedRecord(q,{...blankLessonRecord(),practiceStage:stage,solved,attempts,practiceMiss:!!(flags&2),hintsUsed}))
  if(solved)stage=followingPracticeStage(records,stage)
 }
 if((stage===null)!==(minutes>0))throw invalid()
 const lastRecord=records.at(-1)!
 if(lastRecord.solved&&stage!==null)records.push({...blankLessonRecord(),practiceStage:stage})
 return {records,index:records.length-1,practiceSeed,completedAt:minutes?minutes*60000:null}
}
