'use client'
import type {ReactNode} from 'react'
import {SketchFrame} from '@/components/StudySketch'
import {useWidgetLanguage} from './BilingualWidget'
import './skill-welcome.css'

/** Shared entry presentation. Identity, goals, scoring and native state belong to the caller. */
export default function SkillWelcome({catchphrase, skill, visual, goal, scoreNote, children, subtitle}: {
  catchphrase: string; skill: string; visual: ReactNode; goal: ReactNode
  scoreNote?: ReactNode; children: ReactNode; subtitle?: string
}) {
  const {translate: t, displayText} = useWidgetLanguage(), show = displayText ?? t
  return <section className="skill-welcome">
    <SketchFrame/>
    <div className="skill-welcome-main">
      <h2 className="skill-welcome-catchphrase">{show(catchphrase)}</h2>
      {subtitle && <p className="skill-welcome-subtitle">{show(subtitle)}</p>}
      <div className="skill-welcome-skill"><h3>{show('Skill:')}</h3><p>{show(skill)}</p></div>
      {children}
    </div>
    <aside className="skill-welcome-aside">
      <div className="skill-welcome-visual">{visual}</div>
      <div className="skill-welcome-goal"><h3>{show('Goal:')}</h3>{goal}</div>
    </aside>
    {scoreNote && <p className="skill-welcome-score-note">{scoreNote}</p>}
  </section>
}

export function SkillIdentityFields({value, onChange}: {
  value: {first: string; last: string; hour: string}
  onChange: (field: 'first' | 'last' | 'hour', value: string) => void
}) {
  const {translate: t, displayText} = useWidgetLanguage(), show = displayText ?? t
  return <div className="skill-welcome-fields">{(['first', 'last', 'hour'] as const).map(field =>
    <label key={field}>{show(field === 'first' ? 'First name' : field === 'last' ? 'Last name' : 'Class hour')}
      {field === 'hour' ? <select required name="hour" value={value.hour} onChange={event => onChange(field, event.target.value)}>
        <option value="" disabled>—</option>
        {Array.from({length: 8}, (_, i) => <option key={i + 1} value={String(i + 1)} data-no-translate>{i + 1}</option>)}
        {value.hour && !/^[1-8]$/.test(value.hour) && <option value={value.hour} disabled data-no-translate>{value.hour}</option>}
      </select> : <input required maxLength={40} autoComplete="off" name={field} value={value[field]} onChange={event => onChange(field, event.target.value)}/>}
    </label>
  )}</div>
}
