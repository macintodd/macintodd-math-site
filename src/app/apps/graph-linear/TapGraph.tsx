'use client'
import { useId, useRef, useState } from 'react'
import { lineEnds, slopePoint, type GridPoint } from '@/lib/graph-line'
import type { Line } from '@/lib/slope'
const sx=(x:number)=>32+(x+10)*22
const sy=(y:number)=>sx(-y)
export default function TapGraph({selected,onSelect,drawn,reveal,disabled,line,revealPoints}:{selected:GridPoint[];onSelect:(point:GridPoint)=>void;drawn:boolean;reveal:boolean;disabled:boolean;line:Line;revealPoints?:GridPoint[]}) {
  const id=useId().replace(/:/g,'')
  const down=useRef<{x:number;y:number;id:number}|null>(null)
  const [cursor,setCursor]=useState<GridPoint>({x:0,y:0})
  const [keyboard,setKeyboard]=useState(false)
  const studentEnds=selected.length===2 ? lineEnds(selected[0],selected[1]) : []
  const intercept=revealPoints?.[0]??{x:0,y:line.y}, second=revealPoints?.[1]??slopePoint(line)
  const correctEnds=lineEnds(intercept,second)
  function path(ends:GridPoint[]) {return ends.length===2 ? `M ${sx(ends[0].x)} ${sy(ends[0].y)} L ${sx(ends[1].x)} ${sy(ends[1].y)}` : ''}
  function arrows(ends:GridPoint[],className:string) {
    if(ends.length!==2)return null
    return <g className={className}>{ends.map((p,i)=>{const other=ends[1-i];const angle=Math.atan2(sy(p.y)-sy(other.y),sx(p.x)-sx(other.x))*180/Math.PI;return <path key={i} d="M -12 -6 L 0 0 L -12 6" transform={`translate(${sx(p.x)} ${sy(p.y)}) rotate(${angle})`} fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />})}</g>
  }
  return <svg className="tap-line-grid" viewBox="0 0 504 504" role="group" aria-label="Interactive coordinate grid. Tap any grid intersection to select a point; tap it again to remove it. Select two points. Keyboard: arrow keys move the cursor, Enter or Space selects." tabIndex={0}
    onPointerDown={event=>{if(disabled)return;event.preventDefault();setKeyboard(false);down.current={x:event.clientX,y:event.clientY,id:event.pointerId};event.currentTarget.setPointerCapture(event.pointerId)}}
    onPointerCancel={()=>{down.current=null}}
    onPointerUp={event=>{const start=down.current;down.current=null;if(disabled||!start||start.id!==event.pointerId)return;event.preventDefault();if(Math.hypot(event.clientX-start.x,event.clientY-start.y)>16)return;const matrix=event.currentTarget.getScreenCTM();if(!matrix)return;const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());if(p.x<21||p.x>483||p.y<21||p.y>483)return;onSelect({x:Math.max(-10,Math.min(10,Math.round((p.x-32)/22-10))),y:Math.max(-10,Math.min(10,Math.round(10-(p.y-32)/22)))})}}
    onKeyDown={event=>{if(disabled)return;const moves:Record<string,GridPoint>={ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},ArrowUp:{x:0,y:1},ArrowDown:{x:0,y:-1}};if(moves[event.key]){event.preventDefault();setKeyboard(true);const d=moves[event.key];setCursor(p=>({x:Math.max(-10,Math.min(10,p.x+d.x)),y:Math.max(-10,Math.min(10,p.y+d.y))}))}else if(event.key==='Enter'||event.key===' '){event.preventDefault();onSelect(cursor)}}}>
    <defs><clipPath id={`clip-${id}`}><rect x="32" y="32" width="440" height="440" /></clipPath></defs>
    <rect x="32" y="32" width="440" height="440" fill="white" />
    {Array.from({length:21},(_,i)=>i-10).map(n=><g key={n}><path d={`M ${sx(n)} 32 V 472 M 32 ${sy(n)} H 472`} stroke={n===0?'#16334c':'#cddade'} strokeWidth={n===0?1.8:1}/>{n!==0&&n%2===0&&<><text x={sx(n)} y="266" textAnchor="middle" fontSize="10" fill="#385369">{n}</text><text x="244" y={sy(n)+3} textAnchor="end" fontSize="10" fill="#385369">{n}</text></>}</g>)}
    <text x="485" y="247" fontSize="15">x</text><text x="260" y="19" fontSize="15">y</text>
    {drawn&&studentEnds.length===2&&<g key={path(studentEnds)} className={reveal?'student-line-wrong':'student-line'}><path className="draw-student-line" d={path(studentEnds)} pathLength={reveal?undefined:1} fill="none" strokeWidth="3"/>{arrows(studentEnds,'draw-line-arrows')}</g>}
    {reveal&&<g className="correct-graph"><path d={path(correctEnds)} fill="none" strokeWidth="3.5"/>{arrows(correctEnds,'correct-arrows')}{!revealPoints&&<path d={`M ${sx(intercept.x)} ${sy(intercept.y)} H ${sx(second.x)} V ${sy(second.y)}`} stroke="#ad6819" strokeWidth="2.5" strokeDasharray="5 3" fill="none"/>}{[intercept,second].map((p,i)=><g key={i}><circle cx={sx(p.x)} cy={sy(p.y)} r="6" fill="#17633c" stroke="white" strokeWidth="2"/><text x={Math.min(422,sx(p.x)+9)} y={sy(p.y)-10} fontSize="13" fill="#17633c" stroke="white" strokeWidth="3" paintOrder="stroke">({p.x}, {p.y})</text></g>)}{!revealPoints&&<><text x={sx(second.x/2)} y={sy(intercept.y)+18} textAnchor="middle" fontSize="12" fill="#925414" stroke="none">run {second.x}</text><text x={sx(second.x)+9} y={sy((second.y+intercept.y)/2)} fontSize="12" fill="#925414" stroke="none">rise {second.y-intercept.y}</text></>}</g>}
    {selected.map(p=><g key={`${p.x},${p.y}`} pointerEvents="none"><circle cx={sx(p.x)} cy={sy(p.y)} r="5" fill={reveal?'#a64838':'#16334c'} stroke="white" strokeWidth="2"/><g transform={`translate(${Math.max(72,Math.min(432,sx(p.x)))},${sy(p.y)<65?sy(p.y)+25:sy(p.y)-17})`}><rect x="-36" y="-14" width="72" height="22" rx="4" fill="#16334c"/><text y="1" textAnchor="middle" fontSize="12" fill="white">({p.x}, {p.y})</text></g></g>)}
    {keyboard&&!disabled&&<g pointerEvents="none"><circle cx={sx(cursor.x)} cy={sy(cursor.y)} r="9" fill="none" stroke="#9b5a16" strokeWidth="2"/><text x="32" y="496" fontSize="12">Cursor ({cursor.x}, {cursor.y}) · Enter to toggle</text></g>}
  </svg>
}
