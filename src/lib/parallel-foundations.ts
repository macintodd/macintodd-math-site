import type {Line} from './slope.ts'
export type NamedLine=Line & {label:string}
export type ParallelMatch={lines:NamedLine[];pair:string[]}
const line=(label:string,rise:number,run:number,y:number):NamedLine=>({label,rise,run,x:0,y})
/** Three different directions; exactly one pair of distinct parallel lines in each graph. */
export const parallelMatches:ParallelMatch[]=[
 {lines:[line('A',1,2,-3),line('B',-1,1,2),line('C',2,1,-1),line('D',1,2,2),line('E',-2,1,-3)],pair:['A','D']},
 {lines:[line('A',1,1,-3),line('B',-2,3,-2),line('C',2,1,1),line('D',-2,1,3),line('E',-2,3,3)],pair:['B','E']},
 {lines:[line('A',2,1,-3),line('B',-1,2,1),line('C',2,1,3),line('D',1,2,-2),line('E',-1,1,-3)],pair:['A','C']}
]
export function correctParallelPair(q:ParallelMatch,selected:string[]){return selected.length===2&&q.pair.every(label=>selected.includes(label))}
export const slopeTransfers=[
 {kind:'equation',line:line('',1,5,3),hint:'In y = mx + b, the coefficient of x is m. Keep that slope for a parallel line.'},
 {kind:'equation',line:line('',-3,2,-1),hint:'Keep the complete coefficient of x, including its negative sign. A parallel line has the same slope.'},
 {kind:'graph',line:line('',2,3,1),hint:'Count rise and run between two integer points on the given line. Every parallel line has that same rise/run ratio.'},
 {kind:'graph',line:line('',-2,1,2),hint:'Count from left to right. Falling means negative rise. Keep that signed slope for a parallel line.'},
 {kind:'standard',line:line('',-2,5,2),tex:String.raw`2x+5y=10`,hint:'Rewrite in slope-intercept form: subtract 2x from both sides, then divide every term by 5. The coefficient of x is the slope; use that same slope for a parallel line.'}
] as const
