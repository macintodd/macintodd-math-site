import { notFound } from 'next/navigation'
import Link from 'next/link'
import { courses, lessons, getLesson } from '@/content/lessons'
import { Math } from '@/components/Math'
import { WorkedExample } from '@/components/WorkedExample'
import { LessonVideo } from '@/components/LessonVideo'

export function generateStaticParams() { return lessons.map(l => ({ course: l.course, lesson: l.slug })) }
export async function generateMetadata({ params }: { params: Promise<{ course: string; lesson: string }> }) { const p = await params; const lesson = getLesson(p.course, p.lesson); return { title: lesson?.title ?? 'Lesson not found', description: lesson?.description } }

export default async function LessonPage({ params }: { params: Promise<{ course: string; lesson: string }> }) {
  const p = await params
  const lesson = getLesson(p.course, p.lesson)
  if (!lesson) notFound()
  const course = courses.find(c => c.id === lesson.course)!
  return <div className="shell"><nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href={`/courses/${course.id}`}>{course.title}</Link><span aria-hidden="true">/</span><span>{lesson.title}</span></nav>
    <header className="lesson-header"><p className="eyebrow">{course.title} · {lesson.unit} · {lesson.number}</p><h1>{lesson.title}</h1><p>{lesson.description}</p><div className="lesson-tags"><span>Video lesson</span><span>{lesson.examples.length} worked examples</span><span>4 printable PDFs</span></div></header>
    <div className="lesson-body"><aside className="lesson-sidebar"><p className="small-label">IN THIS LESSON</p><nav aria-label="Lesson sections"><a href="#overview"><span>01</span> The goal</a><a href="#watch"><span>02</span> Watch & learn</a><a href="#understand"><span>03</span> The main idea</a><a href="#examples"><span>04</span> See the steps</a><a href="#materials"><span>05</span> Notes & practice</a><a href="#check"><span>06</span> Check yourself</a></nav><p className="sidebar-note">Take it one step at a time.<br />All notes and answers are public and ready to use.</p><a className="button button-sm button-light" href="#materials">Get the PDFs ↓</a></aside>
      <div className="lesson-content">
        <section id="overview" className="lesson-section"><div className="goal-card"><p className="section-kicker">01 / THE GOAL</p><h2>By the end, you can…</h2><ul>{lesson.goals.map(g => <li key={g}>{g}</li>)}</ul></div><p className="content-note" style={{ marginTop: 16 }}><strong>Before you start:</strong> {lesson.prerequisites}</p></section>
        <section id="watch" className="lesson-section"><p className="section-kicker">02 / WATCH & LEARN</p><h2>A little guidance goes a long way.</h2><p>Keep your notes nearby. Pause whenever you need to try a step yourself.</p>{lesson.videos.map(v => <LessonVideo key={v.id} video={v} />)}</section>
        <section id="understand" className="lesson-section"><p className="section-kicker">03 / THE MAIN IDEA</p><h2>Let’s make it click.</h2><div className="concept-grid">{lesson.concepts.map(c => <article className="concept-card" key={c.title}><h3>{c.title}</h3><p>{c.text}</p>{c.formula && <div className="concept-formula"><Math display>{c.formula}</Math></div>}{c.note && <p className="concept-note">{c.note}</p>}</article>)}</div></section>
        <section id="examples" className="lesson-section"><p className="section-kicker">04 / SEE THE STEPS</p><h2>One step. Then the next.</h2><p>These examples follow the problem types on your practice sheet. Use Next step to reveal the reasoning, or open the complete solution to read at your own pace.</p>{lesson.examples.map(ex => <WorkedExample key={ex.id} example={ex} />)}</section>
        <section id="materials" className="lesson-section"><p className="section-kicker">05 / NOTES & PRACTICE</p><h2>Your lesson toolkit.</h2><p>Open a PDF in a new tab to read or print it, or download a copy for your device.</p><div className="material-grid">{lesson.materials.map(m => <article className="material-card" key={m.file}><span className="material-type">{m.kind} · PDF · {m.pages} PAGES</span><h3>{m.title}</h3><p>{m.description}</p><div className="material-actions"><a href={`/materials/${m.file}`} target="_blank" rel="noopener noreferrer" aria-label={`Open ${lesson.title} ${m.title} PDF in a new tab`}>Open PDF ↗</a><a href={`/materials/${m.file}`} download aria-label={`Download ${lesson.title} ${m.title} PDF`}>Download ↓</a></div></article>)}</div>{lesson.practiceApp && <aside className="practice-callout"><h3>Ready for a few more?</h3><p>Practice choosing the inverse operation in the one-step equation app. The score is for this visit only.</p><Link className="button button-dark button-sm" href={lesson.practiceApp}>Open practice app →</Link></aside>}</section>
        <section id="check" className="lesson-section"><p className="section-kicker">06 / CHECK YOURSELF</p><h2>Give it a try.</h2><details className="self-check"><summary>{lesson.check.question}<span className="content-note" style={{ display: 'block', marginTop: 8 }}>Think it through, then tap to reveal the answer.</span></summary><p><Math display>{lesson.check.answer}</Math></p><p>{lesson.check.explanation}</p></details></section>
        <div className="lesson-end"><Link href={`/courses/${course.id}`}>← Back to {course.title}</Link><a href="#materials">Get the lesson materials ↑</a></div>
      </div>
    </div>
  </div>
}
