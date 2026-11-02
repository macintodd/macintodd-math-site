// Exercise actual component event handlers with deterministic hooks and a fake clock.
// This is a unit harness, not a browser/layout test.
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as model from '../src/lib/line-equation.ts'
import * as keypad from '../src/lib/mathboard/keypad.ts'
import * as slope from '../src/lib/slope.ts'
import * as pointModel from '../src/lib/point-slope.ts'
let generated
const generator={...pointModel,generatePointSlope:(...args)=>{generated=pointModel.generatePointSlope(...args);return generated}}
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
const context=vm.createContext({exports:testModule.exports,module:testModule,console,Date:ClockDate,Math,HTMLButtonElement:class{},performance:{now:()=>clock},requestAnimationFrame:fn=>{const id=++nextFrame;frames.set(id,fn);return id},cancelAnimationFrame:id=>frames.delete(id),document:{createElement:()=>({width:0,height:0,getContext:()=>new Proxy({fillText:text=>paint.push(text)},{get:(o,key)=>key in o?o[key]:()=>{}}),toDataURL:()=> 'data:image/png;base64,local-report'})},require:name=>name==='react'?react:name==='react/jsx-runtime'?{jsx,jsxs:jsx}:name==='next/link'?{default:'a',__esModule:true}:name==='@/lib/line-equation'?model:name==='@/lib/slope'?slope:name==='@/lib/point-slope'?generator:name==='./PointSlopeGraph'?{default:'graph',__esModule:true}:name==='../graph-linear/ScratchPad'?{default:'scratch-pad',__esModule:true}:name==='@/lib/mathboard/keypad'?keypad:name==='@/components/Math'?{Math:'formula'}:name==='@/components/Math'?{Math:'formula'}:(()=>{throw Error(name)})()})
const source=fs.readFileSync('src/app/apps/point-slope/PointSlopePractice.tsx','utf8')
vm.runInContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,context)
function render(){index=0;effects=[];tree=testModule.exports.default();for(const effect of effects)effect();return tree}
function nodes(node){if(arguments.length===0)node=tree;if(Array.isArray(node))return node.flatMap(n=>nodes(n));if(!node||typeof node!=='object')return [];return [node,...nodes(node.props?.children??null)]}
function text(node){if(Array.isArray(node))return node.map(text).join('');if(node==null||typeof node==='boolean')return '';return typeof node==='object'?text(node.props?.children):String(node)}
function button(label){const found=nodes().find(n=>n.type==='button'&&text(n)===label);assert(found,'button '+label);assert(!found.props.disabled,label+' enabled');found.props.onClick();render()}
function inputLabel(label,value){const wrapper=nodes().find(n=>n.type==='label'&&text(n).startsWith(label));assert(wrapper,label);const input=nodes(wrapper).find(n=>['input','select'].includes(n.type));input.props.onChange({target:{value}});render()}

function field(label,value){const n=nodes().find(n=>n.type==='input'&&n.props['aria-label']===label);assert(n,'field '+label);assert(!n.props.disabled&&!n.props.readOnly,'editable '+label);n.props.onChange({target:{value}});render()}
function tap(p){nodes().find(n=>n.type==='graph').props.onTap(p);render()}
function submit(){nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});render()}

function graph(){return nodes().find(n=>n.type==='graph')}
function solve(miss=false){const [p,q]=generated.points;tap(p);assert(!nodes().some(n=>n.props['aria-label']==='Rise'));tap(q);assert(nodes().some(n=>n.props['aria-label']==='Rise'));field('Rise',miss?'999':String(generated.line.rise));field('Run',String(generated.line.run));submit();if(miss){assert(text(tree).includes('Not quite.'));field('Rise',String(generated.line.rise));submit()}
 assert(!nodes().some(n=>n.props['aria-label']==='Distributed constant'));assert(graph().props.locked);field('Starting y-coordinate',String(p.y));field('Starting x-coordinate',miss?'999':String(p.x));submit();if(miss){assert(!nodes().some(n=>n.props['aria-label']==='Distributed constant'));field('Starting x-coordinate',String(p.x));submit()}field('Distributed x coefficient',`${generated.line.rise}/${generated.line.run}`);field('Distributed constant',miss?'999':String(-generated.line.rise/generated.line.run*p.x));submit();if(miss){assert(!nodes().some(n=>n.props['aria-label']==='Final equation'));field('Distributed constant',String(-generated.line.rise/generated.line.run*p.x));submit()}button('Scratch work');assert(!nodes().find(n=>n.props['aria-label']==='Scratch work area').props.hidden);field('Final equation','');button('y');button('=');assert.equal(nodes().find(n=>n.props['aria-label']==='Final equation').props.value,'y=');field('Final equation',miss?'y=999':'y='+model.equationText(generated.line));submit();if(miss){assert(graph().props.reveal);field('Final equation','y='+model.equationText(generated.line));submit()}assert(graph().props.reveal);assert(!nodes().find(n=>n.props['aria-label']==='Graph work area').props.hidden);button('Scratch work');assert(!nodes().find(n=>n.props['aria-label']==='Scratch work area').props.hidden);button('Graph');assert(text(tree).includes('Gold star!'))}
render();inputLabel('First name','Demo');inputLabel('Last name','Student');inputLabel('Class hour','4');submit();assert(text(tree).includes('Demo Student'));assert(!graph().props.reveal);button('Scratch work');assert(!nodes().find(n=>n.props['aria-label']==='Scratch work area').props.hidden);assert(nodes().find(n=>n.props['aria-label']==='Graph work area').props.hidden);assert(nodes().some(n=>n.type==='scratch-pad'));button('Graph');assert(!nodes().find(n=>n.props['aria-label']==='Graph work area').props.hidden);solve(true);button('Next graph →');for(let i=0;i<10;i++){solve();if(i<9)button('Next graph →')}
assert(text(tree).includes('Score 10/10'));button('Submit 10/10 & view results');assert(text(tree).includes('Demo Student'));button('Create results image');assert(paint.some(t=>t==='Demo Student'));assert(paint.some(t=>t==='Class hour 4'));button('Next student / new session');assert(!nodes().some(n=>n.type==='img'));assert(!text(tree).includes('Demo Student'))
console.log('Passed actual point-slope component events: point autofill, slope gate/retry, coordinate substitution, distribution, final reveal, streak scoring, named export and next-student reset.')
