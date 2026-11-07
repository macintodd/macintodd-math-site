import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as model from '../src/lib/write-linear.ts'
import * as geometry from '../src/lib/point-slope-celebration.ts'
assert.deepEqual([0,1,2,3,4,5,6,7].map(model.streakScene),[undefined,'goat','chase','goat-skis','haggard','ride','ride','ride'])
let s=model.newSession();s.example=false;s.level=3
s=model.markAnswer(model.markAnswer(s,false),false)
assert.match(model.encouragement(s,'Maya'),/Maya, you can/)
assert.match(model.encouragement(s,'Maya'),/distribute/)
assert.equal(model.encouragement(model.markAnswer(s,true),'Maya'),'')
assert.equal(model.encouragement({...s,example:true},'Maya'),'')
assert.equal(model.done(3,{correct:10,attempts:10,streak:5,best:5}),true)
assert.equal(model.done(3,{correct:5,attempts:5,streak:5,best:5}),true)
assert.equal(model.done(3,{correct:20,attempts:25,streak:4,best:4}),false)
const jsx=(type,props,key)=>({type,props:props??{},key}),mod={exports:{}}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/write-linear-equation/StudentSurprise.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:mod,exports:mod.exports,require:n=>n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='@/lib/point-slope-celebration'?geometry:{default:'goat-surprise',__esModule:true}})
function nodes(n){if(Array.isArray(n))return n.flatMap(nodes);return n&&typeof n==='object'?[n,...nodes(n.props?.children)]:[]}
for(const m of [-2,2])for(const scene of ['skier','goat','chase','goat-skis','haggard','ride']){
 const tree=mod.exports.default({scene,problem:{line:{x:0,y:1,rise:m,run:1},point:{x:2,y:1+2*m}},start:12,clipId:'clip',sx:x=>200+x*20,sy:y=>300-y*20,sound:false})
 const all=nodes(tree)
 if(scene==='goat'){assert.equal(tree.type,'goat-surprise');continue}
 const moves=all.filter(n=>n.type==='animateTransform'&&n.props.type==='translate')
 assert.equal(moves.length,scene==='chase'?2:1)
 assert.equal(moves[0].props.begin,'12s')
 if(scene==='chase'){assert.equal(moves[1].props.begin,'12.8s');assert.equal(moves[0].props.values,moves[1].props.values)}
 for(const move of moves)assert(!/NaN|Infinity/.test(move.props.values))
 if(['goat-skis','haggard','ride'].includes(scene))assert(all.some(n=>n.type==='image'&&n.props.href==='/images/linear-streak-characters.png'))
}
const ui=fs.readFileSync('src/app/apps/write-linear-equation/Practice.tsx','utf8')
assert(ui.includes("studentScene={s?.example?'skier':"))
assert(ui.includes('!teacherMode&&encouragement(s,first)'))
assert(fs.readFileSync('src/app/apps/write-linear-equation/practice.css','utf8').includes('.wl-student-surprise{display:none}'))
console.log('Passed six-scene pacing/reset, shared student/teacher scene eligibility, both slope signs, shared chase path/timing, new sprite cells, encouragement/reset and unchanged five-streak full-credit rule.')
