import assert from 'node:assert/strict'
import {equationFamilyQuestion,equationFamilyValue} from '../src/lib/function-family-equations.ts'
import {equationGraphPath,equationGraphWindow} from '../src/lib/function-family-equation-graph.ts'
for(const kind of ['parent','single','multi'])for(const seed of [0,1,17,71,12345,0xffffffff])for(let index=0;index<40;index++){
 const q=equationFamilyQuestion(seed,index,kind),{step,radius}=equationGraphWindow(q),scale=204/radius
 assert.equal(radius,step*6)
 const anchor=q.family==='constant'?{x:0,y:q.a+q.k}:q.family==='linear'?{x:0,y:q.k-q.a*q.h}:{x:q.h,y:q.k}
 assert(Math.abs(anchor.x)<radius&&Math.abs(anchor.y)<radius,'actual anchor remains visible')
 const points=[...equationGraphPath(q).matchAll(/[ML](-?[\d.]+),(-?[\d.]+)/g)].map(m=>({x:Number(m[1]),y:Number(m[2])}))
 assert(points.length>=601)
 let visible=0
 for(let n=0;n<points.length;n++){
  const p=points[n],x=(p.x-240)/scale
  assert(Number.isFinite(p.x)&&Number.isFinite(p.y))
  if(n)assert(p.x>=points[n-1].x)
  // x is rounded for SVG; steep cubic slopes amplify its small coordinate rounding.
  const tolerance=.006+Math.abs(equationFamilyValue(q,x+.006/scale)-equationFamilyValue(q,x)) *scale
  assert(Math.abs(p.y-(240-equationFamilyValue(q,x)*scale))<tolerance+.001)
  if(p.y>=36&&p.y<=444)visible++
 }
 assert(visible>5,'a meaningful segment of every actual function is on the grid')
 const hx=240+q.h*scale,hy=240-equationFamilyValue(q,q.h)*scale
 assert(points.some(p=>Math.abs(p.x-hx)<.006&&Math.abs(p.y-hy)<.006),'include the exact corner/vertex')
}
const constant={...equationFamilyQuestion(1,0,'parent'),family:'constant',a:5,h:0,k:6,kind:'multi',equation:'y=5(1)+6'}
const {radius}=equationGraphWindow(constant)
assert(equationGraphPath(constant).split(' ').every(p=>Math.abs(Number(p.split(',')[1])-(240-11*204/radius))<.006),'constant graph honors a+k, including nonunit a')
console.log('Passed accurate equal-unit graphs for all five families, parent/single/multi equations, shifted/fractional/expanded cases, visible anchors/segments, exact corners and nonunit constant values.')
