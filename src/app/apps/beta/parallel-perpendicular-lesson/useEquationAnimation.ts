'use client'
import {useEffect,useMemo,useState} from 'react'
import {lessonAnimationFrame,lessonAnimationDuration,visibleLessonSegment,type LessonAnimation,type LessonProblem} from '@/lib/parallel-lesson'
export function useEquationAnimation(q:LessonProblem,enabled:boolean){
 const [frame,setFrame]=useState<LessonAnimation|null>(null)
 useEffect(()=>{let active=true,raf=0;if(!enabled){void Promise.resolve().then(()=>{if(active)setFrame(null)});return()=>{active=false}}const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches,start=performance.now();function tick(now:number){if(!active)return;const elapsed=reduced?lessonAnimationDuration:now-start;const next=lessonAnimationFrame(q,elapsed);setFrame(previous=>previous?.id===next.id&&previous.phase===next.phase&&previous.riseCount===next.riseCount&&previous.runCount===next.runCount&&previous.lineProgress===next.lineProgress&&previous.hitTarget===next.hitTarget?previous:next);if(elapsed<lessonAnimationDuration)raf=requestAnimationFrame(tick)}raf=requestAnimationFrame(tick);return()=>{active=false;cancelAnimationFrame(raf)}},[q,enabled])
 return enabled?(frame?.id===q.id?frame:lessonAnimationFrame(q,0)):null
}

// Snapshot the meaningful stages, not the continuous redraw of the red line.
export function useEquationAnimationSnapshot(q:LessonProblem,frame:LessonAnimation|null):LessonAnimation|null{
 const {id,phase,riseCount,runCount,hitTarget}=frame??{}
 return useMemo(()=>{
  if(!id||!phase)return null
  const {a,b}=visibleLessonSegment(q.answer)
  const lineProgress=phase==='done'?1:phase==='line'&&hitTarget?(q.point.x-a.x)/(b.x-a.x):0
  return {id,phase,riseCount:riseCount??0,runCount:runCount??0,lineProgress,hitTarget:hitTarget??false}
 },[q,id,phase,riseCount,runCount,hitTarget])
}
