'use client'
import {useEffect, useRef} from 'react'
import type {GraphFamilyState} from '@/lib/function-family-graphs'
import {PencilStar} from './StreakStars'

/** Ephemeral presentation only: never dispatches or publishes native state. */
export default function StarRewards({state, restoreRevision}: {state: GraphFamilyState; restoreRevision: number}) {
  const layer = useRef<HTMLDivElement>(null)
  const previous = useRef({state, restoreRevision})
  const running = useRef(new Set<Animation>())

  useEffect(() => {
    const before = previous.current
    previous.current = {state, restoreRevision}
    // Saved slides restore the earned stars without replaying old rewards.
    if (before.restoreRevision !== restoreRevision || before.state.seed !== state.seed) return
    const practice = before.state.scene === 'practice' && state.scene === 'practice' &&
      state.practice.correct === before.state.practice.correct + 1 &&
      state.practice.attempts === before.state.practice.attempts + 1
    const speed = before.state.scene === 'speed' && state.scene === 'speed' &&
      state.speed.round === before.state.speed.round && state.speed.count === before.state.speed.count + 1
    const overlay = layer.current
    if ((!practice && !speed) || !overlay || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const prototype = overlay.querySelector('svg')
    if (!prototype || typeof prototype.animate !== 'function') return

    function track(animation: Animation, remove?: () => void) {
      running.current.add(animation)
      animation.finished.catch(() => {}).finally(() => {running.current.delete(animation); remove?.()})
    }
    const target = overlay.closest('.ffg-app')?.querySelector(practice ? '.ffg-current-star:last-child svg' : '.ffg-speed-count strong')
    if (target) track(target.animate([
      {transform: 'scale(.35)', opacity: .25}, {transform: 'scale(1.32)', opacity: 1, offset: .55},
      {transform: 'scale(.92)', offset: .8}, {transform: 'scale(1)', opacity: 1},
    ], {duration: 390, easing: 'ease-out'}))

    const count = Math.min(practice ? state.practice.streak : state.speed.count, 8)
    // Speed rounds can overlap effects; keep a hard ceiling on live copies too.
    while (overlay.querySelectorAll('.ffg-falling-star').length + count > 24) {
      const oldest = overlay.querySelector('.ffg-falling-star')
      if (!oldest) break
      oldest.getAnimations().forEach(animation => animation.cancel())
      oldest.remove()
    }
    const width = window.innerWidth, height = window.innerHeight
    for (let i = 0; i < count; i++) {
      const star = document.createElement('span')
      star.className = 'ffg-falling-star'
      const size = 30 + (i % 3) * 6
      star.style.width = star.style.height = `${size}px`
      star.append(prototype.cloneNode(true))
      overlay.append(star)
      const x = count === 1 ? width * .52 : 24 + (width - 90) * (i + .4) / count
      const drift = (i % 2 ? -1 : 1) * Math.min(35, width * .04)
      const spin = i % 2 ? -42 : 48
      track(star.animate([
        {transform: `translate(${x}px, -55px) rotate(-12deg) scale(.8)`, opacity: 0},
        {transform: `translate(${x + drift * .25}px, ${height * .12}px) rotate(4deg) scale(1)`, opacity: .95, offset: .18},
        {transform: `translate(${x + drift}px, ${height * .8}px) rotate(${spin}deg) scale(.95)`, opacity: .85, offset: .8},
        {transform: `translate(${x}px, ${height + 60}px) rotate(${spin * 1.5}deg) scale(.85)`, opacity: 0},
      ], {duration: 2200 + (i % 3) * 180, delay: i * 100, easing: 'linear', fill: 'both'}), () => star.remove())
    }
  }, [state, restoreRevision])

  useEffect(() => {
    const animations = running.current
    return () => {animations.forEach(animation => animation.cancel()); animations.clear()}
  }, [])

  return <div ref={layer} className="ffg-reward-layer" aria-hidden="true"><div className="ffg-reward-source"><PencilStar/></div></div>
}
