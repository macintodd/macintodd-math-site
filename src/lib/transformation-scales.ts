import {parentValue,type TransformationFamily} from './transformations.ts'
import {newSession,saveCode,loadCode,type Stats} from './write-linear.ts'
export type ScaleMode='notation'|'parents'
export type ScaleLevel=1|2|3|4|5
export type ScaleParams={a:number;b:number;h:number;k:number}
export type ScaleQuestion={id:number;level:ScaleLevel;params:ScaleParams;family:TransformationFamily|null;expanded:boolean;tex:string;choices:ScaleParams[];answer:number}
export type ScaleProgress={level:ScaleLevel;demo:boolean;stats:Stats[];finished:boolean;hints:number}
export const scaleTitles={notation:'Function Transformations: Stretches, Shrinks & Shifts',parents:'All Transformations: Parent Functions'}
export const scaleSlugs={notation:'transformation-scales',parents:'parent-transformations'}
export const scaleLevels=['Positive a and b','Signed a and b: reflections','Add horizontal and vertical shifts','Factor the inside expression','Mix all transformations']
export const scaleGoals=[
 'Identify vertical and horizontal stretches and shrinks from positive a and b.',
 'Identify reflections and stretches or shrinks from signed a and b.',
 'Describe reflections and dilations first, then translations. These problems never combine b and h.',
 'Factor the input before reading a horizontal shift. The shift is the opposite of the inside constant divided by b.',
 'Read a, b, h, and k and describe the transformations in order.'
]
export const scaleIdentity:ScaleParams={a:1,b:1,h:0,k:0}
export const freshScaleStats=():Stats=>({correct:0,attempts:0,streak:0,best:0})
export const newScaleProgress=():ScaleProgress=>({level:1,demo:true,stats:Array.from({length:5},freshScaleStats),finished:false,hints:0})
export function scaleTarget(mode:ScaleMode,level:ScaleLevel){return {correct:mode==='parents'?10:5,streak:mode==='parents'||level===5?5:3}}
export function scaleDone(mode:ScaleMode,level:ScaleLevel,s:Stats){const goal=scaleTarget(mode,level);return s.correct>=goal.correct&&s.best>=goal.streak}
export function scaleLevelScore(mode:ScaleMode,level:ScaleLevel,s:Stats){const goal=scaleTarget(mode,level);return Math.round(50*(Math.min(1,s.correct/goal.correct)+Math.min(1,s.best/goal.streak)))/10}
export function scaleScore(mode:ScaleMode,p:ScaleProgress){return mode==='parents'?scaleLevelScore(mode,1,p.stats[0]):Math.round(p.stats.reduce((n,s,i)=>n+scaleLevelScore(mode,(i+1) as ScaleLevel,s),0)*2)/10}
export function recordScale(s:Stats,right:boolean):Stats{const streak=right?s.streak+1:0;return {correct:s.correct+Number(right),attempts:s.attempts+1,streak,best:Math.max(s.best,streak)}}
export function scaleFraction(value:number){for(let d=1;d<=120;d++){const n=Math.round(value*d);if(Math.abs(n/d-value)<1e-8)return {n,d}}throw Error('Unsupported fraction.')}
export function scaleNumber(value:number){const {n,d}=scaleFraction(value);return d===1?String(n):`${n}/${d}`}
export function scaleNumberTex(value:number){const {n,d}=scaleFraction(value);return d===1?String(n):`${n<0?'-':''}\\frac{${Math.abs(n)}}{${d}}`}
function coefficient(value:number){return value===1?'':value===-1?'-':scaleNumberTex(value)}
function signed(value:number){return value===0?'':`${value<0?'-':'+'}${scaleNumberTex(Math.abs(value))}`}
function argument(p:ScaleParams,expanded:boolean){if(expanded)return `${coefficient(p.b)}x${signed(-p.b*p.h)}`;const x=`x${signed(-p.h)}`;return p.b===1?x:p.h===0?`${coefficient(p.b)}x`:`${coefficient(p.b)}\\left(${x}\\right)`}
export function scaleEquation(p:ScaleParams,family:TransformationFamily|null=null,expanded=false){const x=argument(p,expanded);let body=family===null?`f\\left(${x}\\right)`:family==='absolute'?`\\left|${x}\\right|`:family==='quadratic'||family==='cubic'?`${x==='x'?'x':`\\left(${x}\\right)`}^{${family==='quadratic'?2:3}}`:family==='squareRoot'?`\\sqrt{${x}}`:family==='rational'?`\\frac{1}{${x}}`:p.a!==1&&x!=='x'?`\\left(${x}\\right)`:x;body=coefficient(p.a)+body;return `g(x)=${body}${signed(p.k)}`}
export function scaleFactored(p:ScaleParams){return `g(x)=${coefficient(p.a)}f\\left(${coefficient(p.b)}\\left(x${signed(-p.h)}\\right)\\right)${signed(p.k)}`}
export type ScaleStep={kind:'reflectX'|'reflectY'|'verticalStretch'|'verticalShrink'|'horizontalStretch'|'horizontalShrink'|'left'|'right'|'up'|'down';value?:number}
export function scaleSteps(p:ScaleParams):ScaleStep[]{const steps:ScaleStep[]=[];if(p.a<0)steps.push({kind:'reflectX'});if(p.b<0)steps.push({kind:'reflectY'});if(Math.abs(p.a)!==1)steps.push({kind:Math.abs(p.a)>1?'verticalStretch':'verticalShrink',value:Math.abs(p.a)});if(Math.abs(p.b)!==1)steps.push({kind:Math.abs(p.b)<1?'horizontalStretch':'horizontalShrink',value:1/Math.abs(p.b)});if(p.h)steps.push({kind:p.h<0?'left':'right',value:Math.abs(p.h)});if(p.k)steps.push({kind:p.k<0?'down':'up',value:Math.abs(p.k)});return steps}
export const stepLabels={reflectX:'Reflect over the x-axis',reflectY:'Reflect over the y-axis',verticalStretch:'Vertical stretch by a factor of',verticalShrink:'Vertical shrink by a factor of',horizontalStretch:'Horizontal stretch by a factor of',horizontalShrink:'Horizontal shrink by a factor of',left:'Translate left',right:'Translate right',up:'Translate up',down:'Translate down'}
export function scaleDescription(p:ScaleParams,translate:(s:string)=>string=s=>s){return scaleSteps(p).map(s=>`${translate(stepLabels[s.kind])}${s.value!==undefined?' '+scaleNumber(s.value)+(['left','right','up','down'].includes(s.kind)?' '+translate('units'):''):''}`).join('; '+translate('then')+' ')||translate('No transformation')}
export function sameScaleCurve(family:TransformationFamily,a:ScaleParams,b:ScaleParams){for(let i=-100;i<=100;i++){const x=i/7,u=parentValue(family,a.b*(x-a.h)),v=parentValue(family,b.b*(x-b.h));if(u===null||v===null){if(u!==v)return false}else{const y=a.a*u+a.k,z=b.a*v+b.k;if(Math.abs(y-z)>1e-7*Math.max(1,Math.abs(y),Math.abs(z)))return false}}return true}
const pick=<T,>(items:readonly T[],rng:()=>number)=>items[Math.floor(rng()*items.length)]
const shuffle=<T,>(items:T[],rng:()=>number)=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const factors=[1/6,1/5,1/4,1/3,1/2,2,3,4,5,6]
function params(level:ScaleLevel,rng:()=>number):ScaleParams{
 const sign=()=>rng()<.5?-1:1,scale=(signed=false)=>signed&&rng()<.12?-1:pick(factors,rng)*(signed?sign():1),shift=()=>sign()*(1+Math.floor(rng()*4))
 if(level<=2)return rng()<.5?{a:scale(level===2),b:1,h:0,k:0}:{a:1,b:scale(level===2),h:0,k:0}
 if(level===3){const horizontal=rng()<.5;return {a:rng()<.65?scale(true):1,b:horizontal?1:scale(true),h:horizontal?shift():0,k:rng()<.65?shift():horizontal?0:shift()}}
 if(level===4){const b=pick([2,3,4,5],rng)*sign(),c=rng()<.75?b*shift():sign()*pick([1,3,5,7],rng);return {a:rng()<.65?scale(true):1,b,h:-c/b,k:0}}
 if(rng()<.35)return {a:scale(true),b:scale(true),h:shift(),k:shift()};return params(pick([1,2,3,4] as const,rng),rng)
}
const demos:ScaleParams[]=[{a:3,b:1,h:0,k:0},{a:-6,b:1,h:0,k:0},{a:-2,b:1,h:3,k:4},{a:3,b:4,h:-3/4,k:0},{a:-1/2,b:-2,h:2,k:-3}]
export function scaleQuestion(mode:ScaleMode,level:ScaleLevel,id:number,demo=false,rng=Math.random):ScaleQuestion{
 if(demo)rng=()=>.35
 let p=demo?{...(mode==='parents'?{a:4,b:1,h:4,k:5}:demos[level-1])}:params(mode==='parents'?5:level,rng)
 let family:TransformationFamily|null=mode==='parents'?(demo?'absolute':pick(p.b<0?['squareRoot','cubic','rational'] as const:['linear','absolute','quadratic','squareRoot','cubic','rational'] as const,rng)):null
 // Do not ask students to identify a transformation whose combined graph is unchanged.
 for(let i=0;family&&sameScaleCurve(family,p,scaleIdentity)&&i<20;i++)p=params(5,rng)
 if(family&&sameScaleCurve(family,p,scaleIdentity))p={...p,k:p.k+1}
 if(family&&p.b<0&&(family==='absolute'||family==='quadratic'))family='squareRoot'
 const expanded=p.b!==1&&p.h!==0,choices:ScaleParams[]=[p],pool:ScaleParams[]=[{...p,a:1/p.a},{...p,b:1/p.b},{...p,h:-p.h},{...p,k:-p.k},{...p,a:-p.a},{...p,b:-p.b},{...p,h:-p.b*p.h},{...p,a:p.b,b:p.a}]
 const equivalent=(a:ScaleParams,b:ScaleParams)=>family?sameScaleCurve(family,a,b):(['a','b','h','k'] as const).every(k=>Math.abs(a[k]-b[k])<1e-8)
 for(const candidate of [...shuffle(pool,rng),...Array.from({length:50},()=>params(3,rng))]){if(!choices.some(a=>equivalent(a,candidate))){choices.push(candidate);if(choices.length===4)break}}
 if(choices.length!==4)throw Error('Could not create distinct transformation choices.')
 const mixed=demo?shuffle(choices,()=>.35):shuffle(choices,rng)
 return {id,level,params:p,family,expanded,tex:scaleEquation(p,family,expanded),choices:mixed,answer:mixed.indexOf(p)}
}
export function saveScale(mode:ScaleMode,p:ScaleProgress,id:{first:string;last:string;hour:string}){const s=newSession();s.example=false;s.stats=p.stats.slice(0,3);s.warnings=p.level-1+(p.demo?8:0)+(p.finished?16:0);s.readingWarnings=1;s.archived={correct:p.hints,misses:0};s.trail=p.stats.slice(3).flatMap(v=>[v.correct,v.attempts,v.streak,v.best].map(n=>({gold:false,count:n+1})));return saveCode(s,id.first,id.last,`${id.hour}:scales-v1:${mode}`).replace(/^WL1-/,mode==='notation'?'TSC-':'TPF-')}
export function loadScale(mode:ScaleMode,code:string,id:{first:string;last:string;hour:string}):ScaleProgress{const prefix=mode==='notation'?'TSC-':'TPF-';if(!code.trim().toUpperCase().startsWith(prefix))throw Error('Use a resume code from this transformation widget.');const s=loadCode(code.trim().toUpperCase().replace(prefix,'WL1-'),id.first,id.last,`${id.hour}:scales-v1:${mode}`),n=s.warnings,extra=s.trail??[],stats=[...s.stats];if(s.readingWarnings!==1||n>=32||n%8>4||extra.length!==8)throw Error('This transformation checkpoint is not valid.');for(let i=0;i<2;i++){const values=extra.slice(i*4,i*4+4).map(v=>v.count-1);stats.push({correct:values[0],attempts:values[1],streak:values[2],best:values[3]})}const level=(n%8+1) as ScaleLevel;if(mode==='parents'&&level!==1||stats.some(v=>v.correct>v.attempts||v.streak>v.best||v.best>v.correct)||mode==='notation'&&stats.slice(0,level-1).some((v,i)=>!scaleDone(mode,(i+1) as ScaleLevel,v)))throw Error('The saved transformation progress is inconsistent.');return {level,demo:!!(n&8),finished:!!(n&16),stats,hints:s.archived?.correct??0}}
