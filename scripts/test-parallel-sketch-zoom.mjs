import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as lesson from '../src/lib/parallel-lesson.ts'
import * as feedback from '../src/lib/parallel-sketch-feedback.ts'
const q=lesson.parallelLesson[0],close=(a,b)=>assert(Math.abs(a-b)<1e-7,`${a} != ${b}`)
assert.deepEqual(feedback.sketchFeedbackCamera(q,{a:{x:-10,y:9},b:{x:10,y:9}},'point'),{x:6,y:-2,span:4})
const far={a:{x:6,y:-2},b:{x:-4,y:-9}},vertical={a:{x:6,y:-8},b:{x:6,y:8}};close(feedback.sketchIntersection(q,far).x,66);assert.deepEqual(feedback.sketchIntersection(q,vertical),{x:6,y:0});assert.equal(feedback.sketchIntersection(q,{a:{x:0,y:0},b:{x:3,y:2}}),null)
for(let x=-10;x<=10;x++)for(let y=-10;y<=10;y++){const s={a:q.point,b:{x,y}};if(Math.hypot(x-6,y+2)<1)continue;const hit=feedback.sketchIntersection(q,s);if(!hit)continue;close(hit.y,q.given.m*hit.x+q.given.b);close((hit.x-s.a.x)*(s.b.y-s.a.y),(hit.y-s.a.y)*(s.b.x-s.a.x));const c=feedback.sketchFeedbackCamera(q,s,'direction');const near=Math.max(Math.abs(hit.x),Math.abs(hit.y))<=10;assert(near?c.span===8:c.span>=20);for(const p of near?[hit]:[hit,q.point,{x:-10,y:-10},{x:10,y:10}]){assert(Math.abs(p.x-c.x)<c.span/2);assert(Math.abs(p.y-c.y)<c.span/2)}const clipped=feedback.clipSketchLine(s,c);assert(clipped);for(const p of [clipped.a,clipped.b]){assert(Math.abs(p.x-c.x)<=c.span/2+1e-7);assert(Math.abs(p.y-c.y)<=c.span/2+1e-7)}}
assert.equal(feedback.clipSketchLine({a:{x:-10,y:9},b:{x:10,y:9}},{x:6,y:-2,span:4}),null);assert(feedback.clipSketchLine({a:{x:6,y:-10},b:{x:6,y:10}},{x:6,y:-2,span:4}));assert.equal(feedback.sketchGridStep(4),1);assert.equal(feedback.sketchGridStep(20),1);assert(feedback.sketchGridStep(200)>1)
for(const target of [{x:6,y:-2,span:4},feedback.sketchFeedbackCamera(q,far,'direction')]){assert.deepEqual(feedback.sketchCameraFrame(target,0),feedback.normalSketchCamera);assert.deepEqual(feedback.sketchCameraFrame(target,1),target);const middle=feedback.sketchCameraFrame(target,.5);close(middle.span,(20+target.span)/2)}
const perpendicular=lesson.parallelLesson.find(q=>q.id==='T5')
const crossing={a:perpendicular.point,b:{x:6,y:8}}
assert.deepEqual(feedback.sketchFeedbackCamera(perpendicular,crossing,'direction'),{x:6,y:0,span:8})
const sameSlope={a:perpendicular.point,b:{x:9,y:0}}
assert.equal(feedback.sketchIntersection(perpendicular,sameSlope),null)
const parallelCloseup=feedback.sketchFeedbackCamera(perpendicular,sameSlope,'direction')
assert(parallelCloseup.span<20)
assert(feedback.clipSketchLine(sameSlope,parallelCloseup))
assert(feedback.clipSketchLine({a:{x:0,y:perpendicular.given.b},b:{x:3,y:perpendicular.given.b+2}},parallelCloseup))
let cursor=0,clock=0,tree,effects=[],rafId=0,reduced=false;const hooks=[],callbacks=new Map(),jsx=(type,props)=>({type,props:props??{}}),react={useId:()=> 'zoom',useState(v){const i=cursor++;hooks[i]??={value:v};return[hooks[i].value,x=>hooks[i].value=typeof x==='function'?x(hooks[i].value):x]},useEffect(fn,deps){const i=cursor++,old=hooks[i];if(!old||deps.some((v,j)=>v!==old.deps[j])){old?.cleanup?.();hooks[i]={deps};effects.push(()=>{hooks[i].cleanup=fn()})}}},mod={exports:{}}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/beta/parallel-perpendicular-lesson/SketchFeedbackGraph.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:mod,exports:mod.exports,window:{matchMedia:()=>({matches:reduced})},requestAnimationFrame:fn=>{callbacks.set(++rafId,fn);return rafId},cancelAnimationFrame:id=>callbacks.delete(id),require:n=>n==='react'?react:n==='react/jsx-runtime'?{jsx,jsxs:jsx}:feedback})
let props={q,segment:far,reason:'direction'}
function nodes(n=tree){return Array.isArray(n)?n.flatMap(nodes):n&&typeof n==='object'?[n,...nodes(n.props.children??null)]:[]}
function render(){cursor=0;tree=mod.exports.default(props);const jobs=effects;effects=[];jobs.forEach(fn=>fn())}function tick(t){clock=t;const [id,fn]=callbacks.entries().next().value;callbacks.delete(id);fn(t);render()}
render();assert.equal(tree.props['data-camera'],'0,0,20');tick(0);tick(1600);assert.equal(hooks[0].value,.5);assert(!nodes().some(n=>n.props.className==='lp-intersection-callout'));tick(3200);assert(nodes().some(n=>n.props.className==='lp-intersection-callout'));assert(nodes().some(n=>n.props.className==='lp-sketch-extension'));assert.equal(callbacks.size,0)
props={q,segment:{a:{x:0,y:9},b:{x:10,y:9}},reason:'point'};hooks.length=0;render();tick(5000);tick(5650);assert.equal(hooks[0].value,.5);tick(6300);assert.equal(tree.props['data-camera'],'6,-2,4');assert(!nodes().some(n=>n.props.className==='lp-intersection-callout'));const gold=nodes().find(n=>n.type==='circle'&&n.props.fill==='#efbd36');assert.equal(gold.props.cx,250);assert.equal(gold.props.cy,250)
// Reduced motion reaches a complete static diagnostic on its first frame; unmount cancels pending work.
reduced=true;hooks.length=0;render();tick(7000);assert.equal(hooks[0].value,1);assert.equal(callbacks.size,0);reduced=false;hooks.length=0;render();assert(callbacks.size);hooks[1].cleanup();assert.equal(callbacks.size,0)
console.log('Passed exact intersections for all integer slopes including vertical lines, distant-crossing framing, point-only close-up, viewport clipping/grid scale, eased point and slow intersection zooms, delayed arrow, reduced motion and animation cleanup.')

props={...props,isExternalDisplay:true,mirroredProgress:.6,onProgressChange:()=>{throw Error('TV must not publish camera frames')}};hooks.length=0;render();assert.equal(callbacks.size,0);const expected=feedback.sketchCameraFrame(feedback.sketchFeedbackCamera(q,props.segment,props.reason),.6);assert.equal(tree.props['data-camera'],`${expected.x},${expected.y},${expected.span}`);props.mirroredProgress=1;render();assert(nodes().some(n=>n.props.className==='lp-point-callout'));assert.equal(callbacks.size,0);console.log('Passed mid-zoom restore from a native snapshot, static final callout, and zero independent timers or outgoing camera updates on the TV.');

for(const [segment,expected] of [[crossing,'Check this angle.'],[sameSlope,'These lines are parallel.']]){
 props={q:perpendicular,segment,reason:'direction',isExternalDisplay:true,mirroredProgress:1}
 hooks.length=0;render()
 assert(nodes().some(n=>n.props.children===expected))
 assert.equal(callbacks.size,0)
}
