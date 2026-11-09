'use client'
import {useEffect,useRef,type ReactNode} from 'react'
import {Math as Formula} from '@/components/Math'
import './skill-goal.css'
export function TwoPointSkillIntro(){return <><p><strong>NEW Skill:</strong> Determine the equation of a line when you only know or can find <strong>two points</strong> on the line.</p><h3>Key steps</h3><ol className="skill-goal-steps"><li>With two known points, calculate the slope—or count rise and run if you have a graph.<Formula display>{String.raw`m=\frac{y_2-y_1}{x_2-x_1}`}</Formula></li><li>Use the point-slope formula to write the equation.<Formula display>{String.raw`y-y_1=m(x-x_1)`}</Formula></li><li>Simplify to slope-intercept form.<Formula display>y=mx+b</Formula></li></ol></>}
export function LinearSkill({level}:{level:number}){
 if(level===4)return <><p><strong>Skill:</strong> Determine the equation of a line in slope-intercept form, when you know or can find <strong>two points</strong> on the line.</p><p className="skill-goal-method">Find the slope, use point-slope form, then simplify to <Formula>y=mx+b</Formula>.</p></>
 return <><p><strong>Skill:</strong> Write the equation of a line in slope-intercept form, <Formula>y=mx+b</Formula>, when you know or can determine the slope, <Formula>m</Formula>, and the y-intercept <Formula>(0,b)</Formula>.</p>{level===2&&<p className="skill-goal-method">Use the graph to determine the intercept and slope, then write the equation.</p>}{level===3&&<p className="skill-goal-method">Use the given point and slope in point-slope form. Distribute, then isolate y.</p>}</>
}
export default function SkillGoal({children,onContinue,readOnly=false}:{children:ReactNode;onContinue:()=>void;readOnly?:boolean}){
 const dialog=useRef<HTMLDialogElement>(null)
 useEffect(()=>{const el=dialog.current;if(el&&!el.open)el.showModal();return()=>el?.close()},[])
 return <dialog className="skill-goal-dialog" ref={dialog} aria-labelledby="skill-goal-heading" onCancel={e=>{e.preventDefault();if(!readOnly)onContinue()}}><div className="skill-goal-accent" aria-hidden="true"/><span className="skill-goal-badge">YOUR TARGET SKILL</span><h2 id="skill-goal-heading">Here’s what you’re learning.</h2><div className="skill-goal-statement">{children}</div><button type="button" className="skill-goal-begin" autoFocus={!readOnly} disabled={readOnly} onClick={onContinue}>Begin →</button></dialog>
}
