export type DrawPoint={x:number;y:number}
export type FittedStroke={center:DrawPoint;direction:DrawPoint;a:DrawPoint;b:DrawPoint;span:number;wobble:number}
export type ParallelResult={percent:number;spread:number;offset:number;alignment:number;crosses:boolean;markers:{point:DrawPoint;foot:DrawPoint}[]}
const dot=(a:DrawPoint,b:DrawPoint)=>a.x*b.x+a.y*b.y
const delta=(a:DrawPoint,b:DrawPoint)=>({x:a.x-b.x,y:a.y-b.y})
/** Uniform arc-length samples remove dependence on stylus speed, event rate and pauses. */
export function sampleStroke(raw:DrawPoint[],count=161):DrawPoint[]{
 const points=raw.filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)),lengths=[0]
 for(let i=1;i<points.length;i++)lengths.push(lengths[i-1]+Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y))
 const total=lengths[lengths.length-1]??0;if(points.length<2||total<1e-6)return []
 const out:DrawPoint[]=[];let edge=1
 for(let i=0;i<count;i++){const at=total*i/(count-1);while(edge<points.length-1&&lengths[edge]<at)edge++;const before=points[edge-1],after=points[edge],t=(at-lengths[edge-1])/Math.max(1e-12,lengths[edge]-lengths[edge-1]);out.push({x:before.x+(after.x-before.x)*t,y:before.y+(after.y-before.y)*t})}return out
}
/** Orthogonal least squares handles vertical lines as naturally as horizontal ones. */
export function fitStroke(raw:DrawPoint[]):FittedStroke|null{
 const points=sampleStroke(raw);if(!points.length)return null
 const center=points.reduce((c,p)=>({x:c.x+p.x/points.length,y:c.y+p.y/points.length}),{x:0,y:0});let xx=0,xy=0,yy=0
 for(const p of points){const d=delta(p,center);xx+=d.x*d.x;xy+=d.x*d.y;yy+=d.y*d.y}
 const angle=.5*Math.atan2(2*xy,xx-yy),direction={x:Math.cos(angle),y:Math.sin(angle)}
 if(dot(delta(points[points.length-1],points[0]),direction)<0){direction.x*=-1;direction.y*=-1}
 const projection=points.map(p=>dot(delta(p,center),direction)),lo=Math.min(...projection),hi=Math.max(...projection),span=hi-lo
 if(span<1)return null
 const normal={x:-direction.y,y:direction.x},wobble=Math.sqrt(points.reduce((n,p)=>n+dot(delta(p,center),normal)**2,0)/points.length)
 const at=(t:number)=>({x:center.x+t*direction.x,y:center.y+t*direction.y})
 return {center,direction,a:at(lo),b:at(hi),span,wobble}
}
export function firstStroke(raw:DrawPoint[]):{line:FittedStroke|null;error:'short'|'curve'|null}{
 const line=fitStroke(raw);if(!line||line.span<160)return {line:null,error:'short'}
 if(line.wobble/line.span>.12)return {line:null,error:'curve'}
 return {line,error:null}
}
export function scoreParallel(line:FittedStroke,raw:DrawPoint[]):{result:ParallelResult|null;error:'short'|'overlap'|null}{
 const points=sampleStroke(raw),fit=fitStroke(raw)
 if(!fit||fit.span<Math.max(140,Math.min(280,line.span*.6)))return {result:null,error:'short'}
 const normal={x:-line.direction.y,y:line.direction.x},distances=points.map(p=>dot(delta(p,line.center),normal))
 if(Math.max(...distances.map(Math.abs))<18)return {result:null,error:'overlap'}
 const offset=distances.reduce((n,d)=>n+d/points.length,0),spread=Math.sqrt(distances.reduce((n,d)=>n+(d-offset)**2/points.length,0)),alignment=Math.min(1,Math.abs(dot(line.direction,fit.direction)))
 const scale=Math.max(18,Math.min(Math.abs(offset),line.span/4)),crosses=Math.min(...distances)<-3&&Math.max(...distances)>3
 // A game index, not a mathematical percentage of parallelism: constant signed gap
 // and matching direction earn 100; drift, wobble and crossing reduce the score.
 const percent=Math.max(0,Math.min(100,Math.round(100*alignment**2*Math.exp(-1.5*spread/scale))))
 const markers=[.12,.31,.5,.69,.88].map(t=>{const i=Math.round(t*(points.length-1)),point=points[i],d=distances[i];return {point,foot:{x:point.x-d*normal.x,y:point.y-d*normal.y}}})
 return {result:{percent,spread,offset,alignment,crosses,markers},error:null}
}
export function parallelPraise(score:number){return score>=98?'Parallel perfection. Those lines are keeping their distance!':score>=90?'Beautifully matched. Same direction, steady gap!':score>=75?'Close! Keep that gap steady all the way across.':score>=50?'Getting there. Watch where the gap starts to change.':'Try again. Match the direction and keep an even gap.'}
export const parallelDrawingSkill='Draw a second line that stays the same perpendicular distance from the first line.'

export type DrawingGameState={line:FittedStroke|null;draft:DrawPoint[];stroke:DrawPoint[];result:ParallelResult|null;scores:number[];error:string;markers:boolean}
