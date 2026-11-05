import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
let index=0,tree;const hooks=[]
const react={useEffect(){},useState(initial){const id=index++;if(!hooks[id])hooks[id]={value:initial};return [hooks[id].value,v=>hooks[id].value=typeof v==='function'?v(hooks[id].value):v]},useRef(initial){const id=index++;return hooks[id]||(hooks[id]={current:initial})}}
const jsx=(type,props)=>({type,props}),testModule={exports:{}}
const pendingImages=[],pngDraws=[]
const context=vm.createContext({Image:class{set src(value){this.url=value;pendingImages.push(this)}},document:{createElement:()=>({getContext:()=>({drawImage(image){pngDraws.push(image.url)}}),toDataURL:()=>'data:image/png;base64,local-snapshot'})},module:testModule,exports:testModule.exports,DOMPoint:class{constructor(x,y){this.x=x;this.y=y}matrixTransform(m){return {x:this.x*m.a+m.e,y:this.y*m.d+m.f}}},require:n=>n==='react'?react:{jsx,jsxs:jsx}})
vm.runInContext(ts.transpileModule(fs.readFileSync('src/app/apps/graph-linear/ScratchPad.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,context)
function render(props={height:210}){index=0;tree=testModule.exports.default(props)}
function nodes(n=tree){if(Array.isArray(n))return n.flatMap(x=>nodes(x));if(!n||typeof n!=='object')return [];return [n,...nodes(n.props.children??null)]}
function board(){return nodes().find(n=>n.type==='svg')}
function button(label){const n=nodes().find(n=>n.type==='button'&&n.props.children===label);assert(!n.props.disabled);n.props.onClick();render()}
let prevented=0,captured=0
const event=(x,y)=>({pointerId:1,clientX:x,clientY:y,preventDefault(){prevented++},currentTarget:{getScreenCTM:()=>({inverse(){return {a:1,d:1,e:0,f:0}}}),setPointerCapture(){captured++}}})
render();assert.equal(board().props.viewBox,'0 0 504 210');assert.equal(board().props.preserveAspectRatio,'none');board().props.onPointerDown(event(20,30));render();board().props.onPointerMove(event(70,90));render();board().props.onPointerUp(event(70,90));assert.equal(nodes().find(n=>n.type==='path').props.d,'M 20.0 30.0 l 0.1 0 L 70.0 90.0');assert(prevented===2&&captured===1)
button('Eraser');board().props.onPointerDown(event(70,90));render();board().props.onPointerUp(event(70,90));assert.equal(nodes().filter(n=>n.type==='path')[1].props.stroke,'white');button('Undo stroke');assert.equal(nodes().filter(n=>n.type==='path').length,1);button('Clear scratch work');assert.equal(nodes().filter(n=>n.type==='path').length,0);render({});assert.equal(board().props.viewBox,'0 0 504 504')
console.log('Passed touch strokes, pointer capture, eraser, undo, clear, compact evaluation dimensions and unchanged square graph pad.')

// A constrained landscape pad has different x/y scales. Every visible edge must
// map to the corresponding drawing edge, without default SVG letterboxing.
for(const {height,width,pixels} of [{height:504,width:460,pixels:330},{height:210,width:500,pixels:270}]){
 render({height});button('Pen');if(nodes().some(n=>n.type==='path'))button('Clear scratch work');render({height});assert.equal(board().props.preserveAspectRatio,'none')
 const left=38,top=24,a=504/width,d=height/pixels
 const scaled=(x,y)=>({...event(x,y),currentTarget:{getScreenCTM:()=>({inverse:()=>({a,d,e:-left*a,f:-top*d})}),setPointerCapture(){captured++}}})
 board().props.onPointerDown(scaled(left,top));render({height});board().props.onPointerMove(scaled(left+width,top+pixels));render({height});board().props.onPointerUp(scaled(left+width,top+pixels));assert.equal(nodes().find(n=>n.type==='path').props.d,`M 0.0 0.0 l 0.1 0 L 504.0 ${height.toFixed(1)}`)
}
console.log('Passed full-edge writing on resized rectangular pads: separate x/y scaling maps visible corners to all drawing bounds.')

// Controlled pads render bridge-restored ink and report every edit to the owner.
let shared=[{id:40,path:'M 2 3 L 4 5',erase:false}],changed=0
const controlled=()=>render({height:320,strokes:shared,onStrokesChange:next=>{shared=next;changed++}})
controlled();assert.equal(nodes().find(n=>n.type==='path').props.d,'M 2 3 L 4 5');board().props.onPointerDown(event(10,20));controlled();board().props.onPointerMove(event(30,40));controlled();board().props.onPointerUp(event(30,40));assert.equal(shared.length,2);assert(shared[1].id>40);assert(shared[1].path.includes('L 30.0 40.0'));assert.equal(changed,2)
for(const label of ['Undo stroke','Clear scratch work']){nodes().find(n=>n.type==='button'&&n.props.children===label).props.onClick();controlled()}assert.equal(shared.length,0);assert.equal(nodes().filter(n=>n.type==='path').length,0);shared=[{id:60,path:'M 20 30 L 40 50',erase:true}];controlled();assert.equal(nodes().find(n=>n.type==='path').props.stroke,'white');console.log('Passed controlled ink restore, live pointer updates, unique restored IDs, undo, clear and eraser rendering.');

const exported=[];const snapshotProps={height:320,onStrokeEnd:url=>exported.push(url)};render(snapshotProps);if(nodes().some(n=>n.type==='path')){nodes().find(n=>n.type==='button'&&n.props.children==='Clear scratch work').props.onClick();render(snapshotProps);pendingImages.splice(0).forEach(image=>image.onload())}exported.length=0
board().props.onPointerDown(event(5,6));render(snapshotProps);board().props.onPointerMove(event(20,30));render(snapshotProps);assert.equal(pendingImages.length,0);board().props.onPointerUp(event(20,30));assert.equal(pendingImages.length,1);assert.equal(exported.length,0);pendingImages.shift().onload();assert.equal(exported[0],'data:image/png;base64,local-snapshot');assert(decodeURIComponent(pngDraws.at(-1)).includes('L 20.0 30.0'))
for(const label of ['Undo stroke','Clear scratch work']){render(snapshotProps);const btn=nodes().find(n=>n.type==='button'&&n.props.children===label);btn.props.onClick();render(snapshotProps);pendingImages.splice(0).forEach(image=>image.onload())}assert(decodeURIComponent(pngDraws.at(-1)).includes('<rect'));const beforeExport=exported.length;render({...snapshotProps,syncContent:'data:image/png;base64,remote-ink'});assert.equal(nodes().find(n=>n.type==='image').props.href,'data:image/png;base64,remote-ink');assert.equal(nodes().filter(n=>n.type==='path').length,0);board().props.onPointerDown(event(20,30));board().props.onPointerUp(event(20,30));assert.equal(exported.length,beforeExport);assert.equal(pendingImages.length,0);render({...snapshotProps,syncContent:null});assert(!nodes().some(n=>n.type==='image'));console.log('Passed pointer-up-only PNG snapshots, undo/clear capture, read-only external image, null clearing and no echo.');
