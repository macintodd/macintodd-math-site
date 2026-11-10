import {fraction,type Line} from './slope.ts'
import {slopeTex,numberAnswer} from './point-slope.ts'
import {newSession,saveCode,loadCode} from './write-linear.ts'
export type Relation='parallel'|'perpendicular'
export type GridPoint={x:number;y:number}
export type RelatedProblem={given:Line;point:GridPoint;answer:Line}
const slopes=[[1,2],[-2,1],[2,3],[-1,2],[3,2],[-2,3]]
export function targetSlope(line:Line,relation:Relation){return relation==='parallel'?{rise:line.rise,run:line.run}:{rise:-line.run*Math.sign(line.rise),run:Math.abs(line.rise)}}
export function onLine(line:Line,p:GridPoint){return Math.abs(p.y-line.y-p.x*line.rise/line.run)<1e-8}
export function relatedProblem(relation:Relation,index:number,demo=false,rng=Math.random):RelatedProblem{
 if(demo&&relation==='parallel')return {given:{x:0,y:5,rise:1,run:4},point:{x:3,y:2},answer:{x:0,y:1.25,rise:1,run:4}}
 const pair=slopes[demo?0:(Math.floor(rng()*slopes.length)+index)%slopes.length],given={x:0,y:demo?1:Math.floor(rng()*5)-2,rise:pair[0],run:pair[1]},m=targetSlope(given,relation),x=demo?2:(rng()<.5?-1:1)*m.run,y=demo?4:Math.floor(rng()*7)-3
 const point={x,y:onLine(given,{x,y})?y+2:y},answer={x:0,y:point.y-m.rise/m.run*point.x,...m}
 return {given,point,answer}
}
export function discoveryLine(relation:Relation,round:number):Line{return {x:0,y:round===0?1:-2,rise:relation==='parallel'?(round===0?1:-2):(round===0?2:-1),run:relation==='parallel'?(round===0?2:1):(round===0?1:2)}}
export function through(a:GridPoint,b:GridPoint):Line|null{if(a.x===b.x)return null;return {x:0,y:a.y-(b.y-a.y)/(b.x-a.x)*a.x,rise:b.y-a.y,run:b.x-a.x}}
export function relationMatches(line:Line,a:GridPoint,b:GridPoint,relation:Relation){const other=through(a,b);if(!other)return false;const m=targetSlope(line,relation);return other.rise*m.run===m.rise*other.run}
export const supportFor=(index:number,demo:boolean)=>demo||index<2?'guided':index<4?'slope':'independent'
export function slopeCorrect(text:string,line:Line){return numberAnswer(text,line.rise/line.run)}
export function reciprocalHint(line:Line){return `The original slope is ${fraction(line.rise,line.run)}. Flip its numerator and denominator, then change its sign.`}
export type RelatedCheckpoint={topic:Relation;phase:'intro'|'discover'|'conclude'|'lesson'|'practice'|'finished'|'identify'|'slope-only'|'visual'|'opening'|'meaning';recognition?:number;transfer?:number;parallelConclusion?:string;round:number;demo:boolean;index:number;parallel:number;perpendicular:number;firstTry:number;checks:number}
const phases=['intro','discover','conclude','lesson','practice','finished','identify','slope-only','visual','opening','meaning'] as const
export const newRelatedCheckpoint=():RelatedCheckpoint=>({topic:'parallel',phase:'opening',round:0,demo:true,index:0,parallel:0,perpendicular:0,firstTry:0,checks:0})
export function relatedScore(c:RelatedCheckpoint){return Math.round((c.parallel+c.perpendicular)/12*100)/10}
export function saveRelated(c:RelatedCheckpoint,id:{first:string;last:string;hour:string}){const s=newSession();s.warnings=1024+phases.indexOf(c.phase)*128+(c.topic==='perpendicular'?64:0)+(c.demo?32:0)+c.round*8+c.index;s.readingWarnings=(c.recognition??0)+(c.parallelConclusion?4:0);s.distributionWarnings=c.transfer??0;s.stats[0]={correct:c.parallel,attempts:c.parallel,streak:0,best:0};s.stats[1]={correct:c.perpendicular,attempts:c.perpendicular,streak:0,best:0};s.stats[2]={correct:c.firstTry,attempts:c.checks,streak:0,best:0};return saveCode(s,id.first,id.last,`${id.hour}:related-lines-v2`).replace(/^WL1-/,'RLP-')}
export function loadRelated(code:string,id:{first:string;last:string;hour:string}):RelatedCheckpoint{
 if(!code.trim().toUpperCase().startsWith('RLP-'))throw Error('Use a resume code from Write the Linear Equation: Parallel and Perpendicular.')
 const s=loadCode(code.trim().toUpperCase().replace(/^RLP-/,'WL1-'),id.first,id.last,`${id.hour}:related-lines-v2`),modern=s.warnings>=1024,v=modern?s.warnings-1024:s.warnings,unit=modern?128:64,phase=phases[Math.floor(v/unit)],topic=v%unit>=unit/2?'perpendicular':'parallel',demo=v%(unit/2)>=unit/4,round=Math.floor(v%(unit/4)/8),index=v%8,c={topic,phase,demo,round,index,parallel:s.stats[0].correct,perpendicular:s.stats[1].correct,firstTry:s.stats[2].correct,checks:s.stats[2].attempts,...(modern?{recognition:(s.readingWarnings??0)%4,...((s.readingWarnings??0)>=4?{parallelConclusion:'equal'}:{}),transfer:s.distributionWarnings??0}:{})} as RelatedCheckpoint
 if((s.readingWarnings??0)>7||!phase||(c.recognition??0)>3||(c.transfer??0)>4||round>1||index>5||c.parallel>6||c.perpendicular>6||c.firstTry>c.parallel+c.perpendicular||c.checks<c.firstTry||topic==='parallel'&&c.perpendicular!==0||topic==='perpendicular'&&c.parallel!==6)throw Error('The saved progress is inconsistent.')
 return c
}

export function relatedEquationTex(line:Line){const m=line.rise===line.run?'':line.rise===-line.run?'-':slopeTex(line);let d=1;while(d<100&&Math.abs(Math.abs(line.y)*d-Math.round(Math.abs(line.y)*d))>1e-8)d++;const n=Math.round(Math.abs(line.y)*d),b=d===1?String(n):`\\frac{${n}}{${d}}`;return `y=${m}x${line.y===0?'':(line.y<0?'-':'+')+b}`}
