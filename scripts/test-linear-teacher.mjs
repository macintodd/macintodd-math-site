import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as model from '../src/lib/write-linear.ts'
import * as intro from '../src/lib/intro-point-slope.ts'
import * as point from '../src/lib/point-slope.ts'
import * as keypad from '../src/lib/mathboard/keypad.ts'
let index=0,tree,effects=[],serial=0,dropSlot='y1';const hooks=[],timers=new Map()
const equal=(a,b)=>a&&b&&a.length===b.length&&a.every((v,i)=>v===b[i])
const react={useState(initial){const id=index++;if(!hooks[id])hooks[id]={value:typeof initial==='function'?initial():initial};return [hooks[id].value,v=>hooks[id].value=typeof v==='function'?v(hooks[id].value):v]},useRef(initial){const id=index++;return hooks[id]||(hooks[id]={current:initial})},useEffect(fn,deps){const id=index++;if(!hooks[id]||!equal(hooks[id].deps,deps)){const old=hooks[id];hooks[id]={deps};effects.push(()=>{old?.cleanup?.();hooks[id].cleanup=fn()})}}};react.useLayoutEffect=react.useEffect
const jsx=(type,props,key)=>({type,props:props??{},key}),testModule={exports:{}}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/write-linear-equation/Practice.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:testModule,exports:testModule.exports,console,document:{elementFromPoint:()=>({closest:()=>({getAttribute:()=>dropSlot})})},setTimeout:fn=>{const id=++serial;timers.set(id,fn);return id},clearTimeout:id=>timers.delete(id),require:n=>n==='@/components/practice/BilingualWidget'?{useWidgetLanguage:()=>({language:'en',translate:v=>v,setLanguage(){}})}:n==='react'?react:n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='@/lib/goat-sound'?{prepareGoatSound(){}}:n==='@/lib/write-linear'?model:n==='@/lib/intro-point-slope'?intro:n==='@/lib/point-slope'?point:n==='@/lib/mathboard/keypad'?keypad:n==='@/components/Math'?{Math:'formula'}:{default:n,__esModule:true}})
function render(){index=0;effects=[];tree=testModule.exports.default({teacherMode:true});effects.forEach(fn=>fn())}
function nodes(n=tree){if(Array.isArray(n))return n.flatMap(x=>nodes(x??null));if(!n||typeof n!=='object')return [];return [n,...nodes(n.props.children??null)]}
function text(n){if(Array.isArray(n))return n.map(text).join('');return n&&typeof n==='object'?text(n.props.children):n==null||typeof n==='boolean'?'':String(n)}
function click(label){const n=nodes().find(n=>n.type==='button'&&text(n)===label);assert(n,label+' exists');assert(!n.props.disabled,label+' enabled');n.props.onClick();render()}
function input(label,value){const n=nodes().find(n=>n.type==='input'&&n.props['aria-label']===label);assert(n,label);n.props.onChange({target:{value}});render()}
function flush(){const t=[...timers.values()];timers.clear();t.forEach(f=>f());render()}
function state(){return hooks[3].value}
function problem(){return hooks[4].value}
function solve(){const p=problem();input('Complete equation',`y=${p.line.rise}/${p.line.run}x+${p.line.y}`);click('Check equation');flush()}
render();assert(state());assert.equal(state().level,1);assert(!nodes().some(n=>n.type==='form'));assert(text(tree).includes('TEACHER DEMO'));assert(!nodes().some(n=>n.type==='button'&&text(n)==='Stop & save'));
function jump(value){nodes().find(n=>n.type==='select'&&n.props['aria-label']==='Jump to demonstration slide').props.onChange({target:{value}});render()}
solve();click('Skip to next problem');flush();assert.equal(state().phase,'work');assert(!state().example);assert(!nodes().some(n=>n.type==='../intro-point-slope/PointSlopeCelebration'));
jump('2');assert.equal(state().level,2);click('Next step →');assert(nodes().some(n=>n.props['aria-label']==='Slope rise'));click('Next step →');assert(nodes().some(n=>n.type==='input'&&n.props['aria-label']==='Complete equation'));assert.equal(state().stats[1].correct,0);click('← Previous step');assert(nodes().some(n=>n.type==='input'&&n.props['aria-label']==='Slope rise'));
jump('3');click('Next step →');assert(nodes().some(n=>n.type==='input'&&n.props['aria-label']==='Distributed right-hand expression'));click('Next step →');assert(nodes().some(n=>n.type==='input'&&n.props['aria-label']==='Complete equation'));assert(state().stats.every(s=>s.correct===0));click('Skip to level end');assert.equal(state().phase,'spin');click('Spin for your number');flush();assert.equal(state().targets.length,3);click('Play the bonus game →');assert.equal(state().phase,'bonus');nodes().find(n=>n.type==='./BonusGame').props.onFinish();render();assert.equal(state().phase,'report');assert(text(tree).includes('Demonstration complete'));assert(!nodes().some(n=>n.type==='button'&&text(n)==='Download named results'));assert(!text(tree).includes('FINAL SCORE'));assert(!nodes().some(n=>n.type==='@/components/practice/ResumeDialog'));
jump('1');click('Skip to next level →');assert.equal(state().level,2);click('Skip to next level →');assert.equal(state().phase,'challenge');click('Skip to next level →');assert.equal(state().level,3);assert.equal(state().phase,'work');jump('bonus');assert.equal(state().targets.length,3);jump('1-end');assert.equal(state().targets.length,0);click('Spin for your number');flush();assert.equal(state().targets.length,1);
console.log('Passed teacher auto-start, step navigation, problem skip/timer cancellation, all level jumps/endings, bonus preview, and absence of student score cards/resume codes.')

jump('3');click('Next step →');assert.equal(nodes().filter(n=>n.type==='input'&&n.props['aria-label']==='Distributed right-hand expression').length,1);assert(!nodes().some(n=>n.props['aria-label']==='Distributed constant'));input('Distributed right-hand expression','2x + -6');click('Check distribution');solve();click('Next: graph animation →');let movie=nodes().find(n=>n.type==='../intro-point-slope/PointSlopeCelebration');assert.equal(movie.props.studentScene,'skier');movie.props.onNext();render();
for(const expected of ['goat','chase','goat-skis','haggard','ride']){click('Next step →');input('Distributed right-hand expression',model.distributionText(problem()));click('Check distribution');solve();click('Next: graph animation →');movie=nodes().find(n=>n.type==='../intro-point-slope/PointSlopeCelebration');assert.equal(movie.props.studentScene,expected);movie.props.onNext();render()}
assert.equal(state().phase,'spin');console.log('Passed one-field distribution, plus-negative notation and full teacher animation sequence from unscored example through five streak scenes.');
