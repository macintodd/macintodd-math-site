import { Math as Formula } from '@/components/Math'
import type {StandardEquation} from '@/lib/standard-form'
import {fraction} from '@/lib/slope'
export default function SlopeWork({problem}:{problem:StandardEquation}){
 const {a,b,c,line}=problem
 const m=fraction(line.rise,line.run),constant=line.y
 const parts=m.split('/'),slopeTex=parts.length===2?`\\frac{${parts[0]}}{${parts[1]}}`:m
 return <section className="intercept-work conversion-work" aria-label="Correct work for slope-intercept form"><h3>Isolate y</h3><p>Subtract {a===1?'':a}x on both sides.</p><div className="conversion-subtract" aria-label="Subtract the x term beneath both sides"><span>{a===1?'':a}x</span><span>{b<0?'−':'+'} {Math.abs(b)===1?'':Math.abs(b)}y</span><span>=</span><span>{c}</span><span className="subtract-operation">−{a===1?'':a}x</span><span/><span/><span className="subtract-operation">−{a===1?'':a}x</span></div><Formula display>{`${b}y = ${-a}x ${c<0?'-':'+'} ${Math.abs(c)}`}</Formula><p>Divide every term by {b}.</p><Formula display>{`\\frac{${b}y}{${b}}=\\frac{${-a}x}{${b}}+\\frac{${c}}{${b}}`}</Formula><Formula display>{`y=${slopeTex}x ${constant<0?'-':'+'} ${Math.abs(constant)}`}</Formula><p>Plot (0, {constant}), then use slope {m} to find a second point.</p></section>
}
