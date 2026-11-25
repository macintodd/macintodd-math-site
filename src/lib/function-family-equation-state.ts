import {freshGraphFamilyState, type FunctionFamily} from './function-family-graphs.ts'
import type {FamilyStarState} from './function-family-stars.ts'
import {equationFamilyQuestion, validEquationFamily, type EquationKind} from './function-family-equations.ts'
import type {CompletionDisplayState} from './mathboard/display-mirror.ts'
export type EquationPhase = 'parents'|'advanced'
export type EquationStats = {index:number;attempts:number;correct:number;streak:number;best:number;naturalStreak:number;naturalBest:number;selected:FunctionFamily|null;result:null|'right'|'wrong'|'kept';completed:number[]}
export type EquationState = {
 scene:'welcome'|'practice'|'parent-ready'|'complete'|'report';phase:EquationPhase;questionKind:EquationKind
 first:string;last:string;hour:string;seed:number;parents:EquationStats;advanced:EquationStats
 multiUnlocked:boolean;advancedNaturalRun:number;keepsEarned:number;keepsUsed:number
 pendingKeep:null|{phase:EquationPhase;index:number;streak:number;completedBefore:number}
 nextAt:number;infoOpen:boolean;completedAt:number;reportReturn:'practice'|'parent-ready'|'complete';completion:CompletionDisplayState|null
}
export const freshEquationStats=():EquationStats=>({index:0,attempts:0,correct:0,streak:0,best:0,naturalStreak:0,naturalBest:0,selected:null,result:null,completed:[]})
export function freshEquationState():EquationState{return {scene:'welcome',phase:'parents',questionKind:'parent',first:'',last:'',hour:'',seed:0,parents:freshEquationStats(),advanced:freshEquationStats(),multiUnlocked:false,advancedNaturalRun:0,keepsEarned:0,keepsUsed:0,pendingKeep:null,nextAt:0,infoOpen:false,completedAt:0,reportReturn:'practice',completion:null}}
export function equationPhaseSeed(s:EquationState){return s.phase==='parents'?s.seed:(s.seed^0xA32785BD)>>>0}
export function activeEquationQuestion(s:EquationState){return equationFamilyQuestion(equationPhaseSeed(s),s[s.phase].index,s.questionKind)}
export function availableStreakKeeps(s:EquationState){return s.keepsEarned-s.keepsUsed}
export function canKeepStreak(s:EquationState){return s.scene==='practice'&&s.pendingKeep!==null&&availableStreakKeeps(s)>0}
/** Adapt only presentation so widget 1's proven stars and Star Launch remain untouched. */
export function equationStarDisplay(s:EquationState):FamilyStarState {
 const stats=s[s.phase]
 return {...freshGraphFamilyState(),seed:equationPhaseSeed(s),scene:s.scene==='practice'?'practice':'ready',practice:{index:stats.index,selected:stats.selected,attempts:stats.attempts,correct:stats.correct,streak:stats.streak,best:stats.best},starTrail:{completed:stats.completed,earlierCorrect:0}}
}
export type EquationAction =
 |{type:'identity';field:'first'|'last'|'hour';value:string}
 |{type:'start';seed:number}|{type:'advanced'}
 |{type:'answer';family:FunctionFamily;now:number}|{type:'tick';now:number}|{type:'keep';now:number}
 |{type:'info';open:boolean}|{type:'report';now:number}|{type:'return';now:number}
 |{type:'completion';value:CompletionDisplayState}|{type:'restore';value:EquationState}
export function equationReducer(s:EquationState,action:EquationAction):EquationState {
 switch(action.type){
  case 'identity':return s.scene==='welcome'?{...s,[action.field]:action.value.slice(0,40)}:s
  case 'start':return s.scene==='welcome'&&s.first.trim()&&s.last.trim()&&/^[1-8]$/.test(s.hour)?{...s,scene:'practice',seed:action.seed>>>0}:s
  case 'info':return s.infoOpen===action.open?s:{...s,infoOpen:action.open}
  case 'advanced':return s.scene==='parent-ready'?{...s,scene:'practice',phase:'advanced',questionKind:'single',pendingKeep:null,nextAt:0}:s
  case 'answer':{
   const previous=s[s.phase]
   if(s.scene!=='practice'||previous.selected!==null||s.infoOpen)return s
   const right=activeEquationQuestion(s).family===action.family
   const streak=right?previous.streak+1:0
   const natural=s.phase==='advanced'?(right?s.advancedNaturalRun+1:0):s.advancedNaturalRun
   const naturalStreak=right?previous.naturalStreak+1:0
   const stats={...previous,naturalStreak,naturalBest:Math.max(previous.naturalBest,naturalStreak),selected:action.family,result:right?'right' as const:'wrong' as const,attempts:previous.attempts+1,correct:previous.correct+(right?1:0),streak,best:Math.max(previous.best,streak),completed:!right&&previous.streak?[...previous.completed,previous.streak]:previous.completed}
   // Award policy is supplied by the activity's teacher-approved rules below.
   const earns=earnsEquationKeep(s,stats,natural)
   return {...s,[s.phase]:stats,advancedNaturalRun:natural,keepsEarned:s.keepsEarned+(earns?1:0),pendingKeep:!right&&previous.streak?{phase:s.phase,index:previous.index,streak:previous.streak,completedBefore:previous.completed.length}:null,multiUnlocked:s.multiUnlocked||s.phase==='advanced'&&streak>=5,nextAt:action.now+(right?1400:3000),completion:null}
  }
  case 'keep':{
   if(!canKeepStreak(s))return s
   const pending=s.pendingKeep!
   const stats=s[pending.phase]
   return {...s,[pending.phase]:{...stats,streak:pending.streak,completed:stats.completed.slice(0,pending.completedBefore),result:stats.index===pending.index?'kept':stats.result},keepsUsed:s.keepsUsed+1,pendingKeep:null,nextAt:stats.index===pending.index?action.now+1400:s.nextAt}
  }
  case 'tick':{
   if(s.scene!=='practice'||!s.nextAt||action.now<s.nextAt||s.infoOpen)return s
   const stats=s[s.phase]
   if(stats.streak>=10)return {...s,scene:s.phase==='parents'?'parent-ready':'complete',nextAt:0,pendingKeep:null}
   return {...s,[s.phase]:{...stats,index:stats.index+1,selected:null,result:null},questionKind:s.phase==='parents'?'parent':s.multiUnlocked?'multi':'single',nextAt:0}
  }
  case 'report':return ['practice','parent-ready','complete'].includes(s.scene)?{...s,scene:'report',reportReturn:s.scene as EquationState['reportReturn'],completedAt:action.now,completion:null,infoOpen:false}:s
  case 'return':return s.scene==='report'?{...s,scene:s.reportReturn,completion:null,nextAt:s.reportReturn==='practice'&&s[s.phase].selected!==null?action.now+1400:s.nextAt}:s
  case 'completion':return s.scene==='report'?{...s,completion:action.value}:s
  case 'restore':return action.value
 }
}

export type EquationSnapshot={
 app:'algebra2-function-family-equations';version:1;score:number;maxScore:10;isComplete:boolean;scoreDisplay:string
 answeredItems:number;correctFirstTry:number;longestStreak:number
 extraData:{parentBestStreak:number;advancedBestStreak:number;currentStreak:number;streakKeepsEarned:number;streakKeepsUsed:number;round:string}
 customState:{state:EquationState;language:'en'|'es';scrollY:number}
}
export function equationSnapshot(state:EquationState,language:'en'|'es',scrollY:number):EquationSnapshot {
 const score=equationScore(state)
 return {app:'algebra2-function-family-equations',version:1,score,maxScore:10,scoreDisplay:`${score}/10`,isComplete:state.scene==='report'&&!!state.completion?.record&&state.completion.record.language===language&&state.completion.confidence>0&&state.completion.difficulty>0,
 answeredItems:state.parents.attempts+state.advanced.attempts,correctFirstTry:state.parents.correct+state.advanced.correct,longestStreak:Math.max(state.parents.naturalBest,state.advanced.naturalBest),
 extraData:{parentBestStreak:state.parents.best,advancedBestStreak:state.advanced.best,currentStreak:state[state.phase].streak,streakKeepsEarned:state.keepsEarned,streakKeepsUsed:state.keepsUsed,round:state.phase},customState:{state,language,scrollY}}
}
const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v)
const count=(v:unknown,max=1_000_000):v is number=>typeof v==='number'&&Number.isInteger(v)&&v>=0&&v<=max
function validStats(v:unknown):v is EquationStats {
 if(!object(v)||![v.index,v.attempts,v.correct].every(n=>count(n))||!count(v.streak,10)||!count(v.best,10)||!count(v.naturalStreak,10)||!count(v.naturalBest,10)||!(v.selected===null||validEquationFamily(v.selected))||![null,'right','wrong','kept'].includes(v.result as null|'right'|'wrong'|'kept'))return false
 const s=v as unknown as EquationStats
 return s.naturalStreak<=s.streak&&s.naturalBest>=s.naturalStreak&&s.naturalBest<=s.best&&s.best>=s.streak&&s.correct>=s.best&&s.correct<=s.attempts&&s.attempts===s.index+(s.selected===null?0:1)&&(s.result===null)===(s.selected===null)&&Array.isArray(s.completed)&&s.completed.length<=s.attempts&&s.completed.every(n=>count(n,10)&&n>0)&&s.completed.reduce((sum,n)=>sum+n,0)+s.streak===s.correct
}
export function readEquationSnapshot(value:unknown):EquationSnapshot|null {
 if(!object(value)||value.app!=='algebra2-function-family-equations'||value.version!==1||!object(value.customState))return null
 const {state:s,language,scrollY}=value.customState
 if(!object(s)||!['en','es'].includes(String(language))||!count(scrollY,10_000_000))return null
 if(!['welcome','practice','parent-ready','complete','report'].includes(String(s.scene))||!['parents','advanced'].includes(String(s.phase))||!['parent','single','multi'].includes(String(s.questionKind))||!['practice','parent-ready','complete'].includes(String(s.reportReturn)))return null
 if(![s.first,s.last,s.hour].every(v=>typeof v==='string'&&v.length<=40)||!count(s.seed,0xffffffff)||!count(s.completedAt,Number.MAX_SAFE_INTEGER)||!count(s.nextAt,Number.MAX_SAFE_INTEGER)||!validStats(s.parents)||!validStats(s.advanced))return null
 if(typeof s.multiUnlocked!=='boolean'||typeof s.infoOpen!=='boolean'||![s.advancedNaturalRun,s.keepsEarned,s.keepsUsed].every(n=>count(n))||(s.keepsUsed as number)>(s.keepsEarned as number))return null
 if(s.phase==='advanced'&&s.parents.best!==10||s.phase==='parents'&&s.questionKind!=='parent'||s.phase==='advanced'&&s.questionKind==='parent'||s.questionKind==='multi'&&!s.multiUnlocked)return null
 if(s.pendingKeep!==null){
  const p=s.pendingKeep
  if(!object(p)||p.phase!==s.phase||!count(p.index)||!count(p.streak,10)||p.streak===0||!count(p.completedBefore))return null
  const stats=s[s.phase as EquationPhase] as EquationStats
  if(stats.streak!==0||p.index>stats.index||stats.index>p.index+1||p.completedBefore!==stats.completed.length-1||stats.completed[p.completedBefore]!==p.streak)return null
 }
 if(s.completion!==null){const c=s.completion;if(!object(c)||!count(c.confidence,5)||!count(c.difficulty,5)||typeof c.notice!=='boolean'||typeof c.error!=='string')return null
  if(c.record!==null&&(!object(c.record)||typeof c.record.image!=='string'||!c.record.image.startsWith('data:image/png;base64,')||typeof c.record.identity!=='string'||!['en','es'].includes(String(c.record.language))))return null
 }
 return equationSnapshot(s as unknown as EquationState,language as 'en'|'es',scrollY)
}
/** Parent partial credit scales the best run to five points. Intro-only completion earns five;
 * once advanced is attempted, that round's best credited run is the grade (including below five). */
export function equationScore(s:EquationState){return s.advanced.attempts?Math.min(10,s.advanced.best):s.parents.best>=10?5:Math.min(5,s.parents.best/2)}
function earnsEquationKeep(s:EquationState,stats:EquationStats,natural:number){return s.phase==='parents'?stats.attempts===8:stats.result==='right'&&natural>0&&natural%8===0}
