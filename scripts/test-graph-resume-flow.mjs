import {reflectionRuntime} from './reflection-test-runtime.mjs'
import {mockScorecard} from './scorecard-test-runtime.mjs'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as resume from '../src/lib/resume-code.ts'
import * as graph from '../src/lib/graph-line.ts'
import * as standard from '../src/lib/standard-form.ts'
import * as convert from '../src/lib/standard-slope.ts'
import * as equation from '../src/lib/line-equation.ts'
import * as slope from '../src/lib/slope.ts'
for(const mode of ['intercepts','conversion','original']){
 let index=0,tree,generated;const hooks=[],props=mode==='intercepts'?{standard:true}:mode==='conversion'?{convert:true}:{}
 const react={useState(initial){const id=index++;if(!hooks[id])hooks[id]={value:initial};return [hooks[id].value,v=>hooks[id].value=typeof v==='function'?v(hooks[id].value):v]},useRef(initial){const id=index++;return hooks[id]||(hooks[id]={current:initial})}}
 const jsx=(type,props)=>({type,props:props??{}}),testModule={exports:{}}
 vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/graph-linear/GraphPractice.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:testModule,exports:testModule.exports,Date,Math,Error,require:n=>n==='@/components/practice/PracticeReflection'?reflectionRuntime(react):n==='@/lib/scorecard'?mockScorecard(typeof paint==='undefined'?[]:paint):['@/components/practice/ReportIdentity','@/components/practice/ScoreImageActions'].includes(n)?{default:'report-presentation',__esModule:true}:n==='react'?react:n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='next/link'?{default:'a',__esModule:true}:n==='@/components/practice/ResumeDialog'?{default:'resume-dialog',__esModule:true}:n==='@/lib/resume-code'?resume:n==='@/lib/graph-line'?graph:n==='@/lib/slope'?slope:n==='@/lib/standard-slope'?convert:n==='@/lib/line-equation'?equation:n==='@/lib/standard-form'?{...standard,generateStandardEquation:(...args)=>{generated=standard.generateStandardEquation(()=>.51,args[1]??[]);return generated}}:n==='./TapGraph'?{default:'graph',__esModule:true}:n==='./SlopeEntries'?{default:'slope-entries',__esModule:true}:['./ScratchPad','./InterceptWork','./SlopeWork'].includes(n)?{default:n,__esModule:true}:(()=>{throw Error(n)})()})
 function render(){index=0;tree=testModule.exports.default(props)}
 function nodes(n){if(arguments.length===0)n=tree;if(Array.isArray(n))return n.flatMap(x=>nodes(x));if(!n||typeof n!=='object')return [];return [n,...nodes(n.props.children??null)]}
 function text(n){if(Array.isArray(n))return n.map(text).join('');return n&&typeof n==='object'?text(n.props.children):n==null||typeof n==='boolean'?'':String(n)}
 function button(label){const n=nodes().find(n=>n.type==='button'&&text(n)===label);assert(n,label);assert(!n.props.disabled,label);n.props.onClick();render()}
 function entry(label,value){const n=nodes().find(n=>n.type==='label'&&text(n).startsWith(label));nodes(n).find(n=>n.type==='input'||n.type==='select').props.onChange({target:{value}});render()}
 function submit(resuming=false){nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){},nativeEvent:{submitter:{value:resuming?'resume':'new'}}});render()}
 function field(label,value){nodes().find(n=>n.type==='input'&&n.props['aria-label']===label).props.onChange({target:{value}});render()}
 function identity(){entry('First name','Demo');entry('Last name','Student');entry('Class hour','6')}
 function solve(wrong=false){if(mode==='conversion'){nodes().find(n=>n.type==='slope-entries').props.onChange({m:wrong?'999':slope.fraction(generated.line.rise,generated.line.run),b:String(generated.line.y)});render()}else{field('X-intercept x-coordinate',wrong?'999':String(generated.xIntercept));field('X-intercept y-coordinate','0');field('Y-intercept x-coordinate','0');field('Y-intercept y-coordinate',String(generated.yIntercept))}button('Graph');for(const p of [{x:generated.xIntercept,y:0},{x:0,y:generated.yIntercept}]){nodes().find(n=>n.type==='graph').props.onSelect(p);render()}button('Graph line');button('Check graph')}
 function stopAndReturn(){button('Stop & save progress');const dialog=nodes().find(n=>n.type==='resume-dialog');assert(dialog);assert.equal(dialog.props.name,'Demo Student');const code=dialog.props.code;dialog.props.onExit();render();identity();entry('Resume code',code);submit(true);assert(text(tree).includes('Progress restored'));return code}
 render();identity();submit();if(mode==='original'){assert(!nodes().some(n=>n.type==='button'&&text(n)==='Stop & save progress'));continue}
 assert(nodes().find(n=>n.type==='button'&&text(n)==='Stop & save progress').props.disabled);solve();assert(text(tree).includes('Correct!'));const code=stopAndReturn();assert.deepEqual(graph.graphProgress(resume.decodeGraphResume(mode,code,{first:'Demo',last:'Student',hour:'6'})),graph.graphProgress([true]));assert(text(tree).includes('Graph 2'));assert(!nodes().find(n=>n.type==='graph').props.drawn);assert.equal(nodes().find(n=>n.type==='graph').props.selected.length,0)
 solve(true);assert(text(tree).includes('Not quite.'));const afterMiss=stopAndReturn();assert.deepEqual(graph.graphProgress(resume.decodeGraphResume(mode,afterMiss,{first:'Demo',last:'Student',hour:'6'})),graph.graphProgress([true,false]));assert(text(tree).includes('Graph 3'))
 for(let i=0;i<9;i++){solve();if(i<8)button('Next equation →')}
 assert(text(tree).includes('Goal reached!'));assert(text(tree).includes('Final score: 10/10'));button('Next student / new session');assert(!text(tree).includes('Demo Student'));assert(nodes().filter(n=>n.type==='input').every(n=>n.props.value===''))
}
console.log('Passed both standard-form widget flows: locked save until checked, correct/missed graph save and return, new equation with preserved count/streak/score, full-credit completion and clean new student; original slope-intercept widget has no added resume controls.')
