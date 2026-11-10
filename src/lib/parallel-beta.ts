import type {Line} from './slope.ts'
import type {ParallelMatch} from './parallel-foundations.ts'
import {discoveryLine} from './related-lines-v2.ts'
/** Five distinct lines and exactly one parallel pair. Labels and slopes vary indefinitely. */
export function randomParallelMatch(rng=Math.random):ParallelMatch{
 const slopes=[[1,2],[2,3],[3,2],[1,1],[-1,2],[-2,3],[-3,2],[-1,1],[2,1],[-2,1]]
 const shuffle=<T,>(a:T[])=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
 const choices=shuffle([...slopes]),pairs=[choices[0],choices[0],...choices.slice(1,4)],labels=shuffle(['A','B','C','D','E'])
 const lines=pairs.map(([rise,run],i)=>({x:0,y:i===0?-3:i===1?3:Math.floor(rng()*5)-2,rise,run,label:labels[i]}))
 return {lines:lines.sort((a,b)=>a.label.localeCompare(b.label)),pair:[labels[0],labels[1]]}
}
export function discoveryPartner(round:number):Line{return {...discoveryLine('parallel',round),y:round===0?4:2}}
export function equalSlopeAnswer(value:string){return /^(same|equal|identical|equivalent|the same|the same slope|same slopes|equal slopes|igual|iguales|la misma|misma|mismas)$/i.test(value.trim().replace(/[.!]$/,''))}
export function transferHints(kind:string,rise:number,run:number){
 const shared='A parallel line has the same slope, including the sign.'
 if(kind==='equation')return ['In y = mx + b, the coefficient multiplying x is the slope.',shared,`The slope is ${rise}/${run}. Use that value for the parallel line.`]
 if(kind==='graph')return ['Tap two integer points on the blue line to see their coordinates. Tapping is optional.','Count from left to right: change in y is rise; change in x is run. A fall gives a negative rise.',shared,`The slope is ${rise}/${run}. An equivalent fraction is also correct.`]
 return ['Rewrite the given line in slope-intercept form.','Subtract 2x from both sides: 5y = −2x + 10.','Divide every term by 5: y = (−2/5)x + 2.',shared]
}
