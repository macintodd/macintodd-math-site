'use client'
import {useEffect,useRef,type ReactNode} from 'react'
import {Math as Formula} from '@/components/Math'
import './skill-goal.css'
export function LinearSkill({level}:{level:number}){
 return <><p><strong>Skill:</strong> Write the equation of a line in slope-intercept form, <Formula>y=mx+b</Formula>, when you know or can determine the slope, <Formula>m</Formula>, and the y-intercept <Formula>(0,b)</Formula>.</p>{level===2&&<p className="skill-goal-method">Use the graph to determine the intercept and slope, then write the equation.</p>}{level===3&&<p className="skill-goal-method">Use the given point and slope in point-slope form. Distribute, then isolate y.</p>}{level===4&&<p className="skill-goal-method">Find slope from two points, use point-slope form, then isolate y.</p>}</>
}
export default function SkillGoal({children,onContinue,readOnly=false}:{children:ReactNode;onContinue:()=>void;readOnly?:boolean}){
 const dialog=useRef<HTMLDialogElement>(null)
 useEffect(()=>{const el=dialog.current;if(el&&!el.open)el.showModal();return()=>el?.close()},[])
 return <dialog className="skill-goal-dialog" ref={dialog} aria-labelledby="skill-goal-heading" onCancel={e=>{e.preventDefault();if(!readOnly)onContinue()}}><div className="skill-goal-accent" aria-hidden="true"/><span className="skill-goal-badge">YOUR TARGET SKILL</span><h2 id="skill-goal-heading">Here’s what you’re learning.</h2><div className="skill-goal-statement">{children}</div><button type="button" className="skill-goal-begin" autoFocus={!readOnly} disabled={readOnly} onClick={onContinue}>Begin →</button></dialog>
}
