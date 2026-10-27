import { notFound } from 'next/navigation'
import Link from 'next/link'
import { courses, lessons, type Lesson } from '@/content/lessons'
import { units } from '@/content/units'
import { precalculusAssessments } from '@/content/precalculus'

export function generateStaticParams() { return courses.map(course => ({ course: course.id })) }
export async function generateMetadata({ params }: { params: Promise<{ course: string }> }) {
  const { course } = await params
  return { title: `${courses.find(c => c.id === course)?.title ?? 'Course'} table of contents` }
}

type ContentsEntry = { sortOrder: number; lesson: Lesson } | { sortOrder: number; title: string }
export default async function CoursePage({ params }: { params: Promise<{ course: string }> }) {
  const { course: courseId } = await params
  const course = courses.find(c => c.id === courseId)
  if (!course) notFound()
  const courseUnits = units.filter(unit => unit.course === courseId)
  return <section className="course-index shell" aria-label={`${course.title} table of contents`}>
    <nav className="book-breadcrumb" aria-label="Breadcrumb"><Link href="/">Classes</Link><span aria-hidden="true">/</span><span>{course.title}</span></nav>
    <div className="course-index-content">
      <header><h1>{course.title} table of contents</h1><p className="course-glossary-link"><Link href={`/courses/${courseId}/vocabulary`}>Vocabulary &amp; definitions →</Link></p></header>
      {courseUnits.map(unit => {
        const entries: ContentsEntry[] = [
          ...lessons.filter(lesson => lesson.course === courseId && lesson.unitSlug === unit.slug).map(lesson => ({ lesson, sortOrder: lesson.sortOrder ?? Number(lesson.number.match(/\d+/)?.[0] ?? 0) })),
          ...precalculusAssessments.filter(item => item.course === courseId && item.unitSlug === unit.slug),
        ].sort((a, b) => a.sortOrder - b.sortOrder)
        return <details className="toc-unit toc-folding-unit" key={unit.slug} open={unit.current}>
          <summary><h2><span className="toc-unit-number">{unit.number}</span><span>{unit.title}</span>{unit.current && <span className="current-unit">(Current Unit)</span>}</h2></summary>
          <p className="toc-unit-hint"><Link href={`/courses/${courseId}/units/${unit.slug}`}>Unit overview: skills and everyday connections →</Link></p>
          <ol className="toc-lessons">{entries.map(entry => {
            if (!('lesson' in entry)) return <li className="toc-assessment" key={entry.title}><span className="toc-lesson-number">Quiz</span><span className="toc-lesson-title">{entry.title}</span><small>In class</small></li>
            const lesson = entry.lesson
            return <li className={lesson.followUpOf ? 'toc-follow-up' : undefined} key={lesson.slug}>
              <Link href={`/courses/${courseId}/${lesson.slug}`}><span className="toc-lesson-number">{lesson.followUpOf ? '↳' : lesson.indexLabel ?? `${unit.number}.${lesson.number.match(/\d+/)?.[0]}`}</span><span className="toc-lesson-title">{lesson.title}</span><span className="toc-leader" aria-hidden="true" /><span className="toc-read">Read <span aria-hidden="true">→</span></span></Link>
            </li>
          })}</ol>
        </details>
      })}
    </div>
  </section>
}
