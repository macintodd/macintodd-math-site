'use client'
import { useRef, useState, type PointerEvent } from 'react'
type Stroke={id:number;path:string;erase:boolean}
export default function ScratchPad(){
  const [strokes,setStrokes]=useState<Stroke[]>([])
  const [erase,setErase]=useState(false)
  const pointer=useRef<{pointer:number;stroke:number}|null>(null)
  const serial=useRef(0)
  function point(event:PointerEvent<SVGSVGElement>){
    const matrix=event.currentTarget.getScreenCTM();if(!matrix)return null
    const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse())
    return `${Math.max(0,Math.min(504,p.x)).toFixed(1)} ${Math.max(0,Math.min(504,p.y)).toFixed(1)}`
  }
  function end(event:PointerEvent<SVGSVGElement>){if(pointer.current?.pointer===event.pointerId)pointer.current=null}
  return <div className="scratch-pad">
    <div className="scratch-tools" role="group" aria-label="Scratch pad tools">
      <button type="button" aria-pressed={!erase} onClick={()=>setErase(false)}>Pen</button>
      <button type="button" aria-pressed={erase} onClick={()=>setErase(true)}>Eraser</button>
      <button type="button" disabled={!strokes.length} onClick={()=>setStrokes(current=>current.slice(0,-1))}>Undo stroke</button>
      <button type="button" disabled={!strokes.length} onClick={()=>setStrokes([])}>Clear scratch work</button>
    </div>
    <svg className="scratch-surface" viewBox="0 0 504 504" role="img" aria-label="Scratch pad. Write calculations with your finger, stylus, or Apple Pencil. Use the pen, eraser, undo, and clear buttons above."
      onPointerDown={event=>{event.preventDefault();if(pointer.current)return;const p=point(event);if(!p)return;const id=++serial.current;pointer.current={pointer:event.pointerId,stroke:id};event.currentTarget.setPointerCapture(event.pointerId);setStrokes(current=>[...current,{id,path:`M ${p} l 0.1 0`,erase}])}}
      onPointerMove={event=>{if(pointer.current?.pointer!==event.pointerId)return;event.preventDefault();const p=point(event),id=pointer.current.stroke;if(p)setStrokes(current=>current.map(stroke=>stroke.id===id?{...stroke,path:`${stroke.path} L ${p}`}:stroke))}}
      onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}>
      <rect width="504" height="504" fill="white"/>
      {strokes.map(stroke=><path key={stroke.id} d={stroke.path} fill="none" stroke={stroke.erase?'white':'#16334c'} strokeWidth={stroke.erase?20:2.5} strokeLinecap="round" strokeLinejoin="round" pointerEvents="none"/>)}
    </svg>
    <p className="slope-small">Use a finger or Apple Pencil. Scratch work stays here when you switch views and clears for the next equation.</p>
  </div>
}
