// Exercise actual component event handlers with deterministic hooks and a fake clock.
// This is a unit harness, not a browser/layout test.
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as model from '../src/lib/multiplication.ts'
let clock=0,index=0,tree,effects=[],nextFrame=0
const hooks=[],frames=new Map(),paint=[]
const equal=(a,b)=>a&&b&&a.length===b.length&&a.every((v,i)=>v===b[i])
const react={
 useState(initial){const id=index++;if(!hooks[id])hooks[id]={value:typeof initial==='function'?initial():initial};return [hooks[id].value,value=>{hooks[id].value=typeof value==='function'?value(hooks[id].value):value}]},
 useRef(initial){const id=index++;return hooks[id]||(hooks[id]={current:initial})},
 useCallback(fn,deps){const id=index++;if(!hooks[id]||!equal(hooks[id].deps,deps))hooks[id]={fn,deps};return hooks[id].fn},
 useEffect(fn,deps){const id=index++;if(!hooks[id]||!equal(hooks[id].deps,deps)){const old=hooks[id];hooks[id]={deps};effects.push(()=>{old?.cleanup?.();hooks[id].cleanup=fn()})}}
}
const jsx=(type,props)=>({type,props:props||{}}),testModule={exports:{}}
const RealDate=Date
class ClockDate extends RealDate{constructor(...args){super(...(args.length?args:[Date.UTC(2026,9,31,15)+clock]))}}
const context=vm.createContext({exports:testModule.exports,module:testModule,console,Date:ClockDate,Math,HTMLButtonElement:class{},performance:{now:()=>clock},requestAnimationFrame:fn=>{const id=++nextFrame;frames.set(id,fn);return id},cancelAnimationFrame:id=>frames.delete(id),document:{createElement:()=>({width:0,height:0,getContext:()=>new Proxy({fillText:text=>paint.push(text)},{get:(o,key)=>key in o?o[key]:()=>{}}),toDataURL:()=> 'data:image/png;base64,local-report'})},require:name=>name==='react'?react:name==='react/jsx-runtime'?{jsx,jsxs:jsx}:name==='next/link'?{default:'a',__esModule:true}:name==='@/lib/multiplication'?model:(()=>{throw Error(name)})()})
const source=fs.readFileSync('src/app/apps/multiplication/Multiplication.tsx','utf8')
vm.runInContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,context)
function render(){index=0;effects=[];tree=testModule.exports.default();for(const effect of effects)effect();return tree}
function nodes(node){if(arguments.length===0)node=tree;if(Array.isArray(node))return node.flatMap(n=>nodes(n));if(!node||typeof node!=='object')return [];return [node,...nodes(node.props?.children??null)]}
function text(node){if(Array.isArray(node))return node.map(text).join('');if(node==null||typeof node==='boolean')return '';return typeof node==='object'?text(node.props?.children):String(node)}
function button(label){const found=nodes().find(n=>n.type==='button'&&text(n)===label);assert(found,'button '+label);assert(!found.props.disabled,label+' enabled');found.props.onClick();render()}
function inputLabel(label,value){const wrapper=nodes().find(n=>n.type==='label'&&text(n).startsWith(label));assert(wrapper,label);const input=nodes(wrapper).find(n=>['input','select'].includes(n.type));input.props.onChange({target:{value}});render()}
function configure(factor,negatives){button('Clear selection');const wrapper=nodes().find(n=>n.type==='label'&&text(n)===String(factor));nodes(wrapper).find(n=>n.type==='input').props.onChange();render();const negative=nodes().find(n=>n.type==='label'&&text(n)==='Include Negatives');nodes(negative).find(n=>n.type==='input').props.onChange({target:{checked:negatives}});render();nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});render()}
function answer(correct=true){const label=nodes().find(n=>/^[-\d]+ times [-\d]+$/.test(n.props['aria-label']||'')).props['aria-label'],[a,b]=label.split(' times ').map(Number);const value=String(a*b+(correct?0:1));for(const digit of value)button(digit==='-'?'±':digit);button('Enter ↵')}
function end(){clock+=60001;const queued=[...frames.values()];frames.clear();queued.forEach(fn=>fn(clock));render()}
function rows(){const tbody=nodes().find(n=>n.type==='tbody');return nodes(tbody).filter(n=>n.type==='tr')}
render();inputLabel('First name','Alex');inputLabel('Last name','Todd');inputLabel('Class hour','3');configure(2,true);button('Start · flip the table ↻');assert(!nodes().some(n=>n.type==='table'),'No table during practice');answer();answer(false);end();assert.equal(rows().length,1);assert(text(rows()[0]).includes('Negatives included'));assert(text(rows()[0]).includes('50%'))
button('Choose different factors');configure(3,false);button('Start · flip the table ↻');answer();answer();end();assert.equal(rows().length,2);assert(text(rows()[0]).includes('Selected: 2'));assert(text(rows()[1]).includes('Selected: 3'));assert(text(tree).includes('75%'),'Weighted combined accuracy')
button('Create combined report image');assert(paint.some(t=>t.includes('Alex Todd')));assert(paint.some(t=>t.includes('TOTAL: 3 points / 4 answered')));assert(paint.some(t=>t==='Selected: 2'));assert(paint.some(t=>t==='Selected: 3'));assert(nodes().some(n=>n.type==='img'&&n.props.alt.includes('2 completed minutes')))
button('Choose different factors');inputLabel('First name','New');configure(4,true);button('Start · flip the table ↻');answer();end();assert.equal(rows().length,1,'New identity clears all prior minutes');assert(text(tree).includes('New Todd'));assert(!text(tree).includes('Selected: 2'));assert(!text(tree).includes('Selected: 3'))
button('New student · clear history');assert.equal(nodes().find(n=>n.type==='label'&&text(n)==='First name').props.children[1].props.value,'')
console.log('Passed actual component flow: two timed rounds, signed keypad, immutable factor/sign/date rows, combined PNG, weighted accuracy, automatic identity reset and explicit next-student reset.')
