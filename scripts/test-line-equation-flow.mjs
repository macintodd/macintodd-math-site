// Exercise actual component event handlers with deterministic hooks and a fake clock.
// This is a unit harness, not a browser/layout test.
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as model from '../src/lib/line-equation.ts'
import * as keypad from '../src/lib/mathboard/keypad.ts'
import * as slope from '../src/lib/slope.ts'
import * as levels from '../src/lib/line-equation-levels.ts'
let generated
const generator={...model,generateEquationLine:(...args)=>{generated=model.generateEquationLine(...args);return generated}}
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
const context=vm.createContext({exports:testModule.exports,module:testModule,console,Date:ClockDate,Math,HTMLButtonElement:class{},performance:{now:()=>clock},requestAnimationFrame:fn=>{const id=++nextFrame;frames.set(id,fn);return id},cancelAnimationFrame:id=>frames.delete(id),document:{createElement:()=>({width:0,height:0,getContext:()=>new Proxy({fillText:text=>paint.push(text)},{get:(o,key)=>key in o?o[key]:()=>{}}),toDataURL:()=> 'data:image/png;base64,local-report'})},require:name=>name==='react'?react:name==='react/jsx-runtime'?{jsx,jsxs:jsx}:name==='next/link'?{default:'a',__esModule:true}:name==='@/lib/line-equation'?generator:name==='@/lib/slope'?slope:name==='@/lib/line-equation-levels'?levels:name==='../slope/Graph'?{default:'graph',__esModule:true}:name==='@/lib/mathboard/keypad'?keypad:name==='@/components/Math'?{Math:'formula'}:(()=>{throw Error(name)})()})
const source=fs.readFileSync('src/app/apps/line-equations/LineEquationPractice.tsx','utf8')
vm.runInContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,context)
function render(){index=0;effects=[];tree=testModule.exports.default();for(const effect of effects)effect();return tree}
function nodes(node){if(arguments.length===0)node=tree;if(Array.isArray(node))return node.flatMap(n=>nodes(n));if(!node||typeof node!=='object')return [];return [node,...nodes(node.props?.children??null)]}
function text(node){if(Array.isArray(node))return node.map(text).join('');if(node==null||typeof node==='boolean')return '';return typeof node==='object'?text(node.props?.children):String(node)}
function button(label){const found=nodes().find(n=>n.type==='button'&&text(n)===label);assert(found,'button '+label);assert(!found.props.disabled,label+' enabled');found.props.onClick();render()}
function inputLabel(label,value){const wrapper=nodes().find(n=>n.type==='label'&&text(n).startsWith(label));assert(wrapper,label);const input=nodes(wrapper).find(n=>['input','select'].includes(n.type));input.props.onChange({target:{value}});render()}

function field(label,value){const n=nodes().find(n=>n.type==='input'&&n.props['aria-label']===label);assert(n,'field '+label);assert(!n.props.disabled&&!n.props.readOnly,'editable '+label);n.props.onChange({target:{value}});render()}
function tap(p){nodes().find(n=>n.type==='graph').props.onPointTap(p);render()}
function submit(){nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});render()}
function slopeAndEquation(){tap({x:generated.run,y:generated.y+generated.rise});field('Rise (numerator)',String(generated.rise));field('Run (denominator)',String(generated.run));button('Check slope');field('Equation of the line',model.equationText(generated));submit()}
render();inputLabel('First name','Demo');inputLabel('Last name','Student');inputLabel('Class hour','3');submit()
assert(!nodes().some(n=>n.props['aria-label']==='Equation of the line'))
assert(nodes().find(n=>n.props['aria-label']==='Insert variable x').props.disabled)
tap({x:generated.run,y:generated.y+generated.rise});assert.equal(nodes().find(n=>n.props['aria-label']==='Y-intercept x-coordinate').props.value,String(generated.run));button('Check y-intercept');assert(text(tree).includes('Not quite.'))
tap({x:0,y:generated.y});button('Check y-intercept');assert(nodes().find(n=>n.props['aria-label']==='Rise (numerator)').props.disabled);slopeAndEquation();assert(text(tree).includes('Gold star!'));assert(text(tree).includes('Consecutive first-try correct 0 / 5'));button('Next graph →')
for(let i=0;i<5;i++){tap({x:0,y:generated.y});button('Check y-intercept');slopeAndEquation();if(i<4){assert(!text(tree).includes('Level 2 is unlocked'));button('Next graph →')}}
assert(text(tree).includes('Level 2 is unlocked'));button('Start Level 2 →');assert(text(tree).includes('Class hour 3 · Level 2'));assert(!nodes().some(n=>n.type==='button'&&text(n)==='Check slope'))
for(let i=0;i<10;i++){
 field('Y-intercept x-coordinate','0');field('Y-intercept y-coordinate',String(generated.y));field('Rise (numerator)',String(generated.rise));field('Run (denominator)',String(generated.run));field('Equation of the line',model.equationText(generated));
 const equation=nodes().find(n=>n.props['aria-label']==='Equation of the line');equation.props.onFocus();render();assert(!nodes().find(n=>n.props['aria-label']==='Insert variable x').props.disabled)
 submit();if(i<9)button('Next graph →')
}
assert(text(tree).includes('Level 2 score: 10/10'));assert(text(tree).includes('Demo Student'));button('Create results image');assert(paint.some(t=>t==='Demo Student'));assert(paint.some(t=>t.includes('Level 1 completed: YES')));button('Next student / new session');assert(!nodes().some(n=>n.type==='img'));assert(!text(tree).includes('Demo Student'))
console.log('Passed actual component events: locked stages, tap autofill, missed check, retry star, five-problem unlock, optional taps in Level 2, scoring, named report and student reset.')
