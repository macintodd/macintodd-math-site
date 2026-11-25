'use client'
import Link from 'next/link'
import {useCallback, useEffect, useReducer, useRef, useState, useSyncExternalStore} from 'react'
import CompletionFlow from '@/components/practice/CompletionFlow'
import {useWidgetLanguage} from '@/components/practice/BilingualWidget'
import {installLessonBridge, type LessonMathBoardWindow} from '@/lib/mathboard/lesson-bridge'
import type {CompletionDisplayState} from '@/lib/mathboard/display-mirror'
import {
  activeFamilyQuestion, familyIds, familyNames, familyHints,
  graphFamilySnapshot, readGraphFamilySnapshot, graphFamilySlug, graphFamilyTitle,
} from '@/lib/function-family-graphs'
import FamilyGraph from './FamilyGraph'
import StreakStars from './StreakStars'
import {SketchFrame} from '@/components/StudySketch'
import {familyStarReducer, freshFamilyStarState} from '@/lib/function-family-stars'

const subscribeDisplay = () => () => {}
const readDisplay = () => new URLSearchParams(window.location.search).get('mathboardDisplay') === '1'

export default function FamilyGraphs() {
  const [state, dispatch] = useReducer(familyStarReducer, undefined, freshFamilyStarState)
  const displayOnly = useSyncExternalStore(subscribeDisplay, readDisplay, () => false)
  const [restoreRevision, setRestoreRevision] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const {language, setLanguage, translate: t, displayText} = useWidgetLanguage(), show = displayText ?? t
  const question = activeFamilyQuestion(state), isSpeed = state.scene === 'speed' || state.scene === 'speed-result'
  const selected = isSpeed ? state.speed.selected : state.practice.selected
  const right = selected === null ? null : selected === question.family
  const practiceScore = Math.min(10, state.practice.best)
  const native = typeof window !== 'undefined' && !!(window as LessonMathBoardWindow).MathBoardApplet
  const readOnlyRef = useRef(false), interacted = useRef(false), appliedScroll = useRef(0)
  const completionChanged = useCallback((value: CompletionDisplayState) => dispatch({type: 'completion', value}), [])

  useEffect(() => {
    const host = window as LessonMathBoardWindow, bridge = installLessonBridge(host)
    readOnlyRef.current = bridge.displayOnly
    // A reused WKWebView can arrive with an already-armed bridge from another widget.
    // Only this widget's own trusted interactions may publish its fresh state.
    const arm = (event: Event) => {if (event.isTrusted) interacted.current = true}
    const events = ['pointerdown', 'keydown', 'input', 'click', 'wheel']
    for (const name of events) window.addEventListener(name, arm, true)
    const disconnect = bridge.listen(incoming => {
      const value = readGraphFamilySnapshot(incoming)
      if (!value) return false
      interacted.current = false
      dispatch({type: 'restore', value: value.customState.state})
      setLanguage(value.customState.language)
      setScrollY(value.customState.scrollY)
      setRestoreRevision(n => n + 1)
      return true
    })
    return () => {disconnect(); for (const name of events) window.removeEventListener(name, arm, true)}
  }, [setLanguage])

  useEffect(() => {
    if (!native) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const settled = () => {clearTimeout(timer); timer = setTimeout(() => setScrollY(Math.round(window.scrollY)), 120)}
    window.addEventListener('scroll', settled, {passive: true})
    return () => {clearTimeout(timer); window.removeEventListener('scroll', settled)}
  }, [native])
  useEffect(() => {
    if (restoreRevision === appliedScroll.current) return
    appliedScroll.current = restoreRevision
    window.scrollTo(0, scrollY)
  }, [restoreRevision, scrollY])
  useEffect(() => {
    const host = window as LessonMathBoardWindow
    if (!native || !interacted.current || readOnlyRef.current || !host.mathBoardLessonBridge?.canPublish()) return
    host.MathBoardApplet?.publishState?.(graphFamilySnapshot(state, language, scrollY))
  }, [native, state, language, scrollY])
  useEffect(() => {
    if (state.scene !== 'speed') return
    const tick = () => {
      const host = window as LessonMathBoardWindow
      if (readOnlyRef.current || native && (!interacted.current || !host.mathBoardLessonBridge?.canPublish())) return
      dispatch({type: 'tick', now: Date.now()})
    }
    // Date-based deadlines prevent extra time from backgrounding or timer throttling.
    const timer = setInterval(tick, 100)
    window.addEventListener('visibilitychange', tick)
    return () => {clearInterval(timer); window.removeEventListener('visibilitychange', tick)}
  }, [state.scene, native])

  function report() {if (!displayOnly) dispatch({type: 'report', now: Date.now()})}
  const identity = <div className="ffg-identity"><strong data-no-translate>{state.first} {state.last}</strong><span><span>{show('Class hour')}</span> <b data-no-translate>{state.hour}</b></span></div>
  const header = <header className="ffg-header"><div><Link href="/apps/beta">{show('← Beta apps')}</Link><p className="ffg-eyebrow">{show('ALGEBRA 2 · FUNCTION TRANSFORMATIONS')}</p><h1>{show(graphFamilyTitle)}</h1></div>{state.scene !== 'welcome' && identity}</header>
  if (state.scene === 'report') return <div className="ffg-report">
    <CompletionFlow key={`${state.completedAt}-${restoreRevision}`} slug={graphFamilySlug} name={`${state.first.trim()} ${state.last.trim()}`} hour={state.hour}
      completedAt={state.completedAt} score={`${practiceScore}/10`}
      stats={[{label: 'Best practice streak', value: state.practice.best}, {label: 'Correct answers', value: state.practice.correct}, {label: 'Graphs answered', value: state.practice.attempts},
        ...(state.speed.round ? [{label: 'Best speed-round score', value: state.speed.best}, {label: 'Last speed-round score', value: state.speed.last ?? 0}, {label: 'Speed rounds played', value: state.speed.round}] : [])]}
      details={['Practice score = your best correct streak, up to 10. A miss never erases your best streak.', 'Speed-round scores are separate from your practice grade.']}
      onReturn={() => dispatch({type: 'return'})} readOnly={displayOnly} mirror={state.completion} onMirrorChange={completionChanged}/>
  </div>

  return <main className={`ffg-app ${displayOnly ? 'ffg-display' : ''}`} inert={displayOnly ? true : undefined}>
    {header}
    {state.scene === 'welcome' ? <section className="ffg-welcome"><SketchFrame/>
      <div className="ffg-welcome-copy"><span className="ffg-chip">{show('LOOK AT THE SHAPE')}</span><h2>{show('Different graphs. Familiar families.')}</h2>
        <p>{show('Recognize constant, linear, absolute value, quadratic, and cubic functions by their graphs.')}</p>
        <ul><li>{show('Build a streak of 10 correct answers. Your best streak is your score out of 10.')}</li><li>{show('Get a grade report whenever you are ready, even before a streak of 10.')}</li><li>{show('After a streak of 10, try the repeatable one-minute speed round.')}</li></ul>
        <form onSubmit={event => {event.preventDefault(); dispatch({type: 'start', seed: Math.floor(Math.random() * 2 ** 32)})}}>
          <div className="ffg-name-fields">{(['first', 'last', 'hour'] as const).map(field => <label key={field}>{show(field === 'first' ? 'First name' : field === 'last' ? 'Last name' : 'Class hour')}<input required maxLength={40} autoComplete="off" name={field} value={state[field]} onChange={event => dispatch({type: 'identity', field, value: event.target.value})}/></label>)}</div>
          <button className="ffg-primary" type="submit">{show('Start graph practice →')}</button>
        </form>
        <p className="ffg-local-note">{show('Your name and report stay in this activity. There is no account or continue-later code.')}</p>
      </div>
      <aside className="ffg-series"><div className="ffg-series-art" aria-hidden="true"><svg viewBox="0 0 340 205"><path d="M22 166H320M170 20V190" fill="none" stroke="#a6b6c9" strokeWidth="1.5"/><path d="M55 25Q170 302 285 25" fill="none" stroke="#235eb3" strokeWidth="4"/><path d="M30 140L155 65L300 152" fill="none" stroke="#b77d3b" strokeWidth="3" strokeDasharray="7 6"/><circle cx="170" cy="164" r="5" fill="#235eb3"/></svg></div>
        <h2>{show('Your transformation series')}</h2><ol><li aria-current="step"><b>{show('Identify Function Family from Graph')}</b><span>{show('You are here')}</span></li><li>{show('Identify Function Family from Equation')}<span>{show('Coming next')}</span></li><li>{show('Graphing Parent Functions')}<span>{show('Planned')}</span></li></ol>
      </aside>
    </section> : state.scene === 'ready' ? <section className="ffg-speed-ready"><SketchFrame/>
      <span className="ffg-chip">{show('10 IN A ROW · READY FOR MORE')}</span><h2>{show('One minute. One perfect run.')}</h2><p>{show('Identify as many graphs as you can in a row. The first miss or the end of the minute ends the round.')}</p>
      <div className="ffg-speed-rules"><span><b data-no-translate>60</b><span>{show('seconds')}</span></span><span><b data-no-translate>1</b><span>{show('miss ends the round')}</span></span><span><b aria-hidden="true">↻</b><span>{show('unlimited retries')}</span></span></div>
      <p>{show('After each correct answer, the equation appears briefly, then the next graph arrives. The timer keeps running.')}</p><p>{show('Your speed-round score is the number correct in a row. It does not change your practice grade.')}</p>
      <div className="ffg-actions"><button className="ffg-primary" type="button" onClick={() => dispatch({type: 'start-speed', now: Date.now()})}>{show('Start 60-second round →')}</button><button type="button" onClick={report}>{show('Get grade report')}</button></div>
      <button className="ffg-text-button" type="button" onClick={() => {dispatch({type: 'practice'}); dispatch({type: 'next'})}}>{show('Practice more graphs')}</button>
    </section> : <>
      <div className="ffg-progress"><SketchFrame/>
        {isSpeed ? <><div className="ffg-timer" role="timer" aria-label={t('Seconds remaining')}><strong data-no-translate>{Math.ceil(state.speed.remainingMs / 1000)}</strong><span>{show('seconds left')}</span></div><div><span>{show('Speed-round score')}</span><strong data-no-translate>{state.speed.count}</strong></div><div><span>{show('Best speed round')}</span><strong data-no-translate>{Math.max(state.speed.best, state.speed.count)}</strong></div></> : <>
          <StreakStars state={state}/><div className="ffg-total-correct"><span>{show('Number correct')}</span><strong data-no-translate>{state.practice.correct}</strong></div><div className="ffg-practice-score"><span>{show('Practice score')}</span><strong data-no-translate>{practiceScore}<small>/10</small></strong></div>
        </>}
        <button type="button" onClick={report}>{show('Get grade report')}</button>
      </div>
      <section className="ffg-workspace" aria-label={t('Graph and family choices')}>
        <div className="ffg-graph-card"><SketchFrame/><div className="ffg-graph-heading"><span>{show(isSpeed ? 'SPEED ROUND' : 'GRAPH PRACTICE')}</span><span><span>{show('Graph')}</span> <b data-no-translate>{(isSpeed ? state.speed.index : state.practice.index) + 1}</b></span></div><FamilyGraph question={question} reveal={right === true}/></div>
        <div className="ffg-answer-panel">
          {state.scene === 'speed-result' ? <section className="ffg-round-result" aria-live="polite"><SketchFrame/><span className="ffg-chip">{show('ROUND OVER')}</span><h2>{show(state.speed.reason === 'time' ? 'Time is up!' : state.speed.reason === 'report' ? 'Round finished.' : 'One miss ends this round.')}</h2><p>{show('Your speed-round score')}</p><strong className="ffg-round-score" data-no-translate>{state.speed.count}</strong><p>{show('correct in a row')}</p>{state.speed.reason === 'miss' && <p><span>{show('This graph belongs to:')}</span> <b>{show(familyNames[question.family])}</b></p>}<div className="ffg-actions"><button className="ffg-primary" type="button" onClick={() => dispatch({type: 'start-speed', now: Date.now()})}>{show('Try the speed round again')}</button><button type="button" onClick={report}>{show('Get grade report')}</button><button type="button" onClick={() => {dispatch({type: 'practice'}); dispatch({type: 'next'})}}>{show('Practice more graphs')}</button></div></section> : <>
            <p className="ffg-eyebrow">{show('NAME THE FAMILY')}</p><h2>{show('Which family does this graph belong to?')}</h2>
            <div className="ffg-choices" role="group" aria-label={t('Function families')}>{familyIds.map((family, i) => <button key={family} type="button" disabled={selected !== null} aria-pressed={selected === family} className={selected === family ? right ? 'ffg-choice-correct' : 'ffg-choice-wrong' : ''} onClick={() => dispatch({type: 'answer', family, now: Date.now()})}><SketchFrame/><span className="ffg-choice-letter" aria-hidden="true">{String.fromCharCode(65 + i)}</span><span>{show(familyNames[family])}</span>{selected === family && <b aria-hidden="true">{right ? '✓' : '×'}</b>}</button>)}</div>
            <div className={`ffg-feedback ${right === true ? 'ffg-feedback-correct' : right === false ? 'ffg-feedback-wrong' : ''}`} role="status" aria-live="polite">
              {selected === null ? <p>{show('Look at the shape, then choose its family.')}</p> : <><strong>{show(right ? 'Correct! Same family, even when the graph moves.' : 'Not quite. Your best streak is safe.')}</strong>{!right && <p><b>{show(familyNames[question.family])}</b><span> · </span>{show(familyHints[question.family])}</p>}</>}
            </div>
            {state.scene === 'practice' && selected !== null && (practiceScore >= 10 ? <div className="ffg-actions"><button className="ffg-primary" type="button" onClick={() => dispatch({type: 'ready'})}>{show('Try the speed round →')}</button><button type="button" onClick={report}>{show('Get grade report')}</button></div> : <button className="ffg-primary ffg-next" type="button" onClick={() => dispatch({type: 'next'})}>{show('Next graph →')}</button>)}
            {state.scene === 'speed' && right && <p className="ffg-speed-next">{show('Next graph arriving…')}</p>}
          </>}
        </div>
      </section>
      <footer className="ffg-footnote"><p>{show(isSpeed ? 'Speed score = correct answers in this run. Try again as often as you like.' : 'A miss restarts the current streak. Your best streak is kept for your grade.')}</p>{!isSpeed && <span>{show('No timer in practice.')}</span>}</footer>
    </>}
  </main>
}
