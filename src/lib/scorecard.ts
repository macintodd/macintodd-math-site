import {skillGoals,skillTitles,type RigidSkill} from './rigid-skills.ts'
import {practiceApps} from '@/content/practice-apps'
export const reportColors={activity:'#174d8c',student:'#653d91',score:'#087366',text:'#111111',muted:'#425466',paper:'#ffffff'}
const skills:Record<string,string>={
 'transformation-scales':'Read a, b, h, and k and describe the transformations in order.',
 'parent-transformations':'Identify stretches, shrinks, reflections, and shifts in equations written with parent functions.',
 slope:'Determine slope from a line graph using signed rise and run.',
 'line-equations':'Write a slope-intercept equation from a slope and y-intercept.',
 'write-linear-equation':'Write a linear equation from a slope and intercept, a graph, or a point and slope.',
 'write-linear-equation-level-1':'Write y = mx + b from a given slope and y-intercept.',
 'write-linear-equation-level-2':'Determine slope and y-intercept from a graph and write y = mx + b.',
 'write-linear-equation-level-3':'Use a point and slope to write a slope-intercept equation.',
 'write-linear-equation-level-4':'Find slope from two points and write their line’s equation.',
 'write-linear-equation-level-5':'Choose a method and write a slope-intercept equation from a graph, slope and intercept, point and slope, or two points.',
 'beta/write-linear-parallel-perpendicular':'Write the equation of a line through a point parallel or perpendicular to a given line.',
 'parallel-perpendicular':'Write the equation of a line through a point parallel or perpendicular to a given line.',
 'intro-point-slope':'Substitute a point and slope, distribute, then isolate y.',
 'point-slope':'Use a point and slope to write the equation of a line.',
 'graph-linear':'Graph a line using its slope and y-intercept.',
 'graph-standard':'Find x- and y-intercepts and graph a standard-form equation.',
 'graph-standard-slope':'Convert standard form to slope-intercept form and graph.',
 'graph-mixed':'Choose a method and graph linear equations in different forms.',
 'function-evaluation':'Substitute an input and evaluate a function using order of operations.',
 'function-families':'Identify a parent-function family from its graph.',
 multiplication:'Multiply selected factors accurately and build fact fluency.',
 'transformation-notation':'Identify shifts and reflections from function notation.',
 transformations:'Connect function parameters to changes in inputs, outputs, and graphs.',
 'mathboard/session-1':'Connect a starting amount and rate of change to an equation and graph.'
}
export function reportInfo(slug:string){const n=Number(slug.match(/^rigid-transformations\/skill-([1-6])$/)?.[1]) as RigidSkill;if(n)return {title:`Rigid Transformations · Skill ${n}: ${skillTitles[n]}`,skill:skillGoals[n]};return {title:practiceApps.find(a=>a.slug===slug)?.title??'Math practice',skill:skills[slug]??'Apply and explain the practiced mathematical skill.'}}
/** Local canvas only: no student details are uploaded. */
export function createReportImage(slug:string,name:string,details:string[],translate:(text:string)=>string=text=>text){
 const {title,skill}=reportInfo(slug),canvas=document.createElement('canvas');canvas.width=1400
 const rows=[{text:translate(title).toUpperCase(),color:reportColors.activity,size:34,bold:true},{text:`${translate('Skill practiced:')} ${translate(skill)}`,color:reportColors.activity,size:27,bold:false},{text:name,color:reportColors.student,size:44,bold:true},...details.map(text=>({text:translate(text),color:/^(FINAL SCORE|Final score|Score|Level 2 score|Mastery score|Final mastery score|TOTAL:|\d+ points\s*\/\s*\d+ possible)/i.test(text)?reportColors.score:reportColors.text,size:/^(FINAL SCORE|Final score|Score|Level 2 score|Mastery score|Final mastery score|TOTAL:|\d+ points\s*\/\s*\d+ possible)/i.test(text)?42:27,bold:/^(FINAL SCORE|Final score|Score|Level 2 score|Mastery score|Final mastery score|TOTAL:|\d+ points\s*\/\s*\d+ possible)/i.test(text)}))]
 const lines=rows.flatMap(row=>(row.text.match(/.{1,78}(?:\s|$)|\S+/g)??['']).map(text=>({...row,text})))
 canvas.height=80+lines.reduce((sum,row)=>sum+row.size*1.6+10,0)
 const ctx=canvas.getContext('2d');if(!ctx)return ''
 ctx.fillStyle=reportColors.paper;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=reportColors.activity;ctx.fillRect(0,0,canvas.width,12)
 let y=65;for(const row of lines){ctx.fillStyle=row.color;ctx.font=`${row.bold?'bold ':''}${row.size}px Arial`;ctx.fillText(row.text,60,y,1280);y+=row.size*1.6+10}
 return canvas.toDataURL('image/png')
}
