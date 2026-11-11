import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import {spanishText} from '../src/lib/beta-spanish.ts'
import {mockScorecard} from './scorecard-test-runtime.mjs'
const jsx=(type,props)=>({type,props:props??{}}),mod={exports:{}};let route=''
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/ActivitySkillIntro.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:mod,exports:mod.exports,require:n=>n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='next/navigation'?{usePathname:()=>'/apps/'+route}:n==='react'?{useState:v=>[v,()=>{}],useSyncExternalStore:()=>false}:{__esModule:true,default:n}})
const slugs=['write-linear-equation',...Array.from({length:5},(_,i)=>`write-linear-equation-level-${i+1}`),'line-equations','point-slope','intro-point-slope'];for(const slug of [...slugs,'write-linear-equation/teacher','parallel-perpendicular']){route=slug;const tree=mod.exports.default({children:'practice'});assert.equal(tree.props.spanishFirst,true,slug)}
route='2048';assert.notEqual(mod.exports.default({children:'game'}).props.spanishFirst,true,'Unrelated routes unaffected')
assert(fs.readFileSync('src/app/apps/horizontal-vertical/page.tsx','utf8').includes('<BilingualWidget spanishFirst>'))
for(const slug of [...slugs,'horizontal-vertical']){const info=mockScorecard().reportInfo(slug),q=`How independently can you ${info.skill.charAt(0).toLowerCase()+info.skill.slice(1).replace(/\.$/,'')}?`;assert.notEqual(spanishText(q),q,slug);assert.notEqual(spanishText(info.title),info.title,slug)}
for(const value of ['y = -2/3x + 5','(3, -2)','Maya Student','WL1-ABCD-2345'])assert.equal(spanishText(value),value)
console.log('Passed combined equation app, standalone Levels 0–5, teacher demo, m/b and point-slope writing apps: shared clean-English / Spanish-tap-English mode, translated final reflections and titles, preserved math/name/code, unrelated routes unchanged.')
