import type {LessonAnimation,LessonProgress,LessonPoint,LessonSegment,checkLessonSegment} from './parallel-lesson.ts'
import type {CompletionDisplayState,ResumeDisplayState} from './mathboard/display-mirror.ts'
export type LessonGraphDisplayState={problemId:string;segment:LessonSegment|null;selected:LessonPoint[];check:ReturnType<typeof checkLessonSegment>|null;zoomProgress:number|null}
export type LessonScratchDisplayState={open:boolean;image:string|null}
export type ParallelLessonDisplayState={
 app:'parallel-perpendicular-classroom';version:1;teacher:boolean;language:'en'|'es'
 first:string;last:string;hour:string;p:LessonProgress|null;screen:'lesson'|'report';reveal:number;turn:number;active:'blue'|'red'|'equation';activePart:'num'|'den'
 notice:string;hint:boolean;saved:boolean;resume:string;date:string;session:number;image:{url:string;language:string}|null
 graphicalNotice:boolean;graphicalAcknowledged:boolean;formatWarning:{prefix:boolean;x:boolean}|null
 scratch?:LessonScratchDisplayState
 graphMirror:LessonGraphDisplayState|null;animation:LessonAnimation|null;completionMirror:CompletionDisplayState|null;resumeMirror:ResumeDisplayState|null
}
export type ParallelLessonBridgeWindow=Window & {MathBoardApplet?:{publishState?:(state:ParallelLessonDisplayState)=>void};mathBoardAppletSetState?:((state:unknown)=>void)}
export function isParallelLessonDisplayState(value:unknown):value is ParallelLessonDisplayState{
 if(!value||typeof value!=='object')return false
 const s=value as Partial<ParallelLessonDisplayState>
 if(s.app!=='parallel-perpendicular-classroom'||s.version!==1||typeof s.teacher!=='boolean'||!['en','es'].includes(s.language??'')||!['lesson','report'].includes(s.screen??''))return false
 if(s.p!==null&&(!s.p||!Number.isInteger(s.p.index)||s.p.index<0||s.p.index>11||!Array.isArray(s.p.records)||s.p.records.length!==12))return false
 return true
}
