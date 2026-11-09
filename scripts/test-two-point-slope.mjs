import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import katex from 'katex'
import * as model from '../src/lib/two-point-slope.ts'
const first={x:1,y:1},second={x:3,y:5},ids=['x1','y1','x2','y2'];let valid=0
for(const a of ids)for(const b of ids)for(const c of ids)for(const d of ids){const r=model.slopeSetup({topLeft:a,topRight:b,bottomLeft:c,bottomRight:d},first,second);if(r.correct){valid++;assert.equal(r.numerator/r.denominator,2)}}assert.equal(valid,2,'Only two consistent coordinate orders are valid, even when numbers happen to match')
assert(model.slopeSetup({topLeft:'x2',topRight:'x1',bottomLeft:'y2',bottomRight:'y1'},first,second).hint.includes('inverted'))
assert(model.slopeSetup({topLeft:'y2',topRight:'x1',bottomLeft:'x2',bottomRight:'y1'},first,second).hint.includes('mixed'))
assert(model.slopeSetup({topLeft:'y2',topRight:'y1',bottomLeft:'x1',bottomRight:'x2'},first,second).hint.includes('same point order'))
assert(!model.slopeSetup(model.emptySlopeSlots(),first,second).correct)
let index=0,tree,dropTarget=null,checked=[],prevented=0,captured=0;const hooks=[];const react={useRef(v){const i=index++;return hooks[i]??(hooks[i]={current:v})},useState(initial){const i=index++;hooks[i]??={value:typeof initial==='function'?initial():initial};return [hooks[i].value,v=>hooks[i].value=typeof v==='function'?v(hooks[i].value):v]}}
const jsx=(type,props)=>({type,props:props??{}}),m={exports:{}}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/write-linear-equation/TwoPointSlopeSetup.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:m,exports:m.exports,document:{elementFromPoint:()=>({closest:()=>({getAttribute:()=>dropTarget})})},require:n=>n==='react'?react:n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='@/lib/two-point-slope'?model:{Math:'formula'}})
function render(){index=0;tree=m.exports.default({first,second,onChecked:r=>checked.push(r)})}function nodes(n=tree){return Array.isArray(n)?n.flatMap(nodes):n&&typeof n==='object'?[n,...nodes(n.props.children)]:[]}const event={clientX:10,clientY:10,pointerId:1,preventDefault(){prevented++},stopPropagation(){},currentTarget:{setPointerCapture(){captured++}}}
function drag(id,target){const button=nodes().find(n=>n.props['aria-label']?.startsWith('Coordinate '+id+':'));button.props.onPointerDown(event);button.props.onPointerMove({...event,clientX:30});render();assert(nodes().some(n=>n.props.className?.startsWith('wl-coordinate-ghost')));dropTarget=target;button.props.onPointerUp(event);render()}
function check(){nodes().find(n=>n.type==='button'&&n.props.children==='Check slope').props.onClick()}
render();check();assert(checked.at(-1).hint.includes('Fill all four'));for(const [id,target] of [['y2','topLeft'],['y1','topRight'],['x2','bottomLeft'],['x1','bottomRight']])drag(id,target);check();assert(checked.at(-1).correct);for(const n of nodes().filter(n=>n.type==='formula'))katex.renderToString(n.props.children,{throwOnError:true});assert.equal(captured,4);assert(prevented>=12)
drag('x1','topLeft');check();assert(checked.at(-1).hint.includes('mixed'));nodes().find(n=>n.props['aria-label']?.startsWith('Coordinate y2:')).props.onClick();render();nodes().find(n=>n.props['data-slope-slot']==='topLeft').props.onClick();render();check();assert(checked.at(-1).correct)
console.log('Passed all 256 coordinate arrangements, either consistent order, diagnostic hints, missing slots, live slope calculation, pointer capture/scroll prevention, drag placement and tap-to-place correction.')
