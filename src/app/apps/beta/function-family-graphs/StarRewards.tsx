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
      // Random launch velocity, then constant gravity: no steered waypoints.
      const scale = Math.max(.75, Math.min(1.1, width / 1024))
      const speed = (330 + Math.random() * 190) * scale
      const angle = (32 + Math.random() * 33) * Math.PI / 180
      const vx = Math.cos(angle) * speed, vy = -Math.sin(angle) * speed, gravity = 700 * scale
      const bottom = (-vy + Math.sqrt(vy * vy + 2 * gravity * (height + size - y))) / gravity
      const right = (width + size - x) / vx
      const flight = Math.max(.1, Math.min(bottom, right))
      const spin = (Math.random() * 2 - 1) * 130
      // Closely spaced samples keep a true parabola smooth in WKWebView/Chrome.
      const samples = Math.ceil(flight * 40)
      const frames = Array.from({length: samples + 1}, (_, step) => {
        const offset = step / samples, time = flight * offset
        const px = x + vx * time, py = y + vy * time + .5 * gravity * time * time
        return {offset, transform: `translate(${px}px, ${py}px) rotate(${spin * time}deg) scale(1)`, opacity: 1}
      })
      track(star.animate(frames, {duration: flight * 1000, delay: 126 + i * 70, easing: 'linear'}), () => star.remove())
    })
  }, [state, restoreRevision])

  useEffect(() => {
    const animations = running.current
    return () => {animations.forEach(animation => animation.cancel()); animations.clear()}
  }, [])

  return <div ref={layer} className="ffg-reward-layer" aria-hidden="true"><div className="ffg-reward-source"><PencilStar/></div></div>
}
