import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as React from 'react'
import * as jsx from 'react/jsx-runtime'
import {renderToStaticMarkup} from 'react-dom/server'
import * as content from '../src/content/practice-apps.ts'
import {lessons} from '../src/content/lessons.ts'
import * as directory from '../src/lib/practice-directory.ts'
for(const app of content.practiceApps){assert(fs.existsSync(`src/app/apps/${app.slug}/page.tsx`));for(const ref of app.lessons)assert(lessons.some(lesson=>lesson.course===ref.course&&lesson.slug===ref.slug))}
const {parseDirectoryCategory,filterDirectoryApps,defaultCategory}=directory
assert.equal(defaultCategory,'Functions')
for(const invalid of [undefined,'','%zz','unrecognized'])assert.equal(parseDirectoryCategory(invalid),'Functions')
for(const category of [...content.appCategories,'all','beta'])assert.equal(parseDirectoryCategory(encodeURIComponent(category)),category)
for(const category of content.appCategories)assert.deepEqual(filterDirectoryApps(content.practiceApps,category).map(app=>app.slug),content.practiceApps.filter(app=>app.category===category&&!app.slug.startsWith('beta/')).map(app=>app.slug))
assert.equal(filterDirectoryApps(content.practiceApps,'all').length,content.practiceApps.length)
assert(filterDirectoryApps(content.practiceApps,'beta').every(app=>app.slug.startsWith('beta/')))
assert(filterDirectoryApps(content.practiceApps,'Functions','precalculus','PARENT').every(app=>app.courses.includes('precalculus')&&`${app.title} ${app.description}`.toLowerCase().includes('parent')))
assert.equal(filterDirectoryApps(content.practiceApps,'Functions','','not-a-math-widget').length,0)
const apps=content.practiceApps.map(app=>({...app,lessons:app.lessons.map(ref=>({key:`${ref.course}/${ref.slug}`,course:ref.course,href:`/courses/${ref.course}/${ref.slug}`,label:ref.slug}))}))
const testModule={exports:{}}
const modules={'react':React,'react/jsx-runtime':jsx,'@/content/practice-apps':content,'@/lib/practice-directory':directory,'./category-preference':{subscribeCategory:()=>()=>{},readCategory:()=>defaultCategory,rememberCategory:()=>{}},'./WidgetCard':{__esModule:true,default:({app})=>jsx.jsx('article',{children:jsx.jsx('a',{href:`/apps/${app.slug}`,children:app.title})})}}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/AppDirectory.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,{module:testModule,exports:testModule.exports,require(name){assert(name in modules,name);return modules[name]}})
for(const category of ['Functions','beta','all']){
 const html=renderToStaticMarkup(jsx.jsx(testModule.exports.default,{apps,initialCategory:category}))
 assert.equal((html.match(/<article>/g)??[]).length,filterDirectoryApps(content.practiceApps,category).length)
 assert(html.includes('Beta apps')&&html.includes('All categories'))
 if(category==='Functions')assert(!html.includes('href="/apps/beta/'))
}
let cookie='';const listeners=new Set(),window={addEventListener:(name,fn)=>listeners.add(fn),removeEventListener:(name,fn)=>listeners.delete(fn),dispatchEvent:()=>listeners.forEach(fn=>fn())}
function preference(blocked=false){const doc={};Object.defineProperty(doc,'cookie',{get:()=>cookie,set:value=>{if(blocked)throw Error('cookies blocked');assert(value.includes('Path=/apps')&&value.includes('SameSite=Lax')&&value.includes('Secure'));cookie=value.split(';')[0]}});const mod={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/category-preference.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{module:mod,exports:mod.exports,require:()=>directory,document:doc,window,location:{protocol:'https:'},Event});return mod.exports}
const store=preference();assert.equal(store.readCategory(),'Functions');let notified=0;const unsubscribe=store.subscribeCategory(()=>notified++);store.rememberCategory('Transformations');assert.equal(store.readCategory(),'Transformations');assert.equal(notified,1);unsubscribe();assert.equal(preference().readCategory(),'Transformations');const blocked=preference(true);blocked.rememberCategory('beta');assert.equal(blocked.readCategory(),'beta')
console.log('Passed category defaults/validation, All/Beta isolation, class/search filters, SSR category views, preference-cookie persistence and cookie-blocked session fallback.')
