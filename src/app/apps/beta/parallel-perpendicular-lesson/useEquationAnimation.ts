'use client'
import {useEffect,useState} from 'react'
import {lessonAnimationFrame,lessonAnimationDuration,type LessonAnimation,type LessonProblem} from '@/lib/parallel-lesson'
export function useEquationAnimation(q:LessonProblem,enabled:boolean){
 const [frame,setFrame]=useState<LessonAnimation|null>(null)
 useEffect(()=>{let active=true,raf=0;if(!enabled){void Promise.resolve().then(()=>{if(active)setFrame(null)});return()=>{active=false}}const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches,start=performance.now();function tick(now:number){if(!active)return;const elapsed=reduced?lessonAnimationDuration:now-start;const next=lessonAnimationFrame(q,elapsed);setFrame(previous=>previous?.id===next.id&&previous.phase===next.phase&&previous.riseCount===next.riseCount&&previous.runCount===next.runCount&&previous.lineProgress===next.lineProgress&&previous.hitTarget===next.hitTarget?previous:next);if(elapsed<lessonAnimationDuration)raf=requestAnimationFrame(tick)}raf=requestAnimationFrame(tick);return()=>{active=false;cancelAnimationFrame(raf)}},[q,enabled])
 return enabled?(frame?.id===q.id?frame:lessonAnimationFrame(q,0)):null
}
