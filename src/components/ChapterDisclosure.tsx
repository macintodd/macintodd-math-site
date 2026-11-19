'use client'
import {useEffect,useRef,type MouseEvent,type ReactNode} from 'react'

/** Keep native disclosure semantics while animating the sheet's measured height. */
export function ChapterDisclosure({initialOpen=false,summary,children}:{initialOpen?:boolean;summary:ReactNode;children:ReactNode}){
 const details=useRef<HTMLDetailsElement>(null)
 const animation=useRef<Animation|null>(null)
 const intendedOpen=useRef(initialOpen)
 useEffect(()=>()=>animation.current?.cancel(),[])
 function toggle(event:MouseEvent<HTMLElement>){
  event.preventDefault()
  const node=details.current
  if(!node)return
  const next=animation.current?!intendedOpen.current:!node.open
  intendedOpen.current=next
  const from=node.getBoundingClientRect().height
  animation.current?.cancel()
  animation.current=null
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
   node.open=next;node.style.height='';node.style.overflow='';return
  }
  node.open=true
  node.style.height='auto'
  const to=next?node.getBoundingClientRect().height:event.currentTarget.getBoundingClientRect().height
  node.style.overflow='hidden'
  const motion=node.animate([{height:`${from}px`},{height:`${to}px`}],{duration:360,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'})
  animation.current=motion
  motion.onfinish=()=>{
   if(animation.current!==motion)return
   node.open=next;node.style.height='';node.style.overflow=''
   animation.current=null;motion.cancel()
  }
 }
 return <details ref={details} className="toc-unit toc-folding-unit" open={initialOpen}><summary onClick={toggle}>{summary}</summary>{children}</details>
}
