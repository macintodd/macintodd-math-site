import {lessonSlopeParts,type LessonProblem,type LessonSegment} from './parallel-lesson.ts'
import {clipSketchLine,normalSketchCamera} from './parallel-sketch-feedback.ts'
export function sketchSlopeParts(s:LessonSegment){const dx=s.b.x-s.a.x,dy=s.b.y-s.a.y;return Math.abs(dx)<1e-10?{rise:1,run:0}:lessonSlopeParts(dy/dx)}
/** Change direction about the given point if already reached; otherwise keep the student's first endpoint. */
export function adjustSketchSlope(q:LessonProblem,s:LessonSegment,numerator:string,denominator:string):LessonSegment|null{
 if(!/^[+-]?\d{1,3}$/.test(numerator.trim())||!/^[+-]?\d{1,3}$/.test(denominator.trim()))return null
 const rise=Number(numerator),run=Number(denominator);if(!run)return null
 const dx=s.b.x-s.a.x,dy=s.b.y-s.a.y,onPoint=Math.abs((q.point.x-s.a.x)*dy-(q.point.y-s.a.y)*dx)<1e-8,anchor=onPoint?q.point:s.a
 return clipSketchLine({a:anchor,b:{x:anchor.x+run,y:anchor.y+rise}},normalSketchCamera)
}
export function sketchLine(s:LessonSegment){const dx=s.b.x-s.a.x;if(Math.abs(dx)<1e-10)return null;const m=(s.b.y-s.a.y)/dx;return {m,b:s.a.y-m*s.a.x}}
export function missingLessonNotation(text:string,slope:number){return {prefix:!!text.trim()&&!/^y\s*=/i.test(text.trim()),x:!!text.trim()&&Math.abs(slope)>1e-10&&!/x/i.test(text)}}
