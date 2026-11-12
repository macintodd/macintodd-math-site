import ScratchPad from '../../graph-linear/ScratchPad'
import type {LessonScratchDisplayState} from '@/lib/parallel-lesson-mirror'

const symbols=['x','y','=']
const digits=['7','8','9','4','5','6','1','2','3','0','.','/','+','-','back','(',')','clear']

export default function LessonTools({enabled,scratch,readOnly,onKey,onToggle,onScratchImage}:{enabled:boolean;scratch:LessonScratchDisplayState;readOnly:boolean;onKey:(key:string)=>void;onToggle:(open:boolean)=>void;onScratchImage?:(image:string)=>void}){
 function keyButton(key:string){
  const label=key==='back'?'Backspace':key==='clear'?'Clear':key
  return <button key={key} type="button" data-key={key} aria-label={label} disabled={!enabled} onPointerDown={event=>event.preventDefault()} onClick={()=>onKey(key)}>{key==='back'?'⌫':key==='-'?'−':label}</button>
 }

 if(readOnly&&!scratch.open)return null
 return <div className="lp-tools">
  {!readOnly&&<div className="wl-tool-toggle">
   <button type="button" aria-pressed={!scratch.open} onClick={()=>onToggle(false)}>Keypad</button>
   <button type="button" aria-pressed={scratch.open} onClick={()=>onToggle(true)}>Scratch paper</button>
  </div>}
  {!readOnly&&<div hidden={scratch.open}>
   <div className="wl-keypad lp-keypad" role="group" aria-label="Keypad">
    <div className="wl-symbols">{symbols.map(keyButton)}</div>
    <div className="wl-digits">{digits.map(keyButton)}</div>
   </div>
  </div>}
  <div hidden={!scratch.open}>
   <ScratchPad height={290} onStrokeEnd={onScratchImage} syncContent={readOnly?scratch.image:undefined}/>
   {!readOnly&&<button className="lp-primary" type="button" onClick={()=>onToggle(false)}>Back to answers &amp; keypad</button>}
  </div>
 </div>
}
