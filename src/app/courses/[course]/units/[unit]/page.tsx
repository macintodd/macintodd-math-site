import { notFound } from 'next/navigation'
import Link from 'next/link'
import { courses, lessons } from '@/content/lessons'
import { getUnit, units } from '@/content/units'
import { BookReader } from '@/components/BookReader'

export function generateStaticParams() { return units.map(unit => ({ course: unit.course, unit: unit.slug })) }
export async function generateMetadata({ params }: { params: Promise<{ course: string; unit: string }> }) {
  const p = await params
  return { title: getUnit(p.course, p.unit)?.title ?? 'Unit not found' }
}
export default async function UnitPage({ params }: { params: Promise<{ course: string; unit: string }> }) {
  const p = await params
  const unit = getUnit(p.course, p.unit)
  const course = courses.find(c => c.id === p.course)
  if (!unit || !course) notFound()
  const firstLesson = lessons.find(lesson => lesson.course === p.course && lesson.unitSlug === unit.slug)
  return <BookReader label={`${unit.title} unit overview`}
    breadcrumb={<><Link href="/">Classes</Link><span aria-hidden="true">/</span><Link href={`/courses/${p.course}`}>{course.title} contents</Link><span aria-hidden="true">/</span><span>Unit {unit.number}</span></>}
    heading={<><p className="book-eyebrow">{course.title} · Unit {unit.number}</p><h1>{unit.title}</h1></>}
    pages={[
      { id: 'skills', label: 'Unit skills', content: <section className="unit-skills"><h2>What you’ll learn</h2><p>{unit.introduction}</p><ul>{unit.skills.map(skill => <li key={skill}>{skill}</li>)}</ul></section> },
      { id: 'relevance', label: 'Everyday connections', content: <section className="unit-relevance"><h2>Why does this matter?</h2><div>{unit.relevance.map(item => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section> },
    ]}
    previousHref={`/courses/${p.course}`} previousLabel="Contents"
    nextHref={firstLesson ? `/courses/${p.course}/${firstLesson.slug}` : `/courses/${p.course}`} nextLabel={firstLesson ? 'Start lesson' : 'Contents'}
  />
}
