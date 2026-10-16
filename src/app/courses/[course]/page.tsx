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
  return <div className="shell course-page"><div className="breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>{course.title}</span></div><header className="page-heading"><p className="eyebrow">{course.kicker}</p><h1>{course.title}</h1><p>{course.description} Choose a lesson to find its video, step-by-step examples, notes, and practice.</p></header><CourseLibrary lessons={lessons.filter(l => l.course === course.id)} /><aside className="course-tip"><span aria-hidden="true">↗</span><p><strong>Your lesson materials are always available.</strong>Open the blank notes to follow along. Try the practice, then compare your work with the completed sheets. More lessons will be added as we work through the course.</p></aside></div>
}
