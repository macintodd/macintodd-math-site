'use client'

import { useId, useRef, useState } from 'react'
import Link from 'next/link'
import type { VocabularyTerm } from '@/content/vocabulary'

export function LessonVocabulary({ terms, course }: { terms: VocabularyTerm[]; course: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const [selected, setSelected] = useState<VocabularyTerm>(terms[0])
  return <aside className="lesson-vocabulary" aria-label="Section vocabulary">
    <h2>Vocabulary</h2>
    <p className="vocabulary-hint">Tap a word for its definition.</p>
    <ul>{terms.map(term => <li key={term.id}><button type="button" aria-haspopup="dialog" onClick={() => { setSelected(term); dialog.current?.showModal() }}>{term.term}</button></li>)}</ul>
    <Link href={`/courses/${course}/vocabulary`}>All class definitions →</Link>
    <dialog ref={dialog} className="vocabulary-dialog" aria-labelledby={titleId} aria-describedby={descriptionId} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }} onKeyDown={event => event.stopPropagation()}>
      <div className="vocabulary-dialog-content">
        <button className="vocabulary-close" type="button" onClick={() => dialog.current?.close()} autoFocus>Close ×</button>
        <h2 id={titleId}>{selected.term}</h2>
        <p id={descriptionId}>{selected.definition}</p>
        <Link href={`/courses/${course}/vocabulary#${selected.id}`}>See in class glossary →</Link>
      </div>
    </dialog>
  </aside>
}
