import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as content from '../src/content/mathboard/session-one.ts'
import * as model from '../src/lib/mathboard/model.ts'
import {editAnswer} from '../src/lib/mathboard/keypad.ts'
import {start2048} from '../src/lib/mathboard/game.ts'
const {screens}=content
const jsx=(type,props)=>({type,props:props??{}})
const source=ts.transpileModule(fs.readFileSync('src/app/apps/mathboard/session-1/SessionLesson.tsx','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText
function harness(saved=null){
 let cursor=0,tree,jobs=[],layout=[],fetches=0;const hooks=[],storage=new Map(saved?[[model.storageKey,JSON.stringify(saved)]]:[])
 const effect=(fn,deps,list)=>{const i=cursor++,old=hooks[i];if(!old||!deps||deps.some((v,j)=>!Object.is(v,old.deps[j]))){hooks[i]={deps};list.push(fn)}}
 const react={useState(initial){const i=cursor++;hooks[i]??={value:typeof initial==='function'?initial():initial};return[hooks[i].value,v=>hooks[i].value=typeof v==='function'?v(hooks[i].value):v]},useRef(current){const i=cursor++;return hooks[i]??(hooks[i]={current})},useEffect(fn,deps){effect(fn,deps,jobs)},useLayoutEffect(fn,deps){effect(fn,deps,layout)}}
 const mod={exports:{}}
 vm.runInNewContext(source,{module:mod,exports:mod.exports,Date,queueMicrotask,fetch(){fetches++;throw Error('Lesson must not require configuration or release requests')},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},require:n=>n==='react'?react:n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='@/content/mathboard/session-one'?content:n==='@/lib/mathboard/model'?model:n==='@/lib/mathboard/keypad'?{editAnswer}:n==='@/lib/mathboard/game'?{start2048}:n==='@/components/Math'?{Math:'formula'}:{__esModule:true,default:n}})
 const nodes=(n=tree)=>Array.isArray(n)?n.flatMap(v=>nodes(v??null)):n&&typeof n==='object'?[n,...nodes(n.props.children??null)]:[]
 const text=n=>Array.isArray(n)?n.map(text).join(''):n&&typeof n==='object'?text(n.props.children):n==null||typeof n==='boolean'?'':String(n)
 function render(){cursor=0;jobs=[];layout=[];tree=mod.exports.default();layout.forEach(f=>f());jobs.forEach(f=>f())}
 function click(label){const b=nodes().find(n=>n.type==='button'&&text(n)===label);assert(b&&!b.props.disabled,label);b.props.onClick();render()}
 return {render,click,nodes,text,state:()=>hooks[0].value,tree:()=>tree,fetches:()=>fetches,storage}
}
const app=harness();app.render();await Promise.resolve();app.render()
assert(app.text(app.tree()).includes('No teacher code is needed'))
app.nodes().find(n=>n.type==='input').props.onChange({target:{value:'Review Student'}});app.click('3');app.nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});app.render()
assert.equal(app.state().completed.length,0)
app.click('Section menu');assert.equal(app.nodes().find(n=>n.props.id==='mb-section-navigation').props.hidden,false)
const nav=app.nodes().find(n=>n.props.id==='mb-section-navigation'),menuButtons=app.nodes(nav).filter(n=>n.type==='button')
assert.equal(menuButtons.length,screens.length+7,'Every screen and section is directly reachable')
app.click('Independent practice →');assert.equal(screens[app.state().index].id,'practice-1');assert.equal(app.state().completed.length,0,'Skipping must not award completion');assert.equal(app.nodes().find(n=>n.props.id==='mb-section-navigation').props.hidden,true)
app.click('Section menu');app.click('Exit ticket →');assert.equal(screens[app.state().index].id,'exit-mb')
app.click('Section menu');app.click('The draining pool →');assert.equal(app.state().index,0)
// Both former checkpoints continue without any passcode, grant, teacher or network.
for(const [checkpoint,next] of [[1,'mb-1'],[2,'practice-1']]){
 app.click('Section menu');const section=app.nodes().find(n=>n.type==='section'&&app.nodes(n).some(c=>c.type==='h2'&&app.text(c)===(checkpoint===1?'The draining pool →':'Guided graphing →')))
 const review=app.nodes(section).find(n=>n.type==='button'&&app.text(n)==='Section review');assert(review);review.props.onClick();app.render();assert.equal(screens[app.state().index].checkpoint,checkpoint)
 assert(!app.nodes().some(n=>n.type==='input'&&n.props.type==='password'));assert(!app.text(app.tree()).includes('locked until'))
 app.click('Continue →');assert.equal(screens[app.state().index].id,next)
}
assert.equal(app.fetches(),0)
assert(app.storage.has(model.storageKey))
// Existing saved progress beyond both former locks, with no grants, remains on that screen.
const legacy={...model.initialState('Saved Student','6','old-token'),index:screens.findIndex(s=>s.id==='practice-4'),values:{m:'-2/3'},completed:['initial'],grants:{}}
const resumed=harness(legacy);resumed.render();await Promise.resolve();resumed.render();resumed.click('Resume Lesson');assert.equal(screens[resumed.state().index].id,'practice-4');assert.equal(resumed.state().values.m,'-2/3');assert.equal(resumed.fetches(),0)
// A review ending after skipping is accurately labeled, with return to the menu.
app.click('Section menu');app.click('What does the y-intercept mean?');const choice=app.nodes().find(n=>n.type==='button'&&app.text(n)==='The $12 on the card before any chores.');choice.props.onClick();app.render();app.click('Check');app.click('Complete Session');const record=app.nodes().find(n=>n.type==='@/components/practice/CompletionFlow');assert.equal(record.props.score,'Review progress');assert.equal(record.props.stats[0].value,`1/${screens.filter(s=>!s.checkpoint).length}`);record.props.onReturn();app.render();app.click('Section menu');assert.equal(app.nodes().find(n=>n.props.id==='mb-section-navigation').props.hidden,false)
console.log('Passed open section/screen navigation, zero earned credit for skips, both code-free transitions, no network dependency, saved-session compatibility, honest partial review record and return to section menu.')
