import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as jsx from 'react/jsx-runtime'
import {renderToStaticMarkup} from 'react-dom/server'
import {practiceApps} from '../src/content/practice-apps.ts'
const testModule={exports:{}}
const modules={'react/jsx-runtime':jsx,'next/link':{__esModule:true,default:({children,...props})=>jsx.jsx('a',{...props,children})},'@/components/StudySketch':{SketchFrame:()=>jsx.jsx('svg',{'aria-hidden':true})},'./AppPreview':{AppPreview:({slug})=>jsx.jsx('div',{'data-preview':slug})}}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/WidgetCard.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,{module:testModule,exports:testModule.exports,require(name){assert(name in modules,name);return modules[name]}})
for(const app of practiceApps){
 const lessonLinks=app.lessons.map(ref=>({key:ref.slug,href:`/courses/${ref.course}/${ref.slug}`,label:ref.slug,course:ref.course}))
 const html=renderToStaticMarkup(jsx.jsx(testModule.exports.default,{app,lessonLinks}))
 assert(html.includes(`href="/apps/${app.slug}"`));assert(html.includes(`data-preview="${app.slug}"`))
 assert(html.includes(`data-kind="${app.activityType==='demonstration'?'demonstration':'practice'}"`))
 for(const link of lessonLinks)assert(html.includes(`href="${link.href}"`))
 assert(html.includes(lessonLinks.length?'Details &amp; lesson links':'Details'))
 let depth=0
 for(const match of html.matchAll(/<\/?a(?:\s[^>]*|)>/g)){depth+=match[0].startsWith('</')?-1:1;assert(depth>=0&&depth<=1,'No nested anchors')}
 assert.equal(depth,0)
}
assert.equal(practiceApps.filter(app=>app.activityType==='demonstration').length,2)
console.log('Passed all 47 shared widget cards: correct preview/launch links, explicit practice/demo styles, matching lesson links, detail labels and no nested anchors.')
