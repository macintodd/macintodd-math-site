import {useRef,useState,type PointerEvent} from 'react'
import {Math as Formula} from '@/components/Math'
import {emptyPlacements,placeQuantity,placementsCorrect,quantityTex,type Placements,type Quantity,type Slot} from '@/lib/intro-point-slope'
import {lessonSlopeParts,pointSlopeLesson,type LessonProblem} from '@/lib/parallel-lesson'

const slotNames={m:'m',x1:'x_1',y1:'y_1'}
const quantityLabels={m:'Slope m',x:'x1 coordinate',y:'y1 coordinate'}

export default function PointSlopePlacement({q,slots=emptyPlacements(),chosen=null,checked,readOnly,onPlace,onChoose,onCheck}:{q:LessonProblem;slots?:Placements;chosen?:Quantity|null;checked:boolean;readOnly:boolean;onPlace:(slots:Placements)=>void;onChoose:(quantity:Quantity)=>void;onCheck:(correct:boolean,message:string)=>void}){
 const drag=useRef<{pointerId:number;quantity:Quantity;x:number;y:number;moved:boolean}|null>(null)
 const [ghost,setGhost]=useState<{quantity:Quantity;x:number;y:number}|null>(null)
 const problem={point:q.point,line:{x:0,y:q.answer.b,...lessonSlopeParts(q.answer.m)}}

 function release(event:PointerEvent<HTMLButtonElement>){
  const current=drag.current
  if(current?.pointerId!==event.pointerId)return
  const slot=document.elementFromPoint(event.clientX,event.clientY)?.closest<HTMLButtonElement>('button[data-point-slope-slot]')?.dataset.pointSlopeSlot as Slot|undefined
  if(slot&&current.moved)onPlace(placeQuantity(slots,slot,current.quantity))
  else if(!current.moved)onChoose(current.quantity)
  clearDrag()
 }
 function clearDrag(){drag.current=null;setGhost(null)}
 function source(quantity:Quantity,label:string){
  return <div className={`wl-quantity wl-${quantity}`}>
   <button type="button" aria-label={quantityLabels[quantity]} aria-pressed={chosen===quantity} disabled={readOnly}
    onContextMenu={event=>event.preventDefault()}
    onPointerDown={event=>{
     if(drag.current||event.button!==0||!event.isPrimary)return
     event.preventDefault()
     drag.current={pointerId:event.pointerId,quantity,x:event.clientX,y:event.clientY,moved:false}
     event.currentTarget.setPointerCapture(event.pointerId)
    }}
    onPointerMove={event=>{
     const current=drag.current
     if(current?.pointerId!==event.pointerId)return
     current.moved ||= Math.hypot(event.clientX-current.x,event.clientY-current.y)>5
     if(current.moved)setGhost({quantity,x:event.clientX,y:event.clientY})
    }}
    onPointerUp={release} onPointerCancel={clearDrag} onLostPointerCapture={clearDrag}
    onClick={event=>{if(event.detail===0)onChoose(quantity)}}><Formula>{quantityTex(problem,quantity)}</Formula></button>
   <span className="wl-source-label"><Formula>{label}</Formula></span>
  </div>
 }
 function slot(name:Slot,label:string){
  const value=slots[name]
  return <button type="button" className={`wl-slot wl-${name[0]}`} data-point-slope-slot={name} data-quantity={value??undefined}
   aria-label={label} disabled={readOnly} onClick={()=>onPlace(chosen?placeQuantity(slots,name,chosen):{...slots,[name]:null})}>
   <Formula>{value?quantityTex(problem,value):slotNames[name]}</Formula>
  </button>
 }
 function check(){
  if(Object.values(slots).some(value=>value===null)){onCheck(false,'Fill all three boxes before checking.');return}
  if(!placementsCorrect(problem,slots)){onCheck(false,'Keep each given sign. Match y₁ with the y-coordinate, m with slope, and x₁ with the x-coordinate.');return}
  onCheck(true,'✓ Point-slope form is correct. Multiply the slope by both terms inside the parentheses.')
 }

 if(checked)return <div className="wl-confirmed">
  <span>✓ Point-slope form</span>
  <Formula display>{pointSlopeLesson(q)}</Formula>
 </div>
 return <section className="lp-point-slope">
  <div className="wl-givens"><div className="wl-sources">
   {source('m','m')}
   <div className="wl-point-pair"><span>(</span>{source('x','x_1')}<span>,</span>{source('y','y_1')}<span>)</span></div>
  </div></div>
  <div className="wl-model"><Formula display>{String.raw`y-\textcolor{#b52439}{y_1}=\textcolor{#245bc7}{m}(x-\textcolor{#187c41}{x_1})`}</Formula></div>
  <p>Drag a quantity into a box, or tap a quantity and then its box. Keep its sign.</p>
  <div className="wl-place">
   <span>y − (</span>{slot('y1','Value of y1')}<span>) =</span>
   {slot('m','Value of slope m')}<span>(x − (</span>{slot('x1','Value of x1')}<span>))</span>
  </div>
  {!readOnly&&<button className="lp-primary lp-check" type="button" onClick={check}>Check point-slope form</button>}
  {ghost&&<div className={`wl-drag-ghost wl-${ghost.quantity}`} style={{left:ghost.x,top:ghost.y}} aria-hidden="true"><Formula>{quantityTex(problem,ghost.quantity)}</Formula></div>}
 </section>
}
