import {notFound} from 'next/navigation'
import Link from 'next/link'
import {courses,lessons,getLesson} from '@/content/lessons'
import {getUnit} from '@/content/units'
import {practiceApps} from '@/content/practice-apps'
import {BookReader} from '@/components/BookReader'
import {LessonVocabulary} from '@/components/LessonVocabulary'
import {getLessonVocabulary} from '@/content/vocabulary'
import {MathText} from '@/components/MathText'
import {LessonVideo} from '@/components/LessonVideo'

export function generateStaticParams(){return lessons.map(lesson=>({course:lesson.course,lesson:lesson.slug}))}
export async function generateMetadata({params}:{params:Promise<{course:string;lesson:string}>}){
 const p=await params, lesson=getLesson(p.course,p.lesson)
 return {title:lesson?.title??'Lesson not found',description:lesson?.description}
}
const materialLabels=['Blank Notes','Completed Notes','Assignment','Assignment Answers']
export default async function LessonPage({params}:{params:Promise<{course:string;lesson:string}>}){
 const p=await params, lesson=getLesson(p.course,p.lesson)
 if(!lesson)notFound()
 const course=courses.find(c=>c.id===lesson.course)!, unit=getUnit(lesson.course,lesson.unitSlug)!
 const courseLessons=lessons.filter(item=>item.course===lesson.course), index=courseLessons.findIndex(item=>item.slug===lesson.slug)
 const previous=courseLessons[index-1], next=courseLessons[index+1]
 const relatedApps=practiceApps.filter(app=>!app.slug.startsWith('beta/')&&(app.lessons.some(ref=>ref.course===lesson.course&&ref.slug===lesson.slug)||lesson.practiceActivities?.some(activity=>activity.slug===app.slug)||`/apps/${app.slug}`===lesson.practiceApp||`/apps/${app.slug}`===lesson.interactiveLesson?.href))
 const apps=(lesson.practiceActivities?lesson.practiceActivities.flatMap(activity=>{const app=practiceApps.find(item=>item.slug===activity.slug&&!item.slug.startsWith('beta/'));return app?[app]:[]}):relatedApps).filter(app=>`/apps/${app.slug}`!==lesson.reviewGuide?.practiceUrl)
 const extras=lesson.materials.flatMap(material=>material.additional??[])
 const terms=getLessonVocabulary(lesson.slug)
 const guide=lesson.reviewGuide
 return <div className="lesson-hub study-page"><BookReader className="lesson-reader study-lesson-reader" label={`${lesson.title} lesson resources`}
  breadcrumb={<><Link href={`/courses/${lesson.course}/units/${unit.slug}`}>← Back to Unit {unit.number}</Link><span aria-hidden="true">/</span><Link href={`/courses/${lesson.course}`}>{course.title}</Link></>}
  heading={<><p className="book-eyebrow">{course.title} · {lesson.unit} · {lesson.number}</p><h1>{lesson.title}</h1><nav id="materials" className="study-materials" aria-label="Lesson documents">{lesson.materials.map((material,i)=><div className="study-material" key={material.kind}>{material.file?<a href={`/materials/${material.file}`} target="_blank" rel="noopener noreferrer" title={material.description}><span aria-hidden="true">▤</span>{material.label??materialLabels[i]}<span className="sr-only"> (PDF, opens in a new tab)</span></a>:<span title={material.unavailableReason}>{material.label??materialLabels[i]}<small>Not posted yet</small></span>}</div>)}</nav>{lesson.materialsNote&&<p className="lesson-materials-note"><MathText>{lesson.materialsNote}</MathText></p>}</>}
  pages={[{id:'resources',label:'Videos, webwidgets and supporting materials',content:<div className="lesson-resource-columns"><section className="lesson-videos"><h2>Lesson videos</h2><p className="resource-column-intro">Watch a lesson, pause, and work at your pace.</p>{lesson.videos.map(video=><LessonVideo key={video.id} video={video}/>)}{!lesson.videos.length&&<p className="study-empty">A video for this lesson has not been posted yet.</p>}{guide&&<section className="study-review"><h2>Prepare for the test</h2><ol>{guide.instructions.map(text=><li key={text}>{text}</li>)}</ol><h3>Return to a lesson</h3><ul>{guide.lessonSlugs.map(slug=>{const item=getLesson(lesson.course,slug);return item?<li key={slug}><Link href={`/courses/${lesson.course}/${slug}`}>{item.number} — {item.title}</Link></li>:null})}</ul></section>}</section><section className="lesson-support"><h2>Practice &amp; explore</h2><p className="resource-column-intro">Webwidgets open in a new tab. Keep your notes here.</p>{lesson.practiceActivities&&<p className="study-empty">Open your blank notes above and choose the level your teacher assigns. Finish both reflections and save your completion record when you finish.</p>}{apps.map(app=><a className="study-resource-card" key={app.slug} href={`/apps/${app.slug}`} target="_blank" rel="noopener noreferrer"><span className="study-card-kind">WEBWIDGET <span aria-hidden="true">↗</span></span><h3>{app.title}</h3><p>{lesson.practiceActivities?.find(activity=>activity.slug===app.slug)?.description??app.description}</p><span className="study-card-action">Open webwidget →<span className="sr-only"> (opens in a new tab)</span></span></a>)}{lesson.interactiveLesson&&!apps.some(app=>`/apps/${app.slug}`===lesson.interactiveLesson?.href)&&<a className="study-resource-card" href={lesson.interactiveLesson.href} target="_blank" rel="noopener noreferrer"><span className="study-card-kind">INTERACTIVE LESSON ↗</span><h3>{lesson.interactiveLesson.title}</h3><span className="study-card-action">Open lesson →</span></a>}{!apps.length&&!lesson.interactiveLesson&&<p className="study-empty">No webwidget is linked to this lesson yet.</p>}{extras.map(extra=><a className="study-resource-card" key={extra.file} href={`/materials/${extra.file}`} target="_blank" rel="noopener noreferrer"><span className="study-card-kind">SUPPORTING MATERIAL · PDF ↗</span><h3>{extra.label}</h3><p>{extra.description}</p></a>)}{guide&&<article className="study-resource-card"><span className="study-card-kind">EXTRA PRACTICE</span><h3><a href={guide.practiceUrl} target="_blank" rel="noopener noreferrer">{guide.practiceTitle} ↗</a></h3><p>{guide.practiceInstructions??'Choose a topic and work on paper before checking each answer. No account is needed.'}</p><p className="review-privacy">{guide.privacyNote} {guide.privacyUrl&&<a href={guide.privacyUrl} target="_blank" rel="noopener noreferrer">Privacy statement ↗</a>}</p></article>}{terms.length>0&&<LessonVocabulary course={lesson.course} terms={terms}/>}</section></div>}]}
  previousHref={previous?`/courses/${previous.course}/${previous.slug}`:`/courses/${lesson.course}/units/${unit.slug}`} previousLabel={previous?'Previous lesson':'Unit overview'}
  nextHref={next?`/courses/${next.course}/${next.slug}`:`/courses/${lesson.course}`} nextLabel={next?'Next lesson':'Contents'}/><div className="math-stamp" aria-hidden="true">MAC<br/>MATH</div></div>
}
