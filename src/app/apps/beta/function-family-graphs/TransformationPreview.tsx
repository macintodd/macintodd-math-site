'use client'
import {useId} from 'react'
import {useWidgetLanguage} from '@/components/practice/BilingualWidget'

export default function TransformationPreview() {
  const id = useId().replace(/:/g, ''), {translate: t, displayText} = useWidgetLanguage(), show = displayText ?? t
  const path = (child: boolean) => Array.from({length: 241}, (_, i) => {
    const x = -6 + i / 20, y = child ? -.5 * (x + 1) ** 2 + 3 : x * x
    return `${i ? 'L' : 'M'}${180 + x * 27},${170 - y * 27}`
  }).join(' ')
  return <figure className="ffg-transformation-preview">
    <svg viewBox="0 0 360 235" role="img" aria-labelledby={`${id}-title ${id}-description`}>
      <title id={`${id}-title`}>{t('A parent function and its transformation')}</title>
      <desc id={`${id}-description`}>{t('The dashed blue parent is y = x squared. The solid red child is reflected, vertically shrunk, shifted one unit left and three units up.')}</desc>
      <defs><clipPath id={`${id}-preview-clip`}><rect x="14" y="10" width="332" height="208"/></clipPath></defs>
      <path d="M22 170H341M180 15V218" fill="none" stroke="#9aaabc" strokeWidth="1.5"/>
      <path d="M333 165L341 170L333 175M175 23L180 15L185 23" fill="none" stroke="#9aaabc" strokeWidth="1.5"/>
      <g clipPath={`url(#${id}-preview-clip)`} fill="none" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={path(false)} stroke="#0f3460" strokeDasharray="7 7"/>
        <path d={path(true)} stroke="#b64f45"/>
      </g>
      <circle cx="180" cy="170" r="4.5" fill="#0f3460"/><circle cx="153" cy="89" r="4.5" fill="#b64f45"/>
    </svg>
    <figcaption><span className="ffg-preview-parent">{show('Parent')}</span><span className="ffg-preview-child">{show('Transformed')}</span></figcaption>
  </figure>
}
