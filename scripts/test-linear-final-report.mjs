import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as model from '../src/lib/write-linear.ts'
import * as focus from '../src/lib/linear-focused.ts'
const jsx=(type,props)=>({type,props:props??{}}),mod={exports:{}}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/write-linear-equation/FinalReport.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:mod,exports:mod.exports,require:n=>n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='@/lib/linear-focused'?focus:n==='@/lib/write-linear'?model:{__esModule:true,default:n}})
const s=model.newSession();s.level=3;s.phase='report';s.example=false;s.date='11/11/2026, 9:15 AM CST';s.stats=[3,3,5].map(n=>({correct:n,attempts:n,streak:n,best:n}));s.targets=[2,4,6];s.bonus=[2,4,6]
for(const level of [undefined,1,2,3,4]){if(level===4)s.stats[2].correct=10;const tree=mod.exports.default({session:s,name:'Maya Student',hour:'3',standaloneLevel:level});assert.equal(tree.type,'@/components/practice/CompletionFlow');assert.equal(tree.props.slug,level?`write-linear-equation-level-${level}`:'write-linear-equation');assert.equal(tree.props.name,'Maya Student');assert.equal(tree.props.completedAt,s.date);assert.equal(tree.props.hour,'3');assert.equal(tree.props.details.length,level?2:4);const expected=(level?focus.focusedScore(s,level):model.mathScore(s))+(level?focus.focusedBonus(s):model.bonusPoint(s));assert.equal(tree.props.score,`${Math.round(expected*10)/10}/10`);assert.equal(tree.props.stats.length,3);assert(tree.props.stats.find(s=>s.label==='Best streak'));}
console.log('Passed combined and standalone reports: shared reflection flow, correct activity identifier, original scores/bonus, completion timestamp and counts.')
