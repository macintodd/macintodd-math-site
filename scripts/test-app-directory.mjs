import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import {practiceApps,appCategories} from '../src/content/practice-apps.ts'
import {lessons} from '../src/content/lessons.ts'
for(const app of practiceApps){assert(fs.existsSync(`src/app/apps/${app.slug}/page.tsx`));assert(app.courses.length);for(const ref of app.lessons)assert(lessons.some(l=>l.course===ref.course&&l.slug===ref.slug))}
const apps=practiceApps.map(a=>({...a,lessons:a.lessons.map(l=>({key:`${l.course}/${l.slug}`,course:l.course,href:`/courses/${l.course}/${l.slug}`,label:l.slug}))}))
let index=0,tree;const hooks=[]
const react={useState(initial){const id=index++;if(!hooks[id])hooks[id]={value:initial};return [hooks[id].value,v=>hooks[id].value=typeof v==='function'?v(hooks[id].value):v]}}
const jsx=(type,props)=>({type,props}),testModule={exports:{}}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/AppDirectory.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:testModule,exports:testModule.exports,require:n=>n==='react'?react:n==='next/link'?{default:'a',__esModule:true}:n==='@/content/practice-apps'?{appCategories}:{jsx,jsxs:jsx}})
function render(){index=0;tree=testModule.exports.default({apps})}
function nodes(n){if(arguments.length===0)n=tree;if(Array.isArray(n))return n.flatMap(x=>nodes(x));if(!n||typeof n!=='object')return [];return [n,...nodes(n.props.children??null)]}
function filter(i,value){nodes().filter(n=>n.type==='select')[i].props.onChange({target:{value}});render()}
function count(){return nodes().filter(n=>n.type==='article').length}
render();assert.equal(count(),practiceApps.length);filter(0,'algebra-2');filter(2,'algebra-2/function-notation');assert.equal(count(),1);filter(1,'Puzzles');assert.equal(count(),0);filter(0,'precalculus');assert.equal(nodes().filter(n=>n.type==='select')[2].props.value,'');assert.equal(count(),1);nodes().find(n=>n.type==='button').props.onClick();render();assert.equal(count(),practiceApps.length);filter(2,'precalculus/linear-equations-two-variables');assert.equal(count(),6)
console.log('Passed: All app routes, valid lesson references, class/lesson/category filters, empty matches, class-change reset and clear filters.')
