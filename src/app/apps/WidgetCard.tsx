import Link from 'next/link'
import type {PracticeApp} from '@/content/practice-apps'
import {SketchFrame} from '@/components/StudySketch'
import {AppPreview} from './AppPreview'
export type WidgetLessonLink={key:string;href:string;label:string;course:string}
type CardApp=Pick<PracticeApp,'slug'|'title'|'description'|'descriptionBullets'|'courses'|'note'|'activityType'>
export function WidgetDescription({description,bullets,expanded=false}:{description:string;bullets?:PracticeApp['descriptionBullets'];expanded?:boolean}){
 return bullets?.length?<ul className="widget-description widget-description-bullets">{bullets.map(item=><li key={item.label}><strong>{item.label}:</strong> {item.value}</li>)}</ul>:<p className={expanded?undefined:"widget-description"}>{description}</p>
}
export default function WidgetCard({app,title=app.title,description=app.description,level,lessonLinks=[]}:{app:CardApp;title?:string;description?:string;level?:string;lessonLinks?:WidgetLessonLink[]}){
 const demonstration=app.activityType==='demonstration'
 return <article className="widget-card" data-kind={demonstration?'demonstration':'practice'}><SketchFrame/><Link className="widget-card-main" href={`/apps/${app.slug}`}><div className="widget-thumbnail" aria-hidden="true"><AppPreview slug={app.slug}/></div><div className="widget-card-copy"><div className="widget-card-labels"><span className="widget-kind">{demonstration?'Demonstration':'Practice'}</span>{level&&<span className="widget-level">{level}</span>}{app.slug.startsWith('beta/')&&<span className="widget-beta">Beta</span>}</div><h3>{title}</h3><WidgetDescription description={description} bullets={app.descriptionBullets}/><span className="widget-launch">{demonstration?'Explore widget':'Open practice'} <span aria-hidden="true">→</span></span></div></Link>{(lessonLinks.length>0||app.note)&&<details className="widget-details"><summary>{lessonLinks.length?'Details & lesson links':'Details'}</summary><div><WidgetDescription description={description} bullets={app.descriptionBullets} expanded/>{app.note&&<p>{app.note}</p>}{lessonLinks.length>0&&<nav aria-label="Matching lessons">{lessonLinks.map(lesson=><Link key={lesson.key} href={lesson.href}>{lesson.label}</Link>)}</nav>}</div></details>}</article>
}
