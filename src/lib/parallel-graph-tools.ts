import type {LessonSegment} from './parallel-lesson.ts'
export function sketchLine(s:LessonSegment){const dx=s.b.x-s.a.x;if(Math.abs(dx)<1e-10)return null;const m=(s.b.y-s.a.y)/dx;return {m,b:s.a.y-m*s.a.x}}
export function missingLessonNotation(text:string,slope:number){return {prefix:!!text.trim()&&!/^y\s*=/i.test(text.trim()),x:!!text.trim()&&Math.abs(slope)>1e-10&&!/x/i.test(text)}}
