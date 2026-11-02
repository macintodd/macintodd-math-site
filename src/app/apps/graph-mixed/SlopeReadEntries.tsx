'use client'
import {useLayoutEffect,useRef,useState} from 'react'
import {editAnswer} from '@/lib/mathboard/keypad'
import type {SlopeReadValues} from '@/lib/mixed-graph'
type Field=keyof SlopeReadValues
const fields:Field[]=['x','y','rise','run']
export default function SlopeReadEntries({value,onChange,disabled}:{value:SlopeReadValues;onChange:(value:SlopeReadValues)=>void;disabled:boolean}){
 const [active,setActive]=useState<Field>('x'),inputs=useRef<Partial<Record<Field,HTMLInputElement|null>>>({}),caret=useRef<{field:Field;position:number}|null>(null)
 useLayoutEffect(()=>{const c=caret.current;if(c){inputs.current[c.field]?.focus({preventScroll:true});inputs.current[c.field]?.setSelectionRange(c.position,c.position);caret.current=null}},[value])
 function edit(field:Field,text:string){if(!disabled&&/^-?\d{0,3}$/.test(text))onChange({...value,[field]:text})}
 function key(k:string){if(disabled)return;if(k==='next'){const next=fields[(fields.indexOf(active)+1)%fields.length];setActive(next);inputs.current[next]?.focus({preventScroll:true});return}const input=inputs.current[active],text=value[active],result=editAnswer(text,k,input?.selectionStart??text.length,input?.selectionEnd??text.length);caret.current={field:active,position:result.caret};edit(active,result.value)}
 function field(id:Field,label:string){return <input ref={el=>{inputs.current[id]=el}} aria-label={label} inputMode="none" autoComplete="off" value={value[id]} disabled={disabled} className={active===id?'active':''} onFocus={()=>setActive(id)} onChange={e=>edit(id,e.target.value)}/>}
 return <section className="standard-intercepts slope-read-entries" aria-label="Y-intercept and slope"><label>Y-intercept (ordered pair)<span className="standard-pair">({field('x','Y-intercept x-coordinate')}, {field('y','Y-intercept y-coordinate')})</span></label><div className="slope-equation"><i>m</i><span>=</span><span className="slope-fraction"><span>rise</span><span>run</span></span><span>=</span><span className="slope-fraction slope-input-fraction">{field('rise','Rise (numerator)')}{field('run','Run (denominator)')}</span></div><p className="slope-small">Enter the y-intercept as a point and the slope as signed rise over run.</p>{!disabled&&<div className="slope-keypad slope-read-keypad" aria-label="Intercept and slope number pad">{['7','8','9','back','4','5','6','clear','1','2','3','next','sign','0'].map(k=><button key={k} type="button" aria-label={k==='back'?'Backspace':k==='clear'?'Clear entry':k==='sign'?'Change sign':k==='next'?'Next field':k} onPointerDown={e=>e.preventDefault()} onClick={()=>key(k)}>{k==='back'?'⌫':k==='clear'?'Clear':k==='sign'?'±':k==='next'?'Next':k}</button>)}</div>}</section>
}
