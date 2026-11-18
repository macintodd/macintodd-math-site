import assert from 'node:assert/strict'
import katex from 'katex'
import * as model from '../src/lib/day2-review.ts'
import * as codec from '../src/lib/day2-review-resume.ts'
import * as day1codec from '../src/lib/day1-review-resume.ts'
import {spanishText} from '../src/lib/beta-spanish.ts'
// Independently solved from the two source PDFs; do not derive answers from question targets.
const expectedA=[['3/2'],['y=2x+11'],['-2/3x+4'],['y=2/3x-5'],['y=-1/2x+4'],['y=3/4x-2'],['y=-2/5x+1'],['y=5/3x-6'],['y=-3/2x+3'],['y=4x+14'],['y=-3x+1'],['y=2x+11'],['1/2','(0,-3)','y=1/2x-3'],['-2/3','(0,2)','y=-2/3x+2'],['3/4','(0,-2)','y=3/4x-2'],['-1/2','(0,4)','y=-1/2x+4'],['2/3','(0,-1)','y=2/3x-1'],['-3/2','(0,3)','y=-3/2x+3'],['y=-2x+7'],['y=3/2x+7'],['y=-1/2x+1']]
const expectedB=[['2'],['1/2'],['y=-2x+10'],['y=2x+4'],['y=-2x-3'],['y=3/2x'],['y=-2/3x+3'],['y=3/4x+2'],['y=-1/2x+4'],['y=4'],['y=-5'],['y=7'],['y=-2'],['y=0'],['y=3'],['C(x)=3x+4','6'],['C(x)=0.5x+3','40'],['C(x)=0.15x+2','40'],['C(x)=2x+5','7'],['C(x)=0.4x+6','40'],['C(x)=0.6x+4','35']]
let p=model.freshReview();assert.equal(model.reviewQuestions.length,42)
for(const [i,q] of model.reviewQuestions.entries()){
 assert.equal(q.number,i%21+1);assert.equal(q.hints.length,3)
 if(q.given)katex.renderToString(q.given,{throwOnError:true})
 const answers=(q.part==='A'?expectedA:expectedB)[q.number-1];assert.equal(answers.length,q.fields.length)
 for(const [j,f] of q.fields.entries()){p.rows[i].answers[f.id]=answers[j];assert(model.fieldCorrect(f,answers[j]),q.part+q.number+' '+f.id);assert(!model.fieldCorrect(f,''));assert(!model.fieldCorrect(f,'9999'))}
 assert.equal(model.reviewCredit(q,p.rows[i]),0);p=model.checkReview(p,[i],1000+i);assert.equal(model.reviewStatus(q,p.rows[i]),'correct',q.part+q.number)
 for(let h=0;h<=3;h++)assert.equal(model.reviewCredit(q,{...p.rows[i],hints:h}),[1,.8,.6,.5][h])
 const wrong=structuredClone(p.rows[i]);wrong.answers[q.fields[0].id]='999';assert.equal(model.reviewStatus(q,wrong),'changed');assert(!model.reviewGrade(q,wrong).fields.every(f=>f.correct))
 for(const str of [q.prompt,...q.fields.flatMap(f=>[f.label,f.help]),...q.hints]){for(const m of str.matchAll(/\$([^$]+)\$/g))katex.renderToString(m[1],{throwOnError:true});if(!str.startsWith('$')&&/[A-Za-z]{4}/.test(str)&&str!=='x')assert.notEqual(spanishText(str),str,'Missing Spanish '+str)}
}
assert.equal(model.reviewTotals(p).correct,42);assert.equal(model.reviewTotals(p).points,42);for(const part of ['A','B'])assert.equal(model.reviewTotals(p,part).correct,21)
const graphValues=[[.5,-3],[-2/3,2],[.75,-2],[-.5,4],[2/3,-1],[-1.5,3]]
model.reviewQuestions.filter(q=>q.graph).forEach((q,i)=>assert.deepEqual([q.graph.m,q.graph.b],graphValues[i]))
const who={first:'Maya',last:'Student',hour:'3'};p.part='A';p.index=12;p.tool='scratch';p.rows[12].readPoints=[{x:0,y:-3},{x:2,y:-2}];p.rows[12].scratch=[{id:1,path:'M 0 0 L 504 330',erase:false}];p.rows[12].hints=2;p.rows[12].checks=7;p.scrollY=250;p.language='es'
for(const screen of ['problem','review','report']){p.screen=screen;p.completedAt=screen==='report'?1800000000000:null;p.reflection={confidence:4,difficulty:3,record:screen==='report'};const code=codec.saveReview(p,who);assert.deepEqual(codec.loadReview(code,who),p);assert.throws(()=>codec.loadReview(code,{...who,hour:'4'}));assert.throws(()=>codec.loadReview(code,{...who,first:'Other'}));assert.throws(()=>codec.loadReview(code+'x',who));assert.throws(()=>day1codec.loadReview(code,who))}
for(const mutate of [p=>p.index=42,p=>p.part='B',p=>p.rows[0].hints=4,p=>p.rows[0].answers.inject='bad',p=>p.rows[12].readPoints=[{x:1,y:8}],p=>p.rows[12].scratch[0].path='<script>',p=>p.reflection.confidence=6]){const bad=structuredClone(p);mutate(bad);assert.throws(()=>codec.validateReview(bad))}
assert(!model.fieldCorrect(model.reviewQuestions[2].fields[0],'alert(1)'));assert(!model.fieldCorrect(model.reviewQuestions[1].fields[0],'2x+11'));assert(!model.fieldCorrect(model.reviewQuestions[1].fields[0],'y=2(x+4)+3'))
const cost=model.reviewQuestions[36].fields[0];for(const answer of ['C(x)=3x+4','3x+4','y=3x+4'])assert(model.fieldCorrect(cost,answer));assert(!model.fieldCorrect(cost,'C(x)=4x+3'))
console.log('Passed all 42 PDF-matched answers, six graph targets, cost notation, LaTeX, Spanish prompts/hints/help, hint floor, free checks, edit invalidation and exact-screen progress with Day 1 code isolation.')
// Actual React component: mutually exclusive parts, free numbering, checks/hints,
// scratch persistence, editable review and restoring the exact selected screen.
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import {editAnswer} from '../src/lib/mathboard/keypad.ts'
let cursor=0,tree,language='en',jobs=[],layout=[];const hooks=[],jsx=(type,props)=>({type,props:props??{}}),react={useState(initial){const i=cursor++;hooks[i]??={value:typeof initial==='function'?initial():initial};return[hooks[i].value,v=>hooks[i].value=typeof v==='function'?v(hooks[i].value):v]},useRef(current){const i=cursor++;return hooks[i]??(hooks[i]={current})},useCallback(fn){cursor++;return fn},useEffect(fn){cursor++;jobs.push(fn)},useLayoutEffect(fn){cursor++;layout.push(fn)}}
const mod={exports:{}},win={scrollY:440,scrollTo(){},addEventListener(){},removeEventListener(){}}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/unit-1b-day-2-review/Practice.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:mod,exports:mod.exports,window:win,Date,requestAnimationFrame:f=>f(),require:n=>n==='react'?react:n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='@/lib/day2-review'?model:n==='@/lib/day2-review-resume'?codec:n==='@/lib/mathboard/keypad'?{editAnswer}:n==='@/components/practice/BilingualWidget'?{useWidgetLanguage:()=>({language,setLanguage:v=>language=v,translate:s=>s})}:n==='@/components/Math'?{Math:'formula'}:{__esModule:true,default:n}})
const nodes=(n=tree)=>Array.isArray(n)?n.flatMap(v=>nodes(v??null)):n&&typeof n==='object'?[n,...nodes(n.props.children??null)]:[]
const text=n=>Array.isArray(n)?n.map(text).join(''):n&&typeof n==='object'?text(n.props.children):n==null||typeof n==='boolean'?'':String(n)
function render(){cursor=0;jobs=[];layout=[];tree=mod.exports.default();layout.forEach(f=>f());jobs.forEach(f=>f())}
function click(label){const b=nodes().find(n=>n.type==='button'&&text(n)===label);assert(b&&!b.props.disabled,label);b.props.onClick();render()}
const state=()=>hooks[3].value
function field(index,id,value){const f=nodes().find(n=>n.props.id===`dr-${index}-${id}`);assert(f);f.props.onFocus();render();nodes().find(n=>n.props.id===`dr-${index}-${id}`).props.onChange({target:{value}});render()}
render();let inputs=nodes().filter(n=>n.type==='input');inputs[0].props.onChange({target:{value:who.first}});inputs[1].props.onChange({target:{value:who.last}});nodes().find(n=>n.type==='select').props.onChange({target:{value:who.hour}});render();nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});render()
assert(text(tree).includes('Self-evaluation only'));assert.equal(nodes().filter(n=>n.type==='nav')[0].props.children.length,21)
click('Part B 21 problems');assert.equal(state().part,'B');assert.equal(nodes().filter(n=>n.type==='nav')[0].props.children.length,21);assert.equal(nodes().filter(n=>n.props['aria-pressed']===true).length,2,'One part and one tool selected')
click('9');assert.equal(state().index,29);field(29,'equation','y=-1/2x+4');click('Check answer');assert.equal(model.reviewStatus(model.reviewQuestions[29],state().rows[29]),'correct')
for(let i=0;i<3;i++)click('Show next hint (−0.2 points)');assert.equal(model.reviewCredit(model.reviewQuestions[29],state().rows[29]),.5)
click('Scratch paper');const scratch=nodes().find(n=>n.type==='../graph-linear/ScratchPad');scratch.props.onStrokesCommit([{id:1,path:'M 0 0 L 504 330',erase:false}]);render();click('Part A 21 problems');field(0,'slope','8');click('Check answer');assert.equal(model.reviewStatus(model.reviewQuestions[0],state().rows[0]),'incorrect');field(0,'slope','3/2');click('Check answer');assert.equal(state().rows[0].checks,2);assert.equal(model.reviewCredit(model.reviewQuestions[0],state().rows[0]),1)
click('Part B 21 problems');click('9 ✓');assert.equal(state().rows[29].scratch.length,1);click('Review all answers');field(29,'equation','y=-1/2x+3');assert.equal(model.reviewStatus(model.reviewQuestions[29],state().rows[29]),'changed');field(29,'equation','y=-1/2x+4');assert.equal(model.reviewStatus(model.reviewQuestions[29],state().rows[29]),'correct')
click('Stop & save progress');let saved=nodes().find(n=>n.type==='./SaveReview');assert(saved);const restored=codec.loadReview(saved.props.code,who);assert.equal(restored.part,'B');assert.equal(restored.index,29);assert.equal(restored.screen,'review');assert.equal(restored.scrollY,440);saved.props.onClose();render();click('Reflect on my review');const report=nodes().find(n=>n.type==='@/components/practice/CompletionFlow');assert(report);assert(report.props.details[0].includes('not a test grade'));report.props.onReturn();render();assert.equal(state().screen,'review');assert.equal(state().rows[29].hints,3)
console.log('Passed actual Part A/B buttons and numbering, multicomponent answers, free retries, paid hints/floor, per-problem scratch, editable answer review, exact-place save, self-evaluation report, and safe return.')
// Read-only graph: integer points on the supplied line toggle; other points do nothing.
const graphModule={exports:{}},graphQ=model.reviewQuestions[12];let graphRow=model.freshReview().rows[12],graphTree,prevented=0,captured=0
class TestPoint{constructor(x,y){this.x=x;this.y=y}matrixTransform(){return this}}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/unit-1b-day-2-review/ReviewGraph.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:graphModule,exports:graphModule.exports,DOMPoint:TestPoint,require:n=>n==='react'?{useId:()=>':graph:'}:n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='@/lib/graph-coordinate-labels'?{coordinateLabels:()=>[]}:null})
function graphRender(){graphTree=graphModule.exports.default({q:graphQ,row:graphRow,onChange:r=>graphRow={...graphRow,...r}})}
function tapPoint(x,y){graphRender();const svg=nodes(graphTree).find(n=>n.type==='svg'),target={getScreenCTM:()=>({inverse:()=>({})}),setPointerCapture(){captured++}};svg.props.onPointerDown({preventDefault(){prevented++},pointerId:1,currentTarget:target});svg.props.onPointerUp({preventDefault(){prevented++},clientX:220+23*x,clientY:220-23*y,currentTarget:target});graphRender()}
tapPoint(0,-3);tapPoint(2,-2);assert.equal(graphRow.readPoints.length,2);tapPoint(1,-2.5);assert.equal(graphRow.readPoints.length,2);tapPoint(1,1);assert.equal(graphRow.readPoints.length,2);tapPoint(0,-3);assert.equal(graphRow.readPoints.length,1);assert.equal(captured,5);assert.equal(prevented,10)
const buttons=nodes(graphTree).filter(n=>n.props.role==='button');assert(buttons.length>2);buttons[0].props.onKeyDown({key:'Enter',preventDefault(){}});assert.equal(graphRow.readPoints.length,2)
for(const file of ['Practice.tsx','SaveReview.tsx','ReviewGraph.tsx']){const ast=ts.createSourceFile(file,fs.readFileSync('src/app/apps/unit-1b-day-2-review/'+file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);function visit(n){if(ts.isJsxText(n)){const s=n.text.replace(/\s+/g,' ').trim();if(/[A-Za-z]{3}/.test(s))assert.notEqual(spanishText(s),s,'Untranslated UI '+s)}ts.forEachChild(n,visit)}visit(ast)}
console.log('Passed integer-only graph taps, toggle, off-line rejection, keyboard access, touch-scroll prevention and visible-copy Spanish coverage.')
