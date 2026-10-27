import Link from 'next/link'
import { notFound } from 'next/navigation'
import { courses, lessons } from '@/content/lessons'
import { getCourseVocabulary, getLessonVocabulary } from '@/content/vocabulary'

export function generateStaticParams() { return courses.map(course => ({ course: course.id })) }
export async function generateMetadata({ params }: { params: Promise<{ course: string }> }) {
  const { course } = await params
  return { title: `${courses.find(item => item.id === course)?.title ?? 'Class'} vocabulary and definitions` }
}
export default async function VocabularyPage({ params }: { params: Promise<{ course: string }> }) {
  const { course: courseId } = await params
  const course = courses.find(item => item.id === courseId)
  if (!course) notFound()
  const courseLessons = lessons.filter(lesson => lesson.course === courseId)
  const terms = getCourseVocabulary(courseLessons)
  const letters = [...new Set(terms.map(term => term.term[0]))]
  return <section className="course-index shell glossary-page">
    <nav className="book-breadcrumb" aria-label="Breadcrumb"><Link href="/">Classes</Link><span aria-hidden="true">/</span><Link href={`/courses/${courseId}`}>{course.title} contents</Link></nav>
    <div className="course-index-content">
      <h1>{course.title} vocabulary &amp; definitions</h1>
      <p>Definitions for the lessons currently posted. Choose a letter or scroll to find a word.</p>
      <nav className="glossary-letters" aria-label="Jump to a letter">{letters.map(letter => <a key={letter} href={`#letter-${letter}`}>{letter}</a>)}</nav>
      {letters.map(letter => <section className="glossary-letter" key={letter} aria-labelledby={`letter-${letter}`}>
        <h2 id={`letter-${letter}`}>{letter}</h2>
        <dl>{terms.filter(term => term.term[0] === letter).map(term => <div className="glossary-entry" id={term.id} key={term.id}>
          <dt>{term.term}</dt><dd><p>{term.definition}</p><nav aria-label={`Lessons using ${term.term}`}>{courseLessons.filter(lesson => getLessonVocabulary(lesson.slug).some(item => item.id === term.id)).map(lesson => <Link key={lesson.slug} href={`/courses/${courseId}/${lesson.slug}`}>{lesson.title}</Link>)}</nav></dd>
        </div>)}</dl>
      </section>)}
      <p><Link href={`/courses/${courseId}`}>← Back to {course.title} contents</Link></p>
    </div>
  </section>
}
