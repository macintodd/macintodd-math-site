'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export type BookPage = { id: string; label: string; content: ReactNode }

type Props = {
  label: string
  heading: ReactNode
  breadcrumb: ReactNode
  pages: BookPage[]
  previousHref?: string
  previousLabel?: string
  nextHref?: string
  nextLabel?: string
}

export function BookReader({ label, heading, breadcrumb, pages, previousHref, previousLabel = 'Previous section', nextHref, nextLabel = 'Next section' }: Props) {
  const [active, setActive] = useState(0)
  const stage = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const last = Math.max(0, pages.length - 1)

  useEffect(() => {
    function restorePage() {
      const match = window.location.hash.match(/^#page=(\d+)$/)
      const index = match ? Number(match[1]) - 1 : 0
      setActive(Math.max(0, Math.min(last, index)))
    }
    restorePage()
    window.addEventListener('popstate', restorePage)
    window.addEventListener('hashchange', restorePage)
    return () => {
      window.removeEventListener('popstate', restorePage)
      window.removeEventListener('hashchange', restorePage)
    }
  }, [last])

  const turnPage = useCallback((index: number) => {
    const next = Math.max(0, Math.min(last, index))
    setActive(next)
    window.history.pushState(null, '', `#page=${next + 1}`)
    if (stage.current) {
      stage.current.scrollTop = 0
      stage.current.focus({ preventScroll: true })
    }
  }, [last])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      const target = event.target
      if (target instanceof Element && target.closest('input, textarea, select, button, a, iframe, [contenteditable="true"], [role="slider"]')) return
      if (event.key === 'ArrowRight') {
        if (active < last) { event.preventDefault(); turnPage(active + 1) }
        else if (nextHref) { event.preventDefault(); router.push(nextHref) }
      } else if (event.key === 'ArrowLeft') {
        if (active > 0) { event.preventDefault(); turnPage(active - 1) }
        else if (previousHref) { event.preventDefault(); router.push(previousHref) }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active, last, nextHref, previousHref, router, turnPage])

  const page = pages[active] ?? pages[0]
  return <section className="book-reader" aria-label={label}>
    <nav className="book-breadcrumb" aria-label="Breadcrumb">{breadcrumb}</nav>
    <article className="book-paper">
      <header className="book-heading">{heading}</header>
      <div className="book-stage" ref={stage} tabIndex={-1} aria-label={page.label}>
        <div className="book-page-content" key={page.id}>{page.content}</div>
      </div>
      <nav className="book-controls" aria-label="Page navigation">
        <div className="book-previous">{active > 0
          ? <button type="button" onClick={() => turnPage(active - 1)} aria-label="Previous page">← Previous</button>
          : previousHref ? <Link href={previousHref}>← {previousLabel}</Link>
            : <button type="button" disabled aria-label="Previous page">← Previous</button>}
        </div>
        <div className="book-position"><span aria-live="polite" aria-atomic="true">Page {active + 1} of {pages.length}</span><small>← → keys turn pages</small></div>
        <div className="book-next">{active < last
          ? <button type="button" onClick={() => turnPage(active + 1)} aria-label="Next page">Next →</button>
          : nextHref ? <Link href={nextHref}>{nextLabel} →</Link>
            : <button type="button" disabled aria-label="Next page">Next →</button>}
        </div>
      </nav>
    </article>
  </section>
}
