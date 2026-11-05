import * as resumeCode from '../src/lib/resume-code.ts'
// Exercise actual component event handlers with deterministic hooks and a fake clock.
// This is a unit harness, not a browser/layout test.
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as model from '../src/lib/line-equation.ts'
import * as keypad from '../src/lib/mathboard/keypad.ts'
import * as slope from '../src/lib/slope.ts'
import * as pointModel from '../src/lib/point-slope.ts'
import * as introModel from '../src/lib/intro-point-slope.ts'
import * as reflectionModel from '../src/lib/point-slope-reflection.ts'
let generated,dropTarget=null,captured=0
const generator={...introModel,generateIntroPointSlope:(...args)=>{generated=introModel.generateIntroPointSlope(()=>0,args[1]??[]);return generated}}
let clock=0,index=0,tree,effects=[],nextFrame=0
const hooks=[],frames=new Map(),timers=new Map(),paint=[]
const equal=(a,b)=>a&&b&&a.length===b.length&&a.every((v,i)=>v===b[i])
const react={
 useState(initial){const id=index++;if(!hooks[id])hooks[id]={value:typeof initial==='function'?initial():initial};return [hooks[id].value,value=>{hooks[id].value=typeof value==='function'?value(hooks[id].value):value}]},
 useRef(initial){const id=index++;return hooks[id]||(hooks[id]={current:initial})},
 useCallback(fn,deps){const id=index++;if(!hooks[id]||!equal(hooks[id].deps,deps))hooks[id]={fn,deps};return hooks[id].fn},
 useEffect(fn,deps){const id=index++;if(!hooks[id]||!equal(hooks[id].deps,deps)){const old=hooks[id];hooks[id]={deps};effects.push(()=>{old?.cleanup?.();hooks[id].cleanup=fn()})}}
}
react.useLayoutEffect=react.useEffect
const jsx=(type,props,key)=>({type,props:props||{},key}),testModule={exports:{}}
const RealDate=Date
class ClockDate extends RealDate{constructor(...args){super(...(args.length?args:[Date.UTC(2026,9,31,15)+clock]))}}
const context=vm.createContext({Error,exports:testModule.exports,module:testModule,console,Date:ClockDate,Math,setTimeout:fn=>{const id=++nextFrame;timers.set(id,fn);return id},clearTimeout:id=>timers.delete(id),HTMLButtonElement:class{},performance:{now:()=>clock},requestAnimationFrame:fn=>{const id=++nextFrame;frames.set(id,fn);return id},cancelAnimationFrame:id=>frames.delete(id),document:{elementFromPoint:()=>dropTarget?{closest:()=>({dataset:{slot:dropTarget}})}:null,createElement:()=>({width:0,height:0,getContext:()=>new Proxy({fillText:text=>paint.push(text)},{get:(o,key)=>key in o?o[key]:()=>{}}),toDataURL:()=> 'data:image/png;base64,local-report'})},require:name=>name==='@/lib/goat-sound'?{prepareGoatSound(){}}:name==='@/components/practice/ResumeDialog'?{default:'resume-dialog',__esModule:true}:name==='@/lib/resume-code'?resumeCode:name==='react'?react:name==='react/jsx-runtime'?{jsx,jsxs:jsx}:name==='./ReflectionRating'?{default:'rating',__esModule:true}:name==='@/lib/point-slope-reflection'?reflectionModel:name==='./PointSlopeCelebration'?{default:'celebration',__esModule:true}:name==='next/link'?{default:'a',__esModule:true}:name==='@/lib/line-equation'?model:name==='@/lib/slope'?slope:name==='@/lib/point-slope'?pointModel:name==='@/lib/intro-point-slope'?generator:name==='./PointSlopeGraph'?{default:'graph',__esModule:true}:name==='../graph-linear/ScratchPad'?{default:'scratch-pad',__esModule:true}:name==='@/lib/mathboard/keypad'?keypad:name==='@/components/Math'?{Math:'formula'}:name==='@/components/Math'?{Math:'formula'}:(()=>{throw Error(name)})()})
const source=fs.readFileSync('src/app/apps/intro-point-slope/IntroPointSlope.tsx','utf8')
vm.runInContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,context)
function render(){index=0;effects=[];tree=testModule.exports.default();for(const effect of effects)effect();return tree}
function nodes(node){if(arguments.length===0)node=tree;if(Array.isArray(node))return node.flatMap(n=>nodes(n));if(!node||typeof node!=='object')return [];return [node,...nodes(node.props?.children??null)]}
function text(node){if(Array.isArray(node))return node.map(text).join('');if(node==null||typeof node==='boolean')return '';return typeof node==='object'?text(node.props?.children):String(node)}
function button(label){const found=nodes().find(n=>n.type==='button'&&text(n)===label);assert(found,'button '+label);assert(!found.props.disabled,label+' enabled');found.props.onClick({detail:0});render()}
function inputLabel(label,value){const wrapper=nodes().find(n=>n.type==='label'&&text(n).startsWith(label));assert(wrapper,label);const input=nodes(wrapper).find(n=>['input','select'].includes(n.type));input.props.onChange({target:{value}});render()}

function field(label,value){const n=nodes().find(n=>n.type==='input'&&n.props['aria-label']===label);assert(n,'field '+label);assert(!n.props.disabled&&!n.props.readOnly,'editable '+label);n.props.onChange({target:{value}});render()}

function submit(){nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});render()}
function quantity(q){return nodes().find(n=>n.type==='button'&&n.props['aria-label']===(q==='m'?'Choose slope':q==='x'?'Choose first coordinate':'Choose second coordinate'))}
function pointer(x,y){return {pointerId:1,clientX:x,clientY:y,preventDefault(){},currentTarget:{setPointerCapture(){captured++}}}}
function drag(q,slot){quantity(q).props.onPointerDown(pointer(10,10));render();quantity(q).props.onPointerMove(pointer(100,100));render();assert(nodes().some(n=>n.props.className==='intro-drag-ghost'));dropTarget=slot;quantity(q).props.onPointerUp(pointer(100,100));render();dropTarget=null;assert(!nodes().some(n=>n.props.className==='intro-drag-ghost'))}
function tapPlace(q,slot){quantity(q).props.onClick({detail:0});render();nodes().find(n=>n.props['data-slot']===slot).props.onClick();render()}
let expectedName='Demo Student'
function solve(miss=false,finishNow=false){
 const number=Number(nodes().find(n=>n.props.className==='intro-given').props['aria-label'].match(/\d+/)[0]);
 const colorOn=()=>tree.props.className.includes('intro-color-help');
 assert.equal(colorOn(),number<=2);
 assert(nodes().filter(n=>n.props['data-slot']).every(n=>text(n).includes(n.props['data-slot']==='m'?'m':n.props['data-slot']==='x1'?'x_1':'y_1')));
 const toggle=nodes().find(n=>n.type==='button'&&text(n)==='Color help off');
 assert.equal(!!toggle,number>=3);
 if(number>=3){button('Color help off');assert(colorOn());button('Color help on');assert(!colorOn());button('Color help off');assert(colorOn())}

 if(miss){drag('m','m');drag('x','y1');drag('y','x1');submit();assert(text(tree).includes('Not quite.'));assert(!nodes().some(n=>n.props['aria-label']==='Distributed constant'));drag('x','x1');drag('y','y1')}
 else{tapPlace('m','m');tapPlace('x','x1');tapPlace('y','y1')}
 submit();
 const scratch=()=>nodes().find(n=>n.type==='scratch-pad');const scratchKey=scratch().key;assert.equal(scratch().props.height,320);
 button('Scratch work');assert.equal(nodes().find(n=>n.props.className==='intro-scratch-view').props.hidden,false);assert.equal(nodes().find(n=>n.props.className==='intro-answer-tools').props.hidden,true);
 let focused=false,scrolled=false;const entry=nodes().find(n=>n.props['aria-label']==='Distributed x coefficient');entry.props.ref({focus(){focused=true},scrollIntoView(){scrolled=true}});
 button('Back to answers');assert(focused&&scrolled);entry.props.ref(null);assert.equal(scratch().key,scratchKey);assert.equal(nodes().find(n=>n.props.className==='intro-answer-tools').props.hidden,false);
 assert(text(tree).includes('Correct placement'));assert.equal(colorOn(),number<=2);assert(!nodes().some(n=>n.props['aria-label']==='Change sign'));if(number>=3){button('Color help off');assert(colorOn())}field('Distributed x coefficient',`${generated.line.rise}/${generated.line.run}`);field('Distributed constant',miss?'999':String(-generated.line.rise/generated.line.run*generated.point.x));submit();if(miss){assert(!nodes().some(n=>n.props['aria-label']==='Final equation'));field('Distributed constant',String(-generated.line.rise/generated.line.run*generated.point.x));submit()}
 assert.equal(colorOn(),number<=2);field('Final equation','');button('y');button('=');assert.equal(nodes().find(n=>n.props['aria-label']==='Final equation').props.value,'y=');field('Final equation',miss?'y=999':'y='+model.equationText(generated.line));submit();if(miss){field('Final equation','y='+model.equationText(generated.line));submit()}assert(text(tree).includes('Gold star!'));assert(!nodes().some(n=>n.type==='celebration'));assert(nodes().some(n=>String(n.props.className).includes('intro-reward-glow')));assert.equal(timers.size,1);for(const [id,fn] of timers){timers.delete(id);fn()}render();assert(!nodes().some(n=>String(n.props.className).includes('intro-reward-glow')));const splash=nodes().find(n=>n.type==='celebration');assert(splash);const earned=Number(nodes().find(n=>n.props.className==='intro-stars').props['aria-label'].match(/\d+/)[0]);assert.equal(splash.props.canSkip,earned>=5);const currentStreak=Number(text(nodes().find(n=>n.props.className==='intro-progress')).match(/Streak (\d+)/)[1]);assert.equal(splash.props.showSkier,currentStreak===3);assert.equal(splash.props.showGoat,currentStreak===5);assert.equal(splash.props.name,expectedName);if(finishNow){assert(splash.props.canFinish);splash.props.onFinish()}else splash.props.onDismiss();render();assert(!nodes().some(n=>n.type==='celebration'))
}
render();inputLabel('First name','Demo');inputLabel('Last name','Student');inputLabel('Class hour','2');submit();assert(text(tree).includes('Demo Student'));assert(!nodes().some(n=>n.type==='graph'))
quantity('m').props.onPointerDown(pointer(10,10));render();quantity('m').props.onPointerMove(pointer(70,80));render();quantity('m').props.onPointerCancel();render();assert(!nodes().some(n=>n.props.className==='intro-drag-ghost'));assert(nodes().filter(n=>n.props['data-slot']).every(n=>text(n).endsWith('drop here')))
assert(nodes().find(n=>n.type==='button'&&text(n)==='Stop & save progress').props.disabled)
solve(true);button('Stop & save progress');const savedResume=nodes().find(n=>n.type==='resume-dialog');assert(savedResume);assert.equal(savedResume.props.name,'Demo Student');const resume=savedResume.props.code;assert(resume);savedResume.props.onExit();render();inputLabel('First name','Demo');inputLabel('Last name','Student');inputLabel('Class hour','8');field('Resume code',resume);function resumeSubmit(){nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){},nativeEvent:{submitter:{value:'resume'}}});render()}resumeSubmit();assert(text(tree).includes('hour does not match'),text(tree));inputLabel('Class hour','2');resumeSubmit();assert(text(tree).includes('Progress restored'));assert(text(tree).includes('Demo Student'));for(let i=0;i<10;i++){solve();if(i<9)button('Next problem →')}
assert(captured>=6);button('Submit 10/10 & view results');assert(text(tree).includes('Congratulations, Demo!'));assert(text(tree).includes('next slide'));button('Next: questions & results →');assert(text(tree).includes('Demo Student'));assert(text(tree).includes('Completed:'));assert(nodes().find(n=>n.type==='button'&&text(n)==='Create results image').props.disabled)
function rate(question,value){nodes().find(n=>n.type==='rating'&&n.props.question===question).props.onChange(value);render()}
rate(0,4);assert(nodes().find(n=>n.type==='button'&&text(n)==='Create results image').props.disabled);rate(1,3);assert(text(tree).includes('10/10'));button('Create results image');assert(paint.some(t=>t==='Demo Student'));assert(paint.some(t=>t.includes('Class hour 2')));assert(paint.some(t=>t.includes('Completed:')));assert(paint.some(t=>t.includes('Mostly on my own')));assert(paint.some(t=>t.includes('Just right')));rate(1,5);assert(!nodes().some(n=>n.type==='img'));assert(text(tree).includes('10/10'));button('Create results image');assert(paint.some(t=>t.includes('Too difficult')));button('Back');button('Next: questions & results →');assert.equal(nodes().find(n=>n.type==='rating'&&n.props.question===1).props.rating,5)
button('Next student / new session');assert(!nodes().some(n=>n.type==='img'));assert(!text(tree).includes('Demo Student'));expectedName='New Student';inputLabel('First name','New');inputLabel('Last name','Student');inputLabel('Class hour','4');submit();for(let i=0;i<5;i++){solve(false,i===4);if(i<4)button('Next problem →')}assert(text(tree).includes('Congratulations, New!'));button('Next: questions & results →');assert(text(tree).includes('5/10'));assert(nodes().filter(n=>n.type==='rating').every(n=>n.props.rating===null));assert(!nodes().some(n=>n.type==='img'))
console.log('Passed intro flow plus congratulations/reflection slides, export gating, unchanged score, dated named report with ratings, stale-image invalidation, back navigation and clean next-student ratings.')
