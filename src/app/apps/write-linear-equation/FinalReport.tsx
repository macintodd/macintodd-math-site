'use client'
import {useState} from 'react'
import {mathScore,bonusPoint,type Session} from '@/lib/write-linear'
const confidenceQuestion='If you have the slope and a point on a line, can you find its equation in slope-intercept form?'
const difficultyQuestion='How was the practice?'
const confidenceLabels=['I need help','I need more practice','I can do some steps','I can do it independently','I can explain it']
const difficultyLabels=['Too easy','A little easy','Just right','A little difficult','Too difficult']
export default function FinalReport({session:s,name,hour}:{session:Session;name:string;hour:string}){
 const [confidence,setConfidence]=useState(0),[difficulty,setDifficulty]=useState(0),[ready,setReady]=useState(false),[image,setImage]=useState('')
 const math=mathScore(s),bonus=bonusPoint(s),final=Math.round((math+bonus)*10)/10
 function rating(kind:'Confidence'|'Difficulty',value:number,setValue:(n:number)=>void){return <div className="wl-survey-stars" role="group" aria-label={`${kind} rating`}>{[1,2,3,4,5].map(n=><button key={n} type="button" aria-label={`${kind} ${n} of 5`} aria-pressed={value===n} onClick={()=>setValue(n)}><span aria-hidden="true">{n<=value?'★':'☆'}</span><small>{n}</small></button>)}</div>}
 function download(){
  if(!ready||!confidence||!difficulty)return
  const c=document.createElement('canvas');c.width=1400;c.height=1120;const ctx=c.getContext('2d');if(!ctx)return
  ctx.fillStyle='#fffdf7';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#172b4a';let y=62
  function line(text:string,size=28,bold=false){ctx!.font=`${bold?'bold ':''}${size}px Arial`;let row='';for(const word of text.split(' ')){const test=row?`${row} ${word}`:word;if(ctx!.measureText(test).width>1280&&row){ctx!.fillText(row,60,y);y+=size*1.35;row=word}else row=test}ctx!.fillText(row,60,y);y+=size*1.4}
  line('WRITE THE LINEAR EQUATION',32,true);line(name,42,true);line(`Class hour ${hour}  |  Completed ${s.date}`,27);y+=12
  line(`FINAL SCORE: ${final}/10`,44,true);line(`Math: ${math}/10   |   Bonus: +${bonus}`,29);y+=10
  s.stats.forEach((v,i)=>line(`Level ${i+1}: ${v.correct} correct | ${v.attempts} scored checks | Best streak ${v.best}`,26));y+=14
  line('YOUR REFLECTION',29,true);line(`1. ${confidenceQuestion}`,27);line(`${confidence}/5 - ${confidenceLabels[confidence-1]}`,30,true);line('Scale: 1 = I need help; 5 = I can explain it.',23);y+=12
  line(`2. ${difficultyQuestion}`,27);line(`${difficulty}/5 - ${difficultyLabels[difficulty-1]}`,30,true);line('Scale: 1 = Too easy; 3 = Just right; 5 = Too difficult.',23);y+=12
  line('Submit this named scorecard image in Google Classroom.',25,true)
  const url=c.toDataURL('image/png');setImage(url);const a=document.createElement('a');a.href=url;a.download=`Write-Linear-Equation-${name.trim().replace(/[^a-z0-9-]+/gi,'-')}-Results.png`;a.click()
 }
 return <section className={`wl-final-report ${ready?'wl-report-ready':''}`}>
 <div className="wl-report-intro"><span className="wl-eyebrow">{ready?'READY TO TURN IN':'LAST STEP · YOUR REFLECTION'}</span><h2>{ready?'Your final scorecard':'Congratulations! Finish your reflection.'}</h2><p>{ready?'Take a screenshot of the whole scorecard, including both survey answers. Open Google Classroom, attach the image to this assignment, and turn it in.':'Answer both questions below. Then choose “Show my final scorecard” to prepare the screenshot you will turn in.'}</p></div>
 <div className="wl-scorecard" aria-label="Final scorecard with student details and survey answers"><header><h3>{name}</h3><p>Class hour {hour} · Completed {s.date}</p></header><div className="wl-scorecard-columns"><section className="wl-score-summary" aria-label="Final scores"><div className="wl-final-total"><span>Final score</span><strong>{final}/10</strong></div><p>Math <b>{math}/10</b> · Bonus <b>+{bonus}</b></p>{s.stats.map((v,i)=><p key={i}><b>Level {i+1}</b>: {v.correct} correct<br/><span>{v.attempts} scored checks · Best streak {v.best}</span></p>)}<p className="wl-scorecard-note">Survey answers do not change your score.</p></section><section className="wl-survey" aria-label="Student reflection"><h3>Your reflection</h3><div><h4>1. {confidenceQuestion}</h4>{ready?<p className="wl-survey-answer"><span aria-hidden="true">{'★'.repeat(confidence)}{'☆'.repeat(5-confidence)}</span><br/>{confidence}/5 — {confidenceLabels[confidence-1]}</p>:rating('Confidence',confidence,setConfidence)}<p className="wl-scale">1 = I need help · 5 = I can explain it</p></div><div><h4>2. {difficultyQuestion}</h4>{ready?<p className="wl-survey-answer"><span aria-hidden="true">{'★'.repeat(difficulty)}{'☆'.repeat(5-difficulty)}</span><br/>{difficulty}/5 — {difficultyLabels[difficulty-1]}</p>:rating('Difficulty',difficulty,setDifficulty)}<p className="wl-scale">1 = Too easy · 3 = Just right · 5 = Too difficult</p></div></section></div></div>
 <div className="wl-report-actions">{ready?<><button className="wl-primary" onClick={download}>Download named scorecard</button><button onClick={()=>{setReady(false);setImage('')}}>Edit survey answers</button><p>You can also take your own screenshot. If a download is hard to find on your iPad, use the image below.</p></>:<><button className="wl-primary" disabled={!confidence||!difficulty} onClick={()=>setReady(true)}>Show my final scorecard</button>{(!confidence||!difficulty)&&<p>Choose a rating for both questions first.</p>}</>}</div>
 {image&&<div className="wl-report-image"><p>Touch and hold this image to save it to Photos, then attach it in Google Classroom.</p>
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src={image} alt={`Completed scorecard for ${name}, ${s.date}, final score ${final}/10, confidence ${confidence}/5, practice difficulty ${difficulty}/5`} width={1400} height={1120}/></div>}
 </section>
}
