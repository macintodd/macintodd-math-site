import {parseLinearExpression} from './line-equation.ts'
export const worksheetTitle='Unit 1B Lesson 4 · Writing Equations Practice'
export const worksheetSkill='Write equations of lines from slopes, points, and graphs, including horizontal, vertical, and parallel lines.'
export type Point={x:number;y:number}
export type WorksheetProblem={id:number;prompt:string;given?:string;answer:{m:number;b:number}|{x:number};graph?:{m:number;b:number;extent:number};plot?:boolean;hints:string[]}
const slopeHints=['Find the slope and a point on the line. Use y − y₁ = m(x − x₁).','Substitute the point and slope. Keep the subtraction signs in point-slope form.','Distribute the slope, isolate y, and combine the constant terms.']
const twoHints=['Calculate m = (y₂ − y₁)/(x₂ − x₁), using the same point order on top and bottom.',...slopeHints.slice(1)]
const graphHints=['Find the y-intercept where the line crosses the y-axis.','Tap two integer points on the given line. Count signed rise and run from left to right.','Write y = mx + b using the slope and y-intercept.']
export const worksheetProblems:WorksheetProblem[]=[
 {id:1,prompt:'A line with slope 3/5 and y-intercept 4.',given:String.raw`m=\frac35,\quad b=4`,answer:{m:3/5,b:4},hints:['Use y = mx + b.','The slope multiplies x. The y-intercept is the constant added at the end.','Keep the fraction as the coefficient of x, then add 4.']},
 {id:2,prompt:'Write the equation of the line shown in the graph.',answer:{m:3/4,b:-1},graph:{m:3/4,b:-1,extent:5},hints:graphHints},
 {id:3,prompt:'Write the equation of the line shown in the graph.',answer:{m:-1/3,b:0},graph:{m:-1/3,b:0,extent:5},hints:graphHints},
 {id:4,prompt:'The line passing through (2, 1) with slope −3/2.',given:String.raw`(2,1),\quad m=-\frac32`,answer:{m:-3/2,b:4},hints:slopeHints},
 {id:5,prompt:'The line passing through (−3, −2) with slope 4/3.',given:String.raw`(-3,-2),\quad m=\frac43`,answer:{m:4/3,b:2},hints:slopeHints},
 {id:6,prompt:'The line passing through (−5, 5) with slope −2/5.',given:String.raw`(-5,5),\quad m=-\frac25`,answer:{m:-2/5,b:3},hints:slopeHints},
 {id:7,prompt:'The line passing through (−2, 4) and (2, −1).',given:String.raw`(-2,4),\quad(2,-1)`,answer:{m:-5/4,b:3/2},hints:twoHints},
 {id:8,prompt:'The line passing through (0, −5) and (2, 4).',given:String.raw`(0,-5),\quad(2,4)`,answer:{m:9/2,b:-5},hints:twoHints},
 {id:9,prompt:'The line passing through (4, −5) and (2, −4).',given:String.raw`(4,-5),\quad(2,-4)`,answer:{m:-1/2,b:-3},hints:twoHints},
 {id:10,prompt:'The line passing through (−1, 1) and (−3, 5).',given:String.raw`(-1,1),\quad(-3,5)`,answer:{m:-2,b:-1},hints:twoHints},
 {id:11,prompt:'A line passing through (−8, 13) with slope 0.',given:String.raw`(-8,13),\quad m=0`,answer:{m:0,b:13},hints:['A slope of zero means the line is horizontal.','Every point on a horizontal line has the same y-coordinate.','Use y = the y-coordinate of the given point.']},
 {id:12,prompt:'A horizontal line passing through (−5, 18).',given:String.raw`(-5,18)`,answer:{m:0,b:18},hints:['A horizontal line has slope zero.','Its equation is y = a constant.','Use the y-coordinate of the given point as that constant.']},
 {id:13,prompt:'A vertical line passing through the origin.',given:String.raw`(0,0)`,answer:{x:0},hints:['A vertical line has an equation x = a constant. It cannot be written in slope-intercept form.','Every point on this line has the same x-coordinate.','The origin has x-coordinate zero.']},
 {id:14,prompt:'A line through (−8, 12) with the same slope as the given equation.',given:String.raw`(-8,12),\quad y=-\frac12x+15`,answer:{m:-1/2,b:8},hints:['Read the slope from the coefficient of x in the given equation.','Use that slope with the NEW point (−8, 12), not the old y-intercept.','Substitute into point-slope form, distribute, and isolate y.']},
 {id:15,prompt:'A line PARALLEL to the line shown, but with y-intercept 6.',given:String.raw`b=6`,answer:{m:1/2,b:6},graph:{m:1/2,b:3,extent:7},hints:['Parallel lines have the same slope.','Use two integer points on the given graph to calculate its slope.','Use that slope and the NEW y-intercept, 6, in y = mx + b.']},
 {id:16,prompt:'A line PARALLEL to the line in Question 15, passing through (2, −1). Graph it on the same coordinate plane, then find its equation.',given:String.raw`(2,-1)`,answer:{m:1/2,b:-2},graph:{m:1/2,b:3,extent:7},plot:true,hints:['Use the same slope as the given line in Question 15.','Use that slope with (2, −1) in point-slope form, then isolate y.','Plot (2, −1), then use the slope to find another integer point on your line. Draw your line and check the equation.']},
]
export type WorksheetRow={answer:string;hints:number;checks:number;checkedAnswer:string|null;checkedGraph:string|null;lastCheckAt:number|null;points:Point[];drawn:boolean;readPoints:Point[];graphMode:'read'|'plot'}
export type WorksheetProgress={version:1;screen:'problem'|'review'|'report';index:number;rows:WorksheetRow[];completedAt:number|null;scrollY:number;language:'en'|'es';reflection:{confidence:number;difficulty:number;record:boolean}}
export const freshWorksheet=():WorksheetProgress=>({version:1,screen:'problem',index:0,rows:worksheetProblems.map(()=>({answer:'',hints:0,checks:0,checkedAnswer:null,checkedGraph:null,lastCheckAt:null,points:[],drawn:false,readPoints:[],graphMode:'read'})),completedAt:null,scrollY:0,language:'en',reflection:{confidence:0,difficulty:0,record:false}})
export const graphSignature=(r:WorksheetRow)=>JSON.stringify([r.drawn,r.points])
const near=(a:number,b:number)=>Math.abs(a-b)<1e-8
export function worksheetGrade(id:number,r:WorksheetRow){const q=worksheetProblems[id-1],text=r.answer.toLowerCase().replace(/\s/g,'').replace(/−/g,'-').replace(/\+\-/g,'-');if(!q)return {correct:false,message:'Choose a valid problem.'};if('x'in q.answer){const value=/^x=/.test(text)?parseLinearExpression(text.slice(2)):null;return value&&value.m===0&&near(value.b,q.answer.x)?{correct:true,message:'Correct! A vertical line uses x = a constant.'}:{correct:false,message:'This is a vertical line. Use x = the x-coordinate shared by all its points.'}}
 const target=q.answer
 if(!/^y=/.test(text))return {correct:false,message:'Write the complete equation beginning with y =. Question 13 is the vertical-line exception.'}
 const body=text.slice(2).replace(/\(([+\-\d./]+)\)/g,'$1').replace(/\+\-/g,'-').replace(/--/g,'+');if(/\(|\)/.test(body)||(body.match(/x/g)??[]).length>1)return {correct:false,message:'Finish distributing and combining terms. Write the answer in slope-intercept form.'}
 const n='(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:/[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))?',form=new RegExp(`^(?:[+-]?(?:${n}\\*?)?x(?:/[+-]?${n})?(?:[+-]${n})?|[+-]?${n})$`)
 if(!form.test(body))return {correct:false,message:'Write a simplified equation in y = mx + b form. Put the slope before x.'}
 const value=parseLinearExpression('y='+body);if(!value)return {correct:false,message:'Check the fraction and signs. Each denominator must be nonzero.'}
 if(!near(value.m,target.m))return {correct:false,message:'Check the slope first. Then use the given point or y-intercept to recalculate b.'}
 if(!near(value.b,target.b))return {correct:false,message:'Your slope is correct. Check the point and its signs, then recalculate b.'}
 if(q.plot&&(!r.drawn||r.points.length!==2||r.points[0].x===r.points[1].x||r.points.some(p=>!near(p.y,target.m*p.x+target.b))))return {correct:false,message:'Your equation is correct. Return to Problem 16, plot two points on your line, and draw it before checking again.'}
 return {correct:true,message:'Correct! Your equation matches the given information.'}
}
export function worksheetStatus(id:number,r:WorksheetRow):'correct'|'incorrect'|'changed'|'unchecked'{if(r.checkedAnswer===null)return 'unchecked';if(r.checkedAnswer!==r.answer||(worksheetProblems[id-1].plot&&r.checkedGraph!==graphSignature(r)))return 'changed';return worksheetGrade(id,r).correct?'correct':'incorrect'}
export function worksheetCredit(id:number,r:WorksheetRow){return worksheetStatus(id,r)==='correct'?Math.max(.5,Math.round((1-.2*r.hints)*10)/10):0}
export function worksheetTotals(p:WorksheetProgress){return {points:Math.round(p.rows.reduce((n,r,i)=>n+worksheetCredit(i+1,r),0)*10)/10,correct:p.rows.filter((r,i)=>worksheetStatus(i+1,r)==='correct').length,hints:p.rows.reduce((n,r)=>n+r.hints,0),checks:p.rows.reduce((n,r)=>n+r.checks,0)}}
export function worksheetCheck(p:WorksheetProgress,ids:number[],time:number){return {...p,rows:p.rows.map((r,i)=>ids.includes(i)&&r.answer.trim()?{...r,checks:r.checks+1,checkedAnswer:r.answer,checkedGraph:graphSignature(r),lastCheckAt:time}:r),completedAt:null,reflection:{confidence:0,difficulty:0,record:false}}}
export function fractionTex(n:number){for(let d=1;d<=120;d++){const v=Math.round(n*d);if(near(v/d,n))return d===1?String(v):`${v<0?'-':''}\\frac{${Math.abs(v)}}{${d}}`}return String(n)}
export function lineTex(m:number,b:number){return `y=${m===0?'':m===1?'x':m===-1?'-x':fractionTex(m)+'x'}${m===0?fractionTex(b):b===0?'':b<0?'-'+fractionTex(-b):'+'+fractionTex(b)}`}
export function answerPreview(answer:string){const t=answer.trim().replace(/−/g,'-');if(/^x\s*=/i.test(t)){const v=parseLinearExpression(t.replace(/^x\s*=/i,''));return v&&v.m===0?'x='+fractionTex(v.b):null}if(!/^y\s*=/i.test(t)||/\([^)]*x|x.*x/i.test(t))return null;const v=parseLinearExpression(t);return v?lineTex(v.m,v.b):null}
