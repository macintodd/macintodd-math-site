import type {DrawingGameState} from './parallel-drawing-game.ts'
import type {ScratchStroke} from '../app/apps/graph-linear/ScratchPad'
import {parallelNotes,parallelLesson} from './parallel-lesson.ts'
import type {LessonAnimation,LessonProgress,LessonPoint,LessonSegment,checkLessonSegment} from './parallel-lesson.ts'
import type {CompletionDisplayState,ResumeDisplayState} from './mathboard/display-mirror.ts'
export type LessonGraphDisplayState={problemId:string;segment:LessonSegment|null;selected:LessonPoint[];check:ReturnType<typeof checkLessonSegment>|null;zoomProgress:number|null}
export type LessonScratchDisplayState={open:boolean;image:string|null;strokes?:ScratchStroke[];erase?:boolean}
export type ParallelLessonDisplayState={
 app:'parallel-perpendicular-classroom';version:1;teacher:boolean;language:'en'|'es'
 first:string;last:string;hour:string;p:LessonProgress|null;screen:'warmup'|'lesson'|'ready'|'report';warmupGame?:DrawingGameState|null;reveal:number;turn:number;active:'blue'|'red'|'equation';activePart:'num'|'den'
 notice:string;hint:boolean;saved:boolean;resume:string;date:string;session:number
 graphicalNotice:boolean;graphicalAcknowledged:boolean;formatWarning:{prefix:boolean;x:boolean}|null
 scratch?:LessonScratchDisplayState;scrollY?:number
 graphMirror:LessonGraphDisplayState|null;animation:LessonAnimation|null;completionMirror:CompletionDisplayState|null;resumeMirror:ResumeDisplayState|null
}
export function isParallelLessonDisplayState(value:unknown):value is ParallelLessonDisplayState{
 if(!value||typeof value!=='object')return false
 const s=value as Partial<ParallelLessonDisplayState>
 if(s.app!=='parallel-perpendicular-classroom'||s.version!==1||typeof s.teacher!=='boolean'||!['en','es'].includes(s.language??'')||!['warmup','lesson','ready','report'].includes(s.screen??''))return false
 if(s.p===null)return true
 const p=s.p
 if(!p||!Array.isArray(p.records)||!Number.isInteger(p.index)||p.index<0||p.index>=p.records.length)return false
 if(s.teacher)return p.records.length===parallelLesson.length
 if(p.practiceSeed===undefined)return p.records.length===parallelNotes.length&&s.screen!=='report'
 if(!Number.isInteger(p.practiceSeed)||p.practiceSeed<0||p.practiceSeed>0xffffffff||p.records.length<=parallelNotes.length)return false
 return p.records.slice(parallelNotes.length).every(r=>r&&Number.isInteger(r.practiceStage)&&r.practiceStage!>=0&&r.practiceStage!<=3)
}

/** Drop the retired P2c slot from snapshots produced by the previous six-note client. */
export function normalizeParallelSnapshot(value:unknown):unknown{
 if(!value||typeof value!=='object')return value
 const s=value as ParallelLessonDisplayState,p=s.p
 if(s.app!=='parallel-perpendicular-classroom'||s.teacher||!p||!Array.isArray(p.records)||p.records.length<6||p.records[5]?.practiceStage!==undefined)return value
 const records=p.records.filter((_,i)=>i!==3),index=p.index>3?p.index-1:p.index
 return {...s,p:{...p,records,index},...(p.index===3?{graphMirror:null,animation:null,graphicalNotice:false,graphicalAcknowledged:false,formatWarning:null}:{} )}
}
