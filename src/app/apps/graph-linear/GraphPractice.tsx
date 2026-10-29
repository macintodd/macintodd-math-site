'use client'
import Link from 'next/link'
import { useState } from 'react'
import { generateEquationLine, equationText } from '@/lib/line-equation'
import { correctGraph, graphProgress, slopePoint, type GridPoint } from '@/lib/graph-line'
import { fraction, type Line, type Student } from '@/lib/slope'
import TapGraph from './TapGraph'
export default function GraphPractice(){
  const [student,setStudent]=useState<Student>({firstName:'',lastName:'',hour:''})
  const [line,setLine]=useState<Line|null>(null)
  const [recent,setRecent]=useState<Line[]>([])
  const [selected,setSelected]=useState<GridPoint[]>([])
  const [drawn,setDrawn]=useState(false)
  const [checked,setChecked]=useState<boolean|null>(null)
  const [results,setResults]=useState<boolean[]>([])
  const [message,setMessage]=useState('')
  const [finished,setFinished]=useState<string|null>(null)
  const [image,setImage]=useState<string|null>(null)
  const progress=graphProgress(results),name=`${student.firstName} ${student.lastName}`
  function select(point:GridPoint){
    if(checked!==null)return
    const exists=selected.some(p=>p.x===point.x&&p.y===point.y)
    if(!exists&&selected.length===2){setMessage('Two points are selected. Tap one again to remove it before choosing another.');return}
    setSelected(exists?selected.filter(p=>p.x!==point.x||p.y!==point.y):[...selected,point]);setDrawn(false);setMessage('')
  }
  function check(){
    if(!line||!drawn||checked!==null)return
    const correct=correctGraph(line,selected),next=[...results,correct]
    setResults(next);setChecked(correct)
    if(correct){setMessage('Correct! Your line matches the equation. You earned a gold star.');if(graphProgress(next).completed)setFinished(new Date().toLocaleString())}
    else{const second=slopePoint(line);setMessage(`Not quite. Your streak has reset. The green line is correct. Start at the y-intercept (0, ${line.y}). The slope is ${fraction(line.rise,line.run)}: move ${Math.abs(second.x)} ${second.x<0?'left':'right'} and ${Math.abs(second.y-line.y)} ${second.y<line.y?'down':second.y>line.y?'up':'vertically (a horizontal line has zero rise)'} to (${second.x}, ${second.y}). Compare the slope triangle with your points.`)}
  }
  function next(){if(!line)return;setRecent([...recent,line]);setLine(generateEquationLine(Math.random,[...recent,line]));setSelected([]);setDrawn(false);setChecked(null);setMessage('')}
  function imageResult(){
    const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=850;const ctx=canvas.getContext('2d');if(!ctx)return
    ctx.fillStyle='#fffdf8';ctx.fillRect(0,0,1200,850);ctx.fillStyle='#16334c'
    const rows=['MacIntodd Math · Graph the line',name,`Class hour ${student.hour}`,`Final score: ${progress.score}/10`,`${progress.correct} correct · ${results.length} graphs checked`,`Best streak: ${progress.bestStreak} / 6 · Final streak: ${progress.streak}`,`Streak deduction: ${progress.deduction} point(s)`,finished??'','Upload this image to Google Classroom yourself.']
    rows.forEach((text,i)=>{ctx.font=`${i===1||i===3?'bold ':''}${i===3?60:i===1?42:30}px Arial`;ctx.fillText(text,60,80+i*80,1080)});setImage(canvas.toDataURL('image/png'))
  }
  return <div className={`slope-app graph-practice shell ${checked===true?'graph-celebrate':''}`}>
    <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/apps">Practice apps</Link><span>/</span><span>Graph the line</span></nav>
    <header className="slope-title"><div><p className="eyebrow">EQUATION TO GRAPH</p><h1>Graph the line</h1></div></header>
    {!line?<form className="slope-start" onSubmit={event=>{event.preventDefault();setStudent({...student,firstName:student.firstName.trim(),lastName:student.lastName.trim()});setLine(generateEquationLine())}}>
      <h2>Graph equations in slope-intercept form</h2><p>Tap two grid intersections, then tap Graph line and Check graph. Tap a selected point again to remove it. Each grid square is 1 unit. Taps snap to integer coordinates.</p><p>Earn at least 10 correct and a best streak of 6 for 10/10. Once you have 10 correct, you may submit or keep practicing. Your score is your correct total (up to 10), minus one point for each streak step missing from 6. Ten correct with a best streak of 4 earns 8/10. Your best streak in this session counts even if it ends later.</p>
      <div className="slope-student-fields">{(['firstName','lastName'] as const).map(id=><label key={id}>{id==='firstName'?'First name':'Last name'}<input required maxLength={60} pattern=".*\S.*" autoComplete="off" value={student[id]} onChange={event=>setStudent({...student,[id]:event.target.value})}/></label>)}<label>Class hour<select required value={student.hour} onChange={event=>setStudent({...student,hour:event.target.value})}><option value="">Choose hour</option>{['3','6','7','8'].map(hour=><option key={hour}>{hour}</option>)}</select></label></div>
      <p className="slope-storage">Your name and scores stay on this device in this page. Take screenshots during practice or download your named final results for Google Classroom. Leaving or reloading resets practice.</p><button className="slope-primary">Start practice</button>
    </form>:<>
      <div className="equation-progress"><div className="equation-student"><strong>{name}</strong><span>Class hour {student.hour}</span></div><div className="graph-score" aria-label="Progress"><span>Correct <b>{progress.correct}</b> / 10</span><span>Streak <b>{progress.streak}</b> / 6</span><span>Best streak <b>{progress.bestStreak}</b> / 6</span><span>Score <b>{progress.score}/10</b></span></div><div className="graph-stars" aria-label={`${progress.correct} total gold stars; streak ${progress.streak} of 6`}><span aria-hidden="true">{'★'.repeat(Math.min(30,progress.correct))}{progress.correct>30?` +${progress.correct-30}`:''}</span><span className="graph-streak-stars" aria-hidden="true">Streak: {'★'.repeat(Math.min(6,progress.streak))}{'☆'.repeat(Math.max(0,6-progress.streak))}</span></div></div>
      {finished?<section className="slope-complete"><h2>{progress.completed?'Goal reached!':'Practice results'}</h2><p className="equation-results-name">{name} · Class hour {student.hour}</p><h2>Final score: {progress.score}/10</h2><p>{progress.correct} correct · {results.length} graphs checked · best streak {progress.bestStreak}/6</p><p>Correct total (up to 10): {Math.min(10,progress.correct)}. Streak deduction: {progress.deduction}.</p><p>{finished}</p><p>Take a screenshot with your name, or save the image below. Upload it to Google Classroom yourself.</p><button onClick={imageResult}>Create results image</button>{image&&<div className="slope-result-image"><p><a className="slope-primary" href={image} download="graph-the-line-results.png">Save results image</a></p>
{/* Local result image; no remote request. */}
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src={image} width={1200} height={850} alt={`Graphing results for ${name}, hour ${student.hour}: ${progress.score}/10`}/></div>}<div className="slope-actions"><button onClick={()=>{setStudent({firstName:'',lastName:'',hour:''});setLine(null);setRecent([]);setSelected([]);setDrawn(false);setChecked(null);setResults([]);setMessage('');setFinished(null);setImage(null)}}>Next student / new session</button></div></section>:<>
        <h2 className="graph-equation" aria-label={`Equation to graph: y = ${equationText(line)}`}>y = {equationText(line)}</h2>
        <div className="graphing-layout"><section className="graphing-board" aria-label="Graphing board"><TapGraph key={recent.length} line={line} selected={selected} onSelect={select} drawn={drawn} reveal={checked===false} disabled={checked!==null}/></section><section className="graphing-actions"><h2>Graph {recent.length+1}</h2><p>Tap any grid intersection to plot a point. Tap it again to remove it. Choose two different points on the line.</p><p aria-live="polite">{selected.length?`Selected: ${selected.map(p=>`(${p.x}, ${p.y})`).join(' and ')}`:'No points selected yet.'}</p><div className="graph-control-buttons">{checked===null?<><button className="slope-primary" disabled={selected.length!==2} onClick={()=>{setDrawn(true);setMessage('Your line is drawn. Check it, or tap a point to revise.')}}>Graph line</button><button className="slope-primary" disabled={!drawn} onClick={check}>Check graph</button><button onClick={()=>{setSelected([]);setDrawn(false);setMessage('')}}>Clear points</button></>:<button className="slope-primary" onClick={next}>Next equation →</button>}</div><p className={`slope-feedback ${checked===true?'success':''}`} role="status">{message}</p>{checked===false&&<p className="slope-small">Green: correct line and y-intercept. Orange: slope triangle. Dashed red: your line.</p>}<p className="slope-small">The grid captures touch gestures so plotting does not scroll the page. Scroll outside the grid. Keyboard: focus the grid, use arrow keys, then Enter to select.</p>{progress.canSubmit&&<button onClick={()=>setFinished(new Date().toLocaleString())}>Submit {progress.score}/10 &amp; view results</button>}</section></div>
      </>}{checked===true&&<span className="graph-reward-star" key={results.length} aria-hidden="true">★</span>}
    </>}
  </div>
}
