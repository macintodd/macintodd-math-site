import Link from 'next/link'
import { courses, lessons } from '@/content/lessons'

export default function Home() {
  return <section id="courses" className="course-section student-home"><div className="shell">
    <div className="section-heading"><h1>Choose your class.</h1></div>
    <div className="course-grid">{courses.map(course => <Link className={`course-tile ${course.id}`} key={course.id} href={`/courses/${course.id}`}>
      <div className="tile-top"><h2>{course.title}</h2><span className="circle-arrow" aria-hidden="true">→</span></div>
      <p>Lesson notes, practice, and videos.</p>
      <div className="tile-bottom"><span>{lessons.filter(l => l.course === course.id).length} {lessons.filter(l => l.course === course.id).length === 1 ? 'lesson' : 'lessons'} available</span><span>View lesson index →</span></div>
    </Link>)}</div>
  </div></section>
}
