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
import * as precalculus from '../src/content/precalculus.ts'
import {chapterReviews} from '../src/content/chapter-reviews.ts'
const iconModule={exports:{}}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/components/DocumentIcon.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:iconModule,exports:iconModule.exports,require:()=>jsx})
const testModule={exports:{}}
const modules={
 'react/jsx-runtime':jsx,
 '@/components/DocumentIcon':iconModule.exports,
 '@/content/chapter-reviews':{chapterReviews},
 '@/components/ChapterDisclosure':{ChapterDisclosure:({initialOpen,summary,children})=>jsx.jsxs('details',{open:initialOpen,children:[jsx.jsx('summary',{children:summary}),children]})},
 '@/components/StudySketch':{SketchFrame:()=>jsx.jsx('svg',{'aria-hidden':true})},
 '@/content/precalculus':precalculus,'./review-links.css':{},
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
 assert.equal((html.match(/data-note-state=/g)??[]).length,lesson.materials.length+lesson.materials.flatMap(material=>material.additional??[]).length,lesson.slug+' document icons')
 assert.equal((html.match(/data-video=/g)??[]).length,lesson.videos.length,lesson.slug+' all videos')
 assert(!html.includes('href="/apps/beta/'),lesson.slug+' beta exclusion')
 let lastIndex=-1
 for(const activity of lesson.practiceActivities??[]){const index=html.indexOf(`href="/apps/${activity.slug}" target="_blank"`);assert(index>lastIndex,lesson.slug+' assigned activity order');lastIndex=index}
 if(lesson.reviewGuide)assert.equal(html.split(`href="${lesson.reviewGuide.practiceUrl}"`).length-1,1,lesson.slug+' one review practice card')
 if(lesson.interactiveLesson)assert(html.includes(`href="${lesson.interactiveLesson.href}" target="_blank"`),lesson.slug+' interactive lesson')
 assert(!html.includes('<iframe'),lesson.slug+' video embeds are deferred')
}
console.log(`Passed all ${content.lessons.length} lesson layouts: reviewed/unavailable document positions, supporting PDFs, video coverage, assigned activity order, unique review links, new-tab launches and beta exclusion.`)

const courseModule={exports:{}}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/courses/[course]/page.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,{module:courseModule,exports:courseModule.exports,require(name){assert(name in modules,name);return modules[name]}})
for(const course of content.courses){
 const html=renderToStaticMarkup(await courseModule.exports.default({params:Promise.resolve({course:course.id})}))
 assert(!html.includes('href="/materials/'),course.id+' materials must be reached through lessons')
 assert.equal((html.match(/class="chapter-review"/g)??[]).length,units.units.filter(unit=>unit.course===course.id).length)
 for(const [key,href] of Object.entries(chapterReviews).filter(([key])=>key.startsWith(course.id+'/')))assert(html.includes(`href="${href}"`),key+' matching review')
 for(const lesson of content.lessons.filter(item=>item.course===course.id))assert(html.includes(`href="/courses/${course.id}/${lesson.slug}"`),lesson.slug+' lesson remains reachable')
}
console.log('Passed both course indexes: all lesson links remain and no direct document links are exposed.')
