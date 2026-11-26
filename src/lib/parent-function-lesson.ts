import {familyIds, type FunctionFamily, freshGraphFamilyState} from './function-family-graphs.ts'
import {parentGraphCheck,parentGraphExamples,parentGraphTex,parentGraphValue,requiredParentPoints,type ParentPoint} from './graph-parent-functions.ts'
import type {CompletionDisplayState} from './mathboard/display-mirror.ts'
import type {FamilyStarState} from './function-family-stars.ts'
import type {ScratchStroke} from '../app/apps/graph-linear/ScratchPad.tsx'
export const parentLessonSlug='beta/graph-evaluate-parent-functions'
export const parentLessonTitle='3. Graphing and Evaluating Parent Functions'
export const parentLessonSkill='Graph and evaluate constant, linear, absolute value, quadratic, and cubic parent functions.'
export const parentLessonInfo=[
 {label:'Functions',value:'constant, linear, absolute value, quadratic, cubic'},
 {label:'Scoring',value:'Two no-hint graphs per family earn 10 points. Missed evaluations deduct points; correct evaluations earn them back.'},
 {label:'Special Features',value:'Tap-to-plot graphs, mixed function notation, worked feedback, scratch paper and Star Launch.'},
] as const
export type ParentLabel='f'|'g'|'h'|'y'
export type LessonQuestion={kind:'graph'|'evaluate';family:FunctionFamily;label:ParentLabel;input:number}
export type ParentLessonState={
 scene:'welcome'|'practice'|'complete'|'report';first:string;last:string;hour:string;seed:number;index:number
 question:LessonQuestion;graphCursor:number;evalSerial:number;graphsSinceEval:number;credits:Record<FunctionFamily,number>
 points:ParentPoint[];cursor:ParentPoint;gridFocus:boolean;hintUsed:boolean;input:string;invalid:boolean
 result:null|'right'|'wrong'|'guided';recoveredThis:boolean;graphAttempts:number;graphCorrect:number;evalAttempts:number;evalCorrect:number;evalMisses:number;recovered:number;debt:number;hints:number
 correct:number;streak:number;best:number;runs:number[];infoOpen:boolean;scratchOpen:boolean;scratch:ScratchStroke[];erase:boolean
 completedAt:number;reportReturn:'practice'|'complete';completion:CompletionDisplayState|null
}
export function freshParentLesson():ParentLessonState{return {scene:'welcome',first:'',last:'',hour:'',seed:0,index:0,question:{kind:'graph',family:'linear',label:'f',input:0},graphCursor:0,evalSerial:0,graphsSinceEval:0,credits:{constant:0,linear:0,absolute:0,quadratic:0,cubic:0},points:[],cursor:{x:0,y:0},gridFocus:false,hintUsed:false,input:'',invalid:false,result:null,recoveredThis:false,graphAttempts:0,graphCorrect:0,evalAttempts:0,evalCorrect:0,evalMisses:0,recovered:0,debt:0,hints:0,correct:0,streak:0,best:0,runs:[],infoOpen:false,scratchOpen:false,scratch:[],erase:false,completedAt:0,reportReturn:'practice',completion:null}}
export const graphSpec=(q:LessonQuestion)=>({family:q.family,constant:1})
export const lessonEquation=(q:LessonQuestion)=>parentGraphTex(graphSpec(q)).replace('y=',q.label==='y'?'y=':`${q.label}(x)=`)
export const lessonValue=(q:LessonQuestion)=>parentGraphValue(graphSpec(q),q.input)!
export const lessonExamples=(q:LessonQuestion)=>parentGraphExamples(graphSpec(q))
export const lessonMinimum=(q:LessonQuestion)=>requiredParentPoints(graphSpec(q))
export function graphCredits(s:ParentLessonState){return familyIds.reduce((sum,f)=>sum+s.credits[f],0)}
export function parentLessonScore(s:ParentLessonState){return Math.max(0,Math.min(10,graphCredits(s)-s.debt))}
export function parentLessonMastered(s:ParentLessonState){return familyIds.every(f=>s.credits[f]===2)&&s.debt===0}
function random(seed:number){let n=seed>>>0;return()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/2**32}}
export function parentLessonOrder(seed:number){const rng=random(seed),order=[...familyIds];for(let i=4;i>0;i--){const j=Math.floor(rng()*(i+1));[order[i],order[j]]=[order[j],order[i]]}return order}
function label(seed:number,index:number):ParentLabel{return (['f','g','h','y'] as const)[(seed+index)%4]}
function nextGraph(s:ParentLessonState,index:number){const order=parentLessonOrder(s.seed);for(let offset=0;offset<5;offset++){const cursor=s.graphCursor+offset,family=order[cursor%5];if(s.credits[family]<2)return {...s,question:{kind:'graph' as const,family,label:label(s.seed,index),input:0},graphCursor:cursor+1}}return s}
export function nextEvaluation(s:ParentLessonState,index:number,forced?:FunctionFamily):ParentLessonState{
 const rng=random((s.seed^Math.imul(s.evalSerial+1,0x9E3779B9))>>>0)
 const family=forced??parentLessonOrder(s.seed^0x6A09E667)[s.evalSerial%5]
 const extent=family==='cubic'?3:family==='quadratic'?4:5
 let input=Math.floor(rng()*(extent*2+1))-extent
 if(s.question.kind==='evaluate'&&s.question.family===family&&s.question.input===input)input=input===extent?-extent:input+1
 return {...s,question:{kind:'evaluate',family,label:label(s.seed,index),input},evalSerial:s.evalSerial+1,graphsSinceEval:0}
}
export function evaluationWork(q:LessonQuestion){
 const x=q.input,lhs=q.label==='y'?'y':`${q.label}(${x})`,value=lessonValue(q)
 const expression=q.family==='constant'?'1':q.family==='linear'?`(${x})`:q.family==='absolute'?`\\lvert ${x}\\rvert`:`(${x})^${q.family==='quadratic'?2:3}`
 const product=q.family==='quadratic'?`(${x})\\cdot(${x})=`:q.family==='cubic'?`(${x})\\cdot(${x})\\cdot(${x})=`:''
 return {substitute:`${lhs}=${expression}`,simplify:`${lhs}=${product}${value}`,point:`(${x},${value})`}
}
export type ParentLessonAction=
 |{type:'identity';field:'first'|'last'|'hour';value:string}|{type:'start';seed:number}
 |{type:'point';point:ParentPoint}|{type:'cursor';point:ParentPoint}|{type:'grid-focus';value:boolean}|{type:'clear'}|{type:'hint'}
 |{type:'input';value:string}|{type:'key';key:string}|{type:'check'}|{type:'next'}
 |{type:'info';open:boolean}|{type:'scratch-open';open:boolean}|{type:'scratch';strokes:ScratchStroke[]}|{type:'erase';value:boolean}
 |{type:'report';now:number}|{type:'return'}|{type:'completion';value:CompletionDisplayState}|{type:'restore';value:ParentLessonState}
function answerStars(s:ParentLessonState,right:boolean){const streak=right?s.streak+1:0;return {correct:s.correct+(right?1:0),streak,best:Math.max(s.best,streak),runs:!right&&s.streak?[...s.runs,s.streak]:s.runs}}
const validPoint=(p:ParentPoint)=>Number.isInteger(p.x)&&Number.isInteger(p.y)&&Math.abs(p.x)<=10&&Math.abs(p.y)<=10
export function parentLessonReducer(s:ParentLessonState,a:ParentLessonAction):ParentLessonState{
 switch(a.type){
  case 'identity':return s.scene==='welcome'?{...s,[a.field]:a.value.slice(0,40)}:s
  case 'start':return s.scene==='welcome'&&s.first.trim()&&s.last.trim()&&/^[1-8]$/.test(s.hour)?nextGraph({...s,scene:'practice',seed:a.seed>>>0},0):s
  case 'info':return s.infoOpen===a.open?s:{...s,infoOpen:a.open}
  case 'point':if(s.scene!=='practice'||s.question.kind!=='graph'||s.result||!validPoint(a.point))return s;return {...s,points:s.points.some(p=>p.x===a.point.x&&p.y===a.point.y)?s.points.filter(p=>p.x!==a.point.x||p.y!==a.point.y):[...s.points,a.point],cursor:a.point,invalid:false}
  case 'cursor':return s.scene==='practice'&&s.question.kind==='graph'&&!s.result&&validPoint(a.point)?{...s,cursor:a.point,gridFocus:true}:s
  case 'grid-focus':return s.gridFocus===a.value?s:{...s,gridFocus:a.value}
  case 'clear':return s.scene==='practice'&&!s.result?{...s,points:[],invalid:false}:s
  case 'hint':return s.scene==='practice'&&s.question.kind==='graph'&&!s.result&&!s.hintUsed?{...s,hintUsed:true,hints:s.hints+1}:s
  case 'input':return s.scene==='practice'&&s.question.kind==='evaluate'&&!s.result?{...s,input:a.value.slice(0,14),invalid:false}:s
  case 'key':return parentLessonReducer(s,{type:'input',value:a.key==='back'?s.input.slice(0,-1):a.key==='clear'?'':a.key==='minus'?s.input.startsWith('-')?s.input.slice(1):'-'+s.input:s.input+a.key})
  case 'check':{
   if(s.scene!=='practice'||s.result||s.infoOpen)return s
   if(s.question.kind==='graph'){
    if(s.points.length<lessonMinimum(s.question))return {...s,invalid:true}
    const right=parentGraphCheck(graphSpec(s.question),s.points).correct,credit=right&&!s.hintUsed
    return {...s,...answerStars(s,right),result:right?s.hintUsed?'guided':'right':'wrong',graphAttempts:s.graphAttempts+1,graphCorrect:s.graphCorrect+(right?1:0),graphsSinceEval:s.graphsSinceEval+1,credits:credit?{...s.credits,[s.question.family]:Math.min(2,s.credits[s.question.family]+1)}:s.credits,gridFocus:false,completion:null}
   }
   const input=s.input.trim().replace(/−/g,'-')
   if(!/^[+-]?\d+$/.test(input)||!Number.isSafeInteger(Number(input)))return {...s,invalid:true}
   const right=Number(input)===lessonValue(s.question),recovered=right&&s.debt>0
   return {...s,...answerStars(s,right),result:right?'right':'wrong',evalAttempts:s.evalAttempts+1,evalCorrect:s.evalCorrect+(right?1:0),evalMisses:s.evalMisses+(right?0:1),debt:s.debt+(right?recovered?-1:0:1),recovered:s.recovered+(recovered?1:0),recoveredThis:recovered,invalid:false,completion:null}
  }
  case 'next':{
   if(s.scene!=='practice'||!s.result)return s
   if(parentLessonMastered(s))return {...s,scene:'complete',gridFocus:false}
   const index=s.index+1,clean={...s,index,points:[],cursor:{x:0,y:0},gridFocus:false,hintUsed:false,input:'',invalid:false,result:null,recoveredThis:false,scratch:[],scratchOpen:false,erase:false}
   if(s.question.kind==='graph')return s.result!=='right'?nextEvaluation(clean,index,s.question.family):s.graphAttempts===1||s.graphsSinceEval>=2?nextEvaluation(clean,index):nextGraph(clean,index)
   return s.debt>0?nextEvaluation(clean,index):nextGraph(clean,index)
  }
  case 'scratch-open':return {...s,scratchOpen:a.open}
  case 'scratch':return {...s,scratch:a.strokes}
  case 'erase':return {...s,erase:a.value}
  case 'report':return s.scene==='practice'||s.scene==='complete'?{...s,scene:'report',reportReturn:s.scene,completedAt:a.now,completion:null,infoOpen:false}:s
  case 'return':return s.scene==='report'?{...s,scene:s.reportReturn,completion:null}:s
  case 'completion':return s.scene==='report'?{...s,completion:a.value}:s
  case 'restore':return a.value
 }
}
export function parentLessonStars(s:ParentLessonState):FamilyStarState{return {...freshGraphFamilyState(),seed:s.seed,scene:s.scene==='practice'?'practice':'ready',practice:{index:s.index,selected:null,attempts:s.graphAttempts+s.evalAttempts,correct:s.correct,streak:s.streak,best:s.best},starTrail:{completed:s.runs,earlierCorrect:0}}}
export function parentLessonSnapshot(state:ParentLessonState,language:'en'|'es',scrollY:number){
 const score=parentLessonScore(state)
 return {app:'algebra2-parent-graph-evaluation',version:1,score,maxScore:10,scoreDisplay:`${score}/10`,isComplete:state.scene==='report'&&!!state.completion?.record&&state.completion.record.language===language&&state.completion.confidence>0&&state.completion.difficulty>0,
 answeredItems:state.graphAttempts+state.evalAttempts,correctFirstTry:graphCredits(state)+state.evalCorrect,
 extraData:{unhintedGraphs:graphCredits(state),graphAttempts:state.graphAttempts,correctGraphs:state.graphCorrect,evaluationAttempts:state.evalAttempts,correctEvaluations:state.evalCorrect,evaluationMisses:state.evalMisses,pointsToRecover:state.debt,pointsRecovered:state.recovered,hintsUsed:state.hints,masteryGoalReached:parentLessonMastered(state),...Object.fromEntries(familyIds.map(f=>[`${f}Graphs`,state.credits[f]]))},customState:{state,language,scrollY}}
}
const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v)
const count=(v:unknown,max=1_000_000):v is number=>typeof v==='number'&&Number.isInteger(v)&&v>=0&&v<=max
export function readParentLessonSnapshot(value:unknown):ReturnType<typeof parentLessonSnapshot>|null{
 if(!object(value)||value.app!=='algebra2-parent-graph-evaluation'||value.version!==1||!object(value.customState))return null
 const {state:s,language,scrollY}=value.customState
 if(!object(s)||!['en','es'].includes(String(language))||!count(scrollY,10_000_000)||!['welcome','practice','complete','report'].includes(String(s.scene))||!['practice','complete'].includes(String(s.reportReturn)))return null
 if(![s.first,s.last,s.hour].every(v=>typeof v==='string'&&v.length<=40)||!count(s.seed,0xffffffff)||!count(s.completedAt,Number.MAX_SAFE_INTEGER))return null
 const q=s.question
 if(!object(q)||!['graph','evaluate'].includes(String(q.kind))||!familyIds.includes(q.family as FunctionFamily)||!['f','g','h','y'].includes(String(q.label))||typeof q.input!=='number'||!Number.isInteger(q.input)||Math.abs(q.input)>5)return null
 if(!object(s.credits)||!familyIds.every(f=>count((s.credits as Record<string,unknown>)[f],2)))return null
 if(!['index','graphCursor','evalSerial','graphsSinceEval','graphAttempts','graphCorrect','evalAttempts','evalCorrect','evalMisses','recovered','debt','hints','correct','streak','best'].every(k=>count(s[k])))return null
 if(!['gridFocus','hintUsed','invalid','recoveredThis','infoOpen','scratchOpen','erase'].every(k=>typeof s[k]==='boolean')||typeof s.input!=='string'||s.input.length>14||![null,'right','wrong','guided'].includes(s.result as null|'right'|'wrong'|'guided'))return null
 if(!Array.isArray(s.points)||s.points.length>441||!s.points.every(p=>object(p)&&validPoint(p as unknown as ParentPoint))||new Set(s.points.map(p=>`${p.x},${p.y}`)).size!==s.points.length||!object(s.cursor)||!validPoint(s.cursor as unknown as ParentPoint))return null
 if(!Array.isArray(s.runs)||!s.runs.every(n=>count(n)&&n>0)||s.runs.length>Number(s.graphAttempts)+Number(s.evalAttempts))return null
 if(!Array.isArray(s.scratch)||s.scratch.length>2000||!s.scratch.every(v=>object(v)&&count(v.id)&&typeof v.erase==='boolean'&&typeof v.path==='string'&&v.path.length<=200000&&/^[MLl0-9.,\s-]+$/.test(v.path)))return null
 if(s.completion!==null){const c=s.completion;if(!object(c)||!count(c.confidence,5)||!count(c.difficulty,5)||typeof c.notice!=='boolean'||typeof c.error!=='string')return null
  if(c.record!==null&&(!object(c.record)||typeof c.record.image!=='string'||!c.record.image.startsWith('data:image/png;base64,')||typeof c.record.identity!=='string'||!['en','es'].includes(String(c.record.language))))return null
 }
 const state=s as unknown as ParentLessonState
 if(state.graphCorrect>state.graphAttempts||state.evalCorrect+state.evalMisses!==state.evalAttempts||state.recovered+state.debt!==state.evalMisses||state.recovered>state.evalCorrect||state.correct!==state.graphCorrect+state.evalCorrect||state.best>state.correct||state.streak>state.best||state.runs.some(n=>n>state.best)||state.runs.reduce((sum,n)=>sum+n,0)+state.streak!==state.correct||graphCredits(state)>state.graphCorrect)return null
 if(state.graphAttempts+state.evalAttempts!==state.index+(state.result===null?0:1)||state.debt>0&&q.kind!=='evaluate'||state.scene==='complete'&&!parentLessonMastered(state)||q.kind==='evaluate'&&state.result==='guided')return null
 return parentLessonSnapshot(state,language as 'en'|'es',scrollY)
}
