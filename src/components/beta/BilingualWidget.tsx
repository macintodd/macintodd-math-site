'use client'
import {createContext,useContext,useEffect,useMemo,useRef,useState,type ReactNode} from 'react'
import {createPortal} from 'react-dom'
import {hasSpanish,spanishText} from '@/lib/beta-spanish'
import './bilingual.css'
type Language='en'|'es'
const LanguageContext=createContext<{language:Language;setLanguage:(language:Language)=>void}>({language:'en',setLanguage:()=>{}})
export function useBetaLanguage(){const {language,setLanguage}=useContext(LanguageContext);return useMemo(()=>({language,setLanguage,translate:(text:string)=>language==='es'?spanishText(text):text}),[language,setLanguage])}
type Source={english:string;rendered:string}
type Control={id:number;element:Element;parent:Element;top:number;left:number;language:Language;label:string}
const skip='input,textarea,math,.math-inline,.math-display,.katex,[data-no-translate],[data-bilingual-ui],.practice-resume-dialog h3'
const blocks='h1,h2,h3,h4,p,li,legend,label,figcaption,small,output,span,strong,b,[role=status],.wl-message,.slope-feedback,.intro-feedback,.success-callout,.wl-eyebrow,.v2-given-equation,.v2-graph-slope,.rl-status>span,.report-identity>strong'
/** Scoped text-node updates preserve React's nodes, all event handlers, mathematical markup, and user-entered values. */
export default function BilingualWidget({children}:{children:ReactNode}){
 const [language,setLanguage]=useState<Language>('en'),[controls,setControls]=useState<Control[]>([]),root=useRef<HTMLDivElement>(null),sources=useRef(new WeakMap<Text,Source>()),attributes=useRef(new WeakMap<Element,Map<string,Source>>()),overrides=useRef(new WeakMap<Element,Language>()),currentLanguage=useRef<Language>('en'),refresh=useRef<()=>void>(()=>{}),ids=useRef(new WeakMap<Element,number>()),serial=useRef(0)
 useEffect(()=>{
  const element=root.current;if(!element)return;const host:HTMLDivElement=element
  let frame=0,disposed=false
  function excluded(element:Element|null){return !element||!!element.closest(skip)}
  function texts(element:Element){const result:Text[]=[],walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);let node:Node|null;while((node=walker.nextNode()))if(!excluded(node.parentElement))result.push(node as Text);return result}
  function source(node:Text){const value=node.nodeValue??'',old=sources.current.get(node);if(!old||value!==old.rendered&&value!==old.english){const next={english:value,rendered:value};sources.current.set(node,next);return next}return old}
  function english(element:Element){return texts(element).map(n=>source(n).english).join(' ')}
  function selectedLanguage(element:Element){let current:Element|null=element;while(current&&host.contains(current)){const local=overrides.current.get(current);if(local)return local;current=current.parentElement}return currentLanguage.current}
  function context(element:Element){return english(element.closest(blocks)??element)}
  function translatedAttribute(element:Element,key:string){const value=element.getAttribute(key);if(value===null)return;let map=attributes.current.get(element);if(!map){map=new Map();attributes.current.set(element,map)}let item=map.get(key);if(!item||value!==item.rendered&&value!==item.english){item={english:value,rendered:value};map.set(key,item)}const next=selectedLanguage(element)==='es'?spanishText(item.english,context(element)):item.english;if(next!==value)element.setAttribute(key,next);item.rendered=next}
  function apply(){
   frame=0;if(disposed)return
   const all=texts(host),blockContexts=new Map<Element,string>()
   for(const node of all){const el=node.parentElement!;const block=el.closest(blocks)??el;if(!blockContexts.has(block))blockContexts.set(block,english(block))}
   for(const node of all){const el=node.parentElement!,item=source(node),block=el.closest(blocks)??el,locale=selectedLanguage(el),next=locale==='es'?spanishText(item.english,blockContexts.get(block)):item.english;if(node.nodeValue!==next)node.nodeValue=next;item.rendered=next}
   for(const el of host.querySelectorAll('[aria-label],[placeholder]'))if(!excluded(el)||el.matches('input,textarea')){if(el.closest('[data-no-translate],[data-bilingual-ui]'))continue;translatedAttribute(el,'aria-label');translatedAttribute(el,'placeholder')}
   for(const el of host.querySelectorAll(blocks)){
    if(excluded(el)||el.closest('button,a,summary,select,svg'))continue
    const available=texts(el).some(n=>hasSpanish(source(n).english,blockContexts.get(el)??english(el)));if(!available)continue
    el.setAttribute('data-translate-block','true');if(!el.classList.contains('bt-tap-text'))el.classList.add('bt-tap-text');if(!el.matches('label'))el.setAttribute('tabindex','0');el.setAttribute('lang',selectedLanguage(el));el.setAttribute('title',selectedLanguage(el)==='en'?'Tap to read in Spanish · Toca para español':'Toca para leer en inglés · Tap for English')
   }
   const next:Control[]=[],modal=Array.from(host.querySelectorAll('dialog[open],[aria-modal="true"]')).filter(el=>el.getBoundingClientRect().width>0).at(-1)
   for(const el of host.querySelectorAll('button,a,summary,select,svg text')){
    if(modal&&!modal.contains(el)||excluded(el)||el.closest('[hidden],dialog:not([open])')||el.closest('[data-bilingual-ui]'))continue
    const closed=el.closest('details:not([open])');if(closed&&!el.matches('summary')&&!el.closest('summary'))continue
    const original=english(el);if(!texts(el).some(n=>hasSpanish(source(n).english,original)))continue
    const rect=el.getBoundingClientRect();if(!rect.width||!rect.height||rect.bottom<0||rect.top>window.innerHeight||rect.right<0||rect.left>window.innerWidth)continue
    const dialog=el.closest('dialog'),parent=dialog??document.body,box=dialog?.getBoundingClientRect(),top=Math.max(1,rect.top-7),left=Math.max(1,Math.min(window.innerWidth-25,rect.right-8));let id=ids.current.get(el);if(!id){id=++serial.current;ids.current.set(el,id)}
    next.push({id,element:el,parent,top:Math.round(dialog?top-box!.top+dialog.scrollTop:top),left:Math.round(dialog?left-box!.left+dialog.scrollLeft:left),language:selectedLanguage(el),label:original.trim()})
   }
   setControls(old=>old.length===next.length&&old.every((v,i)=>v.id===next[i].id&&v.top===next[i].top&&v.left===next[i].left&&v.language===next[i].language&&v.label===next[i].label&&v.parent===next[i].parent)?old:next)
  }
  function schedule(){if(!frame&&!disposed)frame=requestAnimationFrame(apply)}
  function toggle(element:Element){overrides.current.set(element,selectedLanguage(element)==='en'?'es':'en');schedule()}
  function click(event:MouseEvent){const target=event.target instanceof Element?event.target:null;if(!target||!host.contains(target)||excluded(target)||target.closest('button,a,input,textarea,select,summary,svg,[role=button]'))return;const block=target.closest('[data-translate-block]');if(block){event.preventDefault();event.stopPropagation();toggle(block)}}
  function key(event:KeyboardEvent){if(event.key!=='Enter'&&event.key!==' ')return;const target=event.target instanceof Element?event.target:null;if(!target||!host.contains(target)||target.closest('button,a,input,textarea,select,summary,svg,[role=button]'))return;const block=target.closest('[data-translate-block]');if(block){event.preventDefault();event.stopPropagation();toggle(block)}}
  const observer=new MutationObserver(records=>{if(records.some(r=>!(r.target instanceof Element?r.target:r.target.parentElement)?.closest('[data-bilingual-ui]')))schedule()});observer.observe(host,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden','open','class','style','disabled']})
  const resize=new ResizeObserver(schedule);resize.observe(host);host.addEventListener('click',click,true);host.addEventListener('keydown',key,true);window.addEventListener('scroll',schedule,true);window.addEventListener('resize',schedule);refresh.current=schedule;schedule()
  return()=>{disposed=true;observer.disconnect();resize.disconnect();host.removeEventListener('click',click,true);host.removeEventListener('keydown',key,true);window.removeEventListener('scroll',schedule,true);window.removeEventListener('resize',schedule);if(frame)cancelAnimationFrame(frame);refresh.current=()=>{}}
 },[])
 useEffect(()=>{currentLanguage.current=language;overrides.current=new WeakMap();refresh.current()},[language])
 const value=useMemo(()=>({language,setLanguage}),[language])
 function toggleControl(control:Control){if(!control.element.isConnected)return;overrides.current.set(control.element,control.language==='en'?'es':'en');refresh.current()}
 return <LanguageContext.Provider value={value}><div className="bt-widget" lang={language}><div className="bt-language-bar" data-bilingual-ui><div role="group" aria-label="Widget language / Idioma"><button type="button" lang="en" aria-pressed={language==='en'} onClick={()=>setLanguage('en')}>English</button><button type="button" lang="es" aria-pressed={language==='es'} onClick={()=>setLanguage('es')}>Español</button></div><small>{language==='en'?'Tap text to translate · Use ES beside controls':'Toca el texto para traducir · Usa EN junto a los controles'}</small></div><div ref={root}>{children}</div></div>{controls.map(control=>createPortal(<button key={control.id} type="button" data-bilingual-ui className="bt-control-translate" style={{position:control.parent.tagName==='DIALOG'?'absolute':'fixed',top:control.top,left:control.left}} aria-label={control.language==='en'?`Translate into Spanish: ${control.label}`:`Leer en inglés: ${control.label}`} title={control.language==='en'?'Translate only · Does not activate this control':'Solo traducir · No activa este control'} onPointerDown={e=>{e.preventDefault();e.stopPropagation()}} onClick={e=>{e.preventDefault();e.stopPropagation();toggleControl(control)}}>{control.language==='en'?'ES':'EN'}</button>,control.parent,String(control.id)))}</LanguageContext.Provider>
}
