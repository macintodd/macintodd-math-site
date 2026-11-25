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
import {familyIds,familyNames,parentEquations} from '@/lib/function-family-graphs'
import {equationFamilySlug,equationFamilyTitle} from '@/lib/function-family-equations'
import {freshEquationState,equationReducer,activeEquationQuestion,equationStarDisplay,availableStreakKeeps,canKeepStreak,equationScore,equationSnapshot,readEquationSnapshot} from '@/lib/function-family-equation-state'
import StreakStars from '../function-family-graphs/StreakStars'
import StarRewards from '../function-family-graphs/StarRewards'
import EquationInformation from './EquationInformation'
const subscribe=()=>()=>{}
const readDisplay=()=>new URLSearchParams(window.location.search).get('mathboardDisplay')==='1'
export default function FamilyEquations(){
 const [state,dispatch]=useReducer(equationReducer,undefined,freshEquationState)
 const displayOnly=useSyncExternalStore(subscribe,readDisplay,()=>false)
 const [restoreRevision,setRestoreRevision]=useState(0),[scrollY,setScrollY]=useState(0)
 const {language,setLanguage,translate:t,displayText}=useWidgetLanguage(),show=displayText??t
 const native=typeof window!=='undefined'&&!!(window as LessonMathBoardWindow).MathBoardApplet
 const readOnly=useRef(false),interacted=useRef(false),appliedScroll=useRef(0)
 const completionChanged=useCallback((value:CompletionDisplayState)=>dispatch({type:'completion',value}),[])
 const question=activeEquationQuestion(state),stats=state[state.phase],stars=equationStarDisplay(state)
 const score=equationScore(state),right=stats.result==='right'
 useEffect(()=>{
  const host=window as LessonMathBoardWindow,bridge=installLessonBridge(host)
  readOnly.current=bridge.displayOnly
  const arm=(event:Event)=>{if(event.isTrusted)interacted.current=true}
  const events=['pointerdown','keydown','input','click','wheel']
  for(const name of events)window.addEventListener(name,arm,true)
  const disconnect=bridge.listen(incoming=>{
   const value=readEquationSnapshot(incoming)
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
  host.MathBoardApplet?.publishState?.(equationSnapshot(state,language,scrollY))
 },[native,state,language,scrollY])
 useEffect(()=>{
  if(state.scene!=='practice')return
  const tick=()=>{
   const host=window as LessonMathBoardWindow
   if(readOnly.current||native&&(!interacted.current||!host.mathBoardLessonBridge?.canPublish()))return
   dispatch({type:'tick',now:Date.now()})
  }
  const timer=setInterval(tick,100)
  return()=>clearInterval(timer)
 },[native,state.scene])
 const report=()=>dispatch({type:'report',now:Date.now()})
 const advanced=state.phase==='advanced'
 if(state.scene==='report')return <div className="ffg-report"><CompletionFlow key={`${state.completedAt}-${restoreRevision}`} slug={equationFamilySlug} name={`${state.first.trim()} ${state.last.trim()}`} hour={state.hour} completedAt={state.completedAt} score={`${score}/10`}
  stats={[{label:'Correct answers',value:state.parents.correct+state.advanced.correct},{label:'Equations answered',value:state.parents.attempts+state.advanced.attempts},{label:'Best parent streak',value:state.parents.best},{label:'Best advanced streak',value:state.advanced.best},{label:'Streak Keeps used',value:state.keepsUsed}]}
  details={['Parents complete: 5/10 minimum; advanced best streak up to 10/10.','Goal: 10 in a row with parents, then 10 in a row in advanced identification.','A Streak Keep saves a broken run; it does not turn a missed answer into a correct answer.']}
  onReturn={()=>dispatch({type:'return',now:Date.now()})} readOnly={displayOnly} mirror={state.completion} onMirrorChange={completionChanged}/></div>
 return <main className={`ffg-app fe-app ${displayOnly?'ffg-display':''}`} inert={displayOnly?true:undefined}>
  <StarRewards state={stars} restoreRevision={restoreRevision}/>
  <header className="ffg-header"><div><Link href="/apps/beta">{show('← Beta apps')}</Link><p className="ffg-eyebrow">{show('ALGEBRA 2 · FUNCTION FAMILIES')}</p><div className="ffg-title-row"><h1>{show(equationFamilyTitle)}</h1><EquationInformation open={state.infoOpen} onOpenChange={open=>dispatch({type:'info',open})} readOnly={displayOnly}/></div></div>{state.scene!=='welcome'&&<div className="ffg-identity"><strong data-no-translate>{state.first} {state.last}</strong><span>{show('Class hour')} <b data-no-translate>{state.hour}</b></span></div>}</header>
  {state.scene==='welcome'?<SkillWelcome catchphrase="Different equations. Familiar families." subtitle="Read the equation" skill="Identify a function family from an equation"
   visual={<div className="fe-welcome-equations" aria-label={t('Examples of parent function equations')}><Formula>{'f(x)=x^2'}</Formula><Formula>{String.raw`g(x)=\lvert x\rvert`}</Formula><Formula>{'h(x)=x^3'}</Formula></div>}
   goal={<><p><span>{show('Parents')}</span><strong>{show('10 in a row')}</strong></p><p><span>{show('Advanced')}</span><strong>{show('10 in a row')}</strong></p></>}
   scoreNote={show('Parents complete: 5/10 minimum; advanced best streak up to 10/10.')}>
   <form onSubmit={event=>{event.preventDefault();dispatch({type:'start',seed:Math.floor(Math.random()*2**32)})}}><SkillIdentityFields value={state} onChange={(field,value)=>dispatch({type:'identity',field,value})}/><button className="skill-welcome-start" type="submit">{show('Start Skill Practice')}<span aria-hidden="true">→</span></button></form>
  </SkillWelcome>:<>
   <div className="ffg-progress"><SketchFrame/><StreakStars state={stars}/><div className="ffg-total-correct"><span>{show('Number correct')}</span><strong data-no-translate>{state.parents.correct+state.advanced.correct}</strong></div><div className="ffg-practice-score"><span>{show('Practice score')}</span><strong data-no-translate>{score}<small>/10</small></strong></div><button type="button" onClick={report}>{show('Get grade report')}</button></div>
   <div className="fe-stage"><span className="ffg-chip">{show(advanced?'ADVANCED IDENTIFICATION':'PARENT IDENTIFICATION')}</span><span>{show('Goal: 10 in a row')}</span><button type="button" className={`fe-keep ${canKeepStreak(state)?'fe-keep-ready':''}`} disabled={!canKeepStreak(state)} onClick={()=>dispatch({type:'keep',now:Date.now()})}><span>{show('Streak Keep')}</span> <span data-no-translate>({availableStreakKeeps(state)})</span></button></div>
   <section className="ffg-workspace" aria-label={t('Equation and family choices')}>
    <div className={`ffg-graph-card fe-equation-card ${right?'fe-equation-correct':''}`}><SketchFrame/><div className="ffg-graph-heading"><span>{show('READ THE EQUATION')}</span><span>{show('Equation')} <b data-no-translate>{stats.index+1}</b></span></div><div className={`fe-equation ${question.equation.length>30?'fe-long-equation':''}`} key={`${state.phase}-${stats.index}`}><Formula display>{question.equation}</Formula></div>
     <div className="fe-answer-reveal" role="status" aria-live="polite">{stats.result&&<><p>{show('Family:')} <strong>{show(familyNames[question.family])}</strong></p><div><span>{show('Parent:')}</span><Formula>{parentEquations[question.family]}</Formula></div></>}</div>
    </div>
    <div className="ffg-answer-panel"><p className="ffg-eyebrow">{show('NAME THE FAMILY')}</p><h2>{show('Which family does this equation belong to?')}</h2><div className="ffg-choices" role="group" aria-label={t('Function families')}>{familyIds.map((family,i)=><button key={family} type="button" disabled={stats.selected!==null||state.scene!=='practice'} aria-pressed={stats.selected===family} className={stats.result&&family===question.family?'ffg-choice-correct':stats.selected===family?'ffg-choice-wrong':''} onClick={()=>dispatch({type:'answer',family,now:Date.now()})}><SketchFrame/><span className="ffg-choice-letter" aria-hidden="true">{String.fromCharCode(65+i)}</span><span>{show(familyNames[family])}</span>{stats.result&&family===question.family&&<b aria-hidden="true">✓</b>}</button>)}</div>
     <div className={`ffg-feedback ${right?'ffg-feedback-correct':''}`} role="status" aria-live="polite"><p>{show(stats.result==='right'?'Correct! You found the family.':stats.result==='kept'?'Streak saved. Read the correct family, then try the next equation.':stats.result==='wrong'?'Not quite. Your best streak is safe.':'Read the equation, then choose its family.')}</p></div>
    </div>
   </section>
   <footer className="ffg-footnote"><p>{show('A lit Streak Keep can save the latest broken run until you answer again.')}</p><span>{show('No timer in practice.')}</span></footer>
  </>}
  <Congratulations open={state.scene==='parent-ready'||state.scene==='complete'} readOnly={displayOnly} complete={state.scene==='complete'} onStart={()=>dispatch({type:'advanced'})} onReport={report}/>
 </main>
}
function Congratulations({open,readOnly,complete,onStart,onReport}:{open:boolean;readOnly:boolean;complete:boolean;onStart:()=>void;onReport:()=>void}){
 const ref=useRef<HTMLDialogElement>(null)
 const {translate:t,displayText}=useWidgetLanguage(),show=displayText??t
 useEffect(()=>{const el=ref.current;if(open&&!el?.open)el?.showModal();if(!open&&el?.open)el.close()},[open])
 return <dialog ref={ref} className="fe-congratulations" aria-label={t('Congratulations!')} inert={readOnly?true:undefined} onCancel={e=>e.preventDefault()}><SketchFrame/><div className="fe-congrats-stars" aria-hidden="true">★ ★ ★</div><h2>{show('Congratulations!')}</h2><p>{show(complete?'You identified 10 in a row in both rounds!':'You are now ready for advanced identification.')}</p>{complete?<strong className="fe-final-score" data-no-translate>10/10</strong>:<p className="fe-congrats-note">{show('Your parent round is complete. Aim for 10 in a row again.')}</p>}<div className="ffg-actions">{!complete&&<button className="ffg-primary" type="button" disabled={readOnly} onClick={onStart}>{show('Start advanced identification')}</button>}<button type="button" disabled={readOnly} onClick={onReport}>{show('Get grade report')}</button></div></dialog>
}
