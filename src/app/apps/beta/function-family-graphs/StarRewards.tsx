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
    const app = overlay.closest('.ffg-app')
    const sources = Array.from(app?.querySelectorAll(practice ? '.ffg-current-star svg' : '.ffg-speed-count strong') ?? [])
    // Measure before the flash/bounce: each copy starts on its own earned star.
    const origins = sources.map(source => ({source, box: source.getBoundingClientRect()}))
    const count = Math.min(practice ? state.practice.streak : state.speed.count, 8)
    const launching = practice ? origins.slice(-count) : Array.from({length: count}, () => origins[0])
    const firstLaunch = practice ? Math.max(0, origins.length - count) : 0
    origins.forEach(({source}, i) => {
      const newest = i === origins.length - 1
      track(source.animate([
        {transform: newest ? 'scale(.4)' : 'scale(1)', filter: 'brightness(1)'},
        {transform: newest ? 'scale(1.3)' : 'scale(1.12)', filter: 'brightness(1.8) drop-shadow(0 0 5px #efb82d)', offset: .3},
        {transform: 'scale(.96)', filter: 'brightness(1.1)', offset: .75},
        {transform: 'scale(1)', filter: 'brightness(1)'},
      ], {duration: 420, delay: Math.max(0, i - firstLaunch) * 70, easing: 'ease-out'}))
    })
    // Speed rounds can overlap effects; keep a hard ceiling on live copies too.
    while (overlay.querySelectorAll('.ffg-falling-star').length + count > 24) {
      const oldest = overlay.querySelector('.ffg-falling-star')
      if (!oldest) break
      oldest.getAnimations().forEach(animation => animation.cancel())
      oldest.remove()
    }
    const width = window.innerWidth, height = window.innerHeight
    launching.forEach((origin, i) => {
      if (!origin) return
      const {box} = origin
      const star = document.createElement('span')
      star.className = 'ffg-falling-star'
      const size = practice ? box.width : 36
      star.style.width = star.style.height = `${size}px`
      star.append(prototype.cloneNode(true))
      overlay.append(star)
      const x = box.left + (box.width - size) / 2, y = box.top + (box.height - size) / 2
      const endX = count === 1 ? Math.min(width - size - 12, x + 90) : 20 + (width - size - 40) * (i + .5) / count
      const dx = endX - x, spin = i % 2 ? -42 : 48
      track(star.animate([
        {transform: `translate(${x}px, ${y}px) rotate(0deg) scale(1)`, opacity: 1},
        {transform: `translate(${x + dx * .12}px, ${y - 28}px) rotate(-8deg) scale(1.12)`, opacity: 1, offset: .12},
        {transform: `translate(${x + dx * .65}px, ${y + (height - y) * .42}px) rotate(${spin}deg) scale(1)`, opacity: .95, offset: .55},
        {transform: `translate(${endX}px, ${height + 60}px) rotate(${spin * 1.5}deg) scale(.9)`, opacity: 0},
      ], {duration: 2300 + (i % 3) * 180, delay: 126 + i * 70, easing: 'linear'}), () => star.remove())
    })
  }, [state, restoreRevision])

  useEffect(() => {
    const animations = running.current
    return () => {animations.forEach(animation => animation.cancel()); animations.clear()}
  }, [])

  return <div ref={layer} className="ffg-reward-layer" aria-hidden="true"><div className="ffg-reward-source"><PencilStar/></div></div>
}
