import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as model from '../src/lib/tank-flow.ts'
import * as keypad from '../src/lib/mathboard/keypad.ts'
let index=0,tree,effects=[],serial=0,clock=0;const hooks=[],frames=new Map()
const equal=(a,b)=>a&&b&&a.length===b.length&&a.every((v,i)=>v===b[i])
const react={memo:component=>component,useState(initial){const id=index++;if(!hooks[id])hooks[id]={value:typeof initial==='function'?initial():initial};return [hooks[id].value,v=>hooks[id].value=typeof v==='function'?v(hooks[id].value):v]},useRef(initial){const id=index++;return hooks[id]||(hooks[id]={current:initial})},useEffect(fn,deps){const id=index++;if(!hooks[id]||!equal(hooks[id].deps,deps)){const old=hooks[id];hooks[id]={deps};effects.push(()=>{old?.cleanup?.();hooks[id].cleanup=fn()})}}};react.useLayoutEffect=react.useEffect
const jsx=(type,props,key)=>({type,props:props??{},key}),testModule={exports:{}}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/tank-flow/TankFlow.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:testModule,exports:testModule.exports,requestAnimationFrame:fn=>{const id=++serial;frames.set(id,fn);return id},cancelAnimationFrame:id=>frames.delete(id),require:n=>n==='react'?react:n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='@/lib/tank-flow'?model:n==='@/lib/mathboard/keypad'?keypad:n==='next/link'?{default:'a',__esModule:true}:n==='@/components/Math'?{Math:'formula'}:n==='../graph-linear/ScratchPad'?{default:'scratch',__esModule:true}:n==='./TankVisual'?{default:'tank',__esModule:true}:n==='./TankGraph'?{default:'graph',__esModule:true}:(()=>{throw Error(n)})()})
function render(){index=0;effects=[];tree=testModule.exports.default();effects.forEach(fn=>fn())}
function nodes(n=tree){if(Array.isArray(n))return n.flatMap(x=>nodes(x));if(!n||typeof n!=='object')return [];return [n,...nodes(n.props.children??null)]}
function text(n){if(Array.isArray(n))return n.map(text).join('');return n&&typeof n==='object'?text(n.props.children):n==null||typeof n==='boolean'?'':String(n)}
function button(label){const n=nodes().find(n=>n.type==='button'&&text(n)===label);assert(n, label);assert(!n.props.disabled,label+' enabled');n.props.onClick();render()}
function field(label,value){const n=nodes().find(n=>n.type==='input'&&n.props['aria-label']===label);n.props.onFocus({currentTarget:{select(){}}});render();n.props.onChange({target:{value}});render()}
function tick(ms=250){clock+=ms;const pending=[...frames];frames.clear();pending.forEach(([,fn])=>fn(clock));render()}
render();assert.equal(nodes().find(n=>n.type==='tank').props.volume,500);field('Initial volume','250');button('Enter / Apply');assert.equal(nodes().find(n=>n.type==='tank').props.volume,250)
button('Open valves');tick();for(let i=0;i<4;i++)tick();assert.equal(nodes().find(n=>n.type==='tank').props.volume,230);button('Graph view');assert.equal(nodes().find(n=>n.type==='graph').props.time,1);button('Close valves / Pause');tick(1000);assert.equal(nodes().find(n=>n.type==='graph').props.time,1)
button('Scratch paper');assert.equal(nodes().find(n=>n.props.className==='tank-scratch').props.hidden,false);const key=nodes().find(n=>n.type==='scratch').key;button('Keypad');assert.equal(nodes().find(n=>n.type==='scratch').key,key);button('Reset tank');assert.equal(nodes().find(n=>n.type==='graph').props.time,0);button('+1 minute');assert.equal(nodes().find(n=>n.type==='graph').props.time,1)
field('Fill rate','60');button('Enter / Apply');assert.equal(nodes().find(n=>n.type==='graph').props.time,0);assert.equal(nodes().find(n=>n.type==='graph').props.setup.inlet,60);button('Filling tank');assert.equal(nodes().find(n=>n.type==='graph').props.setup.initial,100);for(let i=0;i<18;i++)button('+1 minute');assert.equal(nodes().find(n=>n.type==='graph').props.time,18);assert(text(tree).includes('Tank full'));assert(nodes().find(n=>n.type==='button'&&text(n)==='Open valves / Resume').props.disabled)
button('Balanced flow');button('Open valves');tick();tick();assert.equal(nodes().find(n=>n.type==='graph').props.setup.inlet,30);button('Tank view');assert.equal(nodes().find(n=>n.type==='tank').props.volume,500);button('Close valves / Pause')
field('Tank capacity','10');button('Enter / Apply');assert(text(tree).includes('at least the initial volume'));assert.equal(nodes().find(n=>n.type==='tank').props.setup.capacity,1000)
console.log('Passed instant initial level, run/pause clock, graph sync, setup reset, scratch toggle, presets, boundary stop and invalid capacity UI.')
