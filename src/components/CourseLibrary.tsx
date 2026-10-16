'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Lesson } from '@/content/lessons'

export function CourseLibrary({ lessons }: { lessons: Lesson[] }) {
  const [query, setQuery] = useState('')
  const filtered = lessons.filter(l => `${l.title} ${l.unit} ${l.number} ${l.description}`.toLowerCase().includes(query.trim().toLowerCase()))
  return <><div className="course-search"><label htmlFor="lesson-search">Find a lesson<input id="lesson-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by topic, unit, or lesson…" /></label><p aria-live="polite">{filtered.length} {filtered.length === 1 ? 'lesson' : 'lessons'} available</p></div>
    <div className="lesson-list">{filtered.map(l => <Link className="lesson-row" key={l.slug} href={`/courses/${l.course}/${l.slug}`}><span className={`lesson-icon ${l.course}`} aria-hidden="true">{l.course === 'algebra-2' ? 'x' : '(x,y)'}</span><div><p className="small-label">{l.unit} · {l.number}</p><h2 style={{ fontFamily: 'Arial, sans-serif', fontSize: 22, fontWeight: 600, marginBottom: 8 }}>{l.title}</h2><p>{l.description}</p><p className="content-note" style={{ marginTop: 10 }}>Video · Worked examples · 4 printable PDFs</p></div><span className="row-arrow" aria-hidden="true">↗</span></Link>)}</div>
    {filtered.length === 0 && <p className="empty-state">No lessons match “{query}”. Try a different topic or lesson number.</p>}
  </>
}
