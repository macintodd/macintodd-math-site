import {Math} from './Math'
/** Prose with explicit $...$ inline LaTeX. Never infer mathematics from student text. */
export function MathText({children}:{children:string}){return <>{children.split(/(\$[^$]+\$)/g).map((part,i)=>part.startsWith('$')&&part.endsWith('$')?<Math key={i}>{part.slice(1,-1)}</Math>:part)}</>}
