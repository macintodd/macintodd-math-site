import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as model from '../src/lib/write-linear.ts'
import * as intro from '../src/lib/intro-point-slope.ts'
import * as point from '../src/lib/point-slope.ts'
import * as keypad from '../src/lib/mathboard/keypad.ts'
let index=0,tree,effects=[],serial=0;const hooks=[],timers=new Map()
const equal=(a,b)=>a&&b&&a.length===b.length&&a.every((v,i)=>v===b[i])
const react={useState(initial){const id=index++;if(!hooks[id])hooks[id]={value:typeof initial==='function'?initial():initial};return [hooks[id].value,v=>hooks[id].value=typeof v==='function'?v(hooks[id].value):v]},useRef(initial){const id=index++;return hooks[id]||(hooks[id]={current:initial})},useEffect(fn,deps){const id=index++;if(!hooks[id]||!equal(hooks[id].deps,deps)){const old=hooks[id];hooks[id]={deps};effects.push(()=>{old?.cleanup?.();hooks[id].cleanup=fn()})}}};react.useLayoutEffect=react.useEffect
const jsx=(type,props,key)=>({type,props:props??{},key}),testModule={exports:{}}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/write-linear-equation/Practice.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:testModule,exports:testModule.exports,console,setTimeout:fn=>{const id=++serial;timers.set(id,fn);return id},clearTimeout:id=>timers.delete(id),require:n=>n==='react'?react:n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='@/lib/goat-sound'?{prepareGoatSound(){}}:n==='@/lib/write-linear'?model:n==='@/lib/intro-point-slope'?intro:n==='@/lib/point-slope'?point:n==='@/lib/mathboard/keypad'?keypad:n==='@/components/Math'?{Math:'formula'}:{default:n,__esModule:true}})
function render(){index=0;effects=[];tree=testModule.exports.default();effects.forEach(fn=>fn())}
function nodes(n=tree){if(Array.isArray(n))return n.flatMap(x=>nodes(x??null));if(!n||typeof n!=='object')return [];return [n,...nodes(n.props.children??null)]}
function text(n){if(Array.isArray(n))return n.map(text).join('');return n&&typeof n==='object'?text(n.props.children):n==null||typeof n==='boolean'?'':String(n)}
function click(label){const n=nodes().find(n=>n.type==='button'&&text(n)===label);assert(n,label+' exists');assert(!n.props.disabled,label+' enabled');n.props.onClick();render()}
function input(label,value){const n=nodes().find(n=>n.type==='input'&&n.props['aria-label']===label);assert(n,label);n.props.onChange({target:{value}});render()}
function flush(){const t=[...timers.values()];timers.clear();t.forEach(f=>f());render()}
function state(){return hooks[3].value}
function problem(){return hooks[4].value}
function solve(){const p=problem();input('Complete equation',`y=${p.line.rise}/${p.line.run}x+${p.line.y}`);click('Check equation');flush()}
render();const fields=nodes().filter(n=>n.type==='input');fields[0].props.onChange({target:{value:'Mary'}});fields[1].props.onChange({target:{value:'Todd'}});nodes().find(n=>n.type==='select').props.onChange({target:{value:'3'}});render();nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});render()
assert(state().example);solve();assert.equal(state().stats[0].correct,0);click('Start scored practice →');
input('Complete equation','y=2+3');click('Check equation');assert.equal(state().warnings,1);click('Got it');solve();assert.equal(state().stats[0].streak,1);click('Continue →');input('Complete equation','y=2+3');click('Check equation');assert.equal(state().warnings,2);assert.equal(state().stats[0].streak,0);click('Got it');solve();assert.equal(state().stats[0].streak,0);click('Continue →');
for(let i=0;i<3;i++){solve();click('Continue →')};assert.equal(state().phase,'spin');click('Spin for your number');flush();assert.equal(state().targets.length,1);click('Go to Level 2 →');assert.equal(state().level,2)
function graphSolve(){const p=problem();let graph=nodes().find(n=>n.type==='./LineGraph');graph.props.onSelect({x:0,y:p.line.y});render();graph=nodes().find(n=>n.type==='./LineGraph');graph.props.onSelect(p.point);render();input('Slope rise',String(p.line.rise));input('Slope run',String(p.line.run));click('Check intercept & slope');solve()}
graphSolve();assert.equal(state().stats[1].correct,0);click('Start scored practice →');for(let i=0;i<3;i++){graphSolve();click('Continue →')};assert.equal(state().phase,'spin');click('Spin for your number');flush();click('Try the challenge →');input('Complete equation','y=2x+1');click('Check equation');assert(text(tree).includes('First attempt recorded'));input('Complete equation','y=2x+1');click('Check equation');assert(text(tree).includes('Keep working'));input('Complete equation','y=.75x+1.25');click('Check equation');click('Got it');click('Proceed to Level 3 →');assert(state().example)
function introSolve(){for(const [q,slot] of [['y','y1'],['m','m'],['x','x1']]){const btn=nodes().find(n=>n.type==='button'&&n.props['aria-pressed']!==undefined&&text(n)===intro.quantityTex(problem(),q));assert(btn);btn.props.onClick();render();const dest=nodes().find(n=>n.props['data-slot']===slot);dest.props.onClick();render()};click('Check placement');input('Distributed x coefficient',String(problem().line.rise/problem().line.run));input('Distributed constant',String(-problem().line.rise/problem().line.run*problem().point.x));click('Check distribution');solve();click('Start scored practice →')}
introSolve();assert.equal(state().stats[2].correct,0); // celebration dismiss/advance uses same Continue handler
// Use direct quantity identity when equal numeric values make button search ambiguous.
for(let i=0;i<10;i++){const p=problem();for(const [q,slot] of [['y','y1'],['m','m'],['x','x1']]){const sources=nodes().filter(n=>n.type==='div'&&n.props.className===`wl-quantity wl-${q}`);sources[0].props.children[1].props.onClick();render();nodes().find(n=>n.props['data-slot']===slot).props.onClick();render()};click('Check placement');input('Distributed x coefficient',String(p.line.rise/p.line.run));input('Distributed constant',String(-p.line.rise/p.line.run*p.point.x));click('Check distribution');solve();click('Continue →')}
assert.equal(state().phase,'spin');click('Spin for your number');flush();click('Play the bonus game →');assert.equal(state().phase,'bonus');const bonus=nodes().find(n=>n.type==='./BonusGame');for(const target of state().targets){nodes().find(n=>n.type==='./BonusGame').props.onResult(target);render()}nodes().find(n=>n.type==='./BonusGame').props.onFinish();render();assert.equal(state().phase,'report');assert.equal(model.mathScore(state()),10);assert.equal(model.bonusPoint(state()),1)
console.log('Passed full three-level UI flow, fixed unscored examples, missing-x warnings, graph checks, challenge retries, drag/tap steps, spins, and 11/10 report.')
