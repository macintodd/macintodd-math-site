import type {LessonPoint,LessonProblem,LessonSegment} from './parallel-lesson.ts'
export type SketchCamera={x:number;y:number;span:number}
export const normalSketchCamera:SketchCamera={x:0,y:0,span:20}
/** Intersection of the student's extended line and the given line, including vertical sketches. */
export function sketchIntersection(q:LessonProblem,s:LessonSegment):LessonPoint|null{
 const dx=s.b.x-s.a.x,dy=s.b.y-s.a.y,den=dy-q.given.m*dx
 if(Math.abs(den)<1e-10)return null
 const t=(q.given.m*s.a.x+q.given.b-s.a.y)/den,p={x:s.a.x+t*dx,y:s.a.y+t*dy}
 return Number.isFinite(p.x)&&Number.isFinite(p.y)?p:null
}
export function sketchFeedbackCamera(q:LessonProblem,s:LessonSegment,reason:'point'|'direction'):SketchCamera{
 if(reason==='point')return {x:q.point.x,y:q.point.y,span:4}
 const hit=sketchIntersection(q,s);if(!hit)return normalSketchCamera
 const left=Math.min(-10,hit.x),right=Math.max(10,hit.x),bottom=Math.min(-10,hit.y),top=Math.max(10,hit.y)
 return {x:(left+right)/2,y:(bottom+top)/2,span:Math.max(right-left,top-bottom)*1.35}
}
/** Clip an infinite parametric line to the square world window. No slope division, so vertical lines work. */
export function clipSketchLine(s:LessonSegment,c:SketchCamera):LessonSegment|null{
 const dx=s.b.x-s.a.x,dy=s.b.y-s.a.y;if(Math.hypot(dx,dy)<1e-10)return null
 let lo=-Infinity,hi=Infinity
 for(const [a,d,center] of [[s.a.x,dx,c.x],[s.a.y,dy,c.y]]){const min=center-c.span/2,max=center+c.span/2;if(Math.abs(d)<1e-10){if(a<min||a>max)return null;continue}const t1=(min-a)/d,t2=(max-a)/d;lo=Math.max(lo,Math.min(t1,t2));hi=Math.min(hi,Math.max(t1,t2))}
 if(lo>hi)return null
 return {a:{x:s.a.x+lo*dx,y:s.a.y+lo*dy},b:{x:s.a.x+hi*dx,y:s.a.y+hi*dy}}
}
export function sketchGridStep(span:number){const size=span/20,power=10**Math.floor(Math.log10(size));return Math.max(1,[1,2,5,10].find(n=>n*power>=size)!*power)}
export function sketchCameraFrame(target:SketchCamera,progress:number):SketchCamera{
 const p=Math.max(0,Math.min(1,progress));if(p===0)return normalSketchCamera;if(p===1)return target;const ease=p*p*(3-2*p)
 return {x:target.x*ease,y:target.y*ease,span:20+(target.span-20)*ease}
}
