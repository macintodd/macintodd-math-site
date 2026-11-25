import {equationFamilyValue,type EquationQuestion} from './function-family-equations.ts'

/** Equal x/y units, with enough room for the actual intercept or turning point. */
export function equationGraphWindow(q:EquationQuestion){
 const anchorY=q.family==='constant'?q.a+q.k:q.family==='linear'?q.k-q.a*q.h:q.k
 const extent=Math.max(6,Math.abs(q.h)+3,Math.abs(anchorY)+3)
 const step=[1,2,5,10,20,50,100].find(n=>6*n>=extent)??Math.ceil(extent/6)
 return {step,radius:6*step}
}
export function equationGraphPath(q:EquationQuestion){
 const {radius}=equationGraphWindow(q),scale=204/radius
 const xs=[...new Set([...Array.from({length:601},(_,i)=>-radius+2*radius*i/600),q.h])].sort((a,b)=>a-b)
 return xs.map((x,i)=>`${i?'L':'M'}${(240+x*scale).toFixed(2)},${(240-equationFamilyValue(q,x)*scale).toFixed(2)}`).join(' ')
}
