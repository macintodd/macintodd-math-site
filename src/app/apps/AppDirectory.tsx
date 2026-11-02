'use client'
import Link from 'next/link'
import {AppPreview} from './AppPreview'
import {useState} from 'react'
import {appCategories,type PracticeApp} from '@/content/practice-apps'
export type DirectoryApp=Omit<PracticeApp,'lessons'>&{lessons:{key:string;href:string;label:string;course:string}[]}
const courseNames={'algebra-2':'Algebra 2',precalculus:'Precalculus'}
export default function AppDirectory({apps}:{apps:DirectoryApp[]}){
 const [course,setCourse]=useState(''),[category,setCategory]=useState(''),[lesson,setLesson]=useState('')
 const lessonOptions=[...new Map(apps.flatMap(app=>app.lessons).filter(l=>!course||l.course===course).map(l=>[l.key,l])).values()]
 const visible=apps.filter(app=>(!course||app.courses.some(c=>c===course))&&(!category||app.category===category)&&(!lesson||app.lessons.some(l=>l.key===lesson)))
 return <><div className="app-filters" role="group" aria-label="Find practice apps"><label>Class<select value={course} onChange={e=>{setCourse(e.target.value);setLesson('')}}><option value="">All classes</option>{Object.entries(courseNames).map(([id,title])=><option key={id} value={id}>{title}</option>)}</select></label><label>Skill category<select value={category} onChange={e=>setCategory(e.target.value)}><option value="">All categories</option>{appCategories.map(c=><option key={c}>{c}</option>)}</select></label><label>Lesson<select value={lesson} onChange={e=>setLesson(e.target.value)}><option value="">All lessons</option>{lessonOptions.map(l=><option key={l.key} value={l.key}>{l.label}</option>)}</select></label><button type="button" onClick={()=>{setCourse('');setCategory('');setLesson('')}}>Clear filters</button></div><p className="app-count" role="status">{visible.length} {visible.length===1?'app':'apps'} shown</p>
 {visible.length===0&&<p>No apps match these filters. Choose another lesson or clear the filters.</p>}
 {appCategories.filter(c=>visible.some(app=>app.category===c)).map(c=><section className="app-category" key={c} aria-label={c}><h2>{c}</h2><div className="app-card-grid">{visible.filter(app=>app.category===c).map(app=><article className="app-card" key={app.slug}><Link className="app-preview-link" href={`/apps/${app.slug}`} aria-label={`Preview and open ${app.title}`}><AppPreview slug={app.slug}/></Link><div className="app-card-body"><h3><Link href={`/apps/${app.slug}`}>{app.title}</Link></h3><div className="app-course-tags" aria-label="Suitable classes">{app.courses.map(id=><span key={id}>{courseNames[id]}</span>)}</div><p>{app.description}</p><details className="app-lesson-details"><summary>{app.lessons.length?`Lesson matches (${app.lessons.length})`:'General practice / enrichment'}</summary><div className="app-lesson-tags" aria-label="Primary lesson matches">{app.lessons.map(l=><Link key={l.key} href={l.href}>{l.label}</Link>)}</div></details>{app.note&&<p className="app-fit-note">{app.note}</p>}<Link className="app-open" href={`/apps/${app.slug}`}>Open app →</Link></div></article>)}</div></section>)}
 </>
}
