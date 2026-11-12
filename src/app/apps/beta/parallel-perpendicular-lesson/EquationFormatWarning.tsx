'use client'
import {Math as Formula} from '@/components/Math'
import SkillGoal from '@/components/practice/SkillGoal'
export default function EquationFormatWarning({missing,onClose}:{missing:{prefix:boolean;x:boolean};onClose:()=>void}){
 return <SkillGoal headingText="Include the whole equation." eyebrow="CHECK YOUR NOTATION" buttonLabel="Let me fix it →" onContinue={onClose}><p>Write your complete answer in slope-intercept form. Fix the highlighted part and check again.</p><div className="lp-format-model" aria-label="Slope-intercept form with missing parts highlighted"><span className={missing.prefix?'lp-format-missing':undefined}><Formula>y=</Formula></span><Formula>m</Formula><span className={missing.x?'lp-format-missing':undefined}><Formula>x</Formula></span><Formula>+b</Formula></div>{missing.prefix&&<p>Include y = at the beginning of the equation.</p>}{missing.x&&<p>Include x next to the slope.</p>}<p>This notation warning does not count as an incorrect equation.</p></SkillGoal>
}
