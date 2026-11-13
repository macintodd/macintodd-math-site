import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import katex from 'katex'
import {rationalDeck,rationalTopics,rationalTotals,rationalPartTotals,rationalSkill} from '../src/lib/rational-mcq.ts'
import {saveRational,loadRational} from '../src/lib/rational-resume.ts'
import * as lib from '../src/lib/rational-mcq.ts'
import * as resume from '../src/lib/rational-resume.ts'
import {spanishText} from '../src/lib/beta-spanish.ts'
const near=(a,b,epsilon=1e-7)=>assert(Math.abs(a-b)<epsilon,`${a} != ${b}`),number=s=>Number(s),choice=q=>q.choices[q.answer].tex
let checked=0;const kinds=new Set(),answers=[0,0,0,0]
for(let seed=0;seed<150;seed++)for(const topics of [rationalTopics,...rationalTopics.map(t=>[t])])for(const mode of ['both','no-calculator','calculator']){
 const deck=rationalDeck(seed,topics,mode);assert.equal(deck.length,mode==='both'?20:10);assert.deepEqual(deck,rationalDeck(seed,topics,mode));
 if(mode==='both'){assert(deck.slice(0,10).every(q=>q.part==='no-calculator'));assert(deck.slice(10).every(q=>q.part==='calculator'))}
 for(const q of deck){checked++;kinds.add(q.kind);answers[q.answer]++;assert(topics.includes(q.topic));assert.equal(new Set(q.choices.map(c=>c.tex)).size,4);assert(q.answer>=0&&q.answer<4);for(const tex of [q.given,q.request,...q.work,...q.choices.map(c=>c.tex)].filter(Boolean))katex.renderToString(tex,{throwOnError:true});assert.notEqual(spanishText(q.stem),q.stem,q.stem);q.explanation.forEach(s=>assert.notEqual(spanishText(s),s,s));
  if(q.kind==='calc-average-rate'){const [value,left,right,a,b,d,c]=q.truth,evalAt=x=>(a*x*x+b*x+1)/(d*x*x+c);near(value,(evalAt(right)-evalAt(left))/(right-left));near(Number(choice(q)),value,.000501)}
  if(q.kind==='calc-intersection'){const [x,a,c,target,b]=q.truth;near((a*x*x+b)/(x*x+c),target);assert(x>0);near(Number(choice(q)),x,.000501)}
  if(q.kind==='calc-mixture'){const [t,r,conc,target,v,m]=q.truth;near((m+r*conc*t)/(v+r*t),target);assert(t>0);near(Number(choice(q)),t,.000501)}
  if(q.kind==='calc-zero'){const [x,a,b,c]=q.truth;near(a*x*x-b,0);assert(x+c!==0&&x>0);near(Number(choice(q)),x,.000501)}
  if(q.kind==='calc-asymptote'){const [x,d,b]=q.truth;near(x*x+d*x-b,0);assert(x+1>0);near(Number(choice(q)),x,.000501)}
  if(q.kind==='calc-hole'){const [h,y,a,b,d,c]=q.truth;near((a*h*h+b)/(d*h*h+c),y);assert(choice(q).includes(y.toFixed(3)))}
  if(q.kind==='calc-near-pole'){const [left,right,a,b,d]=q.truth;near(((a-.01)**2+b)/(d*(-.01)),left,1e-7);near(((a+.01)**2+b)/(d*.01),right,1e-7);assert(left<0&&right>0);assert(choice(q).includes(left.toFixed(3))&&choice(q).includes(right.toFixed(3)))}
  if(q.kind==='calc-evaluation'||q.kind==='calc-end-table'){
   const m=q.given.match(/\\frac\{([\d.]+)x\^2\+([\d.]+)x\+1\}\{([\d.]+)x\^2\+([\d.]+)\}/);assert(m,q.given);const [,a,b,d,c]=m.map(Number),x=q.kind==='calc-end-table'?1000:Number(q.request.match(/\d+/)[0]);const expected=(a*x*x+b*x+1)/(d*x*x+c);near(Number(choice(q)),expected,.000501)
  }
  if(q.kind==='hole'||q.kind==='hole-limit'){const factors=[...q.given.matchAll(/\(x([+-])(\d)\)/g)].map(m=>(m[1]==='-'?1:-1)*Number(m[2]));assert.equal(factors.length,4);const [h,z,,v]=factors;near(q.truth[1],(h-z)/(h-v));assert.notEqual(h,v);assert.notEqual(h,z)}
  if(q.kind==='one-sided'){const factors=[...q.given.matchAll(/\(x([+-])(\d)\)/g)].map(m=>(m[1]==='-'?1:-1)*Number(m[2]));const [z,v]=factors;assert.deepEqual(q.truth,[-Math.sign(v-z),Math.sign(v-z)])}
  if(q.graph){assert(Math.abs(q.graph.a)<6);if(q.graph.hole!==undefined){assert(q.graph.hole!==q.graph.a);assert(Math.abs(q.graph.k+q.graph.c/(q.graph.hole-q.graph.a))<6)}}
 }
}
assert(kinds.size>=24,kinds);assert(answers.every(n=>n>checked*.18&&n<checked*.32),answers)
const id={first:'Maya',last:'Student',hour:'4'}
for(const mode of ['both','no-calculator','calculator']){
 const p={seed:0xffffffff,topics:[...rationalTopics],mode,answers:[],completedAt:null},deck=rationalDeck(p.seed,p.topics,p.mode)
 for(let i=0;i<=deck.length;i++){
  const partial={...p,answers:deck.slice(0,i).map(q=>q.answer),completedAt:i===deck.length?Date.now():null},code=saveRational(partial,id);assert.deepEqual(loadRational(code,id),partial);assert.throws(()=>loadRational(code,{...id,first:'Other'}));assert.throws(()=>loadRational(code,{...id,hour:'2'}));assert.throws(()=>loadRational(code+'!',id));
 }
 const allWrong={...p,answers:deck.map(q=>(q.answer+1)%4),completedAt:Date.now()},allRight={...p,answers:deck.map(q=>q.answer),completedAt:Date.now()};assert.equal(rationalTotals(allWrong).points,-5*deck.length);assert.equal(rationalTotals(allRight).points,10*deck.length);assert.equal(rationalTotals(p).points,0)
 const code=saveRational(allRight,id),chars=code.split('');chars[7]=chars[7]==='A'?'B':'A';assert.throws(()=>loadRational(chars.join(''),id));
 if(mode==='both')assert.equal(rationalPartTotals(allRight,'calculator').points,100)
}
// Exercise the actual component: one score per check, section break, resume and review.
const file='src/app/apps/ap-rational-practice/Practice.tsx',source=fs.readFileSync(file,'utf8'),jsx=(type,props)=>({type,props:props??{}});let cursor=0,tree,checkpoint;const hooks=[],react={useMemo:fn=>fn(),useState(initial){const i=cursor++;hooks[i]??={value:typeof initial==='function'?initial():initial};return[hooks[i].value,v=>hooks[i].value=typeof v==='function'?v(hooks[i].value):v]},useRef(v){const i=cursor++;return hooks[i]??(hooks[i]={current:v})}},mod={exports:{}};vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:mod,exports:mod.exports,Date,require:n=>n==='react'?react:n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='@/lib/rational-mcq'?lib:n==='@/lib/rational-resume'?resume:n==='@/components/practice/BilingualWidget'?{useWidgetLanguage:()=>({language:'en',translate:s=>s})}:n==='@/components/Math'?{Math:'formula'}:{__esModule:true,default:n}})
function render(){cursor=0;tree=mod.exports.default()}
function nodes(n=tree){return Array.isArray(n)?n.flatMap(x=>nodes(x??null)):n&&typeof n==='object'?[n,...nodes(n.props?.children??null)]:[]}
function text(n){return Array.isArray(n)?n.map(text).join(''):n&&typeof n==='object'?text(n.props?.children):n==null||typeof n==='boolean'?'':String(n)}
function click(label){const b=nodes().find(n=>n.type==='button'&&text(n)===label);assert(b&&!b.props.disabled,label);b.props.onClick();render()}
render();const fields=nodes().filter(n=>n.type==='input'&&n.props.required);fields[0].props.onChange({target:{value:id.first}});fields[1].props.onChange({target:{value:id.last}});nodes().find(n=>n.type==='select').props.onChange({target:{value:id.hour}});render();nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});render();
for(let i=0;i<20;i++){
 const p=hooks[5].value,q=rationalDeck(p.seed,p.topics,p.mode)[i],answer=i%2?q.answer:(q.answer+1)%4;
 if(i===0){assert(nodes().some(n=>n.type==='button'&&text(n)==='Check answer'&&n.props.disabled));click('Scratch paper');assert(nodes().some(n=>n.type==='../graph-linear/ScratchPad'));click('Answer choices')}
 const b=nodes().filter(n=>n.type==='button'&&(n.props['aria-pressed']===false||n.props['aria-pressed']===true)&&n.props.children?.[0]?.props?.className==='rq-letter')[answer];assert(b);b.props.onClick();render();const check=nodes().find(n=>n.type==='button'&&text(n)==='Check answer');check.props.onClick();check.props.onClick();render();assert.equal(hooks[5].value.answers.length,i+1);assert.equal(nodes().filter(n=>n.type==='button'&&n.props.className==='rq-wrong').length,i%2?0:1)
 if(i===3){click('Stop & save progress');const dialog=nodes().find(n=>n.type==='@/components/practice/ResumeDialog');checkpoint=dialog.props.code;assert.equal(loadRational(checkpoint,id).answers.length,4);dialog.props.onClose();render()}
 click(i===19?'Review & finish →':i===9?'Continue to calculator section →':'Next question →');if(i===9){assert.equal(hooks[8].value,'break');assert(text(tree).includes('Calculator allowed'));click('Begin calculator section →')}
}
assert.equal(hooks[8].value,'review');assert(nodes().some(n=>n.type==='button'&&text(n)==='Next missed question'));click('Next missed question');click('Previous missed question');click('Finish & reflect →');assert.equal(tree.type,'@/components/practice/CompletionFlow');assert.equal(tree.props.name,'Maya Student');assert.equal(tree.props.score,'50 points');assert.equal(tree.props.stats.find(s=>s.label==='Scored checks').value,20);assert.equal(tree.props.stats.find(s=>s.label==='Correct answers').value,10);assert(tree.props.completedAt);tree.props.onReturn();render();assert.equal(hooks[8].value,'review')
const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX),missing=[];function visit(n){if(ts.isJsxText(n)){const s=n.text.replace(/\s+/g,' ').trim();if(/[a-zA-Z]{3}/.test(s)&&!['Hour','points'].includes(s)&&spanishText(s)===s)missing.push(s)}ts.forEachChild(n,visit)}visit(ast);assert.deepEqual(missing,[]);assert.notEqual(spanishText(rationalSkill),rationalSkill)
assert(!/localStorage|sessionStorage|fetch\(/.test(source));assert(!/streak:/i.test(source));
console.log(`Passed ${checked} generated questions and ${kinds.size} templates, exact/rounded math oracles, valid LaTeX and Spanish, negative scores, all section modes, compact resume identity/checksum/history, double-check protection, section break, scratch work, review and named/date reflection handoff.`)

// Restoring a checked question advances to the next unanswered one without losing points.
hooks.length=0;render();let entry=nodes().filter(n=>n.type==='input'&&n.props.required);entry[0].props.onChange({target:{value:id.first}});entry[1].props.onChange({target:{value:id.last}});nodes().find(n=>n.type==='select').props.onChange({target:{value:id.hour}});nodes().find(n=>n.type==='input'&&n.props.autoComplete==='off').props.onChange({target:{value:checkpoint}});render();click('Continue saved progress');assert.equal(hooks[5].value.answers.length,4);assert.equal(hooks[7].value,false);assert.equal(rationalTotals(hooks[5].value).points,10);
// Topic validation, a calculator-only session, and an actually negative final report.
hooks.length=0;render();entry=nodes().filter(n=>n.type==='input'&&n.props.required);entry[0].props.onChange({target:{value:id.first}});entry[1].props.onChange({target:{value:id.last}});nodes().find(n=>n.type==='select').props.onChange({target:{value:id.hour}});nodes().filter(n=>n.type==='input'&&n.props.type==='checkbox').forEach(n=>n.props.onChange());render();nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});render();assert.equal(hooks[5].value,null);assert(text(tree).includes('Select at least one topic.'));nodes().filter(n=>n.type==='input'&&n.props.type==='checkbox')[3].props.onChange();nodes().filter(n=>n.type==='input'&&n.props.name==='section')[2].props.onChange();render();nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});render();assert.deepEqual(Array.from(hooks[5].value.topics),['1.9']);
for(let i=0;i<10;i++){const p=hooks[5].value,q=rationalDeck(p.seed,p.topics,p.mode)[i];assert.equal(q.part,'calculator');nodes().filter(n=>n.type==='button'&&n.props.children?.[0]?.props?.className==='rq-letter')[(q.answer+1)%4].props.onClick();render();click('Check answer');click(i===9?'Review & finish →':'Next question →')}
click('Finish & reflect →');assert.equal(tree.props.score,'-50 points');assert.equal(tree.props.stats.find(s=>s.label==='Maximum points').value,100);assert.equal(tree.props.stats.find(s=>s.label==='Missed answers').value,10);
console.log('Passed actual resume-next-question flow, empty-topic validation, calculator-only practice and negative final-score record.');
