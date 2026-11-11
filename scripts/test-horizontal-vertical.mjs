import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import katex from 'katex'
import {saveCode} from '../src/lib/write-linear.ts'
import * as hv from '../src/lib/horizontal-vertical.ts'
import {spanishText} from '../src/lib/beta-spanish.ts'
for(let level=1;level<=5;level++)for(let i=0;i<1000;i++){
 const q=hv.hvQuestion(level,i);assert(q.graph||q.equation);assert(q.answer>=0);assert.equal(new Set(q.choices).size,q.choices.length)
 if(level===1)assert.equal(q.kind,0);if(level===2)assert.equal(q.kind,1);if(level===3)assert.equal(q.kind,4);if(level===4)assert([2,3].includes(q.kind))
 if(q.kind===0||q.kind===2)assert.equal(q.answerText,q.horizontal?'Horizontal':'Vertical')
 if(q.kind===1||q.kind===3)assert.equal(q.answerText,q.horizontal?'0':'Undefined')
 if(q.kind===4){assert(q.graph);assert.equal(q.choices.length,4);assert.equal(q.answerText,`${q.horizontal?'y':'x'}=${q.value}`)}
 if(q.equation){assert.equal(q.equation,`${q.horizontal?'y':'x'}=${q.value}`);katex.renderToString(q.equation,{throwOnError:true})}
 assert.notEqual(spanishText(q.prompt),q.prompt);assert.notEqual(spanishText(q.cue),q.cue)
}
for(let level=1;level<=5;level++)assert.deepEqual(hv.hvQuestion(level,1,true,()=>.2),hv.hvQuestion(level,1,true,()=>.9),'Fixed class demo')
let p=hv.newHV();for(let level=1;level<=5;level++){p.level=level;p.demo=false;for(let i=0;i<hv.hvTarget(level)-1;i++)p.stats[level-1]=hv.markHV(p.stats[level-1],true);assert(!hv.hvDone(p.stats[level-1],level));p.stats[level-1]=hv.markHV(p.stats[level-1],false);assert.equal(p.stats[level-1].streak,0);for(let i=0;i<hv.hvTarget(level);i++)p.stats[level-1]=hv.markHV(p.stats[level-1],true);assert(hv.hvDone(p.stats[level-1],level));const code=hv.saveHV(p,'Test','Student','4');assert.deepEqual(hv.loadHV(code,'Test','Student','4'),p);assert.throws(()=>hv.loadHV(code,'Other','Name','4'));assert.throws(()=>hv.loadHV(code,'Test','Student','3'));assert.throws(()=>hv.loadHV(code.slice(0,-1)+'!', 'Test','Student','4'))}p.finished=true;assert.equal(hv.hvScore(p),10);assert.deepEqual(hv.loadHV(hv.saveHV(p,'Test','Student','4'),'Test','Student','4'),p)
// Existing five-streak codes retain real totals; revised skill order and targets apply.
const oldStats=[5,5,5,2,0].map(n=>({correct:n,attempts:n,streak:n,best:n})),tail=oldStats.slice(3).flatMap(s=>[s.correct,s.attempts,s.streak,s.best]);
const legacyCode=saveCode({level:1,phase:'work',example:false,stats:oldStats.slice(0,3),warnings:4*4,targets:[],bonus:[],date:'',trail:tail.map(n=>({gold:false,count:n+1}))},'Test','Student','4').replace(/^WL1-/,'HV0-');
const migrated=hv.loadHV(legacyCode,'Test','Student','4');assert.equal(migrated.level,1);assert.deepEqual(migrated.stats.map(s=>s.correct),[5,5,2,5,0]);assert.deepEqual(hv.loadHV(hv.saveHV(migrated,'Test','Student','4'),'Test','Student','4'),migrated);
const src=fs.readFileSync('src/app/apps/horizontal-vertical/Practice.tsx','utf8');assert(!/setInterval|setTimeout|performance\.now|deadline/.test(src))
let cursor=0,tree,effects=[],report=[],language='en';const hooks=[],jsx=(type,props)=>({type,props:props??{}}),mod={exports:{}},translate=v=>language==='en'?v:spanishText(v)
const react={useState(initial){const i=cursor++;hooks[i]??={value:typeof initial==='function'?initial():initial};return [hooks[i].value,v=>hooks[i].value=typeof v==='function'?v(hooks[i].value):v]},useRef(v){const i=cursor++;return hooks[i]??(hooks[i]={current:v})},useEffect(fn,deps){const i=cursor++,old=hooks[i];if(!old||deps.some((v,j)=>v!==old.deps[j])){old?.cleanup?.();hooks[i]={deps};effects.push(()=>{hooks[i].cleanup=fn()})}}}
const reflection={confirmed:false,lines:['Confidence: 5/5','Difficulty: 3/5']}
vm.runInNewContext(ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:mod,exports:mod.exports,require:n=>n==='react'?react:n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='@/lib/horizontal-vertical'?hv:n==='@/components/practice/BilingualWidget'?{useWidgetLanguage:()=>({language,translate})}:n==='@/components/Math'?{Math:'formula'}:n==='@/components/practice/PracticeReflection'?{__esModule:true,default:n,usePracticeReflection:()=>reflection}:n==='@/lib/scorecard'?{createReportImage:(...args)=>{report=args;return 'data:image/png;base64,test'}}:{__esModule:true,default:n}})
function render(){cursor=0;tree=mod.exports.default();const pending=effects;effects=[];pending.forEach(fn=>fn())}
function nodes(n=tree){return Array.isArray(n)?n.flatMap(v=>nodes(v??null)):n&&typeof n==='object'?[n,...nodes(n.props.children??null)]:[]}
function text(n){return Array.isArray(n)?n.map(text).join(''):n&&typeof n==='object'?text(n.props.children):n==null||typeof n==='boolean'?'':String(n)}
function click(label){const b=nodes().find(n=>n.type==='button'&&text(n)===label);assert(b&&!b.props.disabled,label);b.props.onClick();render()}
function answer(right=true){assert.equal(hooks[16].value,'scratch');assert(nodes().some(n=>n.type==='../graph-linear/ScratchPad'));const oldKey=nodes().find(n=>n.type==='../graph-linear/ScratchPad').props.height;assert.equal(oldKey,160);const q=hooks[4].value,choices=nodes().filter(n=>n.type==='button'&&n.props['aria-pressed']===false),b=choices[right?q.answer:(q.answer+1)%q.choices.length];assert(b);b.props.onClick();b.props.onClick();render();assert.equal(hooks[6].value,true);assert.equal(hooks[16].value,'graph');const graph=nodes().find(n=>typeof n.type==='function'&&n.type.name==='Graph'&&n.props.question.id===q.id+100000);assert(graph);assert.equal(graph.props.question.horizontal,q.horizontal);assert.equal(graph.props.question.value,q.value);click('Scratch paper');assert.equal(hooks[16].value,'scratch');click('Correct graph');assert.equal(hooks[16].value,'graph')}
render();const inputs=nodes().filter(n=>n.type==='input');inputs[0].props.onChange({target:{value:'Test'}});inputs[1].props.onChange({target:{value:'Student'}});nodes().find(n=>n.type==='select').props.onChange({target:{value:'4'}});render();nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});render()
for(let level=1;level<=5;level++){
 assert.equal(hooks[3].value.level,level);assert(hooks[3].value.demo);if(level===1){answer(false);click('Try the example again');assert.equal(hooks[3].value.stats[0].attempts,0)}answer();click('Review skill & begin practice →');assert(hooks[8].value);nodes().find(n=>n.type==='@/components/practice/SkillGoal').props.onContinue();render();assert(!hooks[3].value.demo)
 if(level===1){answer(false);assert.equal(hooks[3].value.stats[0].attempts,1);assert(text(tree).includes('Your streak restarts at zero'));click('Next question →')}
 for(let i=0;i<hv.hvTarget(level);i++){answer();assert.equal(hooks[3].value.stats[level-1].streak,i+1);assert.equal(hooks[3].value.stats[level-1].correct,i+1);click(i===hv.hvTarget(level)-1?'Celebrate this level →':'Next question →')}
 assert.equal(hooks[7].value,'levelDone');click('Stop & save progress');const dialog=nodes().find(n=>n.type==='@/components/practice/ResumeDialog');assert(dialog);assert.equal(hv.loadHV(dialog.props.code,'Test','Student','4').level,level);dialog.props.onClose();render();click(level===5?'Finish & reflect →':'Next level example →')
}
assert.equal(hooks[7].value,'report');assert(hooks[3].value.finished);assert.equal(tree.type,'@/components/practice/CompletionFlow');assert.equal(tree.props.score,'10/10');assert.equal(tree.props.name,'Test Student');assert.equal(tree.props.stats.find(s=>s.label==='Correct answers').value,40);assert.equal(tree.props.details.length,5);assert.equal(report.length,0);
// Check translation coverage of new visible passages (mathematical terms can be identical).
const ast=ts.createSourceFile('Practice.tsx',src,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX)
const missing=new Set();function visit(n){if(ts.isJsxText(n)){const t=n.text.replace(/\s+/g,' ').trim();if(/[A-Za-z]{3}/.test(t)&&!['Hour','Horizontal ↔','Vertical ↕'].includes(t))if(spanishText(t)===t)missing.add(t)}ts.forEachChild(n,visit)}visit(ast);assert.equal(missing.size,0,JSON.stringify([...missing]));
console.log('Passed 5,000 level-specific questions, fixed demos, eight-streak gates/reset, all-level resume round trips and name/hour/typo checks, full component progression, scratch/graph flips after right and wrong answers, double-tap locking, unscored demos, skill reminders, required surveys, automatic local scorecard and native save action.')
