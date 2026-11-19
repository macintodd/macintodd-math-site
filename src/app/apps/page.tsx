import Link from 'next/link'
import {cookies} from 'next/headers'
import {lessons,courses} from '@/content/lessons'
import {practiceApps} from '@/content/practice-apps'
import {categoryCookie,parseDirectoryCategory} from '@/lib/practice-directory'
import AppDirectory from './AppDirectory'
import './directory.css'
import './widget-cards.css'
export const metadata={title:'Practice apps'}
export default async function AppsPage(){
 const initialCategory=parseDirectoryCategory((await cookies()).get(categoryCookie)?.value)
 const apps=practiceApps.map(app=>({...app,lessons:app.lessons.map(ref=>{const lesson=lessons.find(item=>item.course===ref.course&&item.slug===ref.slug);if(!lesson)throw Error(`Missing app lesson: ${ref.slug}`);return {key:`${ref.course}/${ref.slug}`,href:`/courses/${ref.course}/${ref.slug}`,course:ref.course,label:`${courses.find(item=>item.id===ref.course)!.title} · ${lesson.unit} · ${lesson.number}: ${lesson.title}`}})}))
 return <div className="shell course-page app-directory study-page"><nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Practice apps</span></nav><header className="page-heading"><p className="eyebrow">TRY IT. CHECK IT. GET IT.</p><h1>Practice apps</h1><p>Choose a topic, explore a demonstration, or practice a skill.</p></header><AppDirectory apps={apps} initialCategory={initialCategory}/></div>
}
