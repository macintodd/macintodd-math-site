import { notFound } from 'next/navigation'
import Link from 'next/link'
import { courses, lessons } from '@/content/lessons'
import { units } from '@/content/units'
import { BookReader, type BookPage } from '@/components/BookReader'

export function generateStaticParams() { return courses.map(course => ({ course: course.id })) }
export async function generateMetadata({ params }: { params: Promise<{ course: string }> }) {
  const { course } = await params
  return { title: `${courses.find(c => c.id === course)?.title ?? 'Course'} table of contents` }
}

export default async function CoursePage({ params }: { params: Promise<{ course: string }> }) {
  const { course: courseId } = await params
  const course = courses.find(c => c.id === courseId)
  if (!course) notFound()
  const courseUnits = units.filter(unit => unit.course === courseId)
  if (courseId === 'algebra-2') return <section className="course-index shell" aria-label={`${course.title} table of contents`}>
    <nav className="book-breadcrumb" aria-label="Breadcrumb"><Link href="/">Classes</Link><span aria-hidden="true">/</span><span>{course.title}</span></nav>
    <div className="course-index-content">
      <header><h1>{course.title} table of contents</h1></header>
      {courseUnits.map(unit => <details className="toc-unit toc-folding-unit" key={unit.slug} open={unit.slug === 'unit-1b'}>
        <summary><h2><span className="toc-unit-number">{unit.number}</span><span>{unit.title}</span>{unit.slug === 'unit-1b' && <span className="current-unit">(Current Unit)</span>}</h2></summary>
        <p className="toc-unit-hint"><Link href={`/courses/${courseId}/units/${unit.slug}`}>Unit overview: skills and everyday connections →</Link></p>
        <ol className="toc-lessons">{lessons.filter(lesson => lesson.course === courseId && lesson.unitSlug === unit.slug).map(lesson => <li className={lesson.followUpOf ? 'toc-follow-up' : undefined} key={lesson.slug}>
          <Link href={`/courses/${courseId}/${lesson.slug}`}><span className="toc-lesson-number">{lesson.followUpOf ? '↳' : `${unit.number}.${lesson.number.match(/\d+/)?.[0]}`}</span><span className="toc-lesson-title">{lesson.title}</span><span className="toc-leader" aria-hidden="true" /><span className="toc-read">Read <span aria-hidden="true">→</span></span></Link>
        </li>)}</ol>
      </details>)}
    </div>
  </section>
  const pages: BookPage[] = []
  // Reserve space for the unit heading and page controls on landscape iPads.
  for (const unit of courseUnits) {
    const unitLessons = lessons.filter(lesson => lesson.course === courseId && lesson.unitSlug === unit.slug)
    for (let start = 0; start < unitLessons.length; start += 4) {
      pages.push({
        id: `${unit.slug}-${start}`,
        label: `${unit.title}${start ? ' continued' : ''}`,
        content: <section className="toc-unit">
          <h2><Link href={`/courses/${courseId}/units/${unit.slug}`}><span className="toc-unit-number">{unit.number}</span><span>{unit.title}{start ? ' (continued)' : ''}</span></Link></h2>
          <p className="toc-unit-hint"><span>Select the unit title for its skills and everyday connections.</span></p>
          <ol className="toc-lessons" start={start + 1}>{unitLessons.slice(start, start + 4).map((lesson, i) => <li className={lesson.followUpOf ? 'toc-follow-up' : undefined} key={lesson.slug}>
            <Link href={`/courses/${courseId}/${lesson.slug}`}><span className="toc-lesson-number">{unit.number}.{lesson.number.match(/\d+/)?.[0] ?? start + i + 1}</span><span className="toc-lesson-title">{lesson.title}</span><span className="toc-leader" aria-hidden="true" /><span className="toc-read">Read <span aria-hidden="true">→</span></span></Link>
          </li>)}</ol>
        </section>,
      })
    }
  }
  return <BookReader className="course-contents" label={`${course.title} table of contents`}
    breadcrumb={<><Link href="/">Classes</Link><span aria-hidden="true">/</span><span>{course.title}</span></>}
    heading={<h1><span>{course.title} table of contents</span></h1>}
    pages={pages}
    previousHref="/" previousLabel="Classes"
    nextHref={courseUnits.length ? `/courses/${courseId}/units/${courseUnits[courseUnits.length - 1].slug}` : undefined} nextLabel="Unit overview"
  />
}
