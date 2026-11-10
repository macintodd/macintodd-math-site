import {blankStats,saveCode,loadCode,type Stats,type Session} from './write-linear.ts'
export const hvTitle='Write the Linear Equations Level 0: Horizontal and Vertical'
export const hvLevelTitles=['Read the graph','Read the slope','Match the graph to its equation','Read the equation','Mix them all together']
export const hvSkills=[
 'Identify a graphed line as horizontal or vertical.',
 'Identify a graphed line’s slope as zero or undefined.',
 'Choose the equation of a horizontal or vertical line from its graph.',
 'Identify the direction or slope of a line from its equation.',
 'Connect graphs, equations, direction, and zero or undefined slopes.'
]
export type HVLevel=1|2|3|4|5
export type HVQuestion={id:number;horizontal:boolean;value:number;kind:number;prompt:string;equation?:string;graph:boolean;choices:string[];answer:number;cue:string;answerText:string}
const integer=(n:number,rng:()=>number)=>Math.min(n-1,Math.floor(rng()*n))
export function hvQuestion(level:HVLevel,id:number,demo=false,rng=Math.random):HVQuestion{
 const horizontal=demo?level!==2:rng()<.5,value=demo?3:integer(11,rng)-5,variable=horizontal?'y':'x',direction=horizontal?'Horizontal':'Vertical',slope=horizontal?'0':'Undefined'
 const kind=demo?[0,1,4,2,3][level-1]:level===1?0:level===2?1:level===3?4:level===4?2+integer(2,rng):integer(5,rng)
 let prompt='',equation:string|undefined,graph=false,choices:string[]=[],correct=''
 if(kind===0){graph=true;prompt='Is this line horizontal or vertical?';choices=['Horizontal','Vertical'];correct=direction}
 if(kind===1){graph=true;prompt='What is the slope of this line?';choices=['0','Undefined'];correct=slope}
 if(kind===2||kind===3){equation=`${variable}=${value}`;prompt=kind===2?'Is this the equation of a vertical or horizontal line?':'What is the slope of the line?';choices=kind===2?['Horizontal','Vertical']:['0','Undefined'];correct=kind===2?direction:slope}
 if(kind===4){graph=true;prompt='Which equation matches this graph?';const other=value===0?2:-value;choices=[`y=${value}`,`x=${value}`,`y=${other}`,`x=${other}`];correct=`${variable}=${value}`}
 // Fixed examples include a fixed choice order for a shared classroom demonstration.
 if(!demo)for(let i=choices.length-1;i>0;i--){const j=integer(i+1,rng);[choices[i],choices[j]]=[choices[j],choices[i]]}
 return {id,horizontal,value,kind,prompt,equation,graph,choices,answer:choices.indexOf(correct),answerText:correct,cue:horizontal?'Horizontal: y stays constant. Rise is 0, so slope is 0.':'Vertical: x stays constant. Run is 0, so slope is undefined. You cannot divide by 0.'}
}
export type HVProgress={level:HVLevel;demo:boolean;stats:Stats[];finished:boolean}
export const newHV=():HVProgress=>({level:1,demo:true,stats:Array.from({length:5},blankStats),finished:false})
export function markHV(s:Stats,right:boolean):Stats{const streak=right?s.streak+1:0;return {correct:s.correct+Number(right),attempts:s.attempts+1,streak,best:Math.max(s.best,streak)}}
export const hvTargets=[8,8,8,8,8] as const
export const hvTarget=(level:number)=>hvTargets[level-1]
export const hvDone=(s:Stats,level:number)=>s.streak>=hvTarget(level)
export const hvScore=(p:HVProgress)=>Math.round(p.stats.reduce((n,s,i)=>n+Math.min(1,s.best/hvTarget(i+1)),0)*20)/10
export function hvTotals(p:HVProgress){const correct=p.stats.reduce((n,s)=>n+s.correct,0),attempted=p.stats.reduce((n,s)=>n+s.attempts,0);return {correct,attempted,accuracy:attempted?Math.round(correct/attempted*100):0}}
export function saveHV(p:HVProgress,first:string,last:string,hour:string){const tail=p.stats.slice(3).flatMap(s=>[s.correct,s.attempts,s.streak,s.best]);const s:Session={level:1,phase:'work',example:p.demo,stats:p.stats.slice(0,3),warnings:p.level*4+Number(p.demo)*2+Number(p.finished),targets:[],bonus:[],date:'',readingWarnings:3,trail:tail.map(n=>({gold:false,count:n+1}))};return saveCode(s,first,last+':horizontal-vertical-v2',hour).replace(/^WL1-/,'HV0-')}
export function loadHV(code:string,first:string,last:string,hour:string):HVProgress{
 if(!/^HV0-/i.test(code.trim()))throw Error('Use a resume code from this horizontal and vertical practice.')
 const s=loadCode(code.trim().replace(/^HV0-/i,'WL1-'),first,last+':horizontal-vertical-v2',hour),level=Math.floor(s.warnings/4) as HVLevel,demo=Boolean(s.warnings&2),finished=Boolean(s.warnings&1),tail=s.trail?.map(v=>v.count-1)??[]
 const stats=[...s.stats,...[0,4].map(i=>({correct:tail[i],attempts:tail[i+1],streak:tail[i+2],best:tail[i+3]}))]
 const legacy=s.readingWarnings!==3
 const validStats=stats.every(t=>[t.correct,t.attempts,t.streak,t.best].every(n=>Number.isSafeInteger(n)&&n>=0)&&t.correct<=t.attempts&&t.streak<=t.best&&t.best<=10&&t.best<=t.correct)
 if(level<1||level>5||tail.length!==8||!validStats)throw Error('This resume code has invalid progress.')
 if(legacy){
  if(stats.some(t=>t.best>5)||stats.some((t,i)=>i<level-1&&t.streak<5||i>level-1&&t.attempts>0))throw Error('This resume code has invalid progress.')
  ;[stats[2],stats[3]]=[stats[3],stats[2]]
  const next=stats.findIndex((t,i)=>!hvDone(t,i+1))
  return {level:(next<0?5:next+1) as HVLevel,demo:next>=0&&stats[next].attempts===0,stats,finished:next<0}
 }
 if(stats.some((t,i)=>i<level-1&&!hvDone(t,i+1))||(finished&&(level!==5||stats.some((t,i)=>!hvDone(t,i+1))))||(demo&&stats[level-1].attempts>0))throw Error('This resume code has invalid progress.')
 return {level,demo,stats,finished}
}
