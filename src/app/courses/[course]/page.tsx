import { notFound } from 'next/navigation'
import Link from 'next/link'
import { courses, lessons } from '@/content/lessons'
import { CourseLibrary } from '@/components/CourseLibrary'

export function generateStaticParams() { return courses.map(c => ({ course: c.id })) }
export async function generateMetadata({ params }: { params: Promise<{ course: string }> }) { const { course } = await params; return { title: courses.find(c => c.id === course)?.title ?? 'Course not found' } }
export default async function CoursePage({ params }: { params: Promise<{ course: string }> }) {
  const { course: courseId } = await params
  const course = courses.find(c => c.id === courseId)
  if (!course) notFound()
  return <div className="shell course-page"><div className="breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>{course.title}</span></div><header className="page-heading"><h1>{course.title}</h1><p>Lesson index. Select a lesson to open its PDFs, instruction, and examples.</p></header><CourseLibrary lessons={lessons.filter(l => l.course === course.id)} /></div>
}
