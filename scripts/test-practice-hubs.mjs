import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import {practiceHubs} from '../src/content/practice-hubs.ts'
import {practiceApps} from '../src/content/practice-apps.ts'
assert.equal(practiceHubs.length,3)
for(const hub of practiceHubs){
 assert(fs.existsSync(`src/app/apps/${hub.slug}/page.tsx`))
 const slugs=hub.sections.flatMap(section=>section.items.map(item=>item.slug))
 assert.equal(new Set(slugs).size,slugs.length,`Duplicate activity in ${hub.slug}`)
 for(const slug of slugs){assert(practiceApps.some(app=>app.slug===slug),slug);assert(!slug.startsWith('beta/'))}
}
assert.deepEqual(practiceHubs[0].sections[0].items.map(item=>item.label),Array.from({length:6},(_,i)=>`Level ${i}`))
for(const slug of ['graph-linear','graph-standard','graph-standard-slope','graph-mixed'])assert(practiceHubs[1].sections.flatMap(s=>s.items).some(item=>item.slug===slug))
const testItems=practiceHubs[2].sections.flatMap(s=>s.items)
assert(testItems.some(item=>item.slug==='function-evaluation'))
assert(!testItems.some(item=>item.slug.includes('parallel')))
assert(testItems.find(item=>item.slug==='unit-1b-lesson-4-practice').description.includes('Problems 1–13'))
const jsx=(type,props)=>({type,props}),mod={exports:{}}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/PracticeHub.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:mod,exports:mod.exports,require:n=>n==='next/link'?{default:'a',__esModule:true}:n==='@/content/practice-hubs'?{practiceHubs}:n==='@/content/practice-apps'?{practiceApps}:n.endsWith('.css')?{}:{jsx,jsxs:jsx}})
function nodes(n){if(Array.isArray(n))return n.flatMap(nodes);if(!n||typeof n!=='object')return [];return [n,...nodes(n.props.children)]}
for(const hub of practiceHubs){const tree=nodes(mod.exports.default({hub}));const rows=tree.filter(n=>n.props.className==='practice-row');assert.equal(rows.length,hub.sections.flatMap(s=>s.items).length);for(const row of rows){assert(row.props.href.startsWith('/apps/'));assert(nodes(row).some(n=>n.props.className==='practice-row-description'));assert.equal(nodes(row).filter(n=>n.type==='a').length,1)}assert(!tree.some(n=>n.type==='img'))}
console.log('Passed: hub routes, Level 0–5 order, app references, graphing coverage, test scope, function evaluation, compact row render and no nested links.')
