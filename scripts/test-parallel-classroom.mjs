import * as sketchFeedback from '../src/lib/parallel-sketch-feedback.ts'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import katex from 'katex'
import * as tools from '../src/lib/parallel-graph-tools.ts'
import * as lib from '../src/lib/parallel-lesson.ts'
import {editAnswer} from '../src/lib/mathboard/keypad.ts'
import {coordinateLabels} from '../src/lib/graph-coordinate-labels.ts'
const expected=[-6,-1,2,-2,-14/3,7/3,7,4,-3,2,11/2,-3/2]
assert.equal(lib.parallelLesson.length,12)
for(const [i,q] of lib.parallelLesson.entries()){assert(Math.abs(q.answer.b-expected[i])<1e-8);assert(Math.abs(q.answer.m*q.point.x+q.answer.b-q.point.y)<1e-8);assert(q.given.m!==0&&Number.isFinite(q.answer.m));assert.equal(lib.inspectLessonLine(q,q.answer).correct,true);assert(Math.abs(q.relation==='parallel'?q.answer.m-q.given.m:q.answer.m*q.given.m+1)<1e-8);for(const s of [lib.lineTex(q.given),lib.lineTex(q.answer),lib.pointSlopeLesson(q),lib.distributedLesson(q)])katex.renderToString(s,{throwOnError:true})}
assert(lib.readLessonLine('hello').format);assert(lib.readLessonLine('y=2(x-3)').format);assert.equal(lib.readLessonLine('y=2(x-3)').line.b,-6);assert(!lib.readLessonLine('y=(4/6)x-6').format);assert(lib.inspectLessonLine(lib.parallelLesson[0],lib.readLessonLine('y=4/6x-6').line).correct)
const source=fs.readFileSync('src/app/apps/beta/parallel-perpendicular-lesson/Lesson.tsx','utf8'),jsx=(type,props)=>({type,props:props??{}}),reflection={confirmed:false,lines:['Confidence 5/5','Difficulty 3/5']},translate=v=>v
function instance(teacher=false){let index=0,tree,effects=[],report=[];const hooks=[],mod={exports:{}};const react={useState(initial){const i=index++;hooks[i]??={value:typeof initial==='function'?initial():initial};return [hooks[i].value,v=>hooks[i].value=typeof v==='function'?v(hooks[i].value):v]},useRef(v){const i=index++;return hooks[i]??(hooks[i]={current:v})},useEffect(fn,deps){const i=index++,old=hooks[i];if(!old||deps.some((v,j)=>v!==old.deps[j])){old?.cleanup?.();hooks[i]={deps};effects.push(()=>{hooks[i].cleanup=fn()})}}};vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:mod,exports:mod.exports,requestAnimationFrame:fn=>fn(),require:n=>n==='react'?react:n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='@/lib/parallel-lesson'?lib:n==='@/lib/parallel-graph-tools'?tools:n==='./useEquationAnimation'?{useEquationAnimation:(q,enabled)=>enabled?lib.lessonAnimationFrame(q,lib.lessonAnimationDuration):null}:n==='@/lib/mathboard/keypad'?{editAnswer}:n==='@/components/Math'?{Math:'formula'}:n==='@/components/practice/BilingualWidget'?{useWidgetLanguage:()=>({language:'en',translate})}:n==='@/components/practice/PracticeReflection'?{__esModule:true,default:n,usePracticeReflection:()=>reflection}:n==='@/lib/scorecard'?{createReportImage:(...args)=>{report=args;return 'data:image/png;base64,test'}}:{__esModule:true,default:n}});function render(){index=0;tree=mod.exports.default({teacher});const pending=effects;effects=[];pending.forEach(fn=>fn())}function nodes(n=tree){return Array.isArray(n)?n.flatMap(v=>nodes(v??null)):n&&typeof n==='object'?[n,...nodes(n.props.children??null)]:[]}function text(n){return Array.isArray(n)?n.map(text).join(''):n&&typeof n==='object'?text(n.props.children):n==null||typeof n==='boolean'?'':String(n)}function click(label){const b=nodes().find(n=>n.type==='button'&&text(n)===label);assert(b&&!b.props.disabled,label);b.props.onClick();render()}function input(label,value){const el=nodes().find(n=>n.type==='input'&&n.props['aria-label']===label);if(!el){assert(!/numerator|denominator|Red line equation/.test(label),'Missing field '+label+' at problem '+hooks[3].value?.index);const [n,d='1']=value.split('/');input(label+' numerator',n);input(label+' denominator',d);return}assert(!el.props.disabled,label);el.props.onChange({target:{value}});render()}render();return {hooks,mod,render,nodes,text,click,input,get tree(){return tree},get report(){return report}}}
const s=instance(),teacher=instance(true);assert.equal(teacher.hooks[3].value.index,0);assert(!teacher.nodes().some(n=>n.type==='input'));const welcome=s.nodes().filter(n=>n.type==='input');welcome[0].props.onChange({target:{value:'Test'}});welcome[1].props.onChange({target:{value:'Student'}});s.nodes().find(n=>n.type==='select').props.onChange({target:{value:'3'}});s.render();s.nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});s.render()
function record(){return s.hooks[3].value.records[s.hooks[3].value.index]}
function graph(){return s.nodes().find(n=>n.type==='./LessonGraph').props}
function feedback(){const q=lib.parallelLesson[s.hooks[3].value.index];const tree=s.mod.exports.LineFeedback({q,record:record()});for(const f of s.nodes(tree).filter(n=>n.type==='formula'))katex.renderToString(f.props.children,{throwOnError:true});return s.text(tree)}
function equation(value){s.input('Red line equation · y = mx + b',value);s.click(record().attempts?`Check attempt ${record().attempts+1}`:'Check equation');const warning=s.nodes().find(n=>n.type==='./EquationFormatWarning');if(warning){warning.props.onClose();s.render()}return warning}
function acknowledgeGraph(){
 assert.equal(graph().graphicalCalloutName,'Test');
 assert(!s.nodes().some(n=>n.type==='@/components/practice/SkillGoal'));
 assert(!s.nodes().some(n=>n.props['aria-label']==='Red line equation · y = mx + b'));
 assert.equal(graph().continueLabel,graph().q.kind==='triple'&&!record().redCorrect?'Continue to slope checks →':'Now write the equation →');
 graph().onAcknowledgeGraph();
 s.render();
 assert.equal(graph().graphicalCalloutName,null);
 if(graph().q.kind!=='triple'||record().redCorrect)assert(s.nodes().some(n=>n.props.className==='lp-algebraic-prompt'));
}
function arrow(label){return s.nodes().find(n=>n.type==='button'&&n.props['aria-label']===label)}
assert(arrow('Previous problem').props.disabled);
assert(arrow('Next problem').props.disabled);
arrow('Next problem').props.onClick();s.render();assert.equal(graph().q.id,'P1');
assert(!s.nodes().some(n=>n.props['aria-label']==='Red line equation · y = mx + b'));graph().onSketchChange({a:{x:0,y:-6},b:{x:9,y:0}});s.render();graph().onSketchCheck(true);s.render();acknowledgeGraph();const both=equation('not an equation');assert(both.props.missing.prefix&&both.props.missing.x);const noY=equation('2/3x-6');assert(noY.props.missing.prefix&&!noY.props.missing.x);const noX=equation('y=2/3-6');assert(noX.props.missing.x&&!noX.props.missing.prefix);assert.equal(record().attempts,0);assert.equal(graph().line,null)
equation('y=2/3x-4');assert(!s.nodes().some(n=>n.props['data-correct']));assert.equal(record().attempts,1);assert.equal(record().solved,false);assert.equal(graph().line.b,-4);assert(feedback().includes('The slope is correct.'));assert(feedback().includes('y=0'));assert(feedback().includes('instead of'));assert(!graph().correct)
equation('y=-3/2x+7');assert(feedback().includes('Your line is perpendicular'));assert(feedback().includes('passes through'));assert.equal(record().attempts,2)
equation('y=2/3x-6');assert(record().solved);assert(s.nodes().some(n=>n.props['data-correct']&&n.props.className==='lp-input equation'));assert(graph().correct);assert(feedback().includes('Solved on attempt 3'));s.click('Stop & save');const checkpoint=s.nodes().find(n=>n.type==='@/components/practice/ResumeDialog');const resumed=lib.loadLesson(checkpoint.props.code,'Test','Student','3');assert.equal(resumed.index,1);assert.equal(resumed.records[0].attempts,3);assert.throws(()=>lib.loadLesson(checkpoint.props.code,'Other','Name','3'));assert.throws(()=>lib.loadLesson(checkpoint.props.code+'!', 'Test','Student','3'));checkpoint.props.onClose();s.render();s.click('Next →')
for(let i=1;i<12;i++){
 assert.equal(s.hooks[3].value.index,i);const q=lib.parallelLesson[i]
 if(q.kind==='triple'){
  if(q.id==='P2a'){graph().onSketchChange({a:{x:3,y:1},b:{x:6,y:3}});s.render();graph().onSketchCheck(true);s.render();acknowledgeGraph()}
  if(q.id==='P2a'){const label='What is the slope of the blue line?';s.input(label+' numerator','2');s.nodes().find(n=>n.props['aria-label']===label+' numerator').props.onFocus();s.render();let prevented=false;s.nodes().find(n=>n.props['aria-label']===label+' numerator').props.onKeyDown({key:'/',preventDefault(){prevented=true}});s.render();assert(prevented);assert.equal(s.hooks[15].value,'den');s.nodes().find(n=>n.type==='./LessonTools').props.onKey('3');s.render();assert.equal(record().blue,'2/3')}
  assert(!s.nodes().some(n=>n.props['aria-label']==='Red line equation · y = mx + b'))
  if(q.id==='P2a'||q.id==='T6a'){s.input('What is the slope of the blue line?','99');s.click('Check blue slope');assert(!record().blueCorrect)}
  s.input('What is the slope of the blue line?',lib.lessonNumber(q.given.m));s.click('Check blue slope');assert.equal(lib.lessonGroupCount(s.hooks[3].value,q.slide),i===1||i===7?0:(i===2||i===8)?1:2)
  s.input('What is the slope of the red line supposed to be?',lib.lessonNumber(q.answer.m));s.click('Check red slope');assert(graph().arrows);assert.equal(graph().line,null);assert(!record().solved)
 }
 if(q.slide===5){s.click('Reveal quarter turn');assert.equal(s.hooks[6].value,1);graph().onSketchChange({a:{x:0,y:7},b:{x:6,y:-2}});s.render();graph().onSketchCheck(true);s.render();acknowledgeGraph()}
 if(q.id==='P3'){
  assert(graph().drawing);
  assert(s.text(s.tree).includes('crosses the y-axis between grid marks'));
  const segment={a:q.point,b:{x:7,y:0},tapped:true};
  assert(lib.checkLessonSegment(q,segment).correct);
  graph().onSketchChange(segment);s.render();
  graph().onSketchCheck(true);s.render();
  assert(record().sketchChecked);
  acknowledgeGraph();
  assert(!record().solved);
  assert(arrow('Next problem').props.disabled);
  arrow('Previous problem').props.onClick();s.render();
  assert.equal(graph().q.id,'P2c');
  assert(record().solved);
  assert(!arrow('Next problem').props.disabled);
  arrow('Next problem').props.onClick();s.render();
  assert.equal(graph().q.id,'P3');
  assert.deepEqual(graph().sketch,segment);
  assert(graph().sketchChecked);
  assert(arrow('Next problem').props.disabled);
 }
 if(q.kind==='exact'){assert.equal(graph().drawing,q.id==='P3');equation('y=99x+99');assert.equal(graph().line.m,99);assert(feedback().includes('Both the slope and the point'))}
 if(q.id==='P4'){
  assert(!s.nodes().some(n=>n.type==='./LessonGraph'));
  assert(!s.nodes().some(n=>n.type==='./PointSlopePlacement'));
  s.input('What is the slope of the given line?','1');
  s.click('Check blue slope');
  assert(!record().blueCorrect);
  assert(!record().hadSlopeMiss);
  s.input('What is the slope of the given line?','-2/3');
  s.click('Check blue slope');
  s.input('What is the slope of the new line?','-2/3');
  s.click('Check red slope');
  let placement=s.nodes().find(n=>n.type==='./PointSlopePlacement');
  assert(placement&&!placement.props.checked);
  assert(!s.nodes().some(n=>n.props['aria-label']==='Red line equation · y = mx + b'));
  placement.props.onPlace({m:'m',x1:'x',y1:'y'});s.render();
  placement=s.nodes().find(n=>n.type==='./PointSlopePlacement');
  placement.props.onCheck(true,'Correct');s.render();
  assert(record().pointSlopeChecked);
  assert.equal(record().attempts,0);
  assert(arrow('Next problem').props.disabled);
 }
 if(q.id==='P2a'||q.id==='T6a'){equation(`y=${lib.lessonNumber(q.answer.m)}x+99`);assert(!record().solved);assert.equal(lib.lessonGroupCount(s.hooks[3].value,q.slide),0)}
 equation(`y=${lib.lessonNumber(q.answer.m)}x${q.answer.b<0?'-':'+'}${lib.lessonNumber(Math.abs(q.answer.b))}`);assert(record().solved);if(q.id!=='P4')assert(graph().correct);if(q.id==='P2a')assert.equal(graph().animation,null);if(q.id==='P2b')assert.equal(graph().animation.phase,'done');if(q.id==='P2c'||q.id==='T6c')assert.equal(lib.lessonGroupCount(s.hooks[3].value,q.slide),3)
 s.click(i===11?'Finish & reflect →':'Next →')
}
assert.equal(s.hooks[4].value,'report');assert.equal(s.tree.type,'@/components/practice/CompletionFlow');assert.equal(s.tree.props.score,'10/10');assert.equal(s.tree.props.name,'Test Student');assert.equal(s.tree.props.stats.find(s=>s.label==='Completed problems').value,12);assert.equal(s.tree.props.details.length,12);assert.equal(s.report.length,0);assert.equal(teacher.hooks[3].value.index,0,'Student retries never move teacher display');
const complete=s.hooks[3].value,loaded=lib.loadLesson(lib.saveLesson(complete,'Test','Student','3'),'Test','Student','3');assert(loaded.records.every(v=>v.solved));assert(Math.abs(loaded.completedAt-complete.completedAt)<60000)
for(let i=0;i<12;i++){teacher.nodes().find(n=>n.type==='select').props.onChange({target:{value:String(i)}});teacher.render();assert.equal(teacher.hooks[3].value.index,i);assert.equal(teacher.hooks[5].value,0);for(let step=0;step<4;step++)teacher.click('Reveal next step');assert.equal(teacher.nodes().find(n=>n.type==='./LessonGraph').props.correct,true);const work=teacher.mod.exports.TeacherWork({q:lib.parallelLesson[i],reveal:4});for(const f of teacher.nodes(work).filter(n=>n.type==='formula'))katex.renderToString(f.props.children,{throwOnError:true})}
// Inspect real graph output: graphable wrong entries have dashed actual geometry, exact success has a burst, algebra slides ignore drawing.
const graphSource=fs.readFileSync('src/app/apps/beta/parallel-perpendicular-lesson/LessonGraph.tsx','utf8'),gmod={exports:{}};let gi=0;const gh=[];vm.runInNewContext(ts.transpileModule(graphSource,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:gmod,exports:gmod.exports,DOMPoint:class{constructor(x,y){this.x=x;this.y=y}matrixTransform(){return this}},require:n=>n==='react'?{useEffect(){},useId:()=> 'test',useRef:v=>{const i=gi++;return gh[i]??(gh[i]={current:v})},useState:v=>{const i=gi++;gh[i]??={value:v};return[gh[i].value,x=>gh[i].value=typeof x==='function'?x(gh[i].value):x]}}:n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='@/lib/parallel-lesson'?lib:n==='@/lib/parallel-graph-tools'?tools:n==='@/lib/graph-coordinate-labels'?{coordinateLabels}:n==='@/lib/parallel-sketch-feedback'?sketchFeedback:{Math:'formula'}})
let tree=gmod.exports.default({q:lib.parallelLesson[0],line:{m:2/3,b:-4},correct:false,drawing:false});assert(s.nodes(tree).some(n=>n.type==='path'&&n.props.strokeDasharray==='10 6'&&!n.props['data-correct']));assert(s.text(tree).includes('overlaps'));assert(!s.nodes(tree).some(n=>n.props.className==='lp-refined-sparks'));s.nodes(tree).find(n=>n.type==='svg').props.onPointerDown({});assert.equal(gh[0].value,null)
gi=0;tree=gmod.exports.default({q:lib.parallelLesson[6],line:lib.parallelLesson[6].answer,correct:true,drawing:false});assert(s.nodes(tree).some(n=>n.props.className==='lp-refined-sparks'));assert(s.nodes(tree).some(n=>n.props.className==='lp-submitted-path'&&n.props['data-correct']));assert(s.nodes(tree).some(n=>n.type==='path'&&n.props.stroke==='#216b47'))
// Straight-line rubber band: the first snapped endpoint stays fixed while the second changes.
gh.length=0;let changed=null,checked=null;const drawProps={q:lib.parallelLesson[0],line:null,correct:false,drawing:true,onSketchChange:value=>changed=value,onSketchCheck:value=>checked=value};function gr(){gi=0;tree=gmod.exports.default(drawProps)}gr();const ev=(x,y)=>({clientX:250+x*20,clientY:250-y*20,pointerId:4,isPrimary:true,preventDefault(){},stopPropagation(){},currentTarget:{getScreenCTM:()=>({inverse:()=>({})}),setPointerCapture(){}}});let svg=s.nodes(tree).find(n=>n.type==='svg');svg.props.onPointerDown(ev(.1,-5.9));gr();svg=s.nodes(tree).find(n=>n.type==='svg');svg.props.onPointerMove(ev(2.2,-1.8));gr();assert.deepEqual(JSON.parse(JSON.stringify(changed)),{a:{x:0,y:-6},b:{x:2,y:-2}});svg=s.nodes(tree).find(n=>n.type==='svg');svg.props.onPointerMove(ev(8.9,.2));svg.props.onPointerUp(ev(8.9,.2));gr();assert.deepEqual(JSON.parse(JSON.stringify(changed)),{a:{x:0,y:-6},b:{x:9,y:0}});assert(!s.nodes(tree).some(n=>n.type==='input'||n.props.onAdjust),'Sketching needs no slope editor');s.nodes(tree).find(n=>n.type==='button'&&s.text(n)==='Check line').props.onClick();gr();assert.equal(checked,true);drawProps.line=lib.parallelLesson[0].answer;drawProps.correct=true;drawProps.drawing=false;gr();assert(!s.nodes(tree).some(n=>n.props.className==='lp-submitted-path'),'Extend the accepted student sketch; do not duplicate it with an answer line');assert(s.nodes(tree).some(n=>n.props.className==='lp-student-segment'&&n.props['data-correct']));assert(s.nodes(tree).find(n=>n.props.className==='lp-student-segment').props.d.includes('M10 '),'Accepted sketch extends beyond the visible grid');
drawProps.correct=false;drawProps.line={m:2/3,b:-4};gr();assert(s.nodes(tree).some(n=>n.props.className==='lp-submitted-path'&&n.props.strokeDasharray==='10 6'),'Show a mistaken algebraic answer even after a correct sketch');drawProps.correct=true;drawProps.line=lib.parallelLesson[0].answer;gr();
const extendedPoint=s.nodes(tree).find(n=>n.props['aria-label']==='Point (-3, -8)');assert(extendedPoint,'Integer points are available on the extended sketch');extendedPoint.props.onPointerDown({preventDefault(){},stopPropagation(){}});gr();assert(s.nodes(tree).some(n=>n.type==='text'&&n.props.className==='lp-selected-coordinate'&&n.props.fontSize===24&&s.text(n)==='(-3, -8)'));assert(s.nodes(tree).some(n=>n.type==='circle'&&n.props.fill==='#efbd36'&&n.props.r==='8'));assert(s.nodes(tree).some(n=>n.props.className==='lp-selected-point'&&n.props.r==='9'));
// Taps replace one snapped point and draw through the gold point, including vertical lines.
gh.length=0;drawProps.line=null;drawProps.correct=false;drawProps.drawing=true;gr();
function gesture(start,end=start){
 const grid=s.nodes(tree).find(n=>n.type==='svg');
 grid.props.onPointerDown(start);grid.props.onPointerUp(end);gr();
}
const currentSketch=()=>JSON.parse(JSON.stringify(changed));
const pointMarkers=()=>s.nodes(tree).filter(n=>n.props.className==='lp-sketch-point');
gesture(ev(3.08,-4.08),ev(3.14,-4.16));
assert.deepEqual(currentSketch(),{a:{x:6,y:-2},b:{x:3,y:-4},tapped:true});
assert.equal(pointMarkers().length,1);
assert.equal(pointMarkers()[0].props.cx,310);
assert.match(s.nodes(tree).find(n=>n.props.className==='lp-student-segment').props.d,/^M450 /);
gesture(ev(6,5));
assert.deepEqual(currentSketch(),{a:{x:6,y:-2},b:{x:6,y:5},tapped:true});
assert.equal(pointMarkers().length,1);
assert.equal(pointMarkers()[0].props.cy,150);
assert.equal(s.nodes(tree).find(n=>n.props.className==='lp-student-segment').props.d,'M370 450L370 50');
gesture(ev(6,-2)); // A duplicate of the given point cannot define a new line.
assert.equal(currentSketch().b.y,5);
gesture(ev(1,1),ev(4,5));
assert.deepEqual(currentSketch(),{a:{x:1,y:1},b:{x:4,y:5}});
assert.equal(pointMarkers().length,2);
gesture(ev(9,0));
s.nodes(tree).find(n=>n.type==='button'&&s.text(n)==='Check line').props.onClick();
gr();assert.equal(checked,true,'A tapped line uses the existing Check line flow');
// Slide 1 diagnostics replace only the graph, then Retry restores the exact drawing viewport.
gh.length=0;drawProps.line=null;drawProps.correct=false;drawProps.drawing=true;gr();let targetLabel=s.nodes(tree).find(n=>n.type==='text'&&s.text(n).startsWith('P ('));assert.equal(targetLabel.props.fontSize,'22');assert.equal(targetLabel.props.x,386);assert.equal(targetLabel.props.y,317);
for(const [a,b,reason] of [[{x:0,y:9},{x:10,y:9},'point'],[{x:6,y:-8},{x:6,y:8},'direction']]){let grid=s.nodes(tree).find(n=>n.type==='svg');grid.props.onPointerDown(ev(a.x,a.y));gr();grid=s.nodes(tree).find(n=>n.type==='svg');grid.props.onPointerUp(ev(b.x,b.y));gr();s.nodes(tree).find(n=>n.type==='button'&&s.text(n)==='Check line').props.onClick();gr();assert(s.nodes(tree).some(n=>n.props.reason===reason),'Diagnostic reason '+reason);assert(s.text(tree).includes('Read the axis labels for scale'));drawProps.correct=true;drawProps.drawing=false;drawProps.line=lib.parallelLesson[0].answer;gr();assert(!s.nodes(tree).some(n=>n.props.reason),'Teacher reveal replaces the diagnostic');drawProps.correct=false;drawProps.drawing=true;drawProps.line=null;gr();const retry=s.nodes(tree).find(n=>n.type==='button'&&s.text(n)==='Retry drawing');assert(retry&&!retry.props.disabled);retry.props.onClick();gr();assert.equal(gh[0].value,null);assert(s.nodes(tree).some(n=>n.type==='svg'&&n.props.viewBox==='0 0 500 500'));assert(!s.nodes(tree).some(n=>n.props.reason));}
// All other sketch problems switch to the same diagnostic view and Retry clears it.
for(const q of lib.parallelLesson.slice(1).filter(q=>q.kind==='draw'||q.kind==='triple'||q.id==='P3')){
 gh.length=0;drawProps.q=q;gr();
 for(const [a,b,reason] of [[{x:0,y:9},{x:10,y:9},'point'],[{x:q.point.x,y:-9},{x:q.point.x,y:9},'direction']]){
  gesture(ev(a.x,a.y),ev(b.x,b.y));
  s.nodes(tree).find(n=>n.type==='button'&&s.text(n)==='Check line').props.onClick();
  gr();
  assert(s.nodes(tree).some(n=>n.props.reason===reason),q.id+' '+reason);
  assert(s.nodes(tree).find(n=>n.type==='button'&&s.text(n)==='Check line').props.disabled);
  s.nodes(tree).find(n=>n.type==='button'&&s.text(n)==='Retry drawing').props.onClick();
  gr();
  assert(s.nodes(tree).some(n=>n.type==='svg'));
  assert(!s.nodes(tree).some(n=>n.props.reason));
 }
}
drawProps.q=lib.parallelLesson[0];
assert.equal(lib.checkLessonSegment(lib.parallelLesson[0],{a:{x:0,y:-2},b:{x:6,y:-2}}).reason,'direction');assert.equal(lib.checkLessonSegment(lib.parallelLesson[0],{a:{x:0,y:-6},b:{x:3,y:-4}}).reason,'point');assert.equal(lib.checkLessonSegment(lib.parallelLesson[0],{a:{x:0,y:-6},b:{x:9,y:0}}).correct,true);
// Deterministic animation order and impact timing for all six short graph problems.
for(const q of lib.parallelLesson.filter(q=>q.kind==='triple')){const frames=[0,1800,3300,4700,5200,7600].map(t=>lib.lessonAnimationFrame(q,t));assert.deepEqual(frames.map(f=>f.phase),['intercept','rise','run','point','line','done']);assert.equal(frames[0].hitTarget,false);assert.equal(frames[5].hitTarget,true);const parts=lib.lessonSlopeParts(q.answer.m);assert.equal(frames[3].riseCount,Math.abs(parts.rise));assert.equal(frames[3].runCount,parts.run);const clipped=lib.visibleLessonSegment(q.answer),fraction=(q.point.x-clipped.a.x)/(clipped.b.x-clipped.a.x),impact=5100+2500*fraction;assert(!lib.lessonAnimationFrame(q,impact-1).hitTarget);assert(lib.lessonAnimationFrame(q,impact+1).hitTarget)}
const equationModule={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/beta/parallel-perpendicular-lesson/AnimatedEquation.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:equationModule,exports:equationModule.exports,require:n=>n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='@/lib/parallel-lesson'?lib:n==='@/lib/parallel-graph-tools'?tools:{Math:'formula'}});const aq=lib.parallelLesson[1];for(const [time,value] of [[0,'1'],[2000,'2'],[3500,'3']]){const readout=equationModule.exports.default({q:aq,animation:lib.lessonAnimationFrame(aq,time)}),flash=s.nodes(readout).find(n=>n.props.className==='lp-number-flash');assert(flash);assert(s.text(flash).includes(value))}
// Run the actual animation hook against a controlled RAF clock, including reduced motion and cleanup.
const animationModule={exports:{}},ah=[],callbacks=new Map();let ai=0,effectJobs=[],clock=0,enabled=true,reduced=false,rafId=0,frameResult;
const animationReact={useState(initial){const i=ai++;ah[i]??={value:initial};return[ah[i].value,value=>ah[i].value=typeof value==='function'?value(ah[i].value):value]},useEffect(fn,deps){const i=ai++,old=ah[i];if(!old||deps.some((v,j)=>v!==old.deps[j])){old?.cleanup?.();ah[i]={deps};effectJobs.push(()=>{ah[i].cleanup=fn()})}}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/beta/parallel-perpendicular-lesson/useEquationAnimation.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:animationModule,exports:animationModule.exports,performance:{now:()=>clock},window:{matchMedia:()=>({matches:reduced})},requestAnimationFrame:fn=>{callbacks.set(++rafId,fn);return rafId},cancelAnimationFrame:id=>callbacks.delete(id),require:n=>n==='react'?animationReact:lib});
function animationRender(){ai=0;frameResult=animationModule.exports.useEquationAnimation(lib.parallelLesson[1],enabled);const jobs=effectJobs;effectJobs=[];jobs.forEach(fn=>fn())}function advanceClock(t){clock=t;const [id,fn]=callbacks.entries().next().value;callbacks.delete(id);fn(t);animationRender()}
animationRender();assert.equal(frameResult.phase,'intercept');advanceClock(1800);assert.equal(frameResult.phase,'rise');advanceClock(3400);assert.equal(frameResult.phase,'run');enabled=false;animationRender();assert.equal(callbacks.size,0);await Promise.resolve();enabled=true;reduced=true;animationRender();advanceClock(clock);assert.equal(frameResult.phase,'done');assert(frameResult.hitTarget);assert.equal(callbacks.size,0);
console.log('Passed all 12 fixed equations and notes IDs, integer-snapped fixed-endpoint drawing, P1 graph callouts, P3 optional sketch, bounded review arrows, and Check line gates, stacked slope entries with slash navigation, requested P1 overlap/perpendicular/correct sequence, valid and format retries, separate slope gates, both three-problem checkpoints, exact fractional slides, teacher-independent navigation/reveals, dashed submitted lines, intercept/rise/run/point/line animation timing and coefficient flashes, mature impact sparks with persistent glow, right-angle/burst gating, no algebra drawing, compact saved progress and completion time, required reflections and named export.')
// Restore graph-local state directly; external gestures cannot mutate it.
const remoteGraph={problemId:lib.parallelLesson[0].id,segment:{a:{x:6,y:-2},b:{x:9,y:0},tapped:true},selected:[{x:3,y:-4}],check:null,zoomProgress:null};
gi=0;tree=gmod.exports.default({...drawProps,isExternalDisplay:true,mirror:remoteGraph});
assert(s.text(tree).includes('(3, -4)'));
assert(s.nodes(tree).some(n=>n.props.className==='lp-student-segment'));
assert.equal(pointMarkers().length,1);
assert.equal(pointMarkers()[0].props.cx,430);
const before=JSON.stringify(gh);s.nodes(tree).find(n=>n.type==='svg').props.onPointerDown(ev(1,2));assert.equal(JSON.stringify(gh),before);
gi=0;tree=gmod.exports.default({...drawProps,line:null,correct:false,isExternalDisplay:true,mirror:{...remoteGraph,check:{correct:false,reason:'point'},zoomProgress:.45}});
const camera=s.nodes(tree).find(n=>n.props.mirroredProgress===.45);assert(camera.props.isExternalDisplay);assert.equal(camera.props.onProgressChange,undefined);
console.log('Passed actual graph restoration of tapped line, pinned coordinates and diagnostic zoom, with read-only gestures and no child feedback.');
