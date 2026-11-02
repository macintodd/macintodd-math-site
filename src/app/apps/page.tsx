import Link from 'next/link'
import {lessons,courses} from '@/content/lessons'
import {practiceApps} from '@/content/practice-apps'
import AppDirectory from './AppDirectory'
import './directory.css'
export const metadata={title:'Practice apps'}
export default function AppsPage(){
 const apps=practiceApps.map(app=>({...app,lessons:app.lessons.map(ref=>{const lesson=lessons.find(l=>l.course===ref.course&&l.slug===ref.slug);if(!lesson)throw Error(`Missing app lesson: ${ref.slug}`);return {key:`${ref.course}/${ref.slug}`,href:`/courses/${ref.course}/${ref.slug}`,course:ref.course,label:`${courses.find(c=>c.id===ref.course)!.title} · ${lesson.unit} · ${lesson.number}: ${lesson.title}`}})}))
 return <div className="shell course-page app-directory"><nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Practice apps</span></nav><header className="page-heading"><p className="eyebrow">PRACTICE BY SKILL</p><h1>Practice apps</h1><p>Choose a skill, class, or lesson. Lesson tags link back to the notes and videos. General review and enrichment tools are labeled separately.</p></header><AppDirectory apps={apps}/></div>
}
