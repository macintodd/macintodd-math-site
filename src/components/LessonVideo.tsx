'use client'
import { useState } from 'react'

export function LessonVideo({ video }: { video: { id: string; title: string; author: string } }) {
  const [playing, setPlaying] = useState(false)
  return <article className="video-card">
    {playing ? <div className="video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`} title={`${video.title} — ${video.author}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /></div> : <div className="video-placeholder"><button type="button" aria-label={`Play ${video.title}`} onClick={() => setPlaying(true)}><span aria-hidden="true">▶</span></button><strong>{video.title}</strong><span>{video.author} · Lesson video</span></div>}
    <div className="video-meta"><p>{video.author}<small>Guest lesson · Shawn Todd’s video will replace this when available.</small></p><a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">Watch on YouTube ↗<span className="sr-only"> (opens in a new tab)</span></a></div>
  </article>
}
