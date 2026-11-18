import Link from 'next/link'
import {practiceHubs, type PracticeHub as Hub} from '@/content/practice-hubs'
import {practiceApps} from '@/content/practice-apps'
import './practice-hubs.css'
export function PracticeHubNav({current}:{current?:string}) {
 return <nav className="practice-hub-nav" aria-label="Practice collections">{practiceHubs.map(hub=><Link key={hub.slug} href={`/apps/${hub.slug}`} aria-current={current===hub.slug?'page':undefined}>{hub.title}<span aria-hidden="true"> →</span></Link>)}</nav>
}
export default function PracticeHub({hub}:{hub:Hub}) {
 return <div className="shell course-page practice-hub"><nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/apps">Practice apps</Link><span>/</span><span>{hub.title}</span></nav>
 <header className="practice-hub-heading"><p className="eyebrow">PRACTICE COLLECTION</p><h1>{hub.title}</h1><p>{hub.description}</p></header>
 <PracticeHubNav current={hub.slug}/>
 <nav className="practice-hub-jumps" aria-label="Sections on this page">{hub.sections.map(section=><a key={section.id} href={`#${section.id}`}>{section.title}</a>)}</nav>
 {hub.slug==='unit-1b-test-practice'&&<aside className="practice-review-links" aria-label="Paper review guides"><strong>Paper review guides and worked answers:</strong><Link href="/courses/algebra-2/unit-1b-test-day-1-review">Day 1 review →</Link><Link href="/courses/algebra-2/unit-1b-test-day-2-review">Day 2 review →</Link></aside>}
 {hub.sections.map(section=><section key={section.id} id={section.id} className="practice-hub-section"><h2>{section.title}</h2>{section.description&&<p>{section.description}</p>}<ul className="practice-rows">{section.items.map(item=>{
 const app=practiceApps.find(app=>app.slug===item.slug)
 if(!app)throw new Error(`Unknown practice app: ${item.slug}`)
 return <li key={item.slug}><Link className="practice-row" href={`/apps/${item.slug}`}><span className="practice-row-title">{item.label&&<span className="practice-row-label">{item.label}</span>}<strong>{item.title??app.title}</strong></span><span className="practice-row-description">{item.description}</span><span className="practice-row-arrow" aria-hidden="true">→</span></Link></li>
 })}</ul></section>)}
 <p className="practice-hub-back"><Link href="/apps">← Browse all practice apps</Link></p></div>
}
