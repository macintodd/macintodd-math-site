import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import katex from 'katex'
import * as related from '../src/lib/related-lines.ts'
import * as linear from '../src/lib/write-linear.ts'
import * as point from '../src/lib/point-slope.ts'
import * as keypad from '../src/lib/mathboard/keypad.ts'
for(const topic of ['parallel','perpendicular'])for(let i=0;i<1500;i++){const p=related.relatedProblem(topic,i),m=p.given.rise/p.given.run,n=p.answer.rise/p.answer.run;assert.equal(topic==='parallel'?n:m*n,topic==='parallel'?m:-1);assert(related.onLine(p.answer,p.point));assert(!related.onLine(p.given,p.point));assert(Number.isInteger(p.point.x)&&Number.isInteger(p.point.y));assert.equal(linear.checkFinal(`y=${n}x+${p.answer.y}`,{line:p.answer,point:p.point}),'correct');assert(related.slopeCorrect(`${p.answer.rise}/${p.answer.run}`,p.answer));katex.renderToString(point.pointSlopeTex(p.answer,p.point),{throwOnError:true})}
for(const topic of ['parallel','perpendicular'])for(let round=0;round<2;round++){const line=related.discoveryLine(topic,round),m=related.targetSlope(line,topic),a={x:8,y:-8},b={x:a.x+m.run,y:a.y+m.rise};assert(related.relationMatches(line,a,b,topic));assert(!related.relationMatches(line,a,{x:a.x,y:a.y+1},topic));assert(!related.relationMatches(line,a,{x:a.x+1,y:a.y},topic))}
const identity={first:'Test',last:'Student',hour:'3'}
for(const topic of ['parallel','perpendicular'])for(const phase of ['intro','discover','conclude','lesson','practice','finished'])for(const demo of [true,false]){const c={...related.newRelatedCheckpoint(),topic,phase,demo,round:1,index:5,parallel:topic==='parallel'?0:6,perpendicular:0,firstTry:0,checks:4},code=related.saveRelated(c,identity);assert.deepEqual(related.loadRelated(code,identity),c);assert.throws(()=>related.loadRelated(code,{...identity,hour:'4'}));assert.throws(()=>related.loadRelated(code.slice(0,-1)+'!',identity))}
const source=fs.readFileSync('src/app/apps/parallel-perpendicular/Tutorial.tsx','utf8'),compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText
let index=0,tree;const hooks=[],jsx=(type,props)=>({type,props:props??{}}),mod={exports:{}},exportsLog=[]
const react={useState(initial){const i=index++;hooks[i]??={value:typeof initial==='function'?initial():initial};return [hooks[i].value,v=>hooks[i].value=typeof v==='function'?v(hooks[i].value):v]},useRef(v){const i=index++;return hooks[i]??(hooks[i]={current:v})}}
vm.runInNewContext(compiled,{module:mod,exports:mod.exports,requestAnimationFrame:fn=>fn(),require:n=>n==='react'?react:n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='@/lib/related-lines'?related:n==='@/lib/write-linear'?linear:n==='@/lib/point-slope'?point:n==='@/lib/mathboard/keypad'?keypad:n==='@/lib/scorecard'?{createReportImage:(...args)=>{exportsLog.push(args);return 'data:image/png;base64,local'}}:n==='@/components/practice/PracticeReflection'?{__esModule:true,default:n,usePracticeReflection:()=>({confirmed:true,lines:['Confidence 5','Difficulty 3']})}:n==='@/components/Math'?{Math:'formula'}:{__esModule:true,default:n}})
function render(){index=0;tree=mod.exports.default()}
function nodes(n=tree){return Array.isArray(n)?n.flatMap(v=>nodes(v??null)):n&&typeof n==='object'?[n,...nodes(n.props.children??null)]:[]}
function text(n){return Array.isArray(n)?n.map(text).join(''):n&&typeof n==='object'?text(n.props.children):n==null||typeof n==='boolean'?'':String(n)}
function click(label){const b=nodes().find(n=>n.type==='button'&&text(n)===label);assert(b&&!b.props.disabled,label);b.props.onClick();render()}
function input(label,value){const el=nodes().find(n=>n.props['aria-label']===label&&n.type==='input');assert(el,label);el.props.onChange({target:{value}});render()}
function dismiss(){const goal=nodes().find(n=>n.type==='@/components/practice/SkillGoal');if(goal){goal.props.onContinue();render()}}
function graph(){return nodes().find(n=>n.type==='./DiscoveryGraph')}
render();let fields=nodes().filter(n=>n.type==='input');fields[0].props.onChange({target:{value:'Test'}});fields[1].props.onChange({target:{value:'Student'}});nodes().find(n=>n.type==='select').props.onChange({target:{value:'3'}});render();nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});render()
for(const topic of ['parallel','perpendicular']){
 assert.equal(hooks[3].value.topic,topic);click('Explore on the graph →')
 for(let round=0;round<2;round++){
  const line=graph().props.line,a={x:0,y:4},m=related.targetSlope(line,topic),b={x:m.run,y:4+m.rise}
  graph().props.onPoint({x:0,y:line.y});render();assert.equal(graph().props.points.length,0)
  graph().props.onPoint(a);render();graph().props.onPoint({x:0,y:5});render();click('Yes — check my construction');assert(text(tree).includes('Not '+topic+' yet'))
  graph().props.onPoint({x:0,y:5});render();assert.equal(graph().props.points.length,1);graph().props.onPoint(b);render();click('Yes — check my construction');input('Original slope',String(line.rise/line.run));click('Check slope');input('Second line slope',String(m.rise/m.run));click('Check slope');click(round===0?'Try a second construction →':'What can we conclude? →')
 }
 const quiz=nodes().filter(n=>n.type==='button'&&n.props['aria-pressed']!==undefined);quiz[1].props.onClick();render();assert(!nodes().some(n=>n.type==='button'&&text(n)==='Now write the equation →'));nodes().filter(n=>n.type==='button'&&n.props['aria-pressed']!==undefined)[0].props.onClick();render();click('Now write the equation →');click('Walk through an example →');dismiss()
 for(let i=-1;i<6;i++){
  const p=hooks[4].value,support=related.supportFor(Math.max(0,i),i===-1)
  if(support!=='independent'){
   if(i===0){input('Original slope','99');click('Check slope');assert(text(tree).includes('Read the coefficient'))}
   input('Original slope',String(p.given.rise/p.given.run));click('Check slope');input('Slope of the new line',String(p.answer.rise/p.answer.run));click('Check slope')
   if(support==='guided'){input('Your y-intercept b',String(p.answer.y));click('Check y-intercept')}
  }
  input('Your complete equation: y = …',`y=${p.answer.rise}/${p.answer.run}x+${p.answer.y}`);click('Check equation');assert(text(tree).includes('You found the right line'));for(const f of nodes().filter(n=>n.type==='formula'))katex.renderToString(f.props.children,{throwOnError:true});click(i===-1?'Review skill & begin practice →':i===5?topic==='parallel'?'Explore perpendicular lines →':'Finish & reflect →':'Next problem →');dismiss()
 }
}
assert.equal(hooks[3].value.phase,'finished');assert.equal(hooks[3].value.parallel,6);assert.equal(hooks[3].value.perpendicular,6);assert.equal(hooks[3].value.firstTry,10);assert.equal(related.relatedScore(hooks[3].value),10);click('Create my results image');assert(exportsLog[0][2].includes('Final score: 10/10 completion mastery'));assert(exportsLog[0][2].includes('Confidence 5'));click('New student / session');assert.equal(hooks[3].value,null);assert.equal(hooks[0].value,'')
console.log('Passed 3000 generated lines, parallel/negative-reciprocal geometry, resume checkpoints/identity, two constructions per topic, removal/retry, conclusion checks, unscored demos, faded support, twelve completed equations, first-try accuracy and named reflected report.')
// The real graph snaps both axes to integers, ignores outside taps, supports keyboard selection,
// expands at edge points, and marks perpendicular intersections.
let graphTree,calls=[];const graphMod={exports:{}},graphJsx=(type,props)=>({type,props:props??{}})
import * as labels from '../src/lib/graph-coordinate-labels.ts'
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/parallel-perpendicular/DiscoveryGraph.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:graphMod,exports:graphMod.exports,DOMPoint:class{constructor(x,y){this.x=x;this.y=y}matrixTransform(){return this}},require:n=>n==='react'?{useId:()=>':test:'}:n==='react/jsx-runtime'?{jsx:graphJsx,jsxs:graphJsx}:n==='@/lib/related-lines'?related:labels})
const line=related.discoveryLine('parallel',0);graphTree=graphMod.exports.default({line,points:[],relation:'parallel',onPoint:p=>calls.push(p)})
const graphNodes=(n=graphTree)=>Array.isArray(n)?n.flatMap(v=>graphNodes(v??null)):n&&typeof n==='object'?[n,...graphNodes(n.props.children??null)]:[],svg=graphNodes().find(n=>n.type==='svg'),event=(x,y)=>({clientX:x,clientY:y,preventDefault(){},currentTarget:{getScreenCTM:()=>({inverse:()=>({})})}})
svg.props.onPointerDown(event(258,217));assert(Number.isInteger(calls[0].x)&&Number.isInteger(calls[0].y));svg.props.onPointerDown(event(0,0));assert.equal(calls.length,1);graphNodes().find(n=>n.props['aria-label']==='Point (2, 3)').props.onKeyDown({key:'Enter',preventDefault(){}});assert.equal(calls[1].x,2);assert.equal(calls[1].y,3)
graphTree=graphMod.exports.default({line,points:[{x:8,y:-8}],relation:'parallel',onPoint:p=>calls.push(p)});assert(graphNodes().some(n=>n.props['aria-label']==='Point (12, 12)'))
const perpLine=related.discoveryLine('perpendicular',0),perpSlope=related.targetSlope(perpLine,'perpendicular');graphTree=graphMod.exports.default({line:perpLine,points:[{x:0,y:4},{x:perpSlope.run,y:4+perpSlope.rise}],relation:'perpendicular'});assert(graphNodes().some(n=>n.type==='text'&&n.props.children==='90°'))
console.log('Passed integer graph snapping/keyboard input, outside-tap rejection, expanded edge graph and a mathematically placed right-angle marker.')
