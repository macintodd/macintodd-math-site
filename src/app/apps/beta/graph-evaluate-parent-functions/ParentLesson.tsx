'use client'
import Link from 'next/link'
import {useCallback,useEffect,useReducer,useRef,useState,useSyncExternalStore} from 'react'
import CompletionFlow from '@/components/practice/CompletionFlow'
import {useWidgetLanguage} from '@/components/practice/BilingualWidget'
import SkillWelcome,{SkillIdentityFields} from '@/components/practice/SkillWelcome'
import {Math as Formula} from '@/components/Math'
import {SketchFrame} from '@/components/StudySketch'
import {installLessonBridge,type LessonMathBoardWindow} from '@/lib/mathboard/lesson-bridge'
import type {CompletionDisplayState} from '@/lib/mathboard/display-mirror'
import {familyIds,familyNames} from '@/lib/function-family-graphs'
import {parentGraphCheck} from '@/lib/graph-parent-functions'
import {freshParentLesson,parentLessonReducer,parentLessonSnapshot,readParentLessonSnapshot,parentLessonStars,parentLessonTitle,parentLessonSlug,parentLessonScore,parentLessonMastered,graphCredits,lessonEquation,lessonExamples,lessonMinimum,graphSpec,evaluationWork} from '@/lib/parent-function-lesson'
import StreakStars from '../function-family-graphs/StreakStars'
import StarRewards from '../function-family-graphs/StarRewards'
import ScratchPad from '../../graph-linear/ScratchPad'
import ParentLessonGraph from './ParentLessonGraph'
import ParentInformation from './ParentInformation'
const subscribe=()=>()=>{}
const readDisplay=()=>new URLSearchParams(window.location.search).get('mathboardDisplay')==='1'
export default function ParentLesson(){
 const [state,dispatch]=useReducer(parentLessonReducer,undefined,freshParentLesson)
 const displayOnly=useSyncExternalStore(subscribe,readDisplay,()=>false)
 const [restoreRevision,setRestoreRevision]=useState(0),[scrollY,setScrollY]=useState(0)
 const {language,setLanguage,translate:t,displayText}=useWidgetLanguage(),show=displayText??t
 const native=typeof window!=='undefined'&&!!(window as LessonMathBoardWindow).MathBoardApplet
 const readOnly=useRef(false),interacted=useRef(false),appliedScroll=useRef(0)
 const completionChanged=useCallback((value:CompletionDisplayState)=>dispatch({type:'completion',value}),[])
 const question=state.question,isGraph=question.kind==='graph',score=parentLessonScore(state),stars=parentLessonStars(state)
 useEffect(()=>{
  const host=window as LessonMathBoardWindow,bridge=installLessonBridge(host)
  readOnly.current=bridge.displayOnly
  const arm=(event:Event)=>{if(event.isTrusted)interacted.current=true}
  const events=['pointerdown','keydown','input','click','wheel']
  for(const name of events)window.addEventListener(name,arm,true)
  const disconnect=bridge.listen(incoming=>{
   const value=readParentLessonSnapshot(incoming)
   if(!value)return false
   interacted.current=false
   dispatch({type:'restore',value:value.customState.state})
   setLanguage(value.customState.language);setScrollY(value.customState.scrollY);setRestoreRevision(n=>n+1)
   return true
  })
  return()=>{disconnect();for(const name of events)window.removeEventListener(name,arm,true)}
 },[setLanguage])
 useEffect(()=>{
  if(!native)return
  let timer:ReturnType<typeof setTimeout>|undefined
  const settled=()=>{clearTimeout(timer);timer=setTimeout(()=>setScrollY(Math.round(window.scrollY)),120)}
  window.addEventListener('scroll',settled,{passive:true})
  return()=>{clearTimeout(timer);window.removeEventListener('scroll',settled)}
 },[native])
 useEffect(()=>{if(restoreRevision===appliedScroll.current)return;appliedScroll.current=restoreRevision;window.scrollTo(0,scrollY)},[restoreRevision,scrollY])
 useEffect(()=>{
  const host=window as LessonMathBoardWindow
  if(!native||!interacted.current||readOnly.current||!host.mathBoardLessonBridge?.canPublish())return
  host.MathBoardApplet?.publishState?.(parentLessonSnapshot(state,language,scrollY))
 },[native,state,language,scrollY])
 const report=()=>dispatch({type:'report',now:Date.now()})
 const worked=evaluationWork(question),right=state.result==='right'||state.result==='guided'
 const nextKind=isGraph?state.result!=='right'||state.graphAttempts===1||state.graphsSinceEval>=2?'evaluate':'graph':state.debt>0?'evaluate':'graph'
 const details=['Goal: graph every family twice without hints.','Each missed evaluation deducts one point. Each correct recovery evaluation restores one point.']
 if(state.scene==='report')return <div className="ffg-report"><CompletionFlow key={`${state.completedAt}-${restoreRevision}`} slug={parentLessonSlug} name={`${state.first.trim()} ${state.last.trim()}`} hour={state.hour} completedAt={state.completedAt} score={`${score}/10`}
  stats={[{label:'Graphs without hints',value:graphCredits(state)},{label:'Graph attempts',value:state.graphAttempts},{label:'Evaluations correct',value:state.evalCorrect},{label:'Evaluation attempts',value:state.evalAttempts},{label:'Points to earn back',value:state.debt},{label:'Points earned back',value:state.recovered},{label:'Hints used',value:state.hints}]}
  details={[...details,...familyIds.map(f=>`${t(familyNames[f])}: ${state.credits[f]}/2`)]}
  onReturn={()=>dispatch({type:'return'})} readOnly={displayOnly} mirror={state.completion} onMirrorChange={completionChanged}/></div>
 return <main className={`ffg-app pfl-app ${displayOnly?'ffg-display':''}`} inert={displayOnly?true:undefined}>
  <StarRewards state={stars} restoreRevision={restoreRevision}/>
  <header className={`ffg-header ${state.scene!=='welcome'?'pfl-compact-header':''}`}><div><Link href="/apps/beta">{show('← Beta apps')}</Link><p className="ffg-eyebrow">{show('ALGEBRA 2 · PARENT FUNCTIONS')}</p><div className="ffg-title-row"><h1>{show(parentLessonTitle)}</h1><ParentInformation open={state.infoOpen} onOpenChange={open=>dispatch({type:'info',open})} readOnly={displayOnly}/></div></div>{state.scene!=='welcome'&&<div className="ffg-identity"><strong data-no-translate>{state.first} {state.last}</strong><span>{show('Class hour')} <b data-no-translate>{state.hour}</b></span></div>}</header>
  {state.scene==='welcome'?<SkillWelcome catchphrase="Inputs become points. Points become graphs." subtitle="Evaluate it. Plot it. Know it." skill="Graph and evaluate parent functions"
   visual={<div className="pfl-welcome-visual"><Formula>{'f(x)=x^2'}</Formula><Formula>{'f(3)=9'}</Formula><svg viewBox="0 0 280 180" role="img" aria-label={t('Evaluating f at 3 gives the graph point (3, 9).')}><path d="M20 160H260M140 170V10" stroke="#abbcc9"/><path d="M100 0Q140 320 180 0" fill="none" stroke="#235eb3" strokeWidth="3"/><circle cx="170" cy="70" r="6" fill="#a65324"/><text x="182" y="66" fill="#0f3460" fontSize="17">(3, 9)</text></svg></div>}
   goal={<><p>{show('Each family')}<strong>{show('2 no-hint graphs')}</strong></p><p>{show('Earn back evaluation points')}</p></>}
   scoreNote={show('Score = no-hint graphs earned − evaluation points still to recover.')}>
   <form onSubmit={e=>{e.preventDefault();dispatch({type:'start',seed:Math.floor(Math.random()*2**32)})}}><SkillIdentityFields value={state} onChange={(field,value)=>dispatch({type:'identity',field,value})}/><button className="skill-welcome-start" type="submit">{show('Start Skill Practice')}<span aria-hidden="true">→</span></button></form>
  </SkillWelcome>:<>
   <div className="ffg-progress"><SketchFrame/><StreakStars state={stars}/><div className="ffg-total-correct"><span>{show('Number correct')}</span><strong data-no-translate>{state.correct}</strong></div><div className="ffg-practice-score"><span>{show('Practice score')}</span><strong data-no-translate>{score}<small>/10</small></strong></div><button type="button" onClick={report}>{show('Get grade report')}</button></div>
   <div className="pfl-mastery" aria-label={t('No-hint graph progress')}>{familyIds.map(f=><div key={f} className={state.credits[f]===2?'pfl-family-complete':''}><span>{show(familyNames[f])}</span><strong aria-label={`${t('Graphs without hints')}: ${state.credits[f]} / 2`} data-no-translate>{state.credits[f]}/2</strong></div>)}</div>
   {state.scene==='complete'?<section className="pfl-complete pfl-paper"><SketchFrame/><span aria-hidden="true">★ ★ ★</span><h2>{show('You know your parent functions!')}</h2><p>{show('You graphed all five families twice without hints and recovered every evaluation point.')}</p><strong data-no-translate>10/10</strong><button className="ffg-primary" type="button" onClick={report}>{show('Get grade report')}</button></section>:<>
    <div className="pfl-mode"><span className="ffg-chip">{show(isGraph?'GRAPH A PARENT FUNCTION':'EVALUATE A PARENT FUNCTION')}</span>{state.debt>0&&<strong className="pfl-debt"><span>{show('Points to earn back')}</span>: <b data-no-translate>{state.debt}</b></strong>}<button type="button" onClick={()=>dispatch({type:'scratch-open',open:!state.scratchOpen})} aria-expanded={state.scratchOpen}>{show(state.scratchOpen?'Close scratch paper':'Scratch paper')}</button></div>
    <section className={`pfl-workspace ${isGraph?'':'pfl-evaluation-workspace'}`}>
     <section className="pfl-paper pfl-board"><SketchFrame/>{isGraph?<><div className="pfl-board-title"><span>{show(familyNames[question.family])}</span><Formula>{lessonEquation(question)}</Formula></div><ParentLessonGraph state={state} dispatch={dispatch} readOnly={displayOnly}/><p className="pfl-grid-note">{show('Tap an intersection to plot a point. Tap that point again to remove it.')}</p></>:<>
      <p className="ffg-eyebrow">{show('INPUT → OUTPUT → POINT')}</p><div className="pfl-eval-equation"><Formula display>{lessonEquation(question)}</Formula></div><h2>{question.label==='y'?<><span>{show('Determine y when')}</span> <Formula>{`x=${question.input}`}</Formula></>:<><span>{show('What is')}</span> <Formula>{`${question.label}(${question.input})`}</Formula>?</>}</h2>
      <p>{show('The input is the x-coordinate. Your output is the y-coordinate.')}</p>
      {state.result&&<div className="pfl-worked" aria-label={t('Worked evaluation')}><p>{show('Replace x with the input:')}</p><Formula display>{worked.substitute}</Formula><p>{show('Simplify:')}</p><Formula display>{worked.simplify}</Formula><p>{show('This gives the graph point:')}</p><Formula display>{worked.point}</Formula></div>}
     </>}</section>
     <section className="pfl-paper pfl-task"><SketchFrame/>{isGraph?<>
      <h2>{show('Build this graph from points.')}</h2><p><span>{show('Minimum points')}</span>: <b data-no-translate>{lessonMinimum(question)}</b></p><p>{show(question.family==='constant'?'Use three different x-values. Keep the output constant.':question.family==='linear'?'Include the origin and a point on each side of the y-axis.':'Include the origin and two points on each side of the y-axis.')}</p>
      <div className="pfl-points" aria-label={t('Plotted points')}>{state.points.length?state.points.map(p=><button key={`${p.x},${p.y}`} type="button" disabled={!!state.result} aria-label={`${t('Remove point')} (${p.x}, ${p.y})`} onClick={()=>dispatch({type:'point',point:p})} data-no-translate>({p.x}, {p.y})</button>):<p>{show('No points plotted yet.')}</p>}</div>
      {(state.hintUsed||state.result)&&<div className="pfl-coordinates"><p>{show('Example points for this parent:')}</p><div data-no-translate>{lessonExamples(question).map(p=><span key={p.x}>({p.x}, {p.y})</span>)}</div>{state.result==='wrong'&&<p>{show(parentGraphCheck(graphSpec(question),state.points).hint)}</p>}</div>}
     </>:<>
      <label className="pfl-answer-label" htmlFor="pfl-evaluation-answer">{show('Your output')}</label><input id="pfl-evaluation-answer" className={`pfl-answer ${state.result?right?'pfl-answer-right':'pfl-answer-wrong':''}`} inputMode="none" autoComplete="off" value={state.input} disabled={!!state.result} maxLength={14} onChange={e=>dispatch({type:'input',value:e.target.value})} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();dispatch({type:'check'})}}}/>
      <div className="pfl-keypad" role="group" aria-label={t('Number keypad')}>{['7','8','9','4','5','6','1','2','3','minus','0','back'].map(key=><button key={key} type="button" disabled={!!state.result} aria-label={key==='minus'?t('Change sign'):key==='back'?t('Backspace'):key} onClick={()=>dispatch({type:'key',key})}>{key==='minus'?'±':key==='back'?'⌫':key}</button>)}<button className="pfl-keypad-clear" type="button" disabled={!!state.result} onClick={()=>dispatch({type:'key',key:'clear'})}>{show('Clear answer')}</button></div>
     </>}
      {state.invalid&&<p role="alert" className="pfl-error">{show(isGraph?'Plot the minimum number of points before checking.':'Enter a whole-number answer.')}</p>}
      <div className={`pfl-feedback ${right?'pfl-feedback-right':state.result==='wrong'?'pfl-feedback-wrong':''}`} role="status" aria-live="polite">{state.result&&<p>{show(isGraph?state.result==='right'?'You earned a no-hint graph!':state.result==='guided'?'Correct with a hint. This family will return for a no-hint graph.':'Study the graph and points. This family will return.':state.result==='wrong'?'Study the steps. A new evaluation gives you a chance to earn the point back.':state.recoveredThis?'Correct! You earned one point back.':'Correct! The output gives the point’s y-coordinate.')}</p>}{state.hintUsed&&!state.result&&<p>{show('This graph is guided. You will earn its point on a later no-hint attempt.')}</p>}</div>
      <div className="pfl-actions">{state.result?<button className="ffg-primary" type="button" onClick={()=>dispatch({type:'next'})}>{show(parentLessonMastered(state)?'Finish this lesson':nextKind==='evaluate'?'Next: evaluate a function':'Next: graph a parent function')}</button>:<><button className="ffg-primary" type="button" onClick={()=>dispatch({type:'check'})} disabled={isGraph&&state.points.length<lessonMinimum(question)}>{show(isGraph?'Check graph':'Check output')}</button>{isGraph&&<><button type="button" onClick={()=>dispatch({type:'clear'})}>{show('Clear points')}</button><button type="button" disabled={state.hintUsed} onClick={()=>dispatch({type:'hint'})}>{show('Show a hint')}</button></>}</>}</div>
     </section>
    </section>
    {state.scratchOpen&&<section className="pfl-paper pfl-scratch"><SketchFrame/><h2>{show('Scratch paper')}</h2><ScratchPad key={`${state.index}-${restoreRevision}`} height={250} initialStrokes={state.scratch} initialErase={state.erase} readOnly={displayOnly} onStrokesCommit={strokes=>dispatch({type:'scratch',strokes})} onToolChange={value=>dispatch({type:'erase',value})}/></section>}
   </>}
  </>}
 </main>
}
