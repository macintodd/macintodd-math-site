import {kinds,fromKind,makeQuestion,shuffled,transformLabel,transformTex,memoryHint,type Transform,type Kind} from './transformation-notation.ts'
import {parentValue,type TransformationFamily} from './transformations.ts'
import {newSession,saveCode,loadCode,type Stats} from './write-linear.ts'
export type RigidSkill=1|2|3|4|5|6
export const rigidSkills:RigidSkill[]=[1,2,3,4,5,6]
export const skillTitles:Record<RigidSkill,string>={1:'Identify Rigid Transformations in Notation',2:'Identify Single Rigid Transformations Numerically',3:'Identify Two Rigid Transformations in Order Numerically',4:'Identify a Single Transformation Graphically',5:'Identify Two Transformations Graphically',6:'Identify Transformations Graphically and Write Function Notation'}
export const skillGoals:Record<RigidSkill,string>={1:'Identify the direction of a shift or the axis of a reflection from symbolic function notation.',2:'Identify one rigid transformation and its distance from numerical function notation.',3:'Identify two rigid transformations in order: reflections first, then translations.',4:'Compare a parent graph and a transformed graph to identify one rigid transformation.',5:'Compare parent and transformed graphs to identify two rigid transformations in order.',6:'Identify transformations from graphs and write the transformed function using f.'}
export type RigidQuestion={id:number;transform:Transform;tex:string;answer:string;choices:string[];hint:string;family:TransformationFamily;kind?:Kind}
export const freshRigidStats=():Stats=>({correct:0,attempts:0,streak:0,best:0})
export function curveValue(family:TransformationFamily,t:Transform,x:number){const y=parentValue(family,(t.ry?-1:1)*(x-t.h));return y===null?null:(t.rx?-y:y)+t.k}
export function sameCurve(family:TransformationFamily,a:Transform,b:Transform){for(let i=-80;i<=80;i++){const x=i/2,u=curveValue(family,a,x),v=curveValue(family,b,x);if(u===null||v===null){if(u!==v)return false}else if(Math.abs(u-v)>1e-7)return false}return true}
function doubleTransform(rng:()=>number):Transform{const n=1+Math.floor(rng()*4),v=1+Math.floor(rng()*4),h=(rng()<.5?-1:1)*n,k=(rng()<.5?-1:1)*v;return [{h,k,rx:false,ry:false},{h,k:0,rx:true,ry:false},{h:0,k,rx:true,ry:false},{h:0,k,rx:false,ry:true},{h:0,k:0,rx:true,ry:true}][Math.floor(rng()*5)]}
const identity:Transform={h:0,k:0,rx:false,ry:false}
export function rigidQuestion(skill:RigidSkill,id:number,demo=false,mask=0,rng=Math.random):RigidQuestion{
 if(demo)rng=()=>.25
 if(skill<=2){const available=kinds.filter((_,i)=>skill!==1||!(mask&(1<<i))),kind=demo?(skill===1?'up':'down'):available[Math.floor(rng()*available.length)]??'up',q=makeQuestion(skill as 1|2,id,demo?()=>.25:rng,kind);return {...q,family:'quadratic'}}
 const t=demo?(skill===3?{h:-3,k:0,rx:true,ry:false}:skill===4?fromKind('right',3):{h:skill===5?-2:-3,k:skill===5?1:2,rx:false,ry:false}):skill===4?fromKind(kinds[Math.floor(rng()*6)],1+Math.floor(rng()*4)):doubleTransform(rng)
 const family:TransformationFamily=demo?(skill===5?'squareRoot':skill===6?'absolute':'quadratic'):t.ry?'squareRoot':(['absolute','quadratic','squareRoot','cubic','rational'] as const)[Math.floor(rng()*5)]
 // y-axis reflections use the square-root parent, whose domain makes the change visible.
 const answer=transformLabel(t),pool:Transform[]=[{h:0,k:0,rx:true,ry:true}]
 for(const n of [1,2,3,4]){for(const k of kinds)pool.push(fromKind(k,n));for(const h of [-n,n])for(const k of [-n,n])pool.push({h,k,rx:false,ry:false},{h,k:0,rx:true,ry:false},{h:0,k,rx:true,ry:false},{h:0,k,rx:false,ry:true})}
 const choices=[answer],accepted:Transform[]=[t]
 for(const candidate of shuffled(pool,rng)){const count=Number(candidate.rx)+Number(candidate.ry)+Number(candidate.h!==0)+Number(candidate.k!==0);if(count!==(skill===4?1:2))continue;const label=transformLabel(candidate);if(choices.includes(label)||skill>=4&&accepted.some(a=>sameCurve(family,a,candidate)))continue;choices.push(label);accepted.push(candidate);if(choices.length===6)break}
 return {id,transform:t,tex:transformTex(t),answer,choices:shuffled(choices,rng),hint:memoryHint(t)+(skill>=4?' Compare a vertex, endpoint, or asymptote. Tap matching points to read their coordinates.':''),family}
}
export function parseRigidNotation(input:string):Transform|null{
 const s=input.replace(/\s/g,'').replace(/[−–]/g,'-').replace(/\+-/g,'-').replace(/--/g,'+'),m=s.match(/^(?:g\(x\)=)?(-?)f\((-?)x([+-]\d+)?\)([+-]\d+)?$/)
 if(!m)return null;const ry=!!m[2],c=Number(m[3]??0);return {rx:!!m[1],ry,h:ry?c:-c,k:Number(m[4]??0)}
}
export function checkRigidNotation(input:string,q:RigidQuestion){const t=parseRigidNotation(input);return !!t&&sameCurve(q.family,t,q.transform)}
export function rigidDone(skill:RigidSkill,s:Stats,mask:number){return skill===1?mask===63:s.correct>=10&&s.best>=5}
export function rigidScore(skill:RigidSkill,s:Stats,mask:number){return skill===1?Math.round(kinds.filter((_,i)=>mask&(1<<i)).length/6*100)/10:Math.max(0,Math.min(10,s.correct)-Math.max(0,5-s.best))}
export function recordRigid(s:Stats,right:boolean,clean=true):Stats{const streak=right&&clean?s.streak+1:0;return {correct:s.correct+(right?1:0),attempts:s.attempts+1,streak,best:Math.max(s.best,streak)}}
export function saveRigid(skill:RigidSkill,id:{first:string;last:string;hour:string},stats:Stats,mask:number){const s=newSession();s.example=false;s.stats[0]=stats;s.warnings=mask;return saveCode(s,id.first,id.last,`${id.hour}:rigid-${skill}`).replace(/^WL1-/,`RT${skill}-`)}
export function loadRigid(skill:RigidSkill,id:{first:string;last:string;hour:string},code:string){if(!code.toUpperCase().startsWith(`RT${skill}-`))throw Error('Use a resume code for this skill.');const s=loadCode(code.replace(/^RT\d-/i,'WL1-'),id.first,id.last,`${id.hour}:rigid-${skill}`);if(s.warnings>63||skill===1&&kinds.filter((_,i)=>s.warnings&(1<<i)).length!==s.stats[0].streak)throw Error('The saved transformation progress is inconsistent.');return {stats:s.stats[0],mask:s.warnings}}
export {identity,kinds,transformTex}
