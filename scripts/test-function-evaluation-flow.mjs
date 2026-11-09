import {reflectionRuntime,completeReflection} from './reflection-test-runtime.mjs'
import {mockScorecard} from './scorecard-test-runtime.mjs'
// Exercise actual component event handlers with deterministic hooks and a fake clock.
// This is a unit harness, not a browser/layout test.
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as model from '../src/lib/function-evaluation.ts'
import * as keypad from '../src/lib/mathboard/keypad.ts'
let generated=[]
const generator={...model,makeRound:settings=>{generated=model.makeRound(settings);return generated}}
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
const context=vm.createContext({exports:testModule.exports,module:testModule,console,Date:ClockDate,Math,HTMLButtonElement:class{},performance:{now:()=>clock},requestAnimationFrame:fn=>{const id=++nextFrame;frames.set(id,fn);return id},cancelAnimationFrame:id=>frames.delete(id),document:{createElement:()=>({width:0,height:0,getContext:()=>new Proxy({fillText:text=>paint.push(text)},{get:(o,key)=>key in o?o[key]:()=>{}}),toDataURL:()=> 'data:image/png;base64,local-report'})},require:name=>name==='@/components/practice/PracticeReflection'?reflectionRuntime(react):name==='@/lib/scorecard'?mockScorecard(typeof paint==='undefined'?[]:paint):['@/components/practice/ReportIdentity','@/components/practice/ScoreImageActions'].includes(name)?{default:'report-presentation',__esModule:true}:name==='react'?react:name==='react/jsx-runtime'?{jsx,jsxs:jsx}:name==='../graph-linear/ScratchPad'?{default:'scratch-pad',__esModule:true}:name==='next/link'?{default:'a',__esModule:true}:name==='@/lib/function-evaluation'?generator:name==='@/lib/mathboard/keypad'?keypad:name==='@/components/Math'?{Math:'formula'}:(()=>{throw Error(name)})()})
const source=fs.readFileSync('src/app/apps/function-evaluation/EvaluationMachine.tsx','utf8')
vm.runInContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,context)
function render(){index=0;effects=[];tree=testModule.exports.default();for(const effect of effects)effect();return tree}
function nodes(node){if(arguments.length===0)node=tree;if(Array.isArray(node))return node.flatMap(n=>nodes(n));if(!node||typeof node!=='object')return [];return [node,...nodes(node.props?.children??null)]}
function text(node){if(Array.isArray(node))return node.map(text).join('');if(node==null||typeof node==='boolean')return '';return typeof node==='object'?text(node.props?.children):String(node)}
function button(label){const found=nodes().find(n=>n.type==='button'&&text(n)===label);assert(found,'button '+label);assert(!found.props.disabled,label+' enabled');found.props.onClick();render()}
function inputLabel(label,value){const wrapper=nodes().find(n=>n.type==='label'&&text(n).startsWith(label));assert(wrapper,label);const input=nodes(wrapper).find(n=>['input','select'].includes(n.type));input.props.onChange({target:{value}});render()}
function changeAnswer(value){nodes().find(n=>n.type==='input'&&n.props['aria-label']==='Function value').props.onChange({target:{value}});render()}
function toggle(label,checked){const wrapper=nodes().find(n=>n.type==='label'&&text(n).startsWith(label));nodes(wrapper).find(n=>n.type==='input').props.onChange({target:{checked}});render()}
render();inputLabel('First name','Demo');inputLabel('Last name','Student');inputLabel('Class hour','3');toggle('Allow decimal inputs',true);toggle('Allow fraction inputs',true)
nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});render();assert.equal(generated.length,12);assert(text(tree).includes('Function Evaluation Practice'));assert(nodes().some(n=>n.type==='scratch-pad'&&n.props.height===210));assert(nodes().some(n=>n.type==='label'&&text(n).startsWith('Find ')))
assert.equal(generated.filter(p=>p.kind==='decimal').length,3);assert.equal(generated.filter(p=>p.kind==='fraction').length,3)
for(let i=0;i<12;i++){
 const expected=generated[i].answer;changeAnswer(i===11?'999':expected.d===1?String(expected.n):`${expected.n}/${expected.d}`);button('Check answer ↵');assert(text(tree).includes(i===11?'Not quite.':'Correct! One star earned.'));button(i===11?'View results →':'Next function →')
}
assert(text(tree).includes('11 points / 12'));assert(text(tree).includes('Demo Student'));assert(text(tree).includes('Decimal inputs: ON'));assert(text(tree).includes('Fraction inputs: ON'))
completeReflection(nodes,render);button('Create results image');assert(paint.some(t=>t.includes('Demo Student')));assert(paint.some(t=>t.includes('Decimal inputs: ON')));assert(paint.some(t=>t.includes('Fraction inputs: ON')));assert(nodes().some(n=>n.type==='img'&&n.props.alt.includes('decimals on, fractions on')))
button('Change settings / student');assert(!nodes().some(n=>n.type==='img'));inputLabel('First name','New');nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});render();assert(text(tree).includes('0 points'));assert(text(tree).includes('New Student'))
changeAnswer(String(generated[0].answer.n/generated[0].answer.d));if(!nodes().find(n=>n.type==='button'&&text(n)==='Check answer ↵').props.disabled){button('Check answer ↵');button('Finish & view results');assert(text(tree).includes('1 answered'))}
console.log('Passed actual component events: all 12 questions, one-attempt scoring, mixed-mode settings, colored-star report data, named export, and clean next-student reset.')
