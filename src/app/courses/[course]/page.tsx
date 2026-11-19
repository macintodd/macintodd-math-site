import { notFound } from 'next/navigation'
import Link from 'next/link'
import { courses, lessons, type Lesson } from '@/content/lessons'
import { units } from '@/content/units'
import { precalculusAssessments } from '@/content/precalculus'
import './review-links.css'
import {SketchFrame} from '@/components/StudySketch'

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
  return <section className="course-index shell study-page chapter-index" aria-label={`${course.title} table of contents`}>
    <nav className="chapter-top-nav" aria-label="Course navigation"><Link href="/">← Back to Home</Link><Link className="study-wordmark" href="/">macintodd.net</Link></nav>
    <div className="course-index-content">
      <header className="chapter-index-heading"><h1>{course.title}</h1><p>Tap any chapter below to reveal its lessons.</p></header>
      <div className="modern-course-layout"><div>{courseUnits.map(unit => {
        const entries: ContentsEntry[] = [
          ...lessons.filter(lesson => lesson.course === courseId && lesson.unitSlug === unit.slug).map(lesson => ({ lesson, sortOrder: lesson.sortOrder ?? Number(lesson.number.match(/\d+/)?.[0] ?? 0) })),
          ...precalculusAssessments.filter(item => item.course === courseId && item.unitSlug === unit.slug),
        ].sort((a, b) => a.sortOrder - b.sortOrder)
        return <article className="chapter-card" key={unit.slug}><SketchFrame/><details className="toc-unit toc-folding-unit" open={unit.current}>
          <summary><div className="chapter-title"><h2>Chapter {unit.number}: {unit.title}</h2><p>{entries.filter(entry=>'lesson' in entry).length} Sections{unit.current&&<span className="chapter-current"> · Current unit</span>}</p></div><span className="chapter-toggle"><SketchFrame/><span className="chapter-toggle-open">Open Unit</span><span className="chapter-toggle-close">Hide Sections</span><svg className="chapter-chevron" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 7L10 13L16 7M4 8L10 14L16 8"/></svg></span></summary>
          <p className="toc-unit-hint"><Link href={`/courses/${courseId}/units/${unit.slug}`}>Unit overview: skills and everyday connections →</Link></p>
          <ol className="toc-lessons">{entries.map(entry => {
            if (!('lesson' in entry)) return <li className="toc-assessment" key={entry.title}><span className="toc-lesson-number">Quiz</span><span className="toc-lesson-title">{entry.title}</span><small>In class</small></li>
            const lesson = entry.lesson
            return <li className={lesson.followUpOf ? 'toc-follow-up' : undefined} key={lesson.slug}>
              <Link href={`/courses/${courseId}/${lesson.slug}`}><span className="toc-lesson-number">{lesson.followUpOf ? '↳' : lesson.indexLabel ?? `${unit.number}.${lesson.number.match(/\d+/)?.[0]}`}</span><span className="toc-lesson-title">{lesson.title}</span><span className="toc-leader" aria-hidden="true" /><span className="toc-read">Open <span aria-hidden="true">→</span></span></Link>
            </li>
          })}</ol>
        </details></article>
      })}</div></div>
      <div className="chapter-extra-links"><nav className="study-course-tabs" aria-label="Choose a course">{courses.map(item=><Link key={item.id} href={`/courses/${item.id}`} aria-current={item.id===courseId?'page':undefined}>{item.title}</Link>)}</nav><Link href={`/courses/${courseId}/vocabulary`}>Vocabulary &amp; definitions →</Link></div>
      {courseId === 'algebra-2' && <section className="course-test-review" aria-labelledby="test-review-heading">
        <h2 id="test-review-heading">Test Review Widgets</h2>
        <p>Preparing for the chapter test? Start with the Unit 1B review collection, then choose the skills you need to practice.</p>
        <Link className="course-test-review-main" href="/apps/unit-1b-test-practice"><strong>Unit 1B Test Practice</strong><span>Function evaluation, slope, graphing, and writing equations—all organized by test topic.</span><span aria-hidden="true">→</span></Link>
        <nav className="course-review-skill-links" aria-label="More linear equation practice"><Link href="/apps/writing-linear-equations">Writing Linear Equations · Levels 0–5 <span aria-hidden="true">→</span></Link><Link href="/apps/graphing-linear-equations">Graphing Linear Equations <span aria-hidden="true">→</span></Link></nav>
      </section>}
      {courseId === 'precalculus' && <section className="course-test-review" aria-labelledby="precalculus-review-heading">
        <h2 id="precalculus-review-heading">Quiz Review Widgets</h2>
        <p>Review Sections 1.6–1.7B: parent functions, shifts, reflections, stretches, and shrinks.</p>
        <Link className="course-test-review-main" href="/apps/precalculus-1-6-1-7b-review"><strong>Sections 1.6–1.7B Review</strong><span>Start with the review-guide widget, then choose extra practice by topic.</span><span aria-hidden="true">→</span></Link>
        <nav className="course-review-skill-links" aria-label="Precalculus review resources"><Link href="/courses/precalculus/quiz-review-sections-1-6-to-1-7">Paper review guide and worked answers <span aria-hidden="true">→</span></Link></nav>
      </section>}
    </div>
  </section>
}
