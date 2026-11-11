import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
import vm from 'node:vm'
let cursor=0,tree,listener;const hooks=[],frameWindow={postMessage:(...args)=>sent.push(args)},sent=[],jsx=(type,props)=>({type,props:props??{}}),react={useRef(v){const i=cursor++;return hooks[i]??(hooks[i]={current:v})},useState(v){const i=cursor++;hooks[i]??={value:v};return[hooks[i].value,x=>hooks[i].value=x]},useEffect(fn){const i=cursor++;if(!hooks[i]){hooks[i]={};fn()}}},mod={exports:{}}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/function-families/FamilyCompletion.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:mod,exports:mod.exports,window:{addEventListener:(kind,fn)=>{listener=fn},removeEventListener(){}},require:n=>n==='react'?react:n==='react/jsx-runtime'?{jsx,jsxs:jsx}:{__esModule:true,default:n}})
function render(){cursor=0;tree=mod.exports.default()}function children(){return tree.props.children}
render();hooks[0].current={contentWindow:frameWindow};children()[0].props.onLoad();assert.equal(sent[0][0].kind,'macintodd-family-host')
const payload={kind:'macintodd-family-completion',name:'Maya Student',hour:'3',date:'2026-11-11T16:30:00.000Z',results:[{score:30,correct:3,attempted:4},{score:50,correct:5,attempted:6},{score:40,correct:4,attempted:5}]}
listener({source:{},data:payload});render();assert.equal(hooks[1].value,null)
listener({source:frameWindow,data:{...payload,results:[{score:1,correct:9,attempted:2}]}});render();assert.equal(hooks[1].value,null)
listener({source:frameWindow,data:payload});render();const [frame,completion]=children();assert.equal(frame.props.style.display,'none');assert.equal(completion.props.name,'Maya Student');assert.equal(completion.props.score,'120 points');assert.equal(completion.props.stats[0].value,12);assert.equal(completion.props.stats[1].value,15);completion.props.onReturn();render();assert.equal(hooks[1].value,null);assert.equal(sent.at(-1)[0].kind,'macintodd-family-return')
const html=fs.readFileSync('public/widgets/function-families.html','utf8');assert(html.includes("event.origin!==new URL(location.href).origin"));assert(html.includes("if(completionHost){finishedAt=new Date();window.parent.postMessage"));assert(!html.includes("if(window.parent!==window){finishedAt"))
console.log('Passed Parent Function Challenge trusted iframe source, bounded score payload, hidden game during separate reflection/record flow, original totals and replay; external embedding does not receive names without a same-origin handshake.')
