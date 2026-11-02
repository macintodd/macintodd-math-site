export const transformationFamilies=['linear','absolute','quadratic','squareRoot','cubic','rational'] as const
export type TransformationFamily=typeof transformationFamilies[number]
export const transformationNames:Record<TransformationFamily,string>={linear:'Linear',absolute:'Absolute value',quadratic:'Quadratic',squareRoot:'Square root',cubic:'Cubic',rational:'Rational'}
export type Parameters={a:number;b:number;h:number;k:number}
export type Parameter=keyof Parameters
export const parameterKeys:Parameter[]=['a','b','h','k']
export const identity:Parameters={a:1,b:1,h:0,k:0}
export const bValues=[-4,-3,-2,-1,-.5,-.25,.25,.5,1,2,3,4]
export function parentValue(f:TransformationFamily,x:number){if(f==='squareRoot'&&x<0||f==='rational'&&Math.abs(x)<1e-10)return null;const y=f==='linear'?x:f==='absolute'?Math.abs(x):f==='quadratic'?x*x:f==='squareRoot'?Math.sqrt(x):f==='cubic'?x*x*x:1/x;return Number.isFinite(y)?y:null}
export function transformedValue(f:TransformationFamily,x:number,p:Parameters){const y=parentValue(f,p.b*(x-p.h));return y===null?null:p.a*y+p.k}
export function mappedPoint(f:TransformationFamily,t:number,p:Parameters){const y=parentValue(f,t);return y===null||p.b===0?null:{parent:{x:t,y},transformed:{x:t/p.b+p.h,y:p.a*y+p.k}}}
export function sampleInputs(f:TransformationFamily){return f==='squareRoot'?[0,1,4,9]:f==='rational'?[-2,-1,.5,1,2]:[-2,-1,0,1,2]}
export function parentTex(f:TransformationFamily,x='x'){return f==='linear'?x:f==='absolute'?`\\left|${x}\\right|`:f==='quadratic'?`\\left(${x}\\right)^2`:f==='squareRoot'?`\\sqrt{${x}}`:f==='cubic'?`\\left(${x}\\right)^3`:`\\frac{1}{${x}}`}
export function numberText(n:number){return Math.abs(n)<1e-9?'0':Number.isInteger(n)?String(n):String(Number(n.toFixed(3)))}
function shifted(variable:string,n:number){return n===0?variable:n<0?`${variable}+${numberText(-n)}`:`${variable}-${numberText(n)}`}
export function modelTex(selected:Parameter[],family?:TransformationFamily,values?:Parameters){
 const has=(key:Parameter)=>selected.includes(key)
 let input=has('h')?(values?shifted('x',values.h):'x-h'):'x'
 if(has('b'))input=values?`${numberText(values!.b)}\\left(${input}\\right)`:`b\\left(${input}\\right)`
 let body=family?parentTex(family,input):`f\\left(${input}\\right)`
 if(has('a'))body=values?`${numberText(values.a)}\\left(${body}\\right)`:`a\\,${body}`
 if(has('k'))body+=values?(values.k<0?`-${numberText(-values.k)}`:`+${numberText(values.k)}`):'+k'
 return `g(x)=${body}`
}
// Separate branches at a rational asymptote, including when a=0 leaves a domain hole.
export function graphSegments(f:TransformationFamily,p:Parameters,extent:number){
 const segments:string[]=[];let path='',previous:number|null=null
 for(let i=0;i<=800;i++){const x=-extent+2*extent*i/800,y=transformedValue(f,x,p),crosses=f==='rational'&&previous!==null&&(previous-p.h)*(x-p.h)<=0
 if(y===null||Math.abs(y)>extent*3||crosses){if(path)segments.push(path);path='';if(y===null||Math.abs(y)>extent*3){previous=x;continue}}
 path+=`${path?'L':'M'}${numberText(x)},${numberText(-y)} `;previous=x}
 if(path)segments.push(path);return segments
}
