import assert from 'node:assert/strict'
import katex from 'katex'
import {transformationFamilies,identity,parameterKeys,parentValue,transformedValue,mappedPoint,modelTex,graphSegments,sampleInputs} from '../src/lib/transformations.ts'
let checked=0
for(const family of transformationFamilies)for(const a of [-2,0,.5,1,3])for(const b of [-2,-.25,.5,1,3])for(const h of [-3,0,2])for(const k of [-2,0,4]){
 const p={a,b,h,k};for(const t of sampleInputs(family)){const mapped=mappedPoint(family,t,p);assert(mapped);const expected=transformedValue(family,mapped.transformed.x,p);assert(Math.abs(expected-mapped.transformed.y)<1e-8);checked++}
 for(let mask=1;mask<16;mask++){const selected=parameterKeys.filter((_,i)=>mask&(1<<i));katex.renderToString(modelTex(selected,family,p),{throwOnError:true})}
 if(family==='rational')for(const path of graphSegments(family,p,10)){const xs=[...path.matchAll(/[ML](-?[\d.]+),/g)].map(m=>Number(m[1]));assert(!(Math.min(...xs)<h&&Math.max(...xs)>h),'Path must not cross asymptote')}
}
assert.equal(modelTex(['k']),'g(x)=f\\left(x\\right)+k');assert.equal(transformedValue('squareRoot',-1,identity),null);assert.equal(transformedValue('rational',0,{...identity,a:0}),null)
assert.equal(parentValue('linear',3),3);assert.equal(parentValue('absolute',-3),3);assert.equal(parentValue('quadratic',-3),9);assert.equal(parentValue('squareRoot',9),3);assert.equal(parentValue('cubic',-3),-27);assert.equal(parentValue('rational',2),.5)
assert.equal(mappedPoint('quadratic',2,{a:2,b:-.5,h:3,k:1}).transformed.x,-1)
console.log(`Passed ${checked} mapped points across all six families, signed scaling/shifts, domain restrictions, rational branch separation and strict LaTeX for parameter subsets.`)
