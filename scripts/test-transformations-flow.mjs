import {reflectionRuntime,completeReflection} from './reflection-test-runtime.mjs'
import {mockScorecard} from './scorecard-test-runtime.mjs'
// Exercise actual component event handlers with deterministic hooks and a fake clock.
// This is a unit harness, not a browser/layout test.
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as model from '../src/lib/transformations.ts'
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
const context=vm.createContext({exports:testModule.exports,module:testModule,console,Date:ClockDate,Math,HTMLButtonElement:class{},performance:{now:()=>clock},requestAnimationFrame:fn=>{const id=++nextFrame;frames.set(id,fn);return id},cancelAnimationFrame:id=>frames.delete(id),document:{createElement:()=>({width:0,height:0,getContext:()=>new Proxy({fillText:text=>paint.push(text)},{get:(o,key)=>key in o?o[key]:()=>{}}),toDataURL:()=> 'data:image/png;base64,local-report'})},require:name=>name==='@/components/practice/CompletionFlow'?{default:'completion',__esModule:true}:name==='@/components/practice/PracticeReflection'?reflectionRuntime(react):name==='@/lib/scorecard'?mockScorecard(typeof paint==='undefined'?[]:paint):['@/components/practice/ReportIdentity','@/components/practice/ScoreImageActions'].includes(name)?{default:'report-presentation',__esModule:true}:name==='react'?react:name==='react/jsx-runtime'?{jsx,jsxs:jsx}:name==='next/link'?{default:'a',__esModule:true}:name==='./TransformationGraph'?{default:'graph',__esModule:true}:name==='@/lib/transformations'?model:name==='@/components/Math'?{Math:'formula'}:(()=>{throw Error(name)})()})
const source=fs.readFileSync('src/app/apps/transformations/TransformationExplorer.tsx','utf8')
vm.runInContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,context)
function render(){index=0;effects=[];tree=testModule.exports.default();for(const effect of effects)effect();return tree}
function nodes(node){if(arguments.length===0)node=tree;if(Array.isArray(node))return node.flatMap(n=>nodes(n));if(!node||typeof node!=='object')return [];return [node,...nodes(node.props?.children??null)]}
function text(node){if(Array.isArray(node))return node.map(text).join('');if(node==null||typeof node==='boolean')return '';return typeof node==='object'?text(node.props?.children):String(node)}
function button(label){const found=nodes().find(n=>n.type==='button'&&text(n)===label);assert(found,'button '+label);assert(!found.props.disabled,label+' enabled');found.props.onClick();render()}
function inputLabel(label,value){const wrapper=nodes().find(n=>n.type==='label'&&text(n).startsWith(label));assert(wrapper,label);const input=nodes(wrapper).find(n=>['input','select'].includes(n.type));input.props.onChange({target:{value}});render()}

function submit(){nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});render()}
function slider(key,value){const n=nodes().find(n=>n.type==='input'&&n.props['aria-label']==='Parameter '+key);assert(n);n.props.onChange({target:{value:String(value)}});render()}
function toggle(key){const n=nodes().find(n=>n.type==='label'&&text(n).includes(key)&&nodes(n).some(x=>x.type==='input'&&x.props.type==='checkbox'));assert(n);nodes(n).find(n=>n.type==='input').props.onChange();render()}
render();inputLabel('First name','Demo');inputLabel('Last name','Student');inputLabel('Class hour','2');submit();assert(text(tree).includes('Demo Student'));button('Explore →');assert.equal(nodes().find(n=>n.type==='graph').props.family,'linear');slider('k',3);assert.equal(nodes().find(n=>n.type==='graph').props.parameters.k,3)
button('Square root');assert.equal(nodes().find(n=>n.type==='graph').props.family,'squareRoot');assert(text(tree).includes('Demo Student'));button('Same input');assert(text(tree).includes('undefined there'));button('Follow a point');assert(nodes().some(n=>n.type==='table'));nodes().find(n=>n.props['aria-label']==='Track parent input 4').props.onClick();render();assert.equal(nodes().find(n=>n.type==='graph').props.tracked,4)
button('Change parameters');button('Select all');button('Explore →');assert.equal(nodes().filter(n=>n.type==='input'&&n.props.type==='range').length,8)
slider('b',2);assert.equal(nodes().find(n=>n.type==='graph').props.parameters.b,-2);slider('h',2);slider('a',-1)
const graph=()=>nodes().find(n=>n.type==='graph').props
assert.equal(graph().comparison.k,0)
const bSlider=nodes().find(n=>n.props['aria-label']==='Equation B parameter k');bSlider.props.onChange({target:{value:'4'}});render();assert.equal(graph().comparison.k,4);assert.equal(graph().parameters.k,3)
function equationToggle(id){const label=nodes().find(n=>n.type==='label'&&text(n)==='Equation '+id);nodes(label).find(n=>n.type==='input').props.onChange();render()}
equationToggle('B');assert.deepEqual(Array.from(graph().enabled),[true,true]);assert(text(tree).includes('B: New x'));button('Same input');assert(text(tree).includes('g_B(x)'));button('Follow a point')
equationToggle('A');assert.deepEqual(Array.from(graph().enabled),[false,true]);equationToggle('B');assert.deepEqual(Array.from(graph().enabled),[false,true]);equationToggle('A');assert.equal(graph().comparison.k,4)
button('Reset B sliders');assert.deepEqual(JSON.parse(JSON.stringify(graph().comparison)),model.identity);assert.equal(graph().parameters.k,3)
nodes().find(n=>n.props['aria-label']==='Equation B parameter k').props.onChange({target:{value:'5'}});render();button('Record this view');assert(text(tree).includes('View recorded'));button('Results (1)');const report=nodes().find(n=>n.type==='completion');assert(report);assert.equal(report.props.name,'Demo Student');assert(report.props.details[0].includes('A:'));assert(report.props.details[0].includes('B:'));assert(report.props.details[0].includes('k = 5'));report.props.onReturn();render();assert.equal(graph().comparison.k,5);button('Reset sliders');assert.deepEqual(JSON.parse(JSON.stringify(graph().parameters)),model.identity);assert.equal(graph().comparison.k,5)
console.log('Passed explorer identity/menu, eight independent sliders, A/B visibility guard, colored graph/table data, per-equation resets, and both configurations in named completion records.')
