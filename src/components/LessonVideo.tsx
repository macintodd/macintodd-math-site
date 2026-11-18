'use client'
import {useEffect, useRef, useState} from 'react'

export function LessonVideo({video}:{video:{id:string;title:string;author:string}}){
 const [playing,setPlaying]=useState(false)
 const dialog=useRef<HTMLDialogElement>(null)
 const trigger=useRef<HTMLButtonElement>(null)
 useEffect(()=>{
  if(!playing)return
  const node=dialog.current
  const opener=trigger.current
  node?.showModal()
  const previous=document.body.style.overflow
  document.body.style.overflow='hidden'
  return ()=>{node?.close();document.body.style.overflow=previous;opener?.focus()}
 },[playing])
 return <article className="lesson-video-card">
  <button className="lesson-video-open" ref={trigger} onClick={()=>setPlaying(true)} aria-label={`Play ${video.title}`}>
   <span className="lesson-video-art" aria-hidden="true"><svg viewBox="0 0 180 95"><path d="M15 70H165M65 85V10"/><path className="video-curve" d="M25 76Q65 65 90 37T156 18"/></svg><span className="video-play">▶</span></span>
   <span className="lesson-video-copy"><small>VIDEO LESSON</small><strong>{video.title}</strong><span>{video.author}</span></span><span aria-hidden="true">↗</span>
  </button>
  {playing&&<dialog ref={dialog} className="lesson-video-dialog" aria-label={video.title} onCancel={()=>setPlaying(false)} onClick={event=>{if(event.target===event.currentTarget)setPlaying(false)}}><div className="video-dialog-heading"><h2>{video.title}</h2><button onClick={()=>setPlaying(false)} aria-label="Close video">Close ×</button></div><div className="video-dialog-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`} title={`${video.title} — ${video.author}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/></div><a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></dialog>}
 </article>
}
