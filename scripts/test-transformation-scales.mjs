import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import katex from 'katex'
import * as scales from '../src/lib/transformation-scales.ts'
import {spanishText} from '../src/lib/beta-spanish.ts'
const id={first:'Maya',last:'Student',hour:'3'}
for(const level of [1,2,3,4,5])for(let i=0;i<250;i++){
 const q=scales.scaleQuestion('notation',level,i),p=q.params;assert(p.a&&p.b);assert.equal(q.choices.length,4);assert.equal(q.choices[q.answer],p);assert(scales.scaleSteps(p).length>0)
 if(level===1){assert(p.a>0&&p.b>0);assert(!p.h&&!p.k);assert(p.a===1||p.b===1)}if(level===2)assert(!p.h&&!p.k);if(level===3)assert(p.b===1||p.h===0);if(level===4){assert.notEqual(p.b,1);assert.equal(p.k,0);assert(Number.isInteger(-p.b*p.h))}
 for(const tex of [q.tex,scales.scaleFactored(p),...scales.scaleSteps(p).filter(s=>s.value!==undefined).map(s=>scales.scaleNumberTex(s.value))])katex.renderToString(tex,{throwOnError:true})
 const steps=scales.scaleSteps(p),shift=steps.findIndex(s=>['left','right','up','down'].includes(s.kind));if(shift>=0)assert(steps.slice(shift).every(s=>['left','right','up','down'].includes(s.kind)))
 if(Math.abs(p.b)!==1)assert.equal(steps.find(s=>s.kind.startsWith('horizontal')).value,1/Math.abs(p.b))
 assert.equal(new Set(q.choices.map(c=>scales.scaleDescription(c))).size,4)
}
for(let i=0;i<700;i++){const q=scales.scaleQuestion('parents',1,i);assert(q.family);assert(!scales.sameScaleCurve(q.family,q.params,scales.scaleIdentity));for(let a=0;a<4;a++)for(let b=a+1;b<4;b++)assert(!scales.sameScaleCurve(q.family,q.choices[a],q.choices[b]));katex.renderToString(q.tex,{throwOnError:true})}
assert.equal(scales.scaleDescription({a:1,b:3,h:0,k:0}),'Horizontal shrink by a factor of 1/3')
assert.equal(scales.scaleDescription({a:-6,b:1,h:0,k:0}),'Reflect over the x-axis; then Vertical stretch by a factor of 6')
const example=scales.scaleQuestion('notation',4,1,true);assert.equal(example.tex,String.raw`g(x)=3f\left(4x+3\right)`);assert.equal(example.params.h,-.75);assert(scales.scaleDescription(example.params).includes('Translate left 3/4 units'))
assert.equal(scales.scaleEquation({a:5,b:1,h:0,k:0},'quadratic'),'g(x)=5x^{2}');assert.equal(scales.scaleEquation({a:1,b:5,h:0,k:0},'quadratic'),String.raw`g(x)=\left(5x\right)^{2}`)
for(const mode of ['notation','parents'])for(let level=1;level<=(mode==='parents'?1:5);level++){
 const p=scales.newScaleProgress();p.level=level;p.demo=false;p.hints=7;for(let i=0;i<level-1;i++)p.stats[i]={correct:5,attempts:7,streak:3,best:3};p.stats[level-1]={correct:4,attempts:6,streak:2,best:3}
 const code=scales.saveScale(mode,p,id);assert.deepEqual(scales.loadScale(mode,code,id),p);assert.throws(()=>scales.loadScale(mode,code,{...id,hour:'6'}));assert.throws(()=>scales.loadScale(mode==='notation'?'parents':'notation',code,id));assert.throws(()=>scales.loadScale(mode,code.slice(0,-1)+'!',id));assert(code.length<100)
 const goal=scales.scaleTarget(mode,level),s={correct:goal.correct-1,attempts:goal.correct,streak:goal.streak,best:goal.streak};assert(!scales.scaleDone(mode,level,s));s.correct++;s.attempts++;assert(scales.scaleDone(mode,level,s));s.best=goal.streak-1;s.streak=s.best;assert(!scales.scaleDone(mode,level,s))
}
// Exercise the actual UI handlers, including examples, missed checks, level gates, pause/return and reports.
const source=fs.readFileSync('src/app/apps/transformation-scales/Practice.tsx','utf8'),code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText
for(const mode of ['notation','parents']){
 let index=0,tree,confirmed=false,locale='en';const hooks=[],reports=[],jsx=(type,props)=>({type,props:props??{}}),mod={exports:{}},react={useState(initial){const i=index++;hooks[i]??={value:typeof initial==='function'?initial():initial};return[hooks[i].value,v=>hooks[i].value=typeof v==='function'?v(hooks[i].value):v]},useRef(value){const i=index++;return hooks[i]??(hooks[i]={current:value})}}
 vm.runInNewContext(code,{module:mod,exports:mod.exports,require:n=>n==='react'?react:n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='@/lib/transformation-scales'?scales:n==='@/lib/transformations'?{parentTex:()=> 'x^2',transformationNames:{absolute:'Absolute value',quadratic:'Quadratic',linear:'Linear',cubic:'Cubic',rational:'Rational',squareRoot:'Square root'}}:n==='@/components/practice/BilingualWidget'?{useWidgetLanguage:()=>({language:locale,translate:v=>locale==='es'?spanishText(v):v})}:n==='@/components/practice/PracticeReflection'?{default:n,usePracticeReflection:()=>({confirmed,lines:['YOUR REFLECTION','Confidence 5','Difficulty 3']})}:n==='@/lib/scorecard'?{createReportImage:(...args)=>{reports.push(args);return 'data:image/png;base64,local'}}:n==='@/components/Math'?{Math:'formula'}:{default:n,__esModule:true}})
 function render(){index=0;tree=mod.exports.default({mode})}function nodes(n=tree){return Array.isArray(n)?n.flatMap(v=>nodes(v)):n&&typeof n==='object'?[n,...nodes(n.props.children??null)]:[]}function text(n){return Array.isArray(n)?n.map(text).join(''):n&&typeof n==='object'?text(n.props.children):n==null||typeof n==='boolean'?'':String(n)}function click(label){const b=nodes().find(n=>n.type==='button'&&text(n)===label);assert(b&&!b.props.disabled,label);b.props.onClick();render()}function dismiss(){for(const n of nodes().filter(n=>n.type==='@/components/practice/SkillGoal'))n.props.onContinue();render()}function choose(correct=true){const q=hooks[4].value,buttons=nodes().filter(n=>n.type==='button'&&n.props['aria-pressed']!==undefined);buttons[correct?q.answer:(q.answer+1)%4].props.onClick();render();click('Check')}
 render();const inputs=nodes().filter(n=>n.type==='input');inputs[0].props.onChange({target:{value:id.first}});inputs[1].props.onChange({target:{value:id.last}});nodes().find(n=>n.type==='select').props.onChange({target:{value:id.hour}});render();nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});render()
 const count=mode==='parents'?1:5
 for(let level=1;level<=count;level++){
  assert(hooks[3].value.demo);assert.equal(hooks[3].value.level,level);assert.equal(hooks[3].value.stats[level-1].correct,0)
  choose(false);assert.equal(hooks[3].value.stats[level-1].attempts,0);click('Try the example again');choose();assert.equal(hooks[3].value.stats[level-1].correct,0);click('Review skill & begin practice →');assert(nodes().some(n=>n.type==='@/components/practice/SkillGoal'));dismiss()
  if(level===1){choose(false);assert.equal(hooks[3].value.stats[0].streak,0);click('Next problem →');click('Show a hint');assert.equal(hooks[3].value.hints,1);click('Stop & save progress');const dialog=nodes().find(n=>n.type==='@/components/practice/ResumeDialog');assert.equal(scales.loadScale(mode,dialog.props.code,id).hints,1);dialog.props.onClose();render()}
  const goal=scales.scaleTarget(mode,level);for(let i=0;i<goal.correct;i++){choose();assert.equal(hooks[3].value.stats[level-1].correct,i+1);if(i===4&&mode==='parents')assert(!scales.scaleDone(mode,1,hooks[3].value.stats[0]));dismiss();click('Next problem →')}
  assert.equal(hooks[8].value,'levelDone');click(level===count?'Finish & reflect →':'Next level: classroom example →')
 }
 assert.equal(hooks[8].value,'report');assert.equal(scales.scaleScore(mode,hooks[3].value),10);assert.equal(tree.type,'@/components/practice/CompletionFlow');assert.equal(tree.props.score,'10/10');assert.equal(tree.props.name,'Maya Student');assert.equal(tree.props.details.length,mode==='parents'?1:5);assert.equal(reports.length,0);
}
// Every new passage and instruction has a local Spanish translation (code selectors are excluded).
for(const file of ['src/app/apps/transformation-scales/Practice.tsx','src/lib/transformation-scales.ts']){const ast=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true);function visit(n){if(ts.isJsxText(n)){const s=n.text.replace(/\s+/g,' ').trim();if(/[A-Za-z]{3}/.test(s))assert.notEqual(spanishText(s),s,s)}ts.forEachChild(n,visit)}visit(ast)}
console.log('Passed 1250 notation questions, 700 unique parent-curve choices, exact reciprocal/factored shifts, LaTeX, threshold rules, five-level and parent UI flows, unscored demos, missed-check resets, resume identity/isolation, final reflection gating, translated reports and new-student reset.')
