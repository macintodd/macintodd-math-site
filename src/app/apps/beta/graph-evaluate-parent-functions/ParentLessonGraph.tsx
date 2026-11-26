'use client'
import {useId,type PointerEvent} from 'react'
import {useWidgetLanguage} from '@/components/practice/BilingualWidget'
import {parentGraphPath,parentGraphSnap,parentPointCorrect} from '@/lib/graph-parent-functions'
import {graphSpec,lessonExamples,type ParentLessonState,type ParentLessonAction} from '@/lib/parent-function-lesson'
export default function ParentLessonGraph({state,dispatch,readOnly=false}:{state:ParentLessonState;dispatch:(a:ParentLessonAction)=>void;readOnly?:boolean}){
 const id=useId().replace(/:/g,''),{translate:t}=useWidgetLanguage(),locked=readOnly||!!state.result,q=graphSpec(state.question),reveal=state.hintUsed||!!state.result
 const sx=(x:number)=>250+x*20,sy=(y:number)=>250-y*20
 function tap(e:PointerEvent<SVGSVGElement>){e.preventDefault();if(locked)return;const matrix=e.currentTarget.getScreenCTM();if(!matrix)return;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse()),point=parentGraphSnap(p.x,p.y);if(point)dispatch({type:'point',point})}
 return <svg className="pfl-grid" viewBox="20 15 460 460" role="group" tabIndex={locked?-1:0} aria-label={t('Coordinate grid. Tap integer intersections to add or remove points. Keyboard: arrow keys move, Enter toggles a point.')}
 onPointerDown={e=>{if(!locked){e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId)}}} onPointerUp={tap}
 onFocus={()=>{if(!locked)dispatch({type:'grid-focus',value:true})}} onBlur={()=>{if(!readOnly)dispatch({type:'grid-focus',value:false})}}
 onKeyDown={e=>{if(locked)return;const moves:Record<string,{x:number;y:number}>={ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},ArrowUp:{x:0,y:1},ArrowDown:{x:0,y:-1}};if(moves[e.key]){e.preventDefault();const d=moves[e.key];dispatch({type:'cursor',point:{x:Math.max(-10,Math.min(10,state.cursor.x+d.x)),y:Math.max(-10,Math.min(10,state.cursor.y+d.y))}})}else if(e.key==='Enter'||e.key===' '){e.preventDefault();dispatch({type:'point',point:state.cursor})}}}>
 <defs><clipPath id={`${id}-clip`}><rect x="50" y="50" width="400" height="400"/></clipPath></defs>
 <rect x="48" y="48" width="404" height="404" fill="white"/>
 {Array.from({length:21},(_,i)=>i-10).map(n=><g key={n} aria-hidden="true"><path d={`M${sx(n)} 50V450M50 ${sy(n)}H450`} stroke={n===0?'#233f5b':'#d5e0e9'} strokeWidth={n===0?2:1}/>{n!==0&&n%2===0&&<><text x={sx(n)} y="268" textAnchor="middle">{n}</text><text x="237" y={sy(n)+4} textAnchor="end">{n}</text></>}</g>)}
 <path d="M40 250H460M250 460V40" stroke="#233f5b" strokeWidth="2"/><path d="M460 250l-9-5v10zM40 250l9-5v10zM250 40l-5 9h10zM250 460l-5-9h10z" fill="#233f5b"/>
 <g aria-hidden="true"><text x="465" y="242" className="pfl-axis">x</text><text x="260" y="33" className="pfl-axis">y</text><text x="237" y="268">0</text></g>
 <g clipPath={`url(#${id}-clip)`}>
  {reveal&&<><path className="pfl-parent-curve" d={parentGraphPath(q)} stroke="#187351" fill="none" strokeWidth="3.5"/>{lessonExamples(state.question).map(p=><circle className="pfl-example-point" key={`${p.x},${p.y}`} cx={sx(p.x)} cy={sy(p.y)} r="7.5" fill="white" stroke="#187351" strokeWidth="2.5"/>)}</>}
  {state.points.map(p=><circle className="pfl-plotted-point" key={`${p.x},${p.y}`} cx={sx(p.x)} cy={sy(p.y)} r="6" stroke="white" strokeWidth="1.5" fill={state.result&&!parentPointCorrect(q,p)?'#bd4d40':'#235eb3'}><title>({p.x}, {p.y})</title></circle>)}
  {state.gridFocus&&!locked&&<path className="pfl-cursor" d={`M${sx(state.cursor.x)-10} ${sy(state.cursor.y)}h20M${sx(state.cursor.x)} ${sy(state.cursor.y)-10}v20`} stroke="#9b5b21" strokeWidth="2"/>}
 </g>
 {state.points.some(p=>p.x===state.cursor.x&&p.y===state.cursor.y)&&<text className="pfl-point-label" x={Math.min(400,sx(state.cursor.x)+11)} y={Math.max(32,sy(state.cursor.y)-14)}>({state.cursor.x}, {state.cursor.y})</text>}
 </svg>
}
