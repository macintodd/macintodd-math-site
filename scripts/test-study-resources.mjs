import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as jsx from 'react/jsx-runtime'
import {renderToStaticMarkup} from 'react-dom/server'
import * as content from '../src/content/lessons.ts'
import * as units from '../src/content/units.ts'
import * as vocabulary from '../src/content/vocabulary.ts'
import * as apps from '../src/content/practice-apps.ts'
const testModule={exports:{}}
const modules={
 'react/jsx-runtime':jsx,
 'next/navigation':{notFound(){throw Error('Unexpected missing lesson')}},
 'next/link':{__esModule:true,default:({children,...props})=>jsx.jsx('a',{...props,children})},
 '@/content/lessons':content,'@/content/units':units,'@/content/vocabulary':vocabulary,'@/content/practice-apps':apps,
 '@/components/BookReader':{BookReader:({heading,breadcrumb,pages})=>jsx.jsxs('div',{children:[breadcrumb,heading,...pages.map(page=>page.content)]})},
 '@/components/LessonVocabulary':{LessonVocabulary:()=>null},
 '@/components/MathText':{MathText:({children})=>children},
 '@/components/LessonVideo':{LessonVideo:({video})=>jsx.jsx('button',{'data-video':video.id,children:video.title})},
}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/courses/[course]/[lesson]/page.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,{module:testModule,exports:testModule.exports,require(name){assert(name in modules,name);return modules[name]}})
for(const lesson of content.lessons){
 const html=renderToStaticMarkup(await testModule.exports.default({params:Promise.resolve({course:lesson.course,lesson:lesson.slug})}))
 assert.equal((html.match(/class="study-material"/g)??[]).length,lesson.materials.length,lesson.slug+' document positions')
 for(const material of lesson.materials){
  if(material.file)assert(html.includes(`href="/materials/${material.file}" target="_blank"`),lesson.slug+' reviewed document')
  else assert(html.includes('Not posted yet'),lesson.slug+' unavailable document')
  for(const extra of material.additional??[])assert(html.includes(`href="/materials/${extra.file}"`),lesson.slug+' supporting PDF')
 }
 assert.equal((html.match(/data-video=/g)??[]).length,lesson.videos.length,lesson.slug+' all videos')
 assert(!html.includes('href="/apps/beta/'),lesson.slug+' beta exclusion')
 let lastIndex=-1
 for(const activity of lesson.practiceActivities??[]){const index=html.indexOf(`href="/apps/${activity.slug}" target="_blank"`);assert(index>lastIndex,lesson.slug+' assigned activity order');lastIndex=index}
 if(lesson.reviewGuide)assert.equal(html.split(`href="${lesson.reviewGuide.practiceUrl}"`).length-1,1,lesson.slug+' one review practice card')
 if(lesson.interactiveLesson)assert(html.includes(`href="${lesson.interactiveLesson.href}" target="_blank"`),lesson.slug+' interactive lesson')
 assert(!html.includes('<iframe'),lesson.slug+' video embeds are deferred')
}
console.log(`Passed all ${content.lessons.length} lesson layouts: reviewed/unavailable document positions, supporting PDFs, video coverage, assigned activity order, unique review links, new-tab launches and beta exclusion.`)
