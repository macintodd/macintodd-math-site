'use client'
import {useEffect,useId,useState} from 'react'
import type {LessonProblem,LessonSegment} from '@/lib/parallel-lesson'
import {normalSketchCamera,sketchFeedbackCamera,sketchCameraFrame,sketchIntersection,clipSketchLine,sketchGridStep} from '@/lib/parallel-sketch-feedback'
/** A read-only diagnostic view. Retry unmounts this view and restores the normal drawing grid. */
export default function SketchFeedbackGraph({q,segment,reason,isExternalDisplay=false,mirroredProgress,onProgressChange}:{q:LessonProblem;segment:LessonSegment;reason:'point'|'direction';isExternalDisplay?:boolean;mirroredProgress?:number|null;onProgressChange?:(progress:number)=>void}){
 const id=useId().replace(/:/g,''),[localProgress,setProgress]=useState(0)
 useEffect(()=>{if(isExternalDisplay)return;let frame=0,start:number|null=null,active=true;const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches,duration=reason==='point'?1300:3200
  function tick(now:number){if(!active)return;if(start===null)start=now;const p=reduced?1:Math.min(1,(now-start)/duration);setProgress(p);if(p<1)frame=requestAnimationFrame(tick)}
  frame=requestAnimationFrame(tick);return()=>{active=false;cancelAnimationFrame(frame)}
 },[q,segment,reason,isExternalDisplay])
 useEffect(()=>{if(!isExternalDisplay)onProgressChange?.(localProgress)},[isExternalDisplay,onProgressChange,localProgress])
 const progress=isExternalDisplay?mirroredProgress??0:localProgress
 const target=sketchFeedbackCamera(q,segment,reason),camera=progress===0?normalSketchCamera:sketchCameraFrame(target,progress),scale=400/camera.span,sx=(x:number)=>250+(x-camera.x)*scale,sy=(y:number)=>250-(y-camera.y)*scale,step=sketchGridStep(camera.span)
 const ticks=(center:number)=>Array.from({length:22},(_,i)=>(Math.ceil((center-camera.span/2)/step)+i)*step).filter(n=>n<=center+camera.span/2+1e-8)
 const number=(n:number)=>Number(n.toPrecision(5)).toString(),path=(s:LessonSegment)=>`M${sx(s.a.x)} ${sy(s.a.y)}L${sx(s.b.x)} ${sy(s.b.y)}`
 const given=clipSketchLine({a:{x:0,y:q.given.b},b:{x:1,y:q.given.m+q.given.b}},camera),extended=reason==='direction'?clipSketchLine(segment,camera):null,intersection=reason==='direction'?sketchIntersection(q,segment):null
 const perpendicular=q.relation==='perpendicular'
 const caption=reason==='point'?'Look closely at the given point.':perpendicular?(intersection?'Look at the angle where the lines meet.':'These lines are parallel.'):'Nonparallel lines eventually intersect.'
 const graphLabel=reason==='point'?'Zoomed view of your line and the given point.':perpendicular?'Zoomed view of the blue line and your line.':'Zoomed view of where your line intersects the given line.'
 const drawnSegment=segment.tapped?extended??segment:segment
 const sketchPoints=segment.tapped?[segment.b]:[segment.a,segment.b]
 const ix=intersection?sx(intersection.x):0,iy=intersection?sy(intersection.y):0,dx=intersection&&intersection.x>camera.x?-85:85,dy=intersection&&intersection.y>camera.y?65:-65
 return <svg className="lp-graph lp-diagnostic-graph" viewBox="0 0 500 500" role="img" aria-label={graphLabel} data-feedback={reason} data-camera={`${camera.x},${camera.y},${camera.span}`}>
 <defs><clipPath id={`${id}-window`}><rect x="50" y="50" width="400" height="400"/></clipPath><marker id={`${id}-intersection-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10" fill="#9d2032"/></marker></defs>
 <rect x="50" y="50" width="400" height="400" fill="white" stroke="#bacada"/>
 {ticks(camera.x).map(n=><g key={`x${n}`}><path d={`M${sx(n)} 50V450`} stroke={Math.abs(n)<1e-8?'#3d536b':'#d0d9e4'} strokeWidth={Math.abs(n)<1e-8?2:1}/><text x={sx(n)} y="472" textAnchor="middle" fontSize="11">{number(n)}</text></g>)}
 {ticks(camera.y).map(n=><g key={`y${n}`}><path d={`M50 ${sy(n)}H450`} stroke={Math.abs(n)<1e-8?'#3d536b':'#d0d9e4'} strokeWidth={Math.abs(n)<1e-8?2:1}/><text x="40" y={sy(n)+4} textAnchor="end" fontSize="11">{number(n)}</text></g>)}
 <g clipPath={`url(#${id}-window)`}>
 {given&&<path className="lp-diagnostic-given" d={path(given)} fill="none" stroke="#245ecb" strokeWidth="3"/>}
 {extended&&!segment.tapped&&<path className="lp-sketch-extension" d={path(extended)} fill="none" stroke="#c32c3c" strokeWidth="3" strokeDasharray="9 6"/>}
 <path className="lp-student-segment" d={path(drawnSegment)} fill="none" stroke="#c32c3c" strokeWidth="4"/>
 {sketchPoints.map((p,i)=><circle key={i} cx={sx(p.x)} cy={sy(p.y)} r="4" fill="#c32c3c" stroke="white"/>)}
 <circle cx={sx(q.point.x)} cy={sy(q.point.y)} r="7" fill="#efbd36" stroke="#795500" strokeWidth="2"/>
 </g>
 <text x={sx(q.point.x)+16} y={sy(q.point.y)+27} fontSize="22" fontWeight="700" fill="#6e5005" stroke="white" strokeWidth="4" paintOrder="stroke">P ({q.point.x}, {q.point.y})</text>
 {reason==='point'&&progress===1&&<g className="lp-point-callout"><path d={`M${sx(q.point.x)-105} ${sy(q.point.y)-50}L${sx(q.point.x)-12} ${sy(q.point.y)-6}`} stroke="#9d2032" strokeWidth="3" markerEnd={`url(#${id}-intersection-arrow)`}/><text x={sx(q.point.x)} y={sy(q.point.y)-66} textAnchor="middle" fontSize="19" fontWeight="700" fill="#9d2032" stroke="white" strokeWidth="5" paintOrder="stroke">The line must go through the point.</text></g>}{intersection&&progress===1&&<g className="lp-intersection-callout"><circle cx={ix} cy={iy} r="9" fill="white" fillOpacity=".7" stroke="#9d2032" strokeWidth="2.5"/><path d={`M${ix+dx*.85} ${iy+dy*.85}L${ix+dx*.13} ${iy+dy*.13}`} stroke="#9d2032" strokeWidth="3" markerEnd={`url(#${id}-intersection-arrow)`}/><text x={ix+dx} y={iy+dy} textAnchor="middle" fontSize="20" fontWeight="700" fill="#9d2032" stroke="white" strokeWidth="5" paintOrder="stroke">{perpendicular?'Check this angle.':'They intersect here.'}</text></g>}
 <text x="250" y="27" textAnchor="middle" fill="#8e2536" fontSize="17" fontWeight="700">{caption}</text>
 </svg>
}
