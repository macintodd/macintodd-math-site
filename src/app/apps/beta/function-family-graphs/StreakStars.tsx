'use client'
import {useWidgetLanguage} from '@/components/practice/BilingualWidget'
import {readStarTrail} from '@/lib/function-family-stars'
import type {GraphFamilyState} from '@/lib/function-family-graphs'

export function PencilStar({count}: {count?: number}) {
  return <svg className={`ffg-pencil-star ${count === undefined ? 'ffg-star-current' : 'ffg-star-completed'}`} viewBox="0 0 60 60" aria-hidden="true" focusable="false">
    <path className="ffg-star-fill" d="M30 4L37 21L55 23L42 36L46 54L30 45L14 55L18 36L4 23L23 21Z"/>
    <path className="ffg-star-pencil" d="M29 5L36 22L54 24L40 36L45 52L30 43L15 54L19 35L6 24L24 22Z"/>
    {count !== undefined && <text x="30" y="37" textAnchor="middle" data-no-translate>{count}</text>}
  </svg>
}

export default function StreakStars({state}: {state: GraphFamilyState}) {
  const {translate: t, displayText} = useWidgetLanguage(), show = displayText ?? t
  const trail = readStarTrail(state), current = state.practice.streak
  return <div className="ffg-star-board" role="group" aria-label={t('Your streaks')}>
    <span className="ffg-star-heading">{show('Your streaks')}</span>
    <p className="ffg-star-summary"><span>{show('Completed streaks')}</span>: <span data-no-translate>{trail.completed.join(', ') || '0'}</span>. <span>{show('Current streak')}</span>: <span data-no-translate>{current}</span>.</p>
    {trail.completed.length || current ? <ol className="ffg-star-trail">
      {trail.completed.map((count, i) => <li key={`finished-${i}`} className="ffg-finished-run" aria-label={`${t('Completed streak')}: ${count}`} data-no-translate><PencilStar count={count}/></li>)}
      {Array.from({length: current}, (_, i) => <li key={`current-${i}`} className="ffg-current-star" aria-label={t('Correct answer')} data-no-translate><PencilStar/></li>)}
    </ol> : <p className="ffg-star-placeholder">{show('Earn your first star')}</p>}
    {trail.earlierCorrect > 0 && <span className="ffg-earlier-correct"><span>{show('Earlier correct answers')}</span>: <b data-no-translate>{trail.earlierCorrect}</b></span>}
  </div>
}
