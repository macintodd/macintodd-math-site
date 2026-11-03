// Exercise actual component event handlers with deterministic hooks and a fake clock.
// This is a unit harness, not a browser/layout test.
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as model from '../src/lib/mixed-graph.ts'
import * as keypad from '../src/lib/mathboard/keypad.ts'
import * as graphModel from '../src/lib/graph-line.ts'
import * as standardModel from '../src/lib/standard-form.ts'
import * as pointModel from '../src/lib/point-slope.ts'
let generated
const generator={...model,takeMixedProblem:(queue,history)=>{const next=model.takeMixedProblem(queue,history,()=>0);generated=next.problem;return next}}
let clock=0,index=0,tree,effects=[],nextFrame=0
const hooks=[],frames=new Map(),paint=[]
const equal=(a,b)=>a&&b&&a.length===b.length&&a.every((v,i)=>v===b[i])
const react={
 useState(initial){const id=index++;if(!hooks[id])hooks[id]={value:typeof initial==='function'?initial():initial};return [hooks[id].value,value=>{hooks[id].value=typeof value==='function'?value(hooks[id].value):value}]},
 useRef(initial){const id=index++;return hooks[id]||(hooks[id]={current:initial})},
 useCallback(fn,deps){const id=index++;if(!hooks[id]||!equal(hooks[id].deps,deps))hooks[id]={fn,deps};return hooks[id].fn},
 useEffect(fn,deps){const id=index++;if(!hooks[id]||!equal(hooks[id].deps,deps)){const old=hooks[id];hooks[id]={deps};effects.push(()=>{old?.cleanup?.();hooks[id].cleanup=fn()})}}
}
react.useLayoutEffect=react.useEffect
const jsx=(type,props)=>({type,props:props||{}}),testModule={exports:{}}
const RealDate=Date
class ClockDate extends RealDate{constructor(...args){super(...(args.length?args:[Date.UTC(2026,9,31,15)+clock]))}}
const context=vm.createContext({exports:testModule.exports,module:testModule,console,Date:ClockDate,Math,HTMLButtonElement:class{},performance:{now:()=>clock},requestAnimationFrame:fn=>{const id=++nextFrame;frames.set(id,fn);return id},cancelAnimationFrame:id=>frames.delete(id),document:{createElement:()=>({width:0,height:0,getContext:()=>new Proxy({fillText:text=>paint.push(text)},{get:(o,key)=>key in o?o[key]:()=>{}}),toDataURL:()=> 'data:image/png;base64,local-report'})},require:name=>name==='react'?react:name==='react/jsx-runtime'?{jsx,jsxs:jsx}:name==='next/link'?{default:'a',__esModule:true}:name==='@/lib/mixed-graph'?generator:name==='@/lib/graph-line'?graphModel:name==='@/lib/standard-form'?standardModel:name==='@/lib/point-slope'?pointModel:name==='@/lib/mathboard/keypad'?keypad:name==='@/components/Math'?{Math:'formula'}:name==='../graph-linear/TapGraph'?{default:'graph',__esModule:true}:name==='../graph-linear/ScratchPad'?{default:'scratch-pad',__esModule:true}:name==='./SlopeReadEntries'?{default:'slope-read-entries',__esModule:true}:name==='../graph-linear/SlopeEntries'?{default:'slope-entries',__esModule:true}:name==='../graph-linear/SlopeWork'?{default:'slope-work',__esModule:true}:name==='../graph-linear/InterceptWork'?{default:'intercept-work',__esModule:true}:name==='@/lib/standard-slope'?{}:(()=>{throw Error(name)})()})
const source=fs.readFileSync('src/app/apps/graph-mixed/MixedGraphPractice.tsx','utf8')
vm.runInContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,context)
function render(){index=0;effects=[];tree=testModule.exports.default();for(const effect of effects)effect();return tree}
function nodes(node){if(arguments.length===0)node=tree;if(Array.isArray(node))return node.flatMap(n=>nodes(n));if(!node||typeof node!=='object')return [];return [node,...nodes(node.props?.children??null)]}
function text(node){if(Array.isArray(node))return node.map(text).join('');if(node==null||typeof node==='boolean')return '';return typeof node==='object'?text(node.props?.children):String(node)}
function button(label){const found=nodes().find(n=>n.type==='button'&&text(n)===label);assert(found,'button '+label);assert(!found.props.disabled,label+' enabled');found.props.onClick();render()}
function inputLabel(label,value){const wrapper=nodes().find(n=>n.type==='label'&&text(n).startsWith(label));assert(wrapper,label);const input=nodes(wrapper).find(n=>['input','select'].includes(n.type));input.props.onChange({target:{value}});render()}

function graph(){return nodes().find(n=>n.type==='graph')}
function field(label,value){nodes().find(n=>n.type==='input'&&n.props['aria-label']===label).props.onChange({target:{value}});render()}
render();inputLabel('First name','Demo');inputLabel('Last name','Student');inputLabel('Class hour','6');nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});render()
const seen=new Set()
for(let i=0;i<11;i++){
 const p=generated;seen.add(p.mode);assert(nodes().some(n=>n.props['aria-label']==='Equation to graph'));assert(!nodes().find(n=>n.props.className==='mixed-question').props.children.some(n=>n?.type==='formula'));assert(text(tree).includes('Demo Student'));assert(nodes().some(n=>n.type==='scratch-pad'));assert(!nodes().find(n=>n.props['aria-label']==='Scratch work area').props.hidden)
 if(p.mode==='free'){assert.equal(nodes().filter(n=>n.type==='input').length,0);assert(!nodes().some(n=>n.type==='slope-entries'));assert(text(tree).includes('Graph the equation below.'))}
 button('Graph');const points=p.mode==='intercepts'?[{x:p.standard.xIntercept,y:0},{x:0,y:p.standard.yIntercept}]:[{x:0,y:p.line.y},graphModel.slopePoint(p.line)]
 graph().props.onSelect(points[0]);render();graph().props.onSelect(points[1]);render();button('Scratch pad');assert.equal(graph().props.selected.length,2);button('Graph');button('Graph line')
 if(p.mode==='intercepts'){field('X-intercept x-coordinate',String(p.standard.xIntercept));field('X-intercept y-coordinate','0');field('Y-intercept x-coordinate','0');field('Y-intercept y-coordinate',String(p.standard.yIntercept))}
 else if(p.mode==='slope'){assert(text(tree).includes('State the y-intercept and slope for the equation below, then graph.'));assert(!nodes().some(n=>n.type==='slope-entries'));nodes().find(n=>n.type==='slope-read-entries').props.onChange({x:'0',y:String(p.line.y),rise:String(p.line.rise),run:String(p.line.run)});render()}
 else if(p.mode==='convert'){
  if(i===0){button('Check graph');assert(text(tree).includes('Enter the slope and y-intercept before checking.'));assert(!graph().props.disabled)}
  nodes().find(n=>n.type==='slope-entries').props.onChange({m:`${p.line.rise}/${p.line.run}`,b:i===0?'999':String(p.line.y)});render()
 }
 button('Check graph');if(i===0){assert(graph().props.reveal);assert(nodes().some(n=>n.type==='slope-work'));assert(text(tree).includes('Not quite.'))}else assert(text(tree).includes(i===10?'Goal reached!':'Gold star!'))
 if(i<10)button('Next equation →')
}
assert.equal(seen.size,4);assert(text(tree).includes('10/10'));assert.equal(nodes().filter(n=>n.type==='tbody')[0].props.children.length,4);button('Create results image');assert(paint.some(t=>t==='Demo Student'));assert(paint.some(t=>t==='Class hour 6'));assert(paint.some(t=>t.includes('Graph with your own method')));button('Next student / new session');assert(!text(tree).includes('Demo Student'));assert(!nodes().some(n=>n.type==='img'))
console.log('Passed actual mixed-graph events: four tasks, free problems without fields, missing-entry guard, wrong/correct checks, preserved work views, draw/check flow, completion, mode summary, named PNG and reset.')
