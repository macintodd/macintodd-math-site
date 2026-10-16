'use client'

import { useState } from 'react'
import type { Example } from '@/content/lessons'
import { Math } from './Math'
import { CoordinatePlane } from './CoordinatePlane'

export function WorkedExample({ example }: { example: Example }) {
  const [visible, setVisible] = useState(1)
  const total = example.steps.length
  return <article className="example" id={`example-${example.id}`} aria-labelledby={`title-${example.id}`}>
    <header className="example-title"><p className="small-label">{example.category}</p><h3 id={`title-${example.id}`}>{example.title}</h3></header>
    <p className="example-prompt">{example.prompt}</p>
    {example.points && <div className="example-graph"><CoordinatePlane points={example.points} stage={visible - 1} triangle={example.triangle} /></div>}
    <div className="example-steps" aria-live="polite" aria-relevant="additions removals">
      {example.steps.slice(0, visible).map((step, i) => <div className="example-step" key={i}><span className="step-number" aria-hidden="true">{i + 1}</span><div><Math display>{step.math}</Math><p>{step.explanation}</p></div></div>)}
    </div>
    <div className="example-controls"><span>Step {visible} of {total}{visible === total ? ' · Complete' : ''}</span><div className="example-buttons"><button type="button" aria-label={`Restart ${example.title}`} disabled={visible === 1} onClick={() => setVisible(1)}>Restart</button><button type="button" aria-label={`Previous step: ${example.title}`} disabled={visible === 1} onClick={() => setVisible(v => v - 1)}>Back</button><button className="next-step" type="button" aria-label={`Next step: ${example.title}`} disabled={visible === total} onClick={() => setVisible(v => v + 1)}>{visible === total ? 'All steps shown' : 'Next step →'}</button></div></div>
    <details className="static-solution"><summary>Read the complete solution</summary><ol>{example.steps.map((step, i) => <li key={i}><Math display>{step.math}</Math><p>{step.explanation}</p></li>)}</ol></details>
  </article>
}
