'use client'
import {useId} from 'react'
import {Math as Formula} from '@/components/Math'
import {useWidgetLanguage} from '@/components/practice/BilingualWidget'
import {familyGraphPath, familyHints, parentEquations, type FamilyQuestion} from '@/lib/function-family-graphs'

export default function FamilyGraph({question, reveal = false}: {question: FamilyQuestion; reveal?: boolean}) {
  const id = useId().replace(/:/g, ''), {translate: t, displayText} = useWidgetLanguage(), show = displayText ?? t
  return <figure className={`ffg-graph ${reveal ? 'ffg-graph-correct' : ''}`}>
    <div className="ffg-graph-frame">
      <svg viewBox="0 0 480 480" role="img" aria-labelledby={`${id}-title ${id}-description`}>
        <title id={`${id}-title`}>{t('Graph to identify')}</title>
        <desc id={`${id}-description`}>{t(familyHints[question.family])} {t('The horizontal axis is x and the vertical axis is y. Each grid square is one unit.')}</desc>
        <defs><clipPath id={`${id}-clip`}><rect x="36" y="36" width="408" height="408"/></clipPath></defs>
        <rect x="36" y="36" width="408" height="408" rx="2" fill="#fff" stroke="#d9e3ec"/>
        {Array.from({length: 13}, (_, i) => i - 6).map(n => <g key={n} aria-hidden="true">
          <path d={`M${240 + n * 34} 36V444M36 ${240 - n * 34}H444`} stroke={n === 0 ? '#526982' : '#dfe7ee'} strokeWidth={n === 0 ? 1.7 : .8}/>
          {n !== 0 && n % 2 === 0 && <><text x={240 + n * 34} y="259" textAnchor="middle" className="ffg-axis-number">{n}</text><text x="228" y={245 - n * 34} textAnchor="end" className="ffg-axis-number">{n}</text></>}
        </g>)}
        <g fill="#526982" aria-hidden="true"><path d="M451 240l-10-5v10zM240 29l-5 10h10z"/><text x="456" y="260" className="ffg-axis-label">x</text><text x="251" y="28" className="ffg-axis-label">y</text><text x="226" y="259" className="ffg-axis-number">0</text></g>
        <path className="ffg-function" d={familyGraphPath(question)} clipPath={`url(#${id}-clip)`} fill="none" stroke="#235eb3" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {reveal && <div className="ffg-equation-reveal" aria-label={t('Equation and parent function')}>
        <Formula>{question.equation}</Formula>
        <div><span>{show('Parent:')}</span> <Formula>{parentEquations[question.family]}</Formula></div>
      </div>}
    </div>
    <figcaption>{show('Each grid square is 1 unit.')}</figcaption>
  </figure>
}
