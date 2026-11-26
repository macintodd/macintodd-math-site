'use client'
import {useEffect, useId, useRef} from 'react'
import {useWidgetLanguage} from '@/components/practice/BilingualWidget'
import {parentLessonInfo} from '@/lib/parent-function-lesson'

export default function ParentInformation({open, onOpenChange, readOnly = false}: {
  open: boolean; onOpenChange: (open: boolean) => void; readOnly?: boolean
}) {
  const dialog = useRef<HTMLDialogElement>(null), title = useId()
  const {translate: t, displayText} = useWidgetLanguage(), show = displayText ?? t
  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (open && !element.open) element.showModal()
    if (!open && element.open) element.close()
  }, [open])
  useEffect(() => {const element = dialog.current; return () => element?.close()}, [])
  return <>
    <button className="ffg-info-button" type="button" aria-label={t('About this widget')} aria-haspopup="dialog" aria-expanded={open} disabled={readOnly} onClick={() => onOpenChange(true)}>
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path d="M16 3C33 3 33 29 16 29C-1 29-1 3 16 3ZM16 4C32 3 32 28 16 28C0 29 1 4 16 4Z"/><text x="16" y="23" textAnchor="middle">i</text></svg>
    </button>
    <dialog ref={dialog} className="ffg-info-dialog" aria-labelledby={title} inert={readOnly ? true : undefined} onCancel={event => {event.preventDefault(); if (!readOnly) onOpenChange(false)}}>
      <header><h2 id={title}>{show('About this widget')}</h2><button type="button" aria-label={t('Close information')} disabled={readOnly} onClick={() => onOpenChange(false)}><span aria-hidden="true">×</span></button></header>
      <ul>{parentLessonInfo.map(item => <li key={item.label}><strong>{show(item.label)}:</strong> {show(item.value)}</li>)}</ul>
    </dialog>
  </>
}
