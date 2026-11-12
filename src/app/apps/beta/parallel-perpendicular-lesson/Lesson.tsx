'use client'
import type {CompletionDisplayState,ResumeDisplayState} from '@/lib/mathboard/display-mirror'
import {isParallelLessonDisplayState,type ParallelLessonBridgeWindow,type LessonGraphDisplayState,type LessonScratchDisplayState} from '@/lib/parallel-lesson-mirror'
import type {LessonAnimation} from '@/lib/parallel-lesson'
import CompletionFlow from '@/components/practice/CompletionFlow'
import Link from 'next/link'
import {useEffect,useRef,useState} from 'react'
import {Math as Formula} from '@/components/Math'
import {useWidgetLanguage} from '@/components/practice/BilingualWidget'
import ResumeDialog from '@/components/practice/ResumeDialog'
import {editAnswer} from '@/lib/mathboard/keypad'
import {parallelLesson,parallelNotes,parallelOnlyTitle,lessonTitle,lessonSlug,notesPath,newLessonProgress,blankLessonRecord,lessonTotals,lessonGroupCount,lessonNumber,lineTex,pointSlopeLesson,distributedLesson,readLessonLine,inspectLessonLine,lessonSlopeCorrect,saveLesson,loadLesson,type LessonProgress,type LessonRecord,type LessonProblem} from '@/lib/parallel-lesson'
import LessonGraph from './LessonGraph'
import EquationFormatWarning from './EquationFormatWarning'
import {missingLessonNotation} from '@/lib/parallel-graph-tools'
import {checkLessonSegment} from '@/lib/parallel-lesson'
import AnimatedEquation from './AnimatedEquation'
import {useEquationAnimation} from './useEquationAnimation'
import {followingPracticeStage,loadStudentLesson,newStudentLesson,practiceGoals,practiceStreak,practiceTitles,saveStudentLesson,standardHints,startParallelPractice,studentProblem} from '@/lib/parallel-practice'
import ScratchPad from '../../graph-linear/ScratchPad'
import LessonTools from './LessonTools'
import PointSlopePlacement from './PointSlopePlacement'
import '../../write-linear-equation/practice.css'
import './lesson.css'
type Field='blue'|'red'|'equation'
const emptyScratch:LessonScratchDisplayState={open:false,image:null}
const stamp=(ms:number)=>new Date(ms).toLocaleString(undefined,{year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'})
export default function Lesson({teacher=false}:{teacher?:boolean}){
 const [first,setFirst]=useState(''),[last,setLast]=useState(''),[hour,setHour]=useState(''),[p,setP]=useState<LessonProgress|null>(()=>teacher?newLessonProgress():null),[screen,setScreen]=useState<'lesson'|'ready'|'report'>('lesson'),[reveal,setReveal]=useState(0),[turn,setTurn]=useState(0),[active,setActive]=useState<Field>('equation'),[notice,setNotice]=useState(''),[hint,setHint]=useState(false),[saved,setSaved]=useState(false),[resume,setResume]=useState(''),[date,setDate]=useState(''),[session,setSession]=useState(0),[activePart,setActivePart]=useState<'num'|'den'>('num'),[graphicalNotice,setGraphicalNotice]=useState(false),[graphicalAcknowledged,setGraphicalAcknowledged]=useState(false),[formatWarning,setFormatWarning]=useState<{prefix:boolean;x:boolean}|null>(null)
 const [isExternalDisplay,setIsExternalDisplay]=useState(false),[graphMirror,setGraphMirror]=useState<LessonGraphDisplayState|null>(null),[mirrorAnimation,setMirrorAnimation]=useState<LessonAnimation|null>(null),[completionMirror,setCompletionMirror]=useState<CompletionDisplayState|null>(null),[resumeMirror,setResumeMirror]=useState<ResumeDisplayState|null>(null),externalDisplayRef=useRef(false)
 const [scratch,setScratch]=useState(emptyScratch)
 const inputs=useRef<Partial<Record<string,HTMLInputElement|null>>>({})
 const name=`${first.trim()} ${last.trim()}`.trim(),index=p?.index??0,q=teacher?parallelLesson[index]:studentProblem(p,index),r=p?.records[index]
 const stage=r?.practiceStage,triple=q.kind==='triple',p4=!teacher&&(q.id==='P4'||stage===1),paperOnly=stage===2||stage===3,needsSlopes=triple||p4
 const requireSketch=q.kind==='draw'||stage===0
 const sketchReady=!requireSketch||!!r?.sketchChecked&&graphicalAcknowledged
 const equationReady=!graphicalNotice&&(!!r?.solved||(!needsSlopes||!!r?.blueCorrect&&!!r?.redCorrect)&&(!p4||!!r?.pointSlopeChecked)&&(teacher||sketchReady))
 const {language,translate,setLanguage}=useWidgetLanguage()
 const totals=p?lessonTotals(p):{solved:0,score:0,firstTry:0,attempts:0}
 const firstUnsolved=p?.records.findIndex(record=>!record.solved)??0
 const lastUnlocked=firstUnsolved<0?(p?.records.length??1)-1:firstUnsolved
 const activeStreak=stage===undefined||!p?0:practiceStreak(p.records.slice(0,index+1),stage)
 const title=teacher?lessonTitle:parallelOnlyTitle
 const graphicallySolved=!!r?.sketch&&checkLessonSegment(q,r.sketch).correct
 const localAnimation=useEquationAnimation(q,!isExternalDisplay&&triple&&!graphicallySolved&&(teacher?reveal>=4:!!r?.solved)),animation=isExternalDisplay?mirrorAnimation:localAnimation
 const bridgeRoute=useRef({teacher,setLanguage}),bridgeActive=typeof window!=='undefined'&&!!(window as ParallelLessonBridgeWindow).MathBoardApplet
 // Register exactly once. Mark the role ref synchronously, before any state updates,
 // so receiving a display snapshot can never be echoed back into the native bridge.
 useEffect(()=>{
  if(typeof window==='undefined')return
  const host=window as ParallelLessonBridgeWindow;if(!host.MathBoardApplet)return
  const restore=(value:unknown)=>{
   if(!isParallelLessonDisplayState(value)||value.teacher!==bridgeRoute.current.teacher)return
   externalDisplayRef.current=true;setIsExternalDisplay(true);bridgeRoute.current.setLanguage(value.language)
   setFirst(value.first??'');setLast(value.last??'');setHour(value.hour??'');setP(value.p??null)
   setScreen(value.screen??'lesson');setReveal(value.reveal??0);setTurn(value.turn??0);setActive(value.active??'equation');setActivePart(value.activePart??'num')
   setNotice(value.notice??'');setHint(value.hint??false);setSaved(value.saved??false);setResume(value.resume??'');setDate(value.date??'');setSession(value.session??0)
   setScratch(value.scratch??emptyScratch);setGraphicalNotice(value.graphicalNotice??false);setGraphicalAcknowledged(value.graphicalAcknowledged??false);setFormatWarning(value.formatWarning??null)
   setGraphMirror(value.graphMirror??null);setMirrorAnimation(value.animation??null);setCompletionMirror(value.completionMirror??null);setResumeMirror(value.resumeMirror??null)
  }
  host.mathBoardAppletSetState=restore
  return()=>{if(host.mathBoardAppletSetState===restore)host.mathBoardAppletSetState=undefined}
 },[])
 useEffect(()=>{
  if(typeof window==='undefined'||isExternalDisplay||externalDisplayRef.current)return
  const mb=(window as ParallelLessonBridgeWindow).MathBoardApplet;if(!mb?.publishState)return
  mb.publishState({app:'parallel-perpendicular-classroom',version:1,teacher,language,first,last,hour,p,screen,reveal,turn,active,activePart,notice,hint,saved,resume,date,session,graphicalNotice,graphicalAcknowledged,formatWarning,scratch,graphMirror,animation,completionMirror,resumeMirror})
 },[isExternalDisplay,teacher,language,first,last,hour,p,screen,reveal,turn,active,activePart,notice,hint,saved,resume,date,session,graphicalNotice,graphicalAcknowledged,formatWarning,scratch,graphMirror,animation,completionMirror,resumeMirror])
 function resetLocal(nextIndex:number,record?:LessonRecord){const nextStage=record?.practiceStage;setScratch(nextStage===2||nextStage===3?{open:true,image:null}:emptyScratch);setGraphMirror(null);setMirrorAnimation(null);setCompletionMirror(null);setResumeMirror(null);setGraphicalNotice(false);setGraphicalAcknowledged(!teacher&&!!record?.sketchChecked);setFormatWarning(null);setReveal(0);setTurn(0);setHint(false);setNotice('');setActive((parallelNotes[nextIndex]?.kind==='triple'||parallelNotes[nextIndex]?.id==='P4'||nextStage===0||nextStage===1)&&!record?.redCorrect?(record?.blueCorrect?'red':'blue'):'equation');setActivePart('num')}
 function start(restoring=false){
  if(!first.trim()||!last.trim()||!hour){setNotice('Enter your first name, last name, and class hour.');return}
  try{
   const next=restoring?(teacher?loadLesson(resume,first,last,hour):loadStudentLesson(resume,first,last,hour)):(teacher?newLessonProgress():newStudentLesson())
   setP(next);setDate(stamp(next.completedAt??Date.now()));setSession(n=>n+1);setResume('')
   const ready=!teacher&&next.practiceSeed===undefined&&next.records.every(record=>record.solved)
   setScreen(next.completedAt!==null?'report':ready?'ready':'lesson')
   resetLocal(next.index,next.records[next.index])
  }catch(error){setNotice(error instanceof Error?error.message:'Check your resume code.')}
 }
 function beginPractice(){
  if(!p||isExternalDisplay)return
  const next=startParallelPractice(p,Math.floor(Math.random()*2**32))
  setP(next);setScreen('lesson');resetLocal(next.index,next.records[next.index])
 }
 function update(patch:Partial<LessonRecord>){if(!p)return;setP({...p,records:p.records.map((v,i)=>i===index?{...v,...patch}:v)})}
 function checkSlope(field:'blue'|'red'){if(!r||r[field].split('/').length!==2||r[field].split('/').some(v=>!v.trim())){setNotice('Enter both the numerator and denominator.');return}const correct=lessonSlopeCorrect(r[field],field==='blue'?q.given.m:q.answer.m);update({[field==='blue'?'blueCorrect':'redCorrect']:correct,...(field==='red'?{redTried:true}:{}),hadSlopeMiss:r.hadSlopeMiss||!p4&&!correct,...(stage!==undefined&&!correct?{practiceMiss:true}:{})});setNotice(correct?'Correct slope. Keep going.':field==='blue'?'Look at the coefficient multiplying x in the given blue equation.':q.relation==='parallel'?'Parallel lines have the same slope, including the sign.':'Use the negative reciprocal: reverse the fraction and change its sign.');if(correct){setActive(field==='blue'?'red':'equation');setActivePart('num')}}
 function checkEquation(){
  if(!p||!r||r.solved||!equationReady||isExternalDisplay)return
  const missing=missingLessonNotation(r.equation,q.answer.m)
  if(missing.prefix||missing.x){setFormatWarning(missing);return}
  const parsed=readLessonLine(r.equation)
  if(parsed.format){
   update({line:parsed.line??r.line,format:true})
   setNotice(parsed.line?(p4||paperOnly?'Finish distributing and write y = mx + b, then check again.':'Your entry graphs a line. Expand it and write y = mx + b, then check again.'):'Use a readable equation starting with y =. Enter fractions with / and put x after the slope.')
   return
  }
  const result=inspectLessonLine(q,parsed.line!)
  const records=p.records.map((record,i)=>i===index?{
   ...record,line:parsed.line,attempts:r.attempts+1,solved:result.correct,format:false,
   ...(stage!==undefined&&!result.correct?{practiceMiss:true}:{}),
  }:record)
  const finished=result.correct&&(teacher?records.every(record=>record.solved):stage===3&&followingPracticeStage(records,stage)===null)
  // Capture the completion time in this submit handler.
  // eslint-disable-next-line react-hooks/purity
  const completedAt=finished?Date.now():p.completedAt
  setP({...p,records,completedAt});setNotice(stage!==undefined&&result.correct&&r.practiceMiss?'Correct. Try a fresh problem to rebuild your streak.':'')
  if(finished)setDate(stamp(completedAt!))
  if(!teacher&&q.id==='P4'&&result.correct)setScreen('ready')
 }
 function studentGo(nextIndex:number){
  if(!p||isExternalDisplay||nextIndex<0)return
  if(nextIndex>lastUnlocked){
   if(nextIndex!==index+1||!r?.solved||index!==p.records.length-1)return
   if(p.completedAt!==null){setScreen('report');return}
   if(stage===undefined){setScreen('ready');return}
   const nextStage=followingPracticeStage(p.records,stage)
   if(nextStage===null)return
   const next={...blankLessonRecord(),practiceStage:nextStage}
   setP({...p,index:nextIndex,records:[...p.records,next]});resetLocal(nextIndex,next);return
  }
  setP({...p,index:nextIndex});resetLocal(nextIndex,p.records[nextIndex])
 }
 function next(){if(r?.solved)studentGo(index+1)}
 function acknowledgeGraph(){
  if(isExternalDisplay)return
  setGraphicalNotice(false)
  setGraphicalAcknowledged(true)
  const field=triple&&!r?.redCorrect?(r?.blueCorrect?'red':'blue'):'equation'
  setActive(field)
  setActivePart('num')
  requestAnimationFrame(()=>inputs.current[field==='equation'?field:`${field}Numerator`]?.focus({preventScroll:true}))
 }
 function teacherGo(i:number){setP(newLessonProgressWithIndex(i));resetLocal(i)}
 function focusDenominator(which:'blue'|'red'){setActive(which);setActivePart('den');requestAnimationFrame(()=>inputs.current[`${which}Denominator`]?.focus({preventScroll:true}))}
 function slopeChange(which:'blue'|'red',part:'num'|'den',value:string){if(!r)return;const [n='',d='']=r[which].split('/');if(part==='num'&&value.includes('/')){const [nextN,nextD='']=value.split('/');update({[which]:`${nextN}/${nextD}`});focusDenominator(which);return}update({[which]:part==='num'?`${value}/${d}`:`${n}/${value.replace(/\//g,'')}`})}
 const slopeChecksReady=needsSlopes&&(stage!==0||sketchReady)
 const keypadEnabled=!!r&&!r.solved&&(equationReady||slopeChecksReady&&!r.redCorrect)
 function key(k:string){if(isExternalDisplay||!r||!keypadEnabled)return;if(active!=='equation'&&k==='/'){focusDenominator(active);return}const refKey=active==='equation'?'equation':`${active}${activePart==='num'?'Numerator':'Denominator'}`,el=inputs.current[refKey],parts=r[active].split('/'),value=active==='equation'?r.equation:parts[activePart==='num'?0:1]??'',result=editAnswer(value,k,el?.selectionStart??value.length,el?.selectionEnd??value.length);if(!result)return;if(active==='equation')update({equation:result.value});else slopeChange(active,activePart,result.value);requestAnimationFrame(()=>{el?.focus({preventScroll:true});el?.setSelectionRange(result.caret,result.caret)})}
 function slopeField(which:'blue'|'red',label:string){const [n='',d='']=r?.[which].split('/')??[];return <fieldset className={`lp-slope-entry ${which}`}><legend>{label}</legend><div className="lp-slope-stack"><span>m =</span><div className="lp-fraction-input">{(['num','den'] as const).map(part=><input key={part} ref={el=>{inputs.current[`${which}${part==='num'?'Numerator':'Denominator'}`]=el}} aria-label={`${label} ${part==='num'?'numerator':'denominator'}`} inputMode="none" value={part==='num'?n:d} maxLength={15} onFocus={()=>{setActive(which);setActivePart(part)}} disabled={!!r?.solved} onChange={e=>slopeChange(which,part,e.target.value)} onKeyDown={e=>{if(e.key==='/'){e.preventDefault();focusDenominator(which)}else if(e.key==='Enter')checkSlope(which)}} autoComplete="off"/>)}</div></div></fieldset>}
 function field(which:Field,label:string,disabled=false){return <label className={`lp-input ${which}`} data-correct={which==='equation'&&r?.solved||undefined}><span>{label}</span>{which==='equation'&&r?.solved&&triple?<AnimatedEquation q={q} animation={animation}/>:<input ref={el=>{inputs.current[which]=el}} aria-label={label} inputMode="none" value={r?.[which]??''} onFocus={()=>setActive(which)} disabled={disabled||!!r?.solved} onChange={e=>update({[which]:e.target.value})} onKeyDown={e=>{if(e.key==='Enter'){if(which==='equation')checkEquation();else checkSlope(which)}}} autoComplete="off"/>}</label>}
 const tools=<LessonTools key={`${session}-${q.id}`} enabled={keypadEnabled} keypadOnly={paperOnly} scratch={scratch} readOnly={isExternalDisplay}
  onKey={key} onToggle={open=>setScratch(current=>({...current,open}))}
  onScratchImage={bridgeActive&&!isExternalDisplay?image=>setScratch(current=>({...current,image})):undefined}/>
 const shownLine=teacher?(reveal>=4?q.answer:null):r?.line??null,correct=teacher?reveal>=4:!!r?.solved,showArrows=teacher?reveal>=2:!!r?.redTried||turn>0
 const equationEntry=equationReady&&field('equation','Red line equation · y = mx + b')
 const checkAction=equationReady&&<button className="lp-primary lp-check" onClick={r?.solved?next:checkEquation}>{r?.solved?(p?.completedAt&&index===p.records.length-1?'Finish & reflect →':'Next →'):r?.attempts?`Check attempt ${r.attempts+1}`:'Check equation'}</button>
 const feedback=(notice||r?.line&&!r.format)&&<div className={`lp-feedback ${r?.solved?'solved':''}`} role="status"><p>{notice}</p>{r?.line&&!r.format&&<LineFeedback q={q} record={r}/>}</div>
 const savedDialog=saved&&p&&<ResumeDialog readOnly={isExternalDisplay} mirror={resumeMirror} onMirrorChange={bridgeActive&&!isExternalDisplay?setResumeMirror:undefined} name={name} hour={hour} title={title} translate={translate} code={teacher?saveLesson(p,first,last,hour):saveStudentLesson(p,first,last,hour)} summary={[`${totals.solved} problems complete`,'Completed problems are kept. The next unfinished problem starts fresh.']} onClose={()=>setSaved(false)} onExit={()=>{setSaved(false);setP(null);setScreen('lesson');setNotice('')}}/>
 if(!teacher&&p&&screen==='report')return <CompletionFlow readOnly={isExternalDisplay} mirror={completionMirror} onMirrorChange={bridgeActive&&!isExternalDisplay?setCompletionMirror:undefined} slug={lessonSlug} name={name} hour={hour} completedAt={date} score="10/10" stats={[{label:'Completed problems',value:totals.solved},{label:'Scored checks',value:totals.attempts},{label:'First-try successes',value:totals.firstTry}]} details={practiceTitles.map((label,i)=>`${translate(label)} · ${practiceGoals[i]}/${practiceGoals[i]}`)} />
 if(!teacher&&p&&screen==='ready')return <main className={`lp-app ${isExternalDisplay?'lp-external-display':''}`} inert={isExternalDisplay||undefined}>
  <section className="lp-card lp-ready">
   <p data-no-translate>{name}</p>
   <h1>I’m ready to Practice</h1>
   <p>Show this screen to your teacher.</p>
   {!isExternalDisplay&&<div><button className="lp-primary" onClick={beginPractice}>Start practice →</button><button onClick={()=>{setResumeMirror(null);setSaved(true)}}>Stop &amp; save</button></div>}
  </section>
  {savedDialog}
 </main>
 return <main className={`lp-app ${teacher?'lp-teacher':''} ${isExternalDisplay?'lp-external-display':''}`} inert={isExternalDisplay?true:undefined}><header><div><Link href="/apps/beta">← Beta apps</Link><h1>{title}</h1><p>{teacher?'Teacher presentation · reveal work at your pace':'Teacher-led notes lesson · same examples, your own progress'}</p></div>{!teacher&&p&&<div className="lp-name"><strong data-no-translate>{name}</strong><small>Class hour {hour} · {date}</small></div>}</header><div className="lp-top-links"><a href={teacher?notesPath:notesPath+"#page=1"} target="_blank" rel="noreferrer">{teacher?'Two-sided notes sheet (PDF)':'Parallel lines notes (PDF)'}</a><Link href={teacher?'/apps/beta/parallel-perpendicular-lesson':'/apps/beta/parallel-perpendicular-lesson/teacher'} target="_blank" rel="noreferrer">{teacher?'Open student lesson':'Open teacher presentation'}</Link><details><summary>Optional review</summary><Link href="/apps/beta/write-linear-parallel-perpendicular">Earlier discovery activities</Link></details></div>
 {!p?<form className="lp-card lp-welcome" onSubmit={e=>{e.preventDefault();start()}}><h2>One point. A new direction.</h2><p>Write an equation for a line parallel to a given line and through a given point. Work through the notes with your teacher, then practice in the app.</p><div className="lp-fields"><label>First name<input required maxLength={35} value={first} onChange={e=>setFirst(e.target.value)}/></label><label>Last name<input required maxLength={35} value={last} onChange={e=>setLast(e.target.value)}/></label><label>Class hour<select required value={hour} onChange={e=>setHour(e.target.value)}><option value="">Choose</option>{['2','3','4','6','7','8'].map(v=><option key={v}>{v}</option>)}</select></label></div><button className="lp-primary">Begin Slide 1 →</button><details><summary>Returning? Enter a resume code</summary><label>Resume code<input value={resume} onChange={e=>setResume(e.target.value)} autoComplete="off"/></label><button type="button" onClick={()=>start(true)}>Continue saved progress</button></details><p role="status">{notice}</p><p>Names, work, and results remain on this device. Nothing is submitted automatically.</p></form>:<><div className="lp-problem-header"><div><b>{stage===undefined?<>Slide {q.slide} · {q.id}</>:<>Practice level {stage+1} · {index-parallelNotes.length+1}</>}</b><span>{q.relation==='parallel'?'PARALLEL LINES':'PERPENDICULAR LINES'}</span></div>{teacher?<label>Jump to problem<select aria-label="Teacher problem navigation" value={index} onChange={e=>teacherGo(Number(e.target.value))}>{parallelLesson.map((v,i)=><option key={v.id} value={i}>Slide {v.slide} · {v.id}</option>)}</select></label>:<><div className="lp-student-nav" role="group" aria-label="Problem navigation"><button type="button" aria-label="Previous problem" disabled={index===0} onClick={()=>studentGo(index-1)}>←</button><button type="button" aria-label="Next problem" disabled={index>=lastUnlocked&&(!r?.solved||p.completedAt!==null)} onClick={()=>studentGo(index+1)}>→</button></div><strong data-no-translate>{name}</strong><span>{totals.solved} complete</span><button disabled={!r?.solved} onClick={()=>{setResumeMirror(null);setSaved(true)}}>Stop &amp; save</button></>}</div><section className="lp-givens"><h2>Write the equation of the line {q.relation==='parallel'?'parallel':'perpendicular'} to the given line and passing through the given point.</h2><div><span className="lp-blue">Given line <Formula>{q.standardForm??lineTex(q.given)}</Formula></span><span className="lp-gold">Given point <Formula>{`P=(${q.point.x},${q.point.y})`}</Formula></span></div></section>{stage!==undefined?<div className="lp-group-count"><strong>{practiceTitles[stage]}</strong> · <span>{activeStreak}/{practiceGoals[stage]} correct in a row</span>{stage===3&&<span>{' · '}Without hints</span>}</div>:triple&&!teacher&&<div className="lp-group-count">Slide {q.slide}: <strong>{lessonGroupCount(p,q.slide)} of 3 complete</strong> · {q.id}</div>}<div className="lp-layout">{!p4&&!paperOnly&&<section className="lp-card lp-picture"><div className="lp-graph-givens"><span className="lp-blue"><Formula>{lineTex(q.given)}</Formula></span><span className="lp-gold"><Formula>{`P=(${q.point.x},${q.point.y})`}</Formula></span></div><LessonGraph key={q.id} q={q} line={shownLine} correct={correct} drawing={(q.kind==='draw'||triple||!teacher&&q.id==='P3')&&!correct} graphicalCalloutName={graphicalNotice?first:null} continueLabel={triple&&!r?.redCorrect?'Continue to slope checks →':'Now write the equation →'} onAcknowledgeGraph={acknowledgeGraph} arrows={showArrows} turn={teacher&&reveal<2?0:turn} sketch={r?.sketch??null} sketchChecked={r?.sketchChecked} onSketchChange={sketch=>{setGraphicalAcknowledged(false);update({sketch,sketchChecked:false,line:null,format:false})}} onSketchCheck={(sketchChecked,reason)=>{update({sketchChecked,...(stage===0&&!sketchChecked&&reason!=='short'?{practiceMiss:true}:{})});if(sketchChecked&&!teacher){setGraphicalAcknowledged(false);setGraphicalNotice(true)}}} animation={animation} isExternalDisplay={isExternalDisplay} mirror={graphMirror} onMirrorChange={bridgeActive&&!isExternalDisplay?setGraphMirror:undefined}/>{q.slide===5&&(!teacher||reveal>=2)&&<div className="lp-turn-controls"><p>Predict the new slope, then explore a quarter turn.</p><button onClick={()=>setTurn(n=>n+1)}>{turn?'Replay quarter turn':'Reveal quarter turn'}</button>{turn>0&&<><p>Right 3 and up 2 becomes right 2 and down 3.</p><Formula>{String.raw`\frac23\longrightarrow-\frac32`}</Formula></>}</div>}{(q.slide===1||q.slide===5)&&correct&&<p className="lp-definition">{q.relation==='parallel'?'Parallel lines in a plane never intersect.':'Perpendicular lines intersect at a right angle.'}</p>}</section>}<section className="lp-card lp-work">{teacher?<><h2>Reveal the work</h2><div className="lp-teacher-actions lp-reveal-controls"><button disabled={reveal===0} onClick={()=>setReveal(n=>n-1)}>Previous step</button><button className="lp-primary" disabled={reveal===4} onClick={()=>{if(q.slide===5&&reveal===1)setTurn(n=>n+1);setReveal(n=>Math.min(4,n+1))}}>Reveal next step</button></div><TeacherWork q={q} reveal={reveal} animation={animation}/><div className="lp-teacher-actions"><button disabled={index===0} onClick={()=>teacherGo(index-1)}>Previous problem</button><button disabled={index===11} onClick={()=>teacherGo(index+1)}>Next problem →</button></div><p>No student score is created in presentation mode.</p></>:<>{paperOnly?<h2>{practiceTitles[stage]}</h2>:p4?<h2>{r?.solved?'Write the final equation.':!r?.blueCorrect?'Find the given slope.':!r.redCorrect?'Find the new slope.':!equationReady?'Build the point-slope equation.':'Write the final equation.'}</h2>:stage===0&&!sketchReady?<h2>Draw and check the parallel line.</h2>:r?.sketchChecked&&graphicalAcknowledged&&equationReady?<h2 className="lp-algebraic-prompt">Now give the algebraic answer for the line. What is the equation of the <span className="lp-red-word">red</span> line in <Formula>y=mx+b</Formula> form?</h2>:q.slide===1&&!r?.sketchChecked?<div className="lp-first-step"><span className="lp-step-number" aria-label="Step 1">1</span><h2>Answer the question by drawing the line that goes through the point and is parallel to the given line.</h2></div>:<h2>{triple?'Check both slopes, then write the equation.':q.kind==='exact'?'Find the exact equation.':q.kind==='independent'?'Try it independently.':r?.sketchChecked?'Now write the equation of your checked line.':'Draw and check your line first.'}</h2>}{!p4&&!paperOnly&&(q.id==='P3'?<p>Use point-slope form with the given point, then rewrite your equation in slope-intercept form. The red line crosses the y-axis between grid marks.</p>:(q.kind==='exact'||q.kind==='independent')&&<p>Use the four steps on your notes sheet. Enter only your final slope-intercept equation here.</p>)}{slopeChecksReady&&<div className="lp-slope-checks">{r?.blueCorrect||r?.solved?<p className="lp-checked blue">✓ Blue slope <Formula>{`m=${lessonNumber(q.given.m,true)}`}</Formula></p>:<>{slopeField('blue',p4||stage===0?'What is the slope of the given line?':'What is the slope of the blue line?')}<button onClick={()=>checkSlope('blue')}>Check blue slope</button></>}{(r?.blueCorrect||r?.solved)&&(r.redCorrect||r.solved?<p className="lp-checked red">✓ New slope <Formula>{`m=${lessonNumber(q.answer.m,true)}`}</Formula></p>:<>{slopeField('red',p4||stage===0?'What is the slope of the new line?':'What is the slope of the red line supposed to be?')}<button onClick={()=>checkSlope('red')}>Check red slope</button></>)}</div>}{p4&&r&&(r.redCorrect||r.solved)&&<PointSlopePlacement q={q} slots={r.placements} chosen={r.chosenQuantity} checked={!!r.pointSlopeChecked||r.solved} readOnly={isExternalDisplay}
 onChoose={chosenQuantity=>update({chosenQuantity})} onPlace={placements=>{update({placements,chosenQuantity:null});setNotice('')}}
 onCheck={(pointSlopeChecked,message)=>{update({pointSlopeChecked,...(stage!==undefined&&!pointSlopeChecked&&r.placements&&Object.values(r.placements).every(Boolean)?{practiceMiss:true}:{})});setNotice(message);if(pointSlopeChecked){setActive('equation');requestAnimationFrame(()=>inputs.current.equation?.focus({preventScroll:true}))}}}/>}
 {p4&&equationReady&&!r?.solved&&<p>Distribute the slope, then isolate y. Enter your final equation in slope-intercept form.</p>}
 {paperOnly&&<>
  {stage===2&&<div className="lp-form-reference"><span>Point-slope form</span><Formula>{String.raw`y-y_1=m(x-x_1)`}</Formula></div>}
  {stage===3&&<div className="lp-standard-hints">
   {!r?.solved&&!isExternalDisplay&&(r?.hintsUsed??0)<standardHints.length&&<button type="button" onClick={()=>update({hintsUsed:(r?.hintsUsed??0)+1,practiceMiss:true})}>{r?.hintsUsed?'Next hint':'Show a hint'}</button>}
   {!!r?.hintsUsed&&<><p>A hint resets the no-hint streak.</p><ol>{standardHints.slice(0,r.hintsUsed).map(message=><li key={message}>{message}</li>)}</ol></>}
  </div>}
  <ScratchPad key={`${session}-${q.id}`} height={350} syncContent={isExternalDisplay?scratch.image:undefined}
   onStrokeEnd={bridgeActive&&!isExternalDisplay?image=>setScratch({open:true,image}):undefined}/>
 </>}
 {equationEntry}{!p4&&!paperOnly&&tools}{checkAction}{feedback}
 {stage===undefined&&(q.kind==='exact'||q.kind==='independent')&&!!r?.attempts&&!r.solved&&<><button onClick={()=>setHint(true)}>Show a hint</button>{hint&&<p className="lp-hint">Find the given slope. Use the required slope relationship. Substitute the given point and new slope into point-slope form, then simplify.</p>}</>}
 {!p4&&!paperOnly&&<p className="lp-small">Graph shows your most recent submitted equation. The gold point and blue line stay fixed.</p>}</>}
 </section>{(p4||paperOnly)&&(!isExternalDisplay||!paperOnly&&scratch.open)&&<aside className="lp-card lp-tool-card">{tools}</aside>}</div></>}

 {formatWarning&&<EquationFormatWarning readOnly={isExternalDisplay} missing={formatWarning} onClose={()=>{setFormatWarning(null);requestAnimationFrame(()=>inputs.current.equation?.focus({preventScroll:true}))}}/>}{savedDialog}</main>
}
function newLessonProgressWithIndex(index:number){return {...newLessonProgress(),index}}
export function LineFeedback({q,record:r}:{q:LessonProblem;record:LessonRecord}){const {translate}=useWidgetLanguage();const v=inspectLessonLine(q,r.line!);return <><h3>{r.solved?'★ Both conditions are correct!':q.kind==='independent'&&q.id!=='T8'?'Use your equation to revise.':'Use your graph to revise.'}</h3>{r.solved?<><div className="lp-correct-equations" aria-label="The blue and red line equations"><div className="lp-equation-blue"><Formula display>{lineTex(q.given)}</Formula></div><div className="lp-equation-red"><Formula display>{lineTex(r.line!)}</Formula></div></div><p>Solved on attempt {r.attempts}</p></>:<>{v.slopeOK?<p>The slope is correct.</p>:<p>{v.relation==='perpendicular'&&q.relation==='parallel'?'Your line is perpendicular. This problem asks for parallel.':v.relation==='parallel'&&q.relation==='perpendicular'?'Your line is parallel. This problem asks for perpendicular.':'Check the required slope relationship.'}</p>}{v.pointOK?<p>Your line passes through the given point.</p>:<><p>At the target x-coordinate, your equation gives:</p><Formula display>{String.raw`x=${q.point.x}:\quad y=${lessonNumber(v.yAt,true)}\quad\text{${translate('instead of')}}\quad${q.point.y}`}</Formula><p>Use the given point to correct the line’s position.</p></>}{!v.slopeOK&&!v.pointOK&&<p>Both the slope and the point need a correction.</p>}</>}</>}
export function TeacherWork({q,reveal,animation=null}:{q:LessonProblem;reveal:number;animation?:import('@/lib/parallel-lesson').LessonAnimation|null}){return <div className="lp-teacher-work">{reveal===0&&<p>Read the prompt together. Sketch on the notes sheet and discuss what must stay true.</p>}{reveal>=1&&<section><h3>1. Determine the given slope.</h3><Formula display>{`m_{\\text{given}}=${lessonNumber(q.given.m,true)}`}</Formula></section>}{reveal>=2&&<section><h3>2. Determine the new slope.</h3><p>{q.relation==='parallel'?'Distinct nonvertical lines are parallel when they have the same slope.':'The new slope is the negative reciprocal. The slopes multiply to −1.'}</p><Formula display>{q.relation==='parallel'?`m_{\\text{new}}=m_{\\text{given}}=${lessonNumber(q.answer.m,true)}`:`m_{\\text{new}}=-\\frac{1}{m_{\\text{given}}}=${lessonNumber(q.answer.m,true)}`}</Formula></section>}{reveal>=3&&<section><h3>3. Substitute the point and new slope.</h3><Formula display>{String.raw`y-y_1=m_{\text{new}}(x-x_1)`}</Formula><Formula display>{pointSlopeLesson(q)}</Formula></section>}{reveal>=4&&<section><h3>4. Rewrite and check both conditions.</h3><Formula display>{distributedLesson(q)}</Formula><div className="lp-correct-equations"><div className="lp-equation-blue"><Formula display>{lineTex(q.given)}</Formula></div><div className="lp-equation-red">{q.kind==='triple'?<AnimatedEquation q={q} animation={animation}/>:<Formula display>{lineTex(q.answer)}</Formula>}</div></div><p>The slope has the required relationship. Check the given point:</p><Formula display>{`${lessonNumber(q.answer.m,true)}\\cdot(${q.point.x})${q.answer.b<0?'-':'+'}${lessonNumber(Math.abs(q.answer.b),true)}=${q.point.y}`}</Formula></section>}</div>}
