'use client'
import {useState} from 'react'
import Link from 'next/link'
import {reportInfo} from '@/lib/scorecard'
import {useWidgetLanguage} from './BilingualWidget'
import {confidenceLabels,difficultyLabels,usePracticeReflection} from './PracticeReflection'
import SkillGoal from './SkillGoal'
import ScoreImageActions from './ScoreImageActions'
import './completion.css'
export type CompletionStat={label:string;value:string|number}
type Props={slug:string;name:string;hour:string;completedAt?:string|number;score:string;stats:CompletionStat[];details?:string[];onReturn?:()=>void}
/** All records are generated on this device. No student information is uploaded. */
export default function CompletionFlow({slug,name,hour,completedAt,score,stats,details=[],onReturn}:Props){
 const {translate:t,displayText,language}=useWidgetLanguage(),show=displayText??t,info=reportInfo(slug)
 const [fallbackStamp]=useState(()=>new Date().toLocaleString()),stamp=completedAt?typeof completedAt==='number'?new Date(completedAt).toLocaleString():/^\d{4}-\d\d-\d\dT/.test(completedAt)?new Date(completedAt).toLocaleString():completedAt:fallbackStamp,identity=`${name}|${hour}|${stamp}`
 const [record,setRecord]=useState<{image:string;language:string;identity:string}|null>(null),[notice,setNotice]=useState(false),[error,setError]=useState('')
 const reflection=usePracticeReflection(slug,identity,()=>setRecord(null))
 const final=record?.language===language&&record.identity===identity?record:null
 function createRecord(){
  if(!reflection.confidence||!reflection.difficulty){setNotice(true);return}
  try{
   const canvas=document.createElement('canvas');canvas.width=1500
   const context=canvas.getContext('2d');if(!context)throw Error('Canvas unavailable');const ctx:CanvasRenderingContext2D=context
   const rows:{text:string;x:number;y:number;size:number;color:string;bold:boolean;width:number}[]=[]
   function block(text:string,x:number,y:number,width:number,size:number,color='#111111',bold=false){ctx.font=`${bold?'bold ':''}${size}px Arial`;let line='';for(const word of text.split(/\s+/)){const next=line?`${line} ${word}`:word;if(line&&ctx.measureText(next).width>width){rows.push({text:line,x,y,size,color,bold,width});y+=size*1.4;line=word}else line=next}rows.push({text:line,x,y,size,color,bold,width});return y+size*1.5}
   let left=block(t(info.title),60,75,870,40,'#174d8c',true)
   left=block(`${t('Skill practiced:')} ${t(info.skill)}`,60,left+18,870,30,'#174d8c')
   let right=block(name,1010,75,430,36,'#653d91',true)
   right=block(`${t('Class hour')} ${hour}`,1010,right,430,24)
   right=block(stamp,1010,right,430,23)
   right=block(`${t('Final score')}: ${score}`,1010,right+12,430,36,'#087366',true)
   for(const stat of stats)right=block(`${t(stat.label)}: ${stat.value}`,1010,right,430,23)
   let y=Math.max(left,right)+50
   y=block(t('Completion Record'),60,y,1380,32,'#174d8c',true)
   y=block(`1. ${t(reflection.question)}`,60,y+24,1380,30,'#111111',true)
   y=block(`${reflection.confidence}/5 — ${t(confidenceLabels[reflection.confidence-1])}`,60,y+4,1380,29)
   y=block(`2. ${t('How was this widget’s practice for you?')}`,60,y+32,1380,30,'#111111',true)
   y=block(`${reflection.difficulty}/5 — ${t(difficultyLabels[reflection.difficulty-1])}`,60,y+4,1380,29)
   for(const detail of details)y=block(t(detail),60,y+20,1380,23)
   canvas.height=Math.ceil(y+65);ctx.fillStyle='#ffffff';ctx.fillRect(0,0,1500,canvas.height);ctx.fillStyle='#174d8c';ctx.fillRect(0,0,1500,12)
   for(const row of rows){ctx.fillStyle=row.color;ctx.font=`${row.bold?'bold ':''}${row.size}px Arial`;ctx.fillText(row.text,row.x,row.y,row.width)}
   setRecord({image:canvas.toDataURL('image/png'),language,identity});setError('')
  }catch{setError(t('The completion image could not be created. Please try again.'))}
 }
 function rating(kind:'confidence'|'difficulty'){
  const value=reflection[kind],labels=kind==='confidence'?confidenceLabels:difficultyLabels
  return <><div className="completion-stars" role="group" aria-label={show(kind==='confidence'?'Confidence rating':'Difficulty rating')}>{[1,2,3,4,5].map(n=><button key={n} type="button" aria-label={`${n}: ${show(labels[n-1])}`} aria-pressed={value===n} onClick={()=>reflection.rate(kind,n)}><span aria-hidden="true">{n<=value?'★':'☆'}</span><small>{n}</small></button>)}</div><p className="completion-rating-label">{value?`${value}/5 — ${show(labels[value-1])}`:show(kind==='confidence'?'1 = I need help · 5 = I can explain it':'1 = Too easy · 3 = Just right · 5 = Too difficult')}</p></>
 }
 return <main className="completion-flow"><Link href="/apps">{show('← Practice apps')}</Link>{final?<section className="completion-record" aria-label={show('Completion Record')}><h1>{show('Completion Record')}</h1><p className="completion-instruction">{show('Save this final record. Open Google Classroom, attach the saved image, and turn it in.')}</p><div className="completion-actions"><ScoreImageActions image={final.image} filename={`${slug.replace(/\//g,'-')}-completion.png`} buttonLabel={show('Press to save image')}/><button type="button" onClick={()=>onReturn?onReturn():window.location.reload()}>{show('Return to practice')}</button></div>
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img className="completion-image" src={final.image} alt={show('Final completion record including student name, date, time, score, and both reflection answers')}/></section>:<><header className="completion-header"><div><h1>{show(info.title)}</h1><p className="completion-skill"><b>{show('Skill practiced:')}</b> {show(info.skill)}</p></div><aside className="completion-summary"><strong data-no-translate>{name}</strong><span>{show('Class hour')} {hour}</span><span data-no-translate>{stamp}</span><b className="completion-score">{show('Final score')}: {score}</b>{stats.map((stat,i)=><span key={i}>{show(stat.label)}: {stat.value}</span>)}</aside></header><section className="completion-reflection"><h2>{show('Last step · Your reflection')}</h2><p>{show('Rate both questions. Then get the single completion record you will turn in.')}</p><div><h3>1. {show(reflection.question)}</h3>{rating('confidence')}</div><div><h3>2. {show('How was this widget’s practice for you?')}</h3>{rating('difficulty')}</div><button className="completion-primary" type="button" onClick={createRecord}>{show('Get Completion Record')}</button>{error&&<p role="alert">{error}</p>}</section></>}{notice&&<SkillGoal headingText={show('Rate your skill and the practice before you can submit.')} eyebrow={show('Last step · Your reflection')} buttonLabel={show('Return to reflection')} onContinue={()=>setNotice(false)}><p>{show('Rate both questions. Then get the single completion record you will turn in.')}</p></SkillGoal>}</main>
}
