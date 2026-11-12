'use client'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
export type ScratchStroke={id:number;path:string;erase:boolean}
export default function ScratchPad({height=504,strokes:sharedStrokes,onStrokesChange,onStrokeEnd,syncContent,initialStrokes,initialImage=null,initialErase=false,readOnly=false,onStrokesCommit,onToolChange}:{height?:number;strokes?:ScratchStroke[];onStrokesChange?:(strokes:ScratchStroke[])=>void;onStrokeEnd?:(dataURL:string)=>void;syncContent?:string|null;initialStrokes?:ScratchStroke[];initialImage?:string|null;initialErase?:boolean;readOnly?:boolean;onStrokesCommit?:(strokes:ScratchStroke[],background:string|null)=>void;onToolChange?:(erase:boolean)=>void}){
  const [localStrokes,setLocalStrokes]=useState<ScratchStroke[]>(initialStrokes??[])
  const [background,setBackground]=useState(initialImage)
  const strokes=sharedStrokes??localStrokes
  function updateStrokes(next:ScratchStroke[]){if(onStrokesChange)onStrokesChange(next);else setLocalStrokes(next)}
  const [erase,setErase]=useState(initialErase)
  function chooseTool(value:boolean){setErase(value);onToolChange?.(value)}
  const pointer=useRef<{pointer:number;stroke:number}|null>(null)
  const serial=useRef(0),snapshotRevision=useRef(0)
  useEffect(()=>()=>{snapshotRevision.current++},[])
  const remote=readOnly||syncContent!==undefined
  function snapshot(next:ScratchStroke[],backdrop=background){
    if(remote)return
    onStrokesCommit?.(next,backdrop)
    if(!onStrokeEnd)return
    const revision=++snapshotRevision.current
    const paths=next.map(s=>`<path d="${s.path.replace(/[^MLl0-9.,\s-]/g,'')}" fill="none" stroke="${s.erase?'white':'#16334c'}" stroke-width="${s.erase?20:2.5}" stroke-linecap="round" stroke-linejoin="round"/>`).join('')
    const source=`<svg xmlns="http://www.w3.org/2000/svg" width="504" height="${height}" viewBox="0 0 504 ${height}"><rect width="504" height="${height}" fill="white"/>${paths}</svg>`
    const image=new Image(),url=`data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`
    image.onload=()=>{if(revision!==snapshotRevision.current)return;const canvas=document.createElement('canvas');canvas.width=1008;canvas.height=height*2;const context=canvas.getContext('2d');if(!context)return;context.drawImage(image,0,0,canvas.width,canvas.height);if(revision===snapshotRevision.current)onStrokeEnd(canvas.toDataURL('image/png'))}
    image.src=url
  }
  function point(event:PointerEvent<SVGSVGElement>){
    const matrix=event.currentTarget.getScreenCTM();if(!matrix)return null
    const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse())
    return `${Math.max(0,Math.min(504,p.x)).toFixed(1)} ${Math.max(0,Math.min(height,p.y)).toFixed(1)}`
  }
  function end(event:PointerEvent<SVGSVGElement>){if(pointer.current?.pointer===event.pointerId){pointer.current=null;snapshot(strokes)}}
  return <div className="scratch-pad">
    <div className="scratch-tools" role="group" aria-label="Scratch pad tools">
      <button type="button" aria-pressed={!erase} disabled={remote} onClick={()=>chooseTool(false)}>Pen</button>
      <button type="button" aria-pressed={erase} disabled={remote} onClick={()=>chooseTool(true)}>Eraser</button>
      <button type="button" disabled={remote||!strokes.length} onClick={()=>{const next=strokes.slice(0,-1);updateStrokes(next);snapshot(next)}}>Undo stroke</button>
      <button type="button" disabled={remote||!strokes.length&&!background} onClick={()=>{setBackground(null);updateStrokes([]);snapshot([],null)}}>Clear scratch work</button>
    </div>
    <svg className="scratch-surface" preserveAspectRatio="none" viewBox={`0 0 504 ${height}`} role="img" aria-label="Scratch pad. Write calculations with your finger, stylus, or Apple Pencil. Use the pen, eraser, undo, and clear buttons above."
      onPointerDown={event=>{event.preventDefault();if(remote||pointer.current)return;const p=point(event);if(!p)return;snapshotRevision.current++;const id=serial.current=strokes.reduce((max,stroke)=>Math.max(max,stroke.id),serial.current)+1;pointer.current={pointer:event.pointerId,stroke:id};event.currentTarget.setPointerCapture(event.pointerId);updateStrokes([...strokes,{id,path:`M ${p} l 0.1 0`,erase}])}}
      onPointerMove={event=>{if(pointer.current?.pointer!==event.pointerId)return;event.preventDefault();const p=point(event),id=pointer.current.stroke;if(p)updateStrokes(strokes.map(stroke=>stroke.id===id?{...stroke,path:`${stroke.path} L ${p}`}:stroke))}}
      onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}>
      <rect width="504" height={height} fill="white"/>
      {(syncContent??background)&&<image href={syncContent??background??undefined} x="0" y="0" width="504" height={height} preserveAspectRatio="none"/>}
      {syncContent===undefined&&strokes.map(stroke=><path key={stroke.id} d={stroke.path} fill="none" stroke={stroke.erase?'white':'#16334c'} strokeWidth={stroke.erase?20:2.5} strokeLinecap="round" strokeLinejoin="round" pointerEvents="none"/>)}
    </svg>
    <p className="slope-small">Use a finger or Apple Pencil. Scratch work stays on this device and clears for the next problem.</p>
  </div>
}
