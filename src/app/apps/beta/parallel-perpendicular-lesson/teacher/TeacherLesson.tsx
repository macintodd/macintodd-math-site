'use client'
import Link from 'next/link'
import {useCallback,useEffect,useRef,useState} from 'react'
import {Math as Formula} from '@/components/Math'
import {useWidgetLanguage} from '@/components/practice/BilingualWidget'
import {editAnswer} from '@/lib/mathboard/keypad'
import {parallelNotes,parallelOnlyTitle,notesPath,blankLessonRecord,lessonNumber,lineTex,pointSlopeLesson,distributedLesson,readLessonLine,inspectLessonLine,lessonSlopeCorrect,type LessonRecord,type LessonAnimation} from '@/lib/parallel-lesson'
import type {LessonGraphDisplayState} from '@/lib/parallel-lesson-mirror'
import {missingLessonNotation} from '@/lib/parallel-graph-tools'
import LessonGraph from '../LessonGraph'
import EquationFormatWarning from '../EquationFormatWarning'
import {useEquationAnimation,useEquationAnimationSnapshot} from '../useEquationAnimation'
import {installLessonBridge,type LessonMathBoardWindow} from '@/lib/mathboard/lesson-bridge'
import {useMathBoardPosition} from '../useMathBoardPosition'
import '../lesson.css'
import './teacher.css'

type Field='blue'|'red'|'equation'
type Demo={generation:number;record:LessonRecord;reveal:number;turn:number;graph:LessonGraphDisplayState|null}
type Snapshot={app:'parallel-perpendicular-teacher';version:1;index:number;demos:Demo[];active:Field;part:'num'|'den';notice:string;warning:{prefix:boolean;x:boolean}|null;language:'en'|'es';animation:LessonAnimation|null;scrollY?:number}
const fraction=(n:number)=>{const [a,b='1']=lessonNumber(n).split('/');return `${a}/${b}`}
const fresh=():Demo=>({generation:0,record:blankLessonRecord(),reveal:0,turn:0,graph:null})
export function validTeacherSnapshot(value:unknown):value is Snapshot{
 if(!value||typeof value!=='object')return false
 const s=value as Snapshot
 return s.app==='parallel-perpendicular-teacher'&&s.version===1&&Number.isInteger(s.index)&&s.index>=0&&s.index<parallelNotes.length&&['en','es'].includes(s.language)&&['blue','red','equation'].includes(s.active)&&['num','den'].includes(s.part)&&Array.isArray(s.demos)&&(s.demos.length===parallelNotes.length||s.demos.length===12)&&s.demos.slice(0,parallelNotes.length).every((d,i)=>!!d?.record&&Number.isInteger(d.generation)&&d.generation>=0&&Number.isInteger(d.reveal)&&d.reveal>=0&&d.reveal<=4&&(!d.graph||d.graph.problemId===parallelNotes[i].id))
}
/** Separate teacher controller: no student progress gates, scorecards or completion path. */
export default function TeacherLesson(){
 const [index,setIndex]=useState(0),[demos,setDemos]=useState<Demo[]>(()=>parallelNotes.map(fresh)),[active,setActive]=useState<Field>('equation'),[part,setPart]=useState<'num'|'den'>('num'),[notice,setNotice]=useState(''),[warning,setWarning]=useState<{prefix:boolean;x:boolean}|null>(null),[isExternalDisplay,setIsExternalDisplay]=useState(false),[remoteAnimation,setRemoteAnimation]=useState<LessonAnimation|null>(null)
 const [restoreRevision,setRestoreRevision]=useState(0)
 const external=useRef(false),inputs=useRef<Record<string,HTMLInputElement|null>>({}),{language,setLanguage}=useWidgetLanguage(),languageSetter=useRef(setLanguage)
 const q=parallelNotes[index],demo=demos[index],r=demo.record,solved=r.solved||demo.reveal===4
 const frame=useEquationAnimation(q,!isExternalDisplay&&!remoteAnimation&&solved&&q.kind==='triple'&&!r.sketchChecked),animation=remoteAnimation??frame
 const bridgeActive=typeof window!=='undefined'&&!!(window as LessonMathBoardWindow).MathBoardApplet
 const animationCheckpoint=useEquationAnimationSnapshot(q,animation)
 const [scrollY,setScrollY]=useMathBoardPosition(bridgeActive,restoreRevision)
 useEffect(()=>{
  if(!bridgeActive)return
  const bridge=installLessonBridge(window as LessonMathBoardWindow)
  if(bridge.displayOnly)external.current=true
  return bridge.listen(value=>{
   if(!validTeacherSnapshot(value))return false
   setIsExternalDisplay(bridge.displayOnly);setIndex(value.index);setDemos(value.demos.slice(0,parallelNotes.length))
   setActive(value.active);setPart(value.part);setNotice(value.notice);setWarning(value.warning)
   languageSetter.current(value.language);setRemoteAnimation(value.animation??null)
   setScrollY(Number.isFinite(value.scrollY)?value.scrollY!:0);setRestoreRevision(n=>n+1)
   return true
  })
 },[bridgeActive,setScrollY])
 useEffect(()=>{
  if(!bridgeActive||isExternalDisplay||external.current)return
  const host=window as LessonMathBoardWindow
  if(!host.mathBoardLessonBridge?.canPublish())return
  host.MathBoardApplet?.publishState?.({app:'parallel-perpendicular-teacher',version:1,index,demos,active,part,notice,warning,language,animation:animationCheckpoint,scrollY})
 },[bridgeActive,isExternalDisplay,index,demos,active,part,notice,warning,language,animationCheckpoint,scrollY])
 const receiveGraph=useCallback((graph:LessonGraphDisplayState)=>{if(external.current)return;setDemos(old=>old.map((d,i)=>i===index?{...d,graph}:d))},[index])
 function change(patch:Partial<Demo>){if(external.current)return;setRemoteAnimation(null);setDemos(old=>old.map((d,i)=>i===index?{...d,...patch}:d))}
 function record(patch:Partial<LessonRecord>){if(external.current)return;setRemoteAnimation(null);setDemos(old=>old.map((d,i)=>i===index?{...d,record:{...d.record,...patch}}:d))}
 function go(next:number){if(external.current||next<0||next>=parallelNotes.length)return;setRemoteAnimation(null);setIndex(next);setNotice('');setWarning(null);setActive('equation');setPart('num')}
 function reset(){if(external.current)return;setRemoteAnimation(null);setDemos(old=>old.map((d,i)=>i===index?{...fresh(),generation:d.generation+1}:d));setNotice('');setWarning(null)}
 function fill(){record({blue:fraction(q.given.m),red:fraction(q.answer.m),equation:`y=${lessonNumber(q.answer.m)}x${q.answer.b<0?'-':'+'}${lessonNumber(Math.abs(q.answer.b))}`,blueCorrect:false,redCorrect:false,solved:false,line:null,format:false});change({reveal:0});setNotice('Answers filled. Check or reveal the work when ready.')}
 function focusDen(which:Field){if(external.current)return;setActive(which);setPart('den');requestAnimationFrame(()=>inputs.current[which+'den']?.focus({preventScroll:true}))}
 function slopeChange(which:'blue'|'red',p:'num'|'den',value:string){const [n='',d='']=r[which].split('/');if(p==='num'&&value.includes('/')){record({[which]:value});focusDen(which)}else record({[which]:p==='num'?`${value}/${d}`:`${n}/${value.replace(/\//g,'')}`})}
 function key(k:string){if(external.current)return;if(active!=='equation'&&k==='/'){focusDen(active);return}const id=active==='equation'?'equation':active+part,el=inputs.current[id],value=active==='equation'?r.equation:r[active].split('/')[part==='num'?0:1]??'',out=editAnswer(value,k,el?.selectionStart??value.length,el?.selectionEnd??value.length);if(active==='equation')record({equation:out.value});else slopeChange(active,part,out.value);requestAnimationFrame(()=>{el?.focus({preventScroll:true});el?.setSelectionRange(out.caret,out.caret)})}
 function checkSlope(which:'blue'|'red'){if(external.current)return;const ok=lessonSlopeCorrect(r[which],which==='blue'?q.given.m:q.answer.m);record({[which==='blue'?'blueCorrect':'redCorrect']:ok});setNotice(ok?'Correct slope. Keep going.':'Check the required slope relationship.')}
 function checkEquation(){if(external.current)return;const missing=missingLessonNotation(r.equation,q.answer.m);if(missing.prefix||missing.x){setWarning(missing);return}const answer=readLessonLine(r.equation);if(!answer.line||answer.format){setNotice('Use a readable equation starting with y =. Enter fractions with / and put x after the slope.');return}const result=inspectLessonLine(q,answer.line);record({line:answer.line,solved:result.correct});setNotice(result.correct?'★ Both conditions are correct!':!result.slopeOK?'Check the required slope relationship.':'Use the given point to correct the line’s position.')}
 function slope(which:'blue'|'red',label:string){const values=r[which].split('/');return <fieldset className={`lp-slope-entry ${which}`}><legend>{label}</legend><div className="lp-slope-stack"><span>m =</span><div className="lp-fraction-input">{(['num','den'] as const).map((p,i)=><input key={p} ref={el=>{inputs.current[which+p]=el}} value={values[i]??''} aria-label={`${label} ${p==='num'?'numerator':'denominator'}`} readOnly={isExternalDisplay} inputMode="none" data-remote-active={active===which&&part===p||undefined} onFocus={()=>{setActive(which);setPart(p)}} onKeyDown={e=>{if(e.key==='/'){e.preventDefault();focusDen(which)}}} onChange={e=>slopeChange(which,p,e.target.value)}/>)}</div><button onClick={()=>checkSlope(which)}>{r[which==='blue'?'blueCorrect':'redCorrect']?'✓':'Check'}</button></div></fieldset>}
 const previousSlide=parallelNotes.reduce((last,v,i)=>i<index&&v.slide<q.slide?i:last,-1),nextSlide=parallelNotes.findIndex((v,i)=>i>index&&v.slide>q.slide)
 return <main className={`lp-app lp-teacher teacher-demo ${isExternalDisplay?'lp-external-display':''}`} inert={isExternalDisplay||undefined}>
  <header><div><Link href="/apps/beta">← Beta apps</Link><h1>{parallelOnlyTitle}</h1><p>Teacher presentation · reveal work at your pace</p></div></header>
  <nav className="lp-top-links"><a href={notesPath+"#page=1"} target="_blank" rel="noreferrer">Parallel lines notes (PDF)</a><Link href="/apps/beta/parallel-lines">Open student lesson</Link></nav>
  <div className="lp-problem-header"><b>Slide {q.slide} · {q.id}</b><span>{q.relation==='parallel'?'PARALLEL LINES':'PERPENDICULAR LINES'}</span><label>Jump to problem<select aria-label="Teacher problem navigation" value={index} onChange={e=>go(Number(e.target.value))}>{parallelNotes.map((v,i)=><option key={v.id} value={i}>Slide {v.slide} · {v.id}</option>)}</select></label></div>
  <section className="lp-givens"><h2>Write the equation of the line {q.relation==='parallel'?'parallel':'perpendicular'} to the given line and passing through the given point.</h2><div><span className="lp-blue">Given line <Formula>{lineTex(q.given)}</Formula></span><span className="lp-gold">Given point <Formula>{`P=(${q.point.x},${q.point.y})`}</Formula></span></div></section>
  <div className="lp-layout"><section className="lp-card lp-picture"><LessonGraph key={`${q.id}-${demo.generation}-${restoreRevision}`} q={q} line={demo.reveal===4?q.answer:r.line} correct={solved} drawing={!solved} sketch={r.sketch??null} sketchChecked={r.sketchChecked} arrows={demo.reveal>=2} turn={demo.turn} animation={animation} isExternalDisplay={isExternalDisplay} mirror={demo.graph} onMirrorChange={bridgeActive&&!isExternalDisplay?receiveGraph:undefined} onSketchChange={sketch=>record({sketch,sketchChecked:false,solved:false,line:null})} onSketchCheck={sketchChecked=>record({sketchChecked})}/>{q.slide===5&&<button onClick={()=>change({turn:demo.turn+1})}>Reveal quarter turn</button>}</section>
  <section className="lp-card lp-work"><h2>Demonstrate the answer</h2><div className="teacher-slopes">{slope('blue','Given slope')}{slope('red','New slope')}</div><label className="teacher-equation">Red line equation · y = mx + b<input aria-label="Red line equation · y = mx + b" ref={el=>{inputs.current.equation=el}} value={r.equation} readOnly={isExternalDisplay} inputMode="none" data-remote-active={active==='equation'||undefined} onFocus={()=>setActive('equation')} onChange={e=>record({equation:e.target.value,solved:false})}/></label>
   <div className="lp-keypad">{['7','8','9','x','4','5','6','y','1','2','3','=','-','0','/','+','.','(',')','back','clear'].map(k=><button key={k} data-key={k} aria-label={k==='back'?'Backspace':k==='clear'?'Clear':k} onPointerDown={e=>e.preventDefault()} onClick={()=>key(k)}>{k==='back'?'⌫':k==='clear'?'Clear':k==='-'?'−':k}</button>)}</div>
   <div className="lp-teacher-actions"><button onClick={fill}>Fill answers</button><button className="lp-primary" onClick={checkEquation}>Check equation</button></div><p className={r.solved?'teacher-success':''} role="status">{notice}</p>
   {r.solved&&<div className="lp-correct-equations"><div className="lp-equation-blue"><Formula display>{lineTex(q.given)}</Formula></div><div className="lp-equation-red"><Formula display>{lineTex(q.answer)}</Formula></div></div>}
   <div className="lp-teacher-actions"><button disabled={demo.reveal===0} onClick={()=>change({reveal:demo.reveal-1})}>Previous step</button><button disabled={demo.reveal===4} onClick={()=>change({reveal:demo.reveal+1})}>Reveal next step</button></div>
   <div className="teacher-work" aria-live="polite">{demo.reveal>=1&&<p>Given slope <Formula>{`m=${lessonNumber(q.given.m,true)}`}</Formula></p>}{demo.reveal>=2&&<p>New slope <Formula>{`m=${lessonNumber(q.answer.m,true)}`}</Formula></p>}{demo.reveal>=3&&<><Formula display>{String.raw`y-y_1=m(x-x_1)`}</Formula><Formula display>{pointSlopeLesson(q)}</Formula></>}{demo.reveal>=4&&<><Formula display>{distributedLesson(q)}</Formula><Formula display>{lineTex(q.answer)}</Formula></>}</div>
  </section></div>
  <footer className="lp-teacher-actions teacher-navigation" aria-label="Teacher presentation controls"><button disabled={index===0} onClick={()=>go(index-1)}>Previous problem</button><button disabled={index===parallelNotes.length-1} onClick={()=>go(index+1)}>Next problem →</button><button disabled={previousSlide<0} onClick={()=>go(previousSlide)}>Previous slide</button><button disabled={nextSlide<0} onClick={()=>go(nextSlide)}>Skip to next slide →</button><button onClick={reset}>Reset this problem</button><p>No student score is created in presentation mode.</p></footer>
  {warning&&<EquationFormatWarning readOnly={isExternalDisplay} missing={warning} onClose={()=>setWarning(null)}/>}
 </main>
}
