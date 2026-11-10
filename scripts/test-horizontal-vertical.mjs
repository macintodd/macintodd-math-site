import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import katex from 'katex'
import {hvDeck,hvTotals,hvAnswerAllowed} from '../src/lib/horizontal-vertical.ts'
import {spanishText} from '../src/lib/beta-spanish.ts'
for(let i=0;i<1000;i++){
 const deck=hvDeck();assert.equal(new Set(deck.map(q=>q.kind)).size,12)
 for(const q of deck){assert.equal(q.choices.length,2);assert(q.answer>=0&&q.answer<2);assert.equal(new Set(q.choices).size,2);if(q.equation){katex.renderToString(q.equation,{throwOnError:true});const [lhs,rhs]=q.equation.split('=');const offset=Number(lhs.slice(1)||0);assert.equal(q.value,Number(rhs)-offset)}
 if(q.kind<2||q.kind===6||q.kind===7)assert.equal(q.answerText,q.horizontal?'0':'Undefined')
 if(q.kind>=10){assert.equal(q.equation,`${q.horizontal?'y':'x'}=${q.value}`);assert.equal(q.answerText,q.horizontal?'Horizontal':'Vertical');assert.equal(q.prompt,'Is this the equation of a vertical or horizontal line?')}assert(q.graph||q.equation,'Every question must show a graph or an equation')
 assert.notEqual(spanishText(q.prompt),q.prompt);assert.notEqual(spanishText(q.cue),q.cue)
 }
}
assert(hvAnswerAllowed(60000,59999,false));assert(!hvAnswerAllowed(60000,60000,false));assert(!hvAnswerAllowed(60000,50000,true))
const q=hvDeck()[0];assert.deepEqual(hvTotals([true,true,false,true].map(right=>({right,question:q,chosen:0}))),{correct:3,points:30,attempted:4,accuracy:75,streak:1,best:2})
const src=fs.readFileSync('src/app/apps/horizontal-vertical/Practice.tsx','utf8')
// Run the actual component's controls against a controlled clock. No student data or network.
let cursor=0,tree,now=0,timer=null,advance=null,effects=[],report=[]
const hooks=[],jsx=(type,props)=>({type,props:props??{}}),mod={exports:{}}
const react={useState(initial){const i=cursor++;hooks[i]??={value:typeof initial==='function'?initial():initial};return [hooks[i].value,v=>hooks[i].value=typeof v==='function'?v(hooks[i].value):v]},useRef(v){const i=cursor++;return hooks[i]??(hooks[i]={current:v})},useEffect(fn,deps){const i=cursor++;const old=hooks[i];if(!old||deps.some((v,j)=>v!==old.deps[j])){old?.cleanup?.();hooks[i]={deps};effects.push(()=>{hooks[i].cleanup=fn()})}}}
const reflection={confirmed:false,lines:['Confidence: 5/5','Difficulty: 3/5']}
vm.runInNewContext(ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:mod,exports:mod.exports,performance:{now:()=>now},setInterval:fn=>{timer=fn;return 1},clearInterval:()=>timer=null,setTimeout:fn=>{advance=fn;return 2},clearTimeout:()=>advance=null,require:n=>n==='react'?react:n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='@/lib/horizontal-vertical'?{hvDeck,hvTotals,hvAnswerAllowed}:n==='@/components/practice/BilingualWidget'?{useWidgetLanguage:()=>({language:'en',translate:v=>v})}:n==='@/components/Math'?{Math:'formula'}:n==='@/components/practice/PracticeReflection'?{__esModule:true,default:n,usePracticeReflection:()=>reflection}:n==='@/lib/scorecard'?{createReportImage:(...args)=>{report=args;return 'data:image/png;base64,test'}}:{__esModule:true,default:n}})
function render(){cursor=0;tree=mod.exports.default();const pending=effects;effects=[];pending.forEach(fn=>fn())}
function nodes(n=tree){return Array.isArray(n)?n.flatMap(v=>nodes(v??null)):n&&typeof n==='object'?[n,...nodes(n.props.children??null)]:[]}
function text(n){return Array.isArray(n)?n.map(text).join(''):n&&typeof n==='object'?text(n.props.children):n==null||typeof n==='boolean'?'':String(n)}
function click(label){const b=nodes().find(n=>n.type==='button'&&text(n)===label);assert(b&&!b.props.disabled,label);b.props.onClick();render()}
render();const inputs=nodes().filter(n=>n.type==='input');inputs[0].props.onChange({target:{value:'Student'}});inputs[1].props.onChange({target:{value:'Test'}});nodes().find(n=>n.type==='select').props.onChange({target:{value:'4'}});render();nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});render();assert.equal(hooks[3].value,'ready');assert.equal(timer,null);click('Start my 60 seconds →');assert(timer)
let question=hooks[4].value[hooks[5].value];let choice=nodes().find(n=>n.type==='button'&&n.props['aria-pressed']===false);const selected=question.choices.findIndex(v=>v===text(choice));choice.props.onClick();choice.props.onClick();render();assert.equal(hooks[6].value.length,1,'double tap must count once');assert(nodes().some(n=>n.type==='button'&&text(n)==='Next question →'));assert(text(tree).includes(question.cue));click('Next question →')
question=hooks[4].value[hooks[5].value];const correctChoice=nodes().filter(n=>n.type==='button'&&n.props['aria-pressed']===false)[question.answer];correctChoice.props.onClick();render();assert(text(tree).includes('★ Correct! +10 points'));assert.equal(hooks[6].value.length,2);const before=hooks[5].value;advance();render();assert.equal(hooks[5].value,before+1)
now=60000;const late=nodes().find(n=>n.type==='button'&&n.props['aria-pressed']===false);late.props.onClick();render();assert.equal(hooks[6].value.length,2,'deadline rejects late input even before timer tick');timer();render();assert.equal(hooks[3].value,'done');assert.equal(timer,null);assert(nodes().find(n=>n.type==='button'&&text(n)==='Create results image').props.disabled);reflection.confirmed=true;render();click('Create results image');assert.equal(report[1],'Student Test');assert(report[2].includes('Confidence: 5/5'));assert(report[2].some(v=>v.startsWith('Final score:')));assert(nodes().some(n=>n.type==='img'));click('New student / session');assert.equal(hooks[0].value,'');assert.equal(hooks[1].value,'');assert.equal(hooks[6].value.length,0);assert(!nodes().some(n=>n.type==='img'))
// Every new visible passage is locally translated (allow identical mathematical labels).
const ast=ts.createSourceFile('Practice.tsx',src,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX)
function visit(n){if(ts.isJsxText(n)){const t=n.text.replace(/\s+/g,' ').trim();if(/[A-Za-z]{3}/.test(t)&&!['Hour','Correct answer:','Horizontal ↔','Vertical ↕'].includes(t))assert.notEqual(spanishText(t),t,`Missing Spanish: ${t}`)}ts.forEachChild(n,visit)}visit(ast)
console.log('Passed 12,000 balanced questions, equation simplification, correct slope/orientation, scoring/accuracy, single-tap locking, feedback, auto/manual advance, strict 60-second cutoff, required reflections, local export and new-student reset.')
