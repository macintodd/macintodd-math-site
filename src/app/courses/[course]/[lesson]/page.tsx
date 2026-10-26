import { notFound } from 'next/navigation'
import Link from 'next/link'
import { courses, lessons, getLesson } from '@/content/lessons'
import { getUnit } from '@/content/units'
import { BookReader } from '@/components/BookReader'
import { LessonVideo } from '@/components/LessonVideo'

export function generateStaticParams() { return lessons.map(lesson => ({ course: lesson.course, lesson: lesson.slug })) }
export async function generateMetadata({ params }: { params: Promise<{ course: string; lesson: string }> }) {
  const p = await params
  const lesson = getLesson(p.course, p.lesson)
  return { title: lesson?.title ?? 'Lesson not found', description: lesson?.description }
}
const materialLabels = ['Blank Notes', 'Completed Notes', 'Blank Practice', 'Completed Practice']
export default async function LessonPage({ params }: { params: Promise<{ course: string; lesson: string }> }) {
  const p = await params
  const lesson = getLesson(p.course, p.lesson)
  if (!lesson) notFound()
  const course = courses.find(c => c.id === lesson.course)!
  const unit = getUnit(lesson.course, lesson.unitSlug)!
  const courseLessons = lessons.filter(item => item.course === lesson.course)
  const index = courseLessons.findIndex(item => item.slug === lesson.slug)
  const previous = courseLessons[index - 1]
  const next = courseLessons[index + 1]
  const unitLessons = lessons.filter(item => item.course === lesson.course && item.unitSlug === lesson.unitSlug)
  const lessonItems = unitLessons.map(item => <li className={item.followUpOf ? "unit-follow-up" : undefined} key={item.slug}>
    <Link href={`/courses/${item.course}/${item.slug}`} aria-current={item.slug === lesson.slug ? 'page' : undefined}>
      <span>{item.number}</span>{item.title}
    </Link>
  </li>)
  return <div className="lesson-layout">
    <aside className="lesson-sidebar">
      <nav aria-label={`Unit ${unit.number} lessons`}>
        <Link className="lesson-unit-link" href={`/courses/${lesson.course}/units/${unit.slug}`}>
          <span>Unit {unit.number}</span><strong>{unit.title}</strong>
        </Link>
        <ol className="unit-lessons-desktop">{lessonItems}</ol>
        <details className="unit-lessons-mobile">
          <summary>Choose a lesson ({unitLessons.length})</summary>
          <ol>{lessonItems}</ol>
        </details>
        <Link className="lesson-contents-link" href={`/courses/${lesson.course}`}>All {course.title} lessons →</Link>
      </nav>
    </aside>
    <BookReader className="lesson-reader" label={`${lesson.title} lesson reader`}
    breadcrumb={<><Link href="/">Classes</Link><span aria-hidden="true">/</span><Link href={`/courses/${lesson.course}`}>{course.title} contents</Link><span aria-hidden="true">/</span><Link href={`/courses/${lesson.course}/units/${unit.slug}`}>Unit {unit.number}</Link></>}
    heading={<><p className="book-eyebrow">{lesson.unit} · {lesson.number}</p><h1>{lesson.title}</h1><nav id="materials" className="lesson-pdf-links" aria-label="Lesson PDFs">{lesson.materials.map((material, i) => material.file
      ? <div className="lesson-material-group" key={material.kind}><a href={`/materials/${material.file}`} target="_blank" rel="noopener noreferrer" title={material.description} aria-label={`Open ${material.label ?? materialLabels[i]} PDF in a new tab`}>{material.label ?? materialLabels[i]}</a>{material.additional?.map(extra => <a className="lesson-extra-material" key={extra.file} href={`/materials/${extra.file}`} target="_blank" rel="noopener noreferrer" title={extra.description} aria-label={`Open ${extra.label} PDF in a new tab`}>{extra.label}</a>)}</div>
      : <span className="material-unavailable" key={material.kind} title={material.unavailableReason}>{materialLabels[i]} <small>Not posted yet</small></span>)}</nav></>}
    pages={lesson.videos.map(video => ({ id: video.id, label: video.title, content: <section className="book-video-section" aria-label={video.title}><LessonVideo video={video} /></section> }))}
    previousHref={previous ? `/courses/${previous.course}/${previous.slug}` : `/courses/${lesson.course}/units/${unit.slug}#page=2`} previousLabel={previous ? 'Previous lesson' : 'Unit overview'}
    nextHref={next ? `/courses/${next.course}/${next.slug}` : `/courses/${lesson.course}`} nextLabel={next ? 'Next lesson' : 'Contents'}
  /></div>
}
