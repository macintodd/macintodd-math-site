import {spanishText} from '../src/lib/beta-spanish.ts'
let reportLanguage='en'
import {scorecardRuntime} from './scorecard-test-runtime.mjs'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as model from '../src/lib/write-linear.ts'
import * as focus from '../src/lib/linear-focused.ts'
let index=0,tree,downloads=0,mode;const hooks=[],drawn=[],ctx={font:'',fillStyle:'',fillRect(){},measureText:s=>({width:s.length*15}),fillText:(s,x,y)=>drawn.push({s,x,y})},canvas={width:0,height:0,getContext:()=>ctx,toDataURL:()=> 'data:image/png;base64,c2NvcmU='}
const react={useState(initial){const i=index++;hooks[i]??={value:initial};return [hooks[i].value,v=>hooks[i].value=typeof v==='function'?v(hooks[i].value):v]}}
const jsx=(type,props,key)=>({type,props:props??{},key}),mod={exports:{}}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/write-linear-equation/FinalReport.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:mod,exports:mod.exports,document:{createElement:tag=>tag==='canvas'?canvas:{click:()=>downloads++}},require:n=>n==='@/components/practice/BilingualWidget'?{useWidgetLanguage:()=>({language:reportLanguage,translate:v=>reportLanguage==='es'?spanishText(v):v,setLanguage(){}})}:n==='@/lib/scorecard'?scorecardRuntime({createElement:()=>canvas}):n==='@/components/practice/ScoreImageActions'?{default:'image-actions',__esModule:true}:n==='@/components/practice/scorecard.css'?{}:n==='react'?react:n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='@/lib/linear-focused'?focus:model})
const s=model.newSession();s.level=3;s.phase='report';s.example=false;s.date='11/6/2026';s.stats=[3,3,5].map(n=>({correct:n,attempts:n,streak:n,best:n}));s.targets=[2,4,6];s.bonus=[2,4,6]
function render(){index=0;tree=mod.exports.default({session:s,name:'Maya Student',hour:'3',standaloneLevel:mode})}
function nodes(n=tree){if(Array.isArray(n))return n.flatMap(v=>nodes(v??null));return n&&typeof n==='object'?[n,...nodes(n.props.children??null)]:[]}
function text(n){return Array.isArray(n)?n.map(text).join(''):n&&typeof n==='object'?text(n.props.children):n==null||typeof n==='boolean'?'':String(n)}
function button(label){return nodes().find(n=>n.type==='button'&&(n.props['aria-label']===label||text(n)===label))}
function click(label){const b=button(label);assert(b&&!b.props.disabled,label);b.props.onClick();render()}
render();assert(button('Show my final scorecard').props.disabled);assert(!button('Download named scorecard'))
click('Confidence 4 of 5');assert(button('Show my final scorecard').props.disabled);click('Difficulty 3 of 5');assert(!button('Show my final scorecard').props.disabled)
click('Show my final scorecard');assert(text(tree).includes('4/5 — I can do it independently'));assert(text(tree).includes('3/5 — Just right'));assert(text(tree).includes('Maya Student'));assert(text(tree).includes('11/6/2026'));assert(text(tree).includes('11/10'));assert(text(tree).includes('Google Classroom'));assert(!button('Difficulty 3 of 5'))
click('Download named scorecard');assert.equal(downloads,1);const lines=drawn.map(v=>v.s).join(' ');for(const item of ['Maya Student','11/6/2026','FINAL SCORE: 11/10','4/5 - I can do it independently','3/5 - Just right','If you have the slope','How was the practice?'])assert(lines.includes(item),item);assert(drawn.every(v=>v.y<canvas.height));assert(nodes().some(n=>n.type==='img'&&n.props.alt.includes('confidence 4/5')))
click('Edit survey answers');assert(!nodes().some(n=>n.type==='img'));click('Difficulty 5 of 5');click('Show my final scorecard');click('Download named scorecard');assert(drawn.some(v=>v.s==='5/5 - Too difficult'));assert.equal(model.mathScore(s),10)
console.log('Passed two-question survey gating, named dated scorecard, survey answers in PNG, bonus total, safe layout height, edit invalidation and unchanged score.')

for(const level of [1,2,3,4]){mode=level;if(level===4)s.stats[2].correct=10;hooks.length=0;s.targets=[7];s.bonus=[7];drawn.length=0;render();click('Confidence 5 of 5');click('Difficulty 3 of 5');click('Show my final scorecard');assert(text(tree).includes(`Write the Linear Equation LEVEL ${level}`));assert.equal(nodes().filter(n=>n.type==='p'&&text(n).includes('scored checks')).length,1);click('Download named scorecard');assert(drawn.some(v=>v.s===`WRITE THE LINEAR EQUATION LEVEL ${level}`));assert(drawn.some(v=>v.s==='FINAL SCORE: 11/10'));assert(drawn.every(v=>v.y<canvas.height));if(level===4)assert(drawn.some(v=>v.s.includes('Given two points')))}
console.log('Passed activity-specific titles, single-level scores, 11/10 bonus totals and survey questions in all four standalone scorecard exports.');

reportLanguage='es';render();assert(!nodes().some(n=>n.type==='img'),'Changing language hides a previously generated English report');drawn.length=0;click('Download named scorecard');const spanishLines=drawn.map(v=>v.s).join(' ');for(const item of ['ESCRIBE LA ECUACIÓN LINEAL NIVEL 4','Maya Student','PUNTUACIÓN FINAL: 11/10','Escala:','Demasiado'])assert(spanishLines.includes(item)||item==='Demasiado'&&spanishLines.includes('Adecuado'),item);assert(!spanishLines.includes('Given two points'));assert(!spanishLines.includes('How was the practice?'));assert(drawn.every(v=>v.y<canvas.height));console.log('Passed Spanish activity/skill/survey/score image, preserved student name and math score, and language-change image invalidation.')
