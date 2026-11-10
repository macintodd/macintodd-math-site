'use client'
import {useEffect,useState} from 'react'
import {useBetaLanguage} from '@/components/beta/BilingualWidget'
import {spanishText} from '@/lib/beta-spanish'
function Typed({text}:{text:string}){
 const [count,setCount]=useState(0)
 useEffect(()=>{const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduced)return;const timer=setInterval(()=>setCount(n=>{const next=Math.min(text.length,n+4);if(next===text.length)clearInterval(timer);return next}),28);return()=>clearInterval(timer)},[text])
 return <><span className="v2-feedback-accessible">{text}</span><span className="v2-feedback-static" aria-hidden="true">{text}</span><span className="v2-feedback-typed" aria-hidden="true">{text.slice(0,count)}{count<text.length&&<span className="v2-type-caret">▎</span>}</span></>
}
/** Full text reserves its space; the typed overlay never changes the panel's height. */
export default function Notice({text,good=false,animate=false}:{text:string;good?:boolean;animate?:boolean}){
 const {language}=useBetaLanguage(),[override,setOverride]=useState<'en'|'es'|null>(null),locale=override??language,translated=locale==='es'?spanishText(text):text
 return <div className={`v2-notice ${good?'good':'help'}`} data-no-translate><div role="status" aria-live="polite" className={animate&&text?'v2-type-feedback':''}>{animate&&text?<Typed key={translated} text={translated}/>:translated||'\u00a0'}</div>{text&&<button type="button" className="v2-notice-language" aria-label="Translate feedback" onClick={()=>setOverride(locale==='en'?'es':'en')}>{locale==='en'?'ES':'EN'}</button>}</div>
}
