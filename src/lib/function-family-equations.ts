import {familyQuestion, familyIds, type FunctionFamily} from './function-family-graphs.ts'

export const equationFamilySlug = 'beta/function-family-equations'
export const equationFamilyTitle = '2. Identify Function Family by Equation'
export type EquationKind = 'parent' | 'single' | 'multi'
export type EquationQuestion = {family:FunctionFamily; label:'f(x)'|'g(x)'|'h(x)'|'y'; a:number; h:number; k:number; kind:EquationKind; expanded:boolean; equation:string; changes:number}
function random(seed:number){let value=seed>>>0;return()=>{value=(value+0x6D2B79F5)>>>0;let n=Math.imul(value^(value>>>15),1|value);n^=n+Math.imul(n^(n>>>7),61|n);return ((n^(n>>>14))>>>0)/4294967296}}
export function equationNumber(n:number):string {
 for(let d=1;d<=120;d++){const p=Math.round(n*d);if(Math.abs(p/d-n)<1e-9)return d===1?String(p):`${p<0?'-':''}\\frac{${Math.abs(p)}}{${d}}`}
 throw Error('Unsupported equation fraction')
}
function polynomial(terms:[number,string][]){let text='';for(const [coefficient,variable] of terms){if(Math.abs(coefficient)<1e-9)continue;const n=Math.abs(coefficient);text+=coefficient<0?'-':text?'+':'';text+=n===1&&variable?variable:equationNumber(n)+variable}return text||'0'}
export function equationRhs(q:Omit<EquationQuestion,'label'|'equation'|'changes'>):string {
 const {family,a,h,k,kind,expanded}=q
 if(family==='constant')return kind==='multi'?polynomial([[a,'(1)'],[k,'']]):equationNumber(a+k)
 if(expanded&&family!=='absolute'){
  if(family==='linear')return polynomial([[a,'x'],[k-a*h,'']])
  if(family==='quadratic')return polynomial([[a,'x^2'],[-2*a*h,'x'],[a*h*h+k,'']])
  return polynomial([[a,'x^3'],[-3*a*h,'x^2'],[3*a*h*h,'x'],[k-a*h**3,'']])
 }
 const inside=polynomial([[1,'x'],[-h,'']])
 const body=family==='absolute'?`\\lvert ${inside}\\rvert`:family==='linear'?(h?`(${inside})`:'x'):`${h?`(${inside})`:'x'}^${family==='quadratic'?2:3}`
 return polynomial([[a,body],[k,'']])
}
/** Private curriculum sequencing. No difficulty-mechanism labels are shown in the activity. */
export function equationFamilyQuestion(seed:number,index:number,kind:EquationKind):EquationQuestion {
 const rng=random((seed^Math.imul(index+1,0x9E3779B9))>>>0),pick=<T,>(items:readonly T[])=>items[Math.floor(rng()*items.length)]
 const family=familyQuestion(seed,index).family
 const label=(['f(x)','g(x)','h(x)','y'] as const)[(index+(seed&3))%4]
 let a=1,h=0,k=0
 if(kind==='single'){
  const axis=family==='constant'?2:Math.floor(rng()*3)
  if(axis===0)a=pick([.2,.25,.5,2,3,4,5,-1])
  if(axis===1)h=pick([-6,-4,-3,-2,-1,1,2,3,4,6])
  if(axis===2)k=pick([-6,-4,-3,-2,-1,1,2,3,4,6])
 }
 if(kind==='multi'){
  a=pick([.2,.5,1,2,3,5,-1,-2,-.5]);h=pick([-3,-2,-1,1,2,3]);k=pick([-6,-4,-2,-1,1,2,4,6])
  if(family==='constant'){a=pick([.5,2,3,4,5]);h=0;if(a+k===1)k+=2}
  if(family==='linear'){if(a===1)a=2;if(k-a*h===0)k+=1}
  // Expanded integer-coefficient examples include x²−5x+6 (vertex 5/2, −1/4).
  if(family==='quadratic'&&index%2===1&&rng()<.5){a=1;h=pick([-2.5,-1.5,1.5,2.5]);k=pick([-3,-1,1,3,6])-h*h;if(!k)k=1}
 }
 const expanded=family==='linear'||kind==='multi'&&family!=='absolute'&&index%2===1
 const base={family,a,h,k,kind,expanded}
 const changes=(a<0?1:0)+(Math.abs(a)!==1?1:0)+(h!==0?1:0)+(k!==0?1:0)
 return {...base,label,equation:`${label}=${equationRhs(base)}`,changes}
}
export function equationFamilyValue(q:EquationQuestion,x:number){const u=x-q.h;return q.a*(q.family==='constant'?1:q.family==='linear'?u:q.family==='absolute'?Math.abs(u):q.family==='quadratic'?u*u:u*u*u)+q.k}
export function validEquationFamily(value:unknown):value is FunctionFamily{return familyIds.includes(value as FunctionFamily)}
