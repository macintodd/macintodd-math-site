import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
let idx=0,tree,effects=[],timers=new Map(),serial=0,results=[];const hooks=[]
const react={useState(v){const i=idx++;if(!hooks[i])hooks[i]={value:typeof v==='function'?v():v};return [hooks[i].value,n=>hooks[i].value=typeof n==='function'?n(hooks[i].value):n]},useRef(v){const i=idx++;return hooks[i]??(hooks[i]={current:v})},useEffect(fn,deps){const i=idx++;if(!hooks[i]||deps.some((v,j)=>v!==hooks[i].deps[j])){const old=hooks[i];hooks[i]={deps};effects.push(()=>{old?.cleanup?.();hooks[i].cleanup=fn()})}}};react.useLayoutEffect=react.useEffect
const jsx=(type,props)=>({type,props:props??{}}),mod={exports:{}}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/write-linear-equation/BonusGame.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:mod,exports:mod.exports,require:n=>n==='react'?react:{jsx,jsxs:jsx},setInterval:(fn,ms)=>{const id=++serial;timers.set(id,{fn,ms});return id},clearInterval:id=>timers.delete(id)})
function render(){idx=0;effects=[];tree=mod.exports.default({targets:[3,4,5],results,name:'Demo',onResult:n=>{results.push(n)},onFinish:()=>{}});effects.forEach(f=>f())}
function nodes(n=tree){if(Array.isArray(n))return n.flatMap(v=>nodes(v??null));if(!n||typeof n!=='object')return [];return [n,...nodes(n.props.children??null)]}
function text(n){return Array.isArray(n)?n.map(text).join(''):n&&typeof n==='object'?text(n.props.children):n==null||typeof n==='boolean'?'':String(n)}
function click(label){const b=nodes().find(n=>n.type==='button'&&text(n)===label);assert(b&&!b.props.disabled,label);b.props.onClick();render()}
render();assert.equal(nodes().filter(n=>n.type==='button'&&n.props.disabled).length,2)
for(let round=0;round<3;round++){click('Start');assert.equal(timers.size,0);click('Let’s go!');assert.equal([...timers.values()][0].ms,[1000,500,250][round]);for(let n=0;n<[3,4,5][round];n++){[...timers.values()][0].fn();render()};if(round===2){const b=nodes().find(n=>n.type==='button'&&text(n)==='Stop');b.props.onPointerDown();render();b.props.onClick();render();assert(!text(tree).includes('Ready for round'))}else click('Stop');assert.equal(timers.size,0);assert.equal(results[round],[3,4,5][round])}
assert(text(tree).includes('Bonus point earned'));assert.equal(nodes().filter(n=>n.type==='button'&&text(n)==='Start').length,0)
console.log('Passed bonus instructions, 1/2/4-per-second timing, committed visible-digit scoring, locking, one stop per round, and all-matches reward.')
