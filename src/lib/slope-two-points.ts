import {blankStats,saveCode,loadCode,type Stats,type Session} from './write-linear.ts'
export const stpTitle='Slope Between Two Points'
export type Coordinate='x1'|'y1'|'x2'|'y2'
export type Slot='topA'|'topB'|'bottomA'|'bottomB'
export type STPProblem={id:number;x1:number;y1:number;x2:number;y2:number}
export type Placements=Record<Slot,Coordinate|null>
export const emptySlopeSlots=():Placements=>({topA:null,topB:null,bottomA:null,bottomB:null})
export function slopePointProblem(id:number,demo=0,rng=Math.random):STPProblem{
 if(demo)return demo===1?{id,x1:-2,y1:1,x2:2,y2:7}:{id,x1:1,y1:5,x2:4,y2:-1}
 const pick=(n:number)=>Math.min(n-1,Math.floor(rng()*n)),x1=pick(11)-5,y1=pick(11)-5,kind=pick(10),dx=kind===0?0:(1+pick(6))*(rng()<.5?-1:1),dy=kind===1?0:(1+pick(6))*(rng()<.5?-1:1)
 return {id,x1,y1,x2:x1+dx,y2:y1+dy}
}
export function placeSlope(s:Placements,slot:Slot,c:Coordinate){return {...Object.fromEntries(Object.entries(s).map(([k,v])=>[k,v===c?null:v])),[slot]:c} as Placements}
export function setupCorrect(p:STPProblem,s:Placements){
 if(Object.values(s).some(v=>!v))return false
 if(!s.topA!.startsWith('y')||!s.topB!.startsWith('y')||!s.bottomA!.startsWith('x')||!s.bottomB!.startsWith('x'))return false
 return ([['y2','y1','x2','x1'],['y1','y2','x1','x2']] as Coordinate[][]).some(order=>[s.topA,s.topB,s.bottomA,s.bottomB].every((key,i)=>p[key!]===p[order[i]]))
}
export function setupHint(s:Placements){if([s.topA,s.topB,s.bottomA,s.bottomB].some(v=>!v))return 'Fill all four boxes. Put y-values on top and x-values on the bottom.';if(!s.topA!.startsWith('y')||!s.topB!.startsWith('y')||!s.bottomA!.startsWith('x')||!s.bottomB!.startsWith('x'))return 'Keep y-values in the numerator and x-values in the denominator. Do not mix x and y.';return 'Subtract in the same point order on top and bottom: point 2 minus point 1, or point 1 minus point 2.'}
const gcd=(a:number,b:number):number=>b?gcd(b,a%b):a
export function slopeValue(p:STPProblem){const dy=p.y2-p.y1,dx=p.x2-p.x1;if(!dx)return {text:'Undefined',tex:'\\text{Undefined}',dy,dx};const g=gcd(Math.abs(dy),Math.abs(dx)),n=dy/g*(dx<0?-1:1),d=Math.abs(dx)/g;return {text:d===1?String(n):`${n}/${d}`,tex:d===1?String(n):`${n<0?'-':''}\\frac{${Math.abs(n)}}{${d}}`,dy,dx}}
export function slopeAnswer(text:string,p:STPProblem){if(p.x1===p.x2)return /^undefined$/i.test(text.trim());const m=text.trim().replace(/−/g,'-').match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:\/([+-]?(?:\d+(?:\.\d*)?|\.\d+)))?$/);if(!m)return false;const d=m[2]?Number(m[2]):1;return !!d&&Math.abs(Number(m[1])/d-(p.y2-p.y1)/(p.x2-p.x1))<1e-9}
export function slopeHint(p:STPProblem){return p.x1===p.x2?'The x-values are equal, so the run is 0. You cannot divide by 0. Choose Undefined.':p.y1===p.y2?'The y-values are equal, so the rise is 0. Zero divided by a nonzero run is 0.':'Subtract the y-values on top and the x-values on the bottom in the same order. Keep negative signs. Use an exact fraction if needed.'}
export type STPProgress={stage:1|2;demo:boolean;stats:Stats[];retries:number;finished:boolean;completedAt:number|null}
export const newSTP=():STPProgress=>({stage:1,demo:true,stats:[blankStats(),blankStats()],retries:0,finished:false,completedAt:null})
export function recordSTP(s:Stats,right:boolean):Stats{const streak=right?s.streak+1:0;return {correct:s.correct+Number(right),attempts:s.attempts+1,streak,best:Math.max(s.best,streak)}}
export const stpDone=(s:Stats)=>s.streak>=5
export const stpScore=(p:STPProgress)=>p.stats.reduce((n,s)=>n+Math.min(5,s.best),0)
export function saveSTP(p:STPProgress,first:string,last:string,hour:string){const day=p.completedAt===null?null:Math.floor(p.completedAt/86400000),minute=p.completedAt===null?null:Math.floor(p.completedAt/60000)%1440;const s:Session={level:1,phase:'work',example:p.demo,stats:[...p.stats,blankStats()],warnings:p.stage*2+Number(p.finished),readingWarnings:91,distributionWarnings:p.retries,targets:[],bonus:[],date:'',trail:day===null?[]:[{gold:false,count:day+1},{gold:false,count:minute!+1}]};return saveCode(s,first,last,hour).replace(/^WL1-/,'STP-')}
export function loadSTP(code:string,first:string,last:string,hour:string):STPProgress{if(!/^STP-/i.test(code.trim()))throw Error('Use a code from Slope Between Two Points.');const s=loadCode(code.trim().replace(/^STP-/i,'WL1-'),first,last,hour),stage=Math.floor(s.warnings/2) as 1|2,stats=s.stats.slice(0,2),finished=Boolean(s.warnings&1),trail=s.trail??[],completedAt=trail.length===2?((trail[0].count-1)*1440+trail[1].count-1)*60000:null;if(s.readingWarnings!==91||![1,2].includes(stage)||s.warnings>5||stats.some(v=>v.best>5)||(stage===2&&!stpDone(stats[0]))||(stage===1&&stats[1].attempts>0)||(s.example&&stats[stage-1].attempts>0)||(finished&&(stage!==2||!stats.every(stpDone)||completedAt===null))||(!finished&&trail.length)||trail.length>2||(trail[1]&&trail[1].count>1440))throw Error('This code has invalid saved progress.');return {stage,demo:s.example,stats,retries:s.distributionWarnings??0,finished,completedAt}}
