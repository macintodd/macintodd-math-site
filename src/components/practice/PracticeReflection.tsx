'use client'
import {useMemo,useState} from 'react'
import {reportInfo} from '@/lib/scorecard'
import './reflection.css'
export const confidenceLabels=['I need help','I need more practice','I can do some steps','I can do it independently','I can explain it']
export const difficultyLabels=['Too easy','A little easy','Just right','A little difficult','Too difficult']
export function usePracticeReflection(slug:string,identity:string,onChange:()=>void,initial?:{confidence:number;difficulty:number}|null){
 const [saved,setSaved]=useState(()=>({identity,confidence:initial?.confidence??0,difficulty:initial?.difficulty??0,confirmed:false}))
 const current=saved.identity===identity?saved:{identity,confidence:0,difficulty:0,confirmed:false}
 const skill=reportInfo(slug).skill.replace(/\.$/,''),question=`How independently can you ${skill.charAt(0).toLowerCase()+skill.slice(1)}?`
 const {confidence,difficulty,confirmed}=current
 const lines=useMemo(()=>['YOUR REFLECTION',`1. ${question}`,`${confidence}/5 - ${confidenceLabels[confidence-1]??'Not answered'}`,'2. How was this widget’s practice for you?',`${difficulty}/5 - ${difficultyLabels[difficulty-1]??'Not answered'}`,'Survey answers do not change the score.'],[question,confidence,difficulty])
 function rate(kind:'confidence'|'difficulty',value:number){if(!Number.isInteger(value)||value<1||value>5)return;setSaved({...current,[kind]:value,confirmed:false});onChange()}
 function confirm(){if(confidence&&difficulty)setSaved({...current,confirmed:true})}
 function edit(){setSaved({...current,confirmed:false});onChange()}
 return {confidence,difficulty,confirmed,question,lines,rate,confirm,edit}
}
export type ReflectionState=ReturnType<typeof usePracticeReflection>
export default function PracticeReflection({state:s}:{state:ReflectionState}){
 function ratings(kind:'confidence'|'difficulty'){const labels=kind==='confidence'?confidenceLabels:difficultyLabels,value=s[kind];return s.confirmed?<p className="practice-reflection-answer">{'★'.repeat(value)}{'☆'.repeat(5-value)}<br/>{value}/5 — {labels[value-1]}</p>:<><div className="practice-reflection-stars" role="group" aria-label={`${kind==='confidence'?'Confidence':'Difficulty'} rating`}>{[1,2,3,4,5].map(n=><button type="button" key={n} aria-label={`${kind==='confidence'?'Confidence':'Difficulty'} ${n} of 5`} aria-pressed={value===n} onClick={()=>s.rate(kind,n)}><span aria-hidden="true">{n<=value?'★':'☆'}</span><small>{n}</small></button>)}</div>{value>0&&<p>{value}/5 — {labels[value-1]}</p>}</>}
 return <section className="practice-reflection" aria-label="Final practice reflection"><h3>{s.confirmed?'Your reflection':'Last step · Your reflection'}</h3><p>{s.confirmed?'Include both answers with your name, date, and score in your screenshot.':'Answer both questions, then prepare your final scorecard. These ratings do not change your score.'}</p><div className="practice-reflection-grid"><div><h4>1. {s.question}</h4>{ratings('confidence')}<p className="practice-reflection-scale">1 = I need help · 5 = I can explain it</p></div><div><h4>2. How was this widget’s practice for you?</h4>{ratings('difficulty')}<p className="practice-reflection-scale">1 = Too easy · 3 = Just right · 5 = Too difficult</p></div></div>{s.confirmed?<button type="button" onClick={s.edit}>Edit reflection answers</button>:<button type="button" disabled={!s.confidence||!s.difficulty} onClick={s.confirm}>Show my final scorecard</button>}</section>
}
