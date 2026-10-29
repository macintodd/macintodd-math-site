import { gcd, isCorrect, type Line } from './slope.ts'
import { correctGraph, type GridPoint } from './graph-line.ts'
export type StandardEquation = { a: number; b: number; c: number; xIntercept: number; yIntercept: number; line: Line }
export type InterceptEntries = { xx: string; xy: string; yx: string; yy: string }
export function generateStandardEquation(random = Math.random, recent: Line[] = []): StandardEquation {
  const last=recent[recent.length-1],previous=recent[recent.length-2]
  const blocked=last&&previous&&isCorrect(last,previous)?last:null
  const choices:StandardEquation[]=[]
  for(let x=-8;x<=8;x++) for(let y=-8;y<=8;y++) {
    if(!x||!y)continue
    const c=Math.abs(x*y)/gcd(x,y)*Math.sign(x),a=c/x,b=c/y
    const divisor=gcd(a,b),sign=b<0?-1:1
    const line={rise:-a/divisor*sign,run:Math.abs(b)/divisor,x:0,y}
    if(!blocked||!isCorrect(blocked,line))choices.push({a,b,c,xIntercept:x,yIntercept:y,line})
  }
  return choices[Math.floor(random()*choices.length)]
}
export function standardText(problem: StandardEquation) {
  const {a,b,c}=problem
  return `${a===1?'':a}x ${b<0?'−':'+'} ${Math.abs(b)===1?'':Math.abs(b)}y = ${c<0?'−':''}${Math.abs(c)}`
}
export function checkStandard(problem:StandardEquation,entries:InterceptEntries,selected:GridPoint[]) {
  const whole=(s:string)=>/^-?\d{1,3}$/.test(s)
  const xCorrect=whole(entries.xx)&&whole(entries.xy)&&Number(entries.xx)===problem.xIntercept&&Number(entries.xy)===0
  const yCorrect=whole(entries.yx)&&whole(entries.yy)&&Number(entries.yx)===0&&Number(entries.yy)===problem.yIntercept
  const graphCorrect=correctGraph(problem.line,selected)&&selected.some(p=>p.x===problem.xIntercept&&p.y===0)&&selected.some(p=>p.x===0&&p.y===problem.yIntercept)
  return {xCorrect,yCorrect,graphCorrect,correct:xCorrect&&yCorrect&&graphCorrect}
}
