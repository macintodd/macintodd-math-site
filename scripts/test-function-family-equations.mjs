import assert from 'node:assert/strict'
import katex from 'katex'
import {equationFamilyQuestion,equationFamilyValue,equationRhs} from '../src/lib/function-family-equations.ts'
import {familyIds} from '../src/lib/function-family-graphs.ts'
function displayedValue(tex,x){const expression=tex.slice(tex.indexOf('=')+1).replace(/\\frac\{(\d+)\}\{(\d+)\}/g,'($1/$2)').replace(/\\lvert\s*(.*?)\\rvert/g,'Math.abs($1)').replace(/(\d|\))(?=x|\(|Math\.abs)/g,'$1*').replace(/^-/, '-1*').replace(/\^/g,'**');return new Function('x',`return ${expression}`)(x)}
const labels=new Set(),examples=new Set()
for(const kind of ['parent','single','multi'])for(const seed of [0,1,17,71,12345,0xffffffff])for(let block=0;block<8;block++){
 const qs=Array.from({length:5},(_,i)=>equationFamilyQuestion(seed,block*5+i,kind))
 assert.deepEqual(new Set(qs.map(q=>q.family)),new Set(familyIds))
 for(const q of qs){
  labels.add(q.label);examples.add(q.equation.slice(q.equation.indexOf('=')+1))
  assert(q.a!==0)
  assert.equal(q.kind,kind)
  if(kind==='parent')assert.equal(q.changes,0)
  if(kind==='single')assert.equal(q.changes,1)
  if(kind==='multi')assert(q.changes>=2)
  katex.renderToString(q.equation,{throwOnError:true,trust:false})
  for(const x of [-4,-1.25,0,.5,3])assert(Math.abs(displayedValue(q.equation,x)-equationFamilyValue(q,x))<1e-8,q.equation)
 }
}
assert.deepEqual(labels,new Set(['f(x)','g(x)','h(x)','y']))
assert([...examples].some(s=>s.includes('\\frac{1}{5}x^2')))
assert.equal(equationRhs({family:'quadratic',a:1,h:2.5,k:-.25,kind:'multi',expanded:true}),'x^2-5x+6')
assert.equal(equationRhs({family:'quadratic',a:5,h:6,k:4,kind:'multi',expanded:false}),'5(x-6)^2+4')
console.log('Passed five-family coverage, all four equation labels, parent/single/multiple-change generation, exact displayed math, fractions and expanded/shifted examples.')
