import Link from 'next/link'
import {type PracticeHub as Hub, type PracticeSection} from '@/content/practice-hubs'
import {practiceApps} from '@/content/practice-apps'
import './directory.css'
import './practice-hubs.css'
import './widget-cards.css'
import WidgetCard from './WidgetCard'
export default function PracticeHub({hub}:{hub:Hub}) {
 function renderSection(section:PracticeSection){return <section key={section.id} id={section.id} className="practice-hub-section"><h2>{section.title}</h2>{section.description&&<p>{section.description}</p>}<ul className="practice-rows">{section.items.map(item=>{
 const app=practiceApps.find(app=>app.slug===item.slug)
 if(!app)throw new Error(`Unknown practice app: ${item.slug}`)
 return <li key={item.slug}><WidgetCard app={app} title={item.title??app.title} description={item.description} level={item.label}/></li>
 })}</ul></section>}
 return <div className="shell course-page practice-hub study-page"><nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/apps">Practice apps</Link><span>/</span><span>{hub.title}</span></nav>
 <header className="practice-hub-heading"><p className="eyebrow">PRACTICE COLLECTION</p><h1>{hub.title}</h1><p>{hub.description}</p></header>
 {hub.sections.filter(section=>section.featured).map(renderSection)}
 <nav className="practice-hub-jumps" aria-label="Sections on this page">{hub.sections.map(section=><a key={section.id} href={`#${section.id}`}>{section.title}</a>)}</nav>
 {hub.resources&&<aside className="practice-review-links" aria-label="Review guide and worked answers"><strong>Paper review:</strong>{hub.resources.map(resource=><Link key={resource.href} href={resource.href}>{resource.title}</Link>)}</aside>}
 {hub.slug==='unit-1b-test-practice'&&<aside className="practice-review-links" aria-label="Paper review guides"><strong>Paper review guides and worked answers:</strong><Link href="/courses/algebra-2/unit-1b-test-day-1-review">Day 1 review →</Link><Link href="/courses/algebra-2/unit-1b-test-day-2-review">Day 2 review →</Link></aside>}
 {hub.sections.filter(section=>!section.featured).map(renderSection)}
 <p className="practice-hub-back"><Link href="/apps">← Browse all practice apps</Link></p></div>
}
