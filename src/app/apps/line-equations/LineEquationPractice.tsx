'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import Graph from '../slope/Graph'
import { fraction, type Line, type Student } from '@/lib/slope'
import { checkEquationAnswer, equationProgress, equationText, generateEquationLine, type EquationAnswer, type EquationRecord } from '@/lib/line-equation'

const emptyAnswer = (): EquationAnswer => ({ interceptX: '', interceptY: '', rise: '', run: '', equation: '' })
type Field = keyof EquationAnswer
export default function LineEquationPractice() {
  const [student, setStudent] = useState<Student>({ firstName: '', lastName: '', hour: '' })
  const [line, setLine] = useState<Line | null>(null)
  const [history, setHistory] = useState<EquationRecord[]>([])
  const [answer, setAnswer] = useState(emptyAnswer)
  const [attempts, setAttempts] = useState(0)
  const [phase, setPhase] = useState<'answer' | 'retry' | 'correct' | 'revealed'>('answer')
  const [active, setActive] = useState<Field>('interceptX')
  const [message, setMessage] = useState('')
  const [finished, setFinished] = useState<string | null>(null)
  const [notation, setNotation] = useState<'y' | 'f(x)'>('y')
  const [image, setImage] = useState<string | null>(null)
  const inputs = useRef<Partial<Record<Field, HTMLInputElement | null>>>({})
  const allRecords = line && attempts ? [...history, { line, attempts, correct: phase === 'correct' }] : history
  const progress = equationProgress(allRecords)
  const locked = phase === 'correct' || phase === 'revealed' || !!finished
  const name = `${student.firstName} ${student.lastName}`
  function focus(field: Field) { setActive(field); inputs.current[field]?.focus({ preventScroll: true }) }
  function edit(field: Field, value: string) {
    if (locked) return
    if (field === 'equation' ? /^[\dxyf().+\-−*/= ×·]{0,100}$/i.test(value) : /^-?\d{0,3}$/.test(value)) setAnswer(current => ({ ...current, [field]: value }))
  }
  function key(value: string) {
    const current = answer[active]
    edit(active, value === 'clear' ? '' : value === 'back' ? current.slice(0, -1) : current + value)
    focus(active)
  }
  function finish() { setFinished(new Date().toLocaleString()); setImage(null) }
  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!line || locked) return
    if (Object.values(answer).some(value => !value.trim() || value === '-')) { setMessage('Complete the ordered pair, slope, and equation before submitting.'); return }
    const result = checkEquationAnswer(line, answer), nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    if (result.correct) {
      setPhase('correct')
      const simple = fraction(line.rise, line.run)
      setMessage(`That’s correct! The y-intercept is (0, ${line.y}), the slope is ${simple}, and ${notation} = ${equationText(line)}.${answer.rise + '/' + answer.run !== simple && Number(answer.run) !== 1 ? ` Write the slope in simplest form: ${simple}.` : ''}${nextAttempts > 1 ? ' You earned a gold star on your retry; your streak remains reset.' : ' Gold star!'}`)
      if (equationProgress([...history, { line, attempts: nextAttempts, correct: true }]).completed) finish()
    } else {
      const hints = [
        !result.interceptCorrect ? 'Y-intercept: find where the line crosses the y-axis. Its x-coordinate is 0.' : 'Your y-intercept is correct.',
        !result.slopeCorrect ? 'Slope: use two integer grid points. Count rise (up positive, down negative) over run to the right.' : 'Your slope is correct.',
        !result.equationCorrect ? `Equation: use ${notation} = mx + b. Replace m with the slope and b with the y-coordinate of the intercept. Use x for the variable.` : 'Your equation is correct.',
      ]
      if (nextAttempts === 1) { setPhase('retry'); setMessage(`Not quite. Your streak has reset. ${hints.join(' ')} Try again for a gold star.`) }
      else { setPhase('revealed'); setMessage(`The y-intercept is (0, ${line.y}), m = ${fraction(line.rise, line.run)}, and ${notation} = ${equationText(line)}. Compare this with your entries, then try a new graph.`) }
    }
  }
  function nextGraph() {
    if (!line) return
    setHistory(allRecords)
    setLine(generateEquationLine(Math.random, [...history.map(item => item.line), line]))
    setAnswer(emptyAnswer()); setAttempts(0); setPhase('answer'); setMessage('')
    setNotation((history.length + 1) % 2 ? 'f(x)' : 'y'); focus('interceptX')
  }
  function saveImage() {
    const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 850
    const ctx = canvas.getContext('2d'); if (!ctx) { setMessage('Please take a screenshot of this results screen.'); return }
    ctx.fillStyle = '#fffdf8'; ctx.fillRect(0, 0, 1200, 850); ctx.fillStyle = '#16334c'
    const rows = ['MacIntodd Math · Write the line', name, `Class hour ${student.hour}`, `Score: ${progress.score}/10`, `${progress.correct} graphs correct · ${progress.firstTry} correct on first try`, `Best streak: ${progress.bestStreak} / 5 · Final streak: ${progress.streak}`, `${allRecords.length} graphs attempted · ${progress.attempts} answers submitted`, `${Math.max(0, 5 - progress.bestStreak)} point(s) deducted for missing streak`, finished ?? '', 'Submit this image to Google Classroom.']
    rows.forEach((text, index) => { const size = index === 3 ? 60 : index === 1 ? 42 : 30; ctx.font = `${index === 1 || index === 3 ? 'bold ' : ''}${size}px Arial`; ctx.fillText(text, 60, 80 + index * 75, 1080) })
    setImage(canvas.toDataURL('image/png'))
  }
  function field(id: Field, label: string, placeholder?: string) {
    return <input ref={element => { inputs.current[id] = element }} aria-label={label} value={answer[id]} onChange={event => edit(id, event.target.value)} onFocus={() => setActive(id)} inputMode="none" autoComplete="off" autoCapitalize="none" spellCheck={false} disabled={locked} placeholder={placeholder} className={active === id ? 'active' : ''} />
  }
  return <div className="slope-app equation-app shell">
    <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/apps">Practice apps</Link><span>/</span><span>Write the line</span></nav>
    <header className="slope-title"><div><p className="eyebrow">FROM GRAPH TO EQUATION</p><h1>Write the line</h1></div></header>
    {!line ? <form className="slope-start" onSubmit={event => { event.preventDefault(); setStudent({ ...student, firstName: student.firstName.trim(), lastName: student.lastName.trim() }); setLine(generateEquationLine()); setNotation('y') }}>
      <h2>Find the intercept, slope, and equation</h2>
      <p>Earn 10 correct graphs and a best streak of 5 first-try answers for 10/10. A correct retry earns a gold star but breaks the streak. The best streak you reach in this session counts.</p>
      <p>You can submit once you reach a streak of 5 or finish 10 graphs correctly. Your score is your correct total (up to 10), minus one point for each streak point missing from 5. For example, 10 correct with a best streak of 3 earns 8/10. You may keep practicing to improve your score.</p>
      <div className="slope-student-fields">{(['firstName','lastName'] as const).map(id => <label key={id}>{id === 'firstName' ? 'First name' : 'Last name'}<input required maxLength={60} pattern=".*\S.*" autoComplete="off" value={student[id]} onChange={event => setStudent({ ...student, [id]: event.target.value })} /></label>)}<label>Class hour<select required value={student.hour} onChange={event => setStudent({ ...student, hour: event.target.value })}><option value="">Choose hour</option>{['3','6','7','8'].map(hour => <option key={hour}>{hour}</option>)}</select></label></div>
      <p className="slope-storage">Your name, answers, and scores stay in this page on your device. Nothing is sent to a server or saved in browser storage. Take a screenshot at any time, or save your final results image for Google Classroom. Leaving or reloading resets practice.</p>
      <button className="slope-primary">Start practice</button>
    </form> : <>
      <div className="equation-progress"><div className="equation-student"><strong>{name}</strong><span>Class hour {student.hour}</span></div>
      <div className="slope-score" aria-label="Progress"><span>Score <b>{progress.score}</b> / 10</span><span>Correct <b>{progress.correct}</b> / 10</span><span>Streak <b>{progress.streak}</b></span><span>Best streak <b>{progress.bestStreak}</b> / 5</span></div>
      <div className="slope-stars" aria-label={`${progress.correct} gold stars`}>{'★'.repeat(Math.min(progress.correct, 30))}{progress.correct > 30 ? ` +${progress.correct - 30}` : ''}</div></div>
      {finished ? <section className="slope-complete"><h2>{progress.completed ? 'Goal reached!' : 'Practice results'}</h2><p className="equation-results-name">{name} · Class hour {student.hour}</p><h2>Score: {progress.score}/10</h2><p>{progress.correct} correct graphs · {progress.firstTry} correct on first try · best streak {progress.bestStreak}/5</p><p>{allRecords.length} graphs attempted · {progress.attempts} answers submitted</p><p>Correct total (up to 10): {Math.min(10, progress.correct)}. Missing streak deduction: {Math.max(0,5-progress.bestStreak)}.</p><p>{finished}</p><p>Take a screenshot showing your name and score. Upload it to Google Classroom yourself.</p><button onClick={saveImage}>Create results image</button>{image && <div className="slope-result-image"><p><a className="slope-primary" href={image} download="line-equation-results.png">Save results image</a></p>{/* Local image only; no network request. */}
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src={image} alt={`Results for ${name}, hour ${student.hour}: ${progress.score}/10`} width={1200} height={850} /></div>}<div className="slope-actions"><button onClick={() => { setLine(null); setHistory([]); setAttempts(0); setAnswer(emptyAnswer()); setPhase('answer'); setMessage(''); setFinished(null); setImage(null); setStudent({ firstName:'',lastName:'',hour:'' }) }}>Next student / new session</button></div></section> : <>
      <div className="slope-workspace"><section className="slope-graph-panel"><h2>Graph {history.length + 1}</h2><Graph key={history.length} line={line} hint={attempts > 0 && phase !== 'correct'} /><p>Each square is 1 unit. Tap integer points to show coordinates; tap again to hide.</p></section>
      <section className="slope-answer-panel"><h2>Write in slope-intercept form</h2><form onSubmit={submit}>
        <label>Y-intercept (ordered pair)<span className="equation-intercept">(<span>{field('interceptX','Y-intercept x-coordinate')}</span>, <span>{field('interceptY','Y-intercept y-coordinate')}</span>)</span></label>
        <div className="slope-equation"><i>m</i><span>=</span><span className="slope-fraction"><span>rise</span><span>run</span></span><span>=</span><span className="slope-fraction slope-input-fraction">{field('rise','Rise (numerator)')}{field('run','Run (denominator)')}</span></div>
        <label className="equation-final">Equation of the line<span><strong>{notation} =</strong>{field('equation','Equation of the line','mx + b')}</span></label>
        <p className="slope-small">Use x for the variable. For a fractional slope, type 3/5x or (3/5)x. Both y and f(x) mean the output.</p>
        <div className="slope-keypad equation-keypad" aria-label="Number and equation pad">{['7','8','9','4','5','6','1','2','3','-','0','back','x','/','+','(',')','clear'].map(value => <button type="button" key={value} disabled={locked} onPointerDown={event => event.preventDefault()} onClick={() => key(value)} aria-label={value === 'back' ? 'Backspace' : value === '-' ? 'Minus' : value === 'clear' ? 'Clear entry' : value}>{value === 'back' ? '⌫' : value === 'clear' ? 'Clear' : value}</button>)}</div>
        {!locked && <button className="slope-primary slope-submit">{phase === 'retry' ? 'Submit retry' : 'Submit answer'}</button>}
      </form><div className={`slope-feedback ${phase === 'correct' ? 'success' : ''}`} role="status">{message}</div>
      {locked && <button className="slope-primary" onClick={nextGraph}>Next graph →</button>}
      </section></div>
      {progress.canSubmit && <div className="slope-actions equation-finish"><button onClick={finish}>Submit {progress.score}/10 &amp; view results</button><p>You can submit this score now or keep practicing.</p></div>}
      </>}
    </>}
  </div>
}
