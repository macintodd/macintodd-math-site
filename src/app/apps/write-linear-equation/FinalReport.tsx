'use client'
import CompletionFlow from '@/components/practice/CompletionFlow'
import {focusedScore,focusedBonus,type FocusedLevel} from '@/lib/linear-focused'
import {mathScore,bonusPoint,type Session} from '@/lib/write-linear'
export default function FinalReport({session:s,name,hour,standaloneLevel}:{session:Session;name:string;hour:string;standaloneLevel?:FocusedLevel}){
 const entries=s.stats.map((v,i)=>({v,level:i+1})).filter(v=>!standaloneLevel||v.level===Math.min(3,standaloneLevel)),math=standaloneLevel?focusedScore(s,standaloneLevel):mathScore(s),bonus=standaloneLevel?focusedBonus(s):bonusPoint(s),final=Math.round((math+bonus)*10)/10
 return <CompletionFlow slug={standaloneLevel?`write-linear-equation-level-${standaloneLevel}`:'write-linear-equation'} name={name} hour={hour} completedAt={s.date} score={`${final}/10`} stats={[{label:'Correct answers',value:entries.reduce((n,{v})=>n+v.correct,0)},{label:'Scored checks',value:entries.reduce((n,{v})=>n+v.attempts,0)},{label:'Best streak',value:Math.max(...entries.map(({v})=>v.best))}]} details={[`Math: ${math}/10 | Bonus: +${bonus}`,...entries.map(({v,level})=>`Level ${standaloneLevel??level}: ${v.correct} correct | ${v.attempts} scored checks | Best streak ${v.best}`)]}/>
}
