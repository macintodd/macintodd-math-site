import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
let index=0,tree;const hooks=[]
const react={useState(initial){const id=index++;if(!hooks[id])hooks[id]={value:initial};return [hooks[id].value,v=>hooks[id].value=typeof v==='function'?v(hooks[id].value):v]},useRef(initial){const id=index++;return hooks[id]||(hooks[id]={current:initial})}}
const jsx=(type,props)=>({type,props}),testModule={exports:{}}
const context=vm.createContext({module:testModule,exports:testModule.exports,DOMPoint:class{constructor(x,y){this.x=x;this.y=y}matrixTransform(){return this}},require:n=>n==='react'?react:{jsx,jsxs:jsx}})
vm.runInContext(ts.transpileModule(fs.readFileSync('src/app/apps/graph-linear/ScratchPad.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,context)
function render(props={height:210}){index=0;tree=testModule.exports.default(props)}
function nodes(n=tree){if(Array.isArray(n))return n.flatMap(x=>nodes(x));if(!n||typeof n!=='object')return [];return [n,...nodes(n.props.children??null)]}
function board(){return nodes().find(n=>n.type==='svg')}
function button(label){const n=nodes().find(n=>n.type==='button'&&n.props.children===label);assert(!n.props.disabled);n.props.onClick();render()}
let prevented=0,captured=0
const event=(x,y)=>({pointerId:1,clientX:x,clientY:y,preventDefault(){prevented++},currentTarget:{getScreenCTM:()=>({inverse(){return {}}}),setPointerCapture(){captured++}}})
render();assert.equal(board().props.viewBox,'0 0 504 210');board().props.onPointerDown(event(20,30));render();board().props.onPointerMove(event(70,90));render();board().props.onPointerUp(event(70,90));assert.equal(nodes().find(n=>n.type==='path').props.d,'M 20.0 30.0 l 0.1 0 L 70.0 90.0');assert(prevented===2&&captured===1)
button('Eraser');board().props.onPointerDown(event(70,90));render();board().props.onPointerUp(event(70,90));assert.equal(nodes().filter(n=>n.type==='path')[1].props.stroke,'white');button('Undo stroke');assert.equal(nodes().filter(n=>n.type==='path').length,1);button('Clear scratch work');assert.equal(nodes().filter(n=>n.type==='path').length,0);render({});assert.equal(board().props.viewBox,'0 0 504 504')
console.log('Passed touch strokes, pointer capture, eraser, undo, clear, compact evaluation dimensions and unchanged square graph pad.')
