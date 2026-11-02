import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as keypad from '../src/lib/mathboard/keypad.ts'
let index=0,tree,value={x:'',y:'',rise:'',run:''};const hooks=[]
const react={useState(initial){const id=index++;if(!hooks[id])hooks[id]={value:initial};return [hooks[id].value,v=>hooks[id].value=typeof v==='function'?v(hooks[id].value):v]},useRef(initial){const id=index++;return hooks[id]||(hooks[id]={current:initial})},useLayoutEffect(){index++}}
const jsx=(type,props)=>({type,props}),testModule={exports:{}}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/graph-mixed/SlopeReadEntries.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:testModule,exports:testModule.exports,require:n=>n==='react'?react:n==='@/lib/mathboard/keypad'?keypad:{jsx,jsxs:jsx}})
function render(disabled=false){index=0;tree=testModule.exports.default({value,onChange:v=>{value=v},disabled})}
function nodes(n){if(arguments.length===0)n=tree;if(Array.isArray(n))return n.flatMap(x=>nodes(x));if(!n||typeof n!=='object')return [];return [n,...nodes(n.props?.children??null)]}
function button(label){nodes().find(n=>n.type==='button'&&n.props['aria-label']===label).props.onClick();render()}
render();assert.equal(nodes().filter(n=>n.type==='input').length,4)
button('0');button('Next field');button('3');button('Change sign');button('Next field');button('2');button('Next field');button('4');assert.deepEqual(JSON.parse(JSON.stringify(value)),{x:'0',y:'-3',rise:'2',run:'4'})
button('Backspace');assert.equal(value.run,'');button('5');render(true);assert.equal(nodes().filter(n=>n.type==='button').length,0);assert(nodes().filter(n=>n.type==='input').every(n=>n.props.disabled))
console.log('Passed ordered-pair/fraction fields, signed keypad entry, next-field navigation, deletion and locked entries.')
