import Link from 'next/link'
import {practiceApps} from '@/content/practice-apps'
import {AppPreview} from '../AppPreview'
import '../directory.css'
import './beta.css'
export const metadata={title:'Beta apps'}
export default function BetaPage(){const apps=practiceApps.filter(app=>app.slug.startsWith('beta/'));return <main className="shell course-page beta-lab"><nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/apps">Practice apps</Link><span>/</span><span>Beta apps</span></nav><header className="page-heading"><p className="eyebrow">THE TESTING SPACE</p><h1>Beta apps</h1><p>Try new activities and layouts on an iPad before they join the classroom collection. The regular practice apps stay available.</p></header><div className="beta-grid">{apps.map(app=><article className="beta-card" key={app.slug}><Link href={`/apps/${app.slug}`} className="beta-preview" aria-label={`Open ${app.title}`}><AppPreview slug={app.slug}/></Link><div className="beta-card-body"><span className="beta-badge">IN DEVELOPMENT</span><h2><Link href={`/apps/${app.slug}`}>{app.title}</Link></h2><p>{app.description}</p><p className="beta-note">{app.note}</p><Link className="beta-open" href={`/apps/${app.slug}`}>Open test widget →</Link></div></article>)}</div><p><Link href="/apps">← Return to classroom practice apps</Link></p></main>}
