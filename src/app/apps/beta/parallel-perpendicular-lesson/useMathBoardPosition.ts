import {useEffect,useRef,useState} from 'react'

/** Scroll is checkpointed once it settles, so scrolling does not flood the bridge. */
export function useMathBoardPosition(enabled:boolean,restoreRevision:number){
 const [scrollY,setScrollY]=useState(0),applied=useRef(0)
 useEffect(()=>{
  if(!enabled)return
  let timer:ReturnType<typeof setTimeout>|undefined
  function scrolled(){
   clearTimeout(timer)
   timer=setTimeout(()=>setScrollY(Math.round(window.scrollY)),120)
  }
  window.addEventListener?.('scroll',scrolled,{passive:true})
  return ()=>{window.removeEventListener?.('scroll',scrolled);clearTimeout(timer)}
 },[enabled])
 useEffect(()=>{
  if(applied.current===restoreRevision)return
  applied.current=restoreRevision
  window.scrollTo?.(0,scrollY)
 },[restoreRevision,scrollY])
 return [scrollY,setScrollY] as const
}
