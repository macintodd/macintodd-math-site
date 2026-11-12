import ScratchPad from '../../graph-linear/ScratchPad'
import type {LessonScratchDisplayState} from '@/lib/parallel-lesson-mirror'

const symbols=['x','y','=']
const digits=['7','8','9','4','5','6','1','2','3','0','.','/','+','-','back','(',')','clear']

export default function LessonTools({enabled,scratch,readOnly,keypadOnly=false,onKey,onToggle,onScratchCommit,onScratchTool}:{enabled:boolean;scratch:LessonScratchDisplayState;readOnly:boolean;keypadOnly?:boolean;onKey:(key:string)=>void;onToggle:(open:boolean)=>void;onScratchCommit?:React.ComponentProps<typeof ScratchPad>['onStrokesCommit'];onScratchTool?:(erase:boolean)=>void}){
 function keyButton(key:string){
  const label=key==='back'?'Backspace':key==='clear'?'Clear':key
  return <button key={key} type="button" data-key={key} aria-label={label} disabled={!enabled} onPointerDown={event=>event.preventDefault()} onClick={()=>onKey(key)}>{key==='back'?'⌫':key==='-'?'−':label}</button>
 }

 if(readOnly&&(keypadOnly||!scratch.open))return null
 return <div className="lp-tools">
  {!readOnly&&!keypadOnly&&<div className="wl-tool-toggle">
   <button type="button" aria-pressed={!scratch.open} onClick={()=>onToggle(false)}>Keypad</button>
   <button type="button" aria-pressed={scratch.open} onClick={()=>onToggle(true)}>Scratch paper</button>
  </div>}
  {!readOnly&&<div hidden={scratch.open&&!keypadOnly}>
   <div className="wl-keypad lp-keypad" role="group" aria-label="Keypad">
    <div className="wl-symbols">{symbols.map(keyButton)}</div>
    <div className="wl-digits">{digits.map(keyButton)}</div>
   </div>
  </div>}
  {!keypadOnly&&<div hidden={!scratch.open}>
   <ScratchPad height={290} initialStrokes={scratch.strokes} initialImage={scratch.image} initialErase={scratch.erase} readOnly={readOnly} onStrokesCommit={onScratchCommit} onToolChange={onScratchTool}/>
   {!readOnly&&<button className="lp-primary" type="button" onClick={()=>onToggle(false)}>Back to answers &amp; keypad</button>}
  </div>}
 </div>
}
