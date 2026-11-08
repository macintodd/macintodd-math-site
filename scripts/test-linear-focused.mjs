import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as model from '../src/lib/write-linear.ts'
import * as focus from '../src/lib/linear-focused.ts'
import * as intro from '../src/lib/intro-point-slope.ts'
import * as point from '../src/lib/point-slope.ts'
import * as keypad from '../src/lib/mathboard/keypad.ts'
import {celebrationGeometry} from '../src/lib/point-slope-celebration.ts'
for(const level of [1,2,3,4]){
 const initial=focus.focusedSession(level)
 for(const phase of ['work','challenge','spin','bonus','report']){
  if(phase==='challenge'&&level!==2)continue
  const s={...initial,phase,example:false,targets:phase==='bonus'||phase==='report'?[7]:[],bonus:phase==='report'?[7]:[]};s.stats[Math.min(3,level)-1]={correct:5,attempts:7,streak:3,best:5};s.distributionWarnings=2
  const code=focus.saveFocused(s,level,'Maya','Todd','3'),restored=focus.loadFocused(code,level,'Maya','Todd','3')
  assert.deepEqual(restored.stats,s.stats);assert.deepEqual(restored.targets,s.targets);assert.deepEqual(restored.bonus,s.bonus);assert.equal(restored.distributionWarnings,2);assert.equal(restored.phase,phase)
  assert.throws(()=>focus.loadFocused(code,level,'Maya','Todd','4'))
  for(const other of [1,2,3,4].filter(n=>n!==level))assert.throws(()=>focus.loadFocused(code.replace(`WLE${level}`,`WLE${other}`),other,'Maya','Todd','3'))
 }
}
for(let i=0;i<1000;i++){
 const p=focus.focusedProblem(4,false),q=p.secondPoint
 assert(Number.isInteger(q.x)&&Number.isInteger(q.y));assert.notEqual(p.point.x,q.x);assert.notEqual(p.point.y,q.y)
 assert.equal((q.y-p.point.y)/(q.x-p.point.x),p.line.rise/p.line.run)
 for(const pt of [p.point,q])assert.equal(pt.y,p.line.y+pt.x*p.line.rise/p.line.run)
 const g=celebrationGeometry(p);assert.deepEqual(g.secondPoint,q);assert(q.x>=g.window.left&&q.x<=g.window.left+g.window.size);assert(q.y>=g.window.bottom&&q.y<=g.window.bottom+g.window.size)
}
const code=ts.transpileModule(fs.readFileSync('src/app/apps/write-linear-equation/Practice.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText
function app(mode){
 let index=0,tree,effects=[],serial=0;const hooks=[],timers=new Map(),equal=(a,b)=>a&&b&&a.length===b.length&&a.every((v,i)=>v===b[i])
 const react={useState(initial){const i=index++;hooks[i]??={value:typeof initial==='function'?initial():initial};return [hooks[i].value,v=>hooks[i].value=typeof v==='function'?v(hooks[i].value):v]},useRef(v){const i=index++;return hooks[i]??(hooks[i]={current:v})},useEffect(fn,deps){const i=index++;if(!hooks[i]||!equal(hooks[i].deps,deps)){const old=hooks[i];hooks[i]={deps};effects.push(()=>{old?.cleanup?.();hooks[i].cleanup=fn()})}}};react.useLayoutEffect=react.useEffect
 const jsx=(type,props,key)=>({type,props:props??{},key}),mod={exports:{}}
 vm.runInNewContext(code,{module:mod,exports:mod.exports,setTimeout:fn=>{const id=++serial;timers.set(id,fn);return id},clearTimeout:id=>timers.delete(id),require:n=>n==='react'?react:n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='@/lib/write-linear'?model:n==='@/lib/linear-focused'?focus:n==='@/lib/intro-point-slope'?intro:n==='@/lib/point-slope'?point:n==='@/lib/mathboard/keypad'?keypad:n==='@/lib/goat-sound'?{prepareGoatSound(){}}:n==='@/components/Math'?{Math:'formula'}:{default:n,__esModule:true}})
 function render(){index=0;effects=[];tree=mod.exports.default({standaloneLevel:mode});effects.forEach(f=>f())}
 function nodes(n=tree){if(Array.isArray(n))return n.flatMap(v=>nodes(v??null));return n&&typeof n==='object'?[n,...nodes(n.props.children??null)]:[]}
 function text(n){return Array.isArray(n)?n.map(text).join(''):n&&typeof n==='object'?text(n.props.children):n==null||typeof n==='boolean'?'':String(n)}
 function click(label){const b=nodes().find(n=>n.type==='button'&&text(n)===label);assert(b&&!b.props.disabled,label);b.props.onClick();render()}
 function input(label,value){const field=nodes().find(n=>n.type==='input'&&n.props['aria-label']===label);assert(field,label);field.props.onChange({target:{value}});render()}
 function flush(){const f=[...timers.values()];timers.clear();f.forEach(fn=>fn());render()}
 const state=()=>hooks[3].value,problem=()=>hooks[4].value
 function solve(){const p=problem(),s=state();
  if(s.phase==='challenge'){input('Complete equation','y=.75x+1.25');click('Check equation');click('Got it');click('Finish Level 2 →');return}
  if(mode===2){let graph=nodes().find(n=>n.type==='./LineGraph');graph.props.onSelect({x:0,y:p.line.y});render();graph=nodes().find(n=>n.type==='./LineGraph');graph.props.onSelect(p.point);render();input('Slope rise',String(p.line.rise));input('Slope run',String(p.line.run));click('Check intercept & slope')}
  if(mode>=3){
   if(mode===4){input('Slope rise',String(p.secondPoint.y-p.point.y));input('Slope run',String(p.secondPoint.x-p.point.x));click('Check slope');assert(nodes().some(n=>n.type==='div'&&n.props.className==='wl-checked'))}
   for(const [q,slot] of [['y','y1'],['m','m'],['x','x1']]){nodes().find(n=>n.type==='div'&&n.props.className===`wl-quantity wl-${q}`).props.children.find(n=>n?.type==='button').props.onClick();render();nodes().find(n=>n.props['data-slot']===slot).props.onClick();render()}
   click('Check placement');input('Distributed right-hand expression',model.distributionText(p));click('Check distribution')
  }
  input('Complete equation',`y=${p.line.rise}/${p.line.run}x+${p.line.y}`);click('Check equation');flush()
  if(mode>=3){click('Next: graph animation →');const movie=nodes().find(n=>n.type==='../intro-point-slope/PointSlopeCelebration');assert.equal(movie.props.studentScene,s.example?'skier':model.streakScene(state().stats[2].streak));if(mode===4)assert(movie.props.problem.secondPoint);movie.props.onNext();render()}
  else click(s.example?'Start scored practice →':'Continue →')
 }
 render();const fields=nodes().filter(n=>n.type==='input');fields[0].props.onChange({target:{value:'Maya'}});fields[1].props.onChange({target:{value:'Todd'}});nodes().find(n=>n.type==='select').props.onChange({target:{value:'3'}});render();nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});render()
 return {nodes,click,input,flush,render,solve,state,problem,text:()=>text(tree)}
}
for(const mode of [1,2,3,4]){
 const a=app(mode),idx=Math.min(3,mode)-1
 assert(a.text().includes(`Write the Linear Equation LEVEL ${mode}`));assert(a.text().includes(`LEVEL ${mode} ·`));assert(!a.nodes().some(n=>n.props['aria-label']==='Teacher demonstration navigation'))
 a.solve();assert.equal(a.state().stats[idx].correct,0);assert(!a.state().example)
 for(let i=0;i<(mode<3?3:5);i++)a.solve()
 if(mode===2){assert.equal(a.state().phase,'challenge');a.click('Yes');a.click('Start the challenge →');a.solve()}
 assert.equal(a.state().phase,'spin');assert.equal(focus.focusedScore(a.state(),mode),10)
 a.click('Spin for your number');a.flush();assert.equal(a.state().targets.length,1);a.click('Play the magic-number game →');assert.equal(a.state().phase,'bonus')
 const b=a.nodes().find(n=>n.type==='./BonusGame');assert.deepEqual(Array.from(b.props.rates),[3]);b.props.onResult(a.state().targets[0]);a.render();a.nodes().find(n=>n.type==='./BonusGame').props.onFinish();a.render();assert.equal(a.state().phase,'report');assert.equal(focus.focusedBonus(a.state()),1);assert.equal(a.nodes().find(n=>n.type==='./FinalReport').props.standaloneLevel,mode)
}
const retry=app(4);retry.input('Slope rise','0');retry.input('Slope run','0');retry.click('Check slope');assert(retry.text().includes('Subtract in the same order'));assert.equal(retry.state().stats[2].correct,0)
console.log('Passed four standalone complete flows, Level 2 challenge, two-point slope guidance, fixed unscored examples, animations, one 3/sec bonus, per-activity scores, resume identity/activity separation and 1000 two-point/graph regressions.')
