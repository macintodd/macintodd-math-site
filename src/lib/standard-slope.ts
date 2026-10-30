import type { StandardEquation } from './standard-form.ts'
import { correctGraph, type GridPoint } from './graph-line.ts'
export type SlopeEntries={m:string;b:string}
export function coefficient(text:string):number|null{
 const parts=text.trim().match(/^(-?(?:\d+(?:\.\d*)?|\.\d+))(?:\/(-?(?:\d+(?:\.\d*)?|\.\d+)))?$/)
 if(!parts)return null
 const numerator=Number(parts[1]),denominator=parts[2]===undefined?1:Number(parts[2]),value=numerator/denominator
 return denominator!==0&&Number.isFinite(value)?value:null
}
export function checkStandardSlope(problem:StandardEquation,entries:SlopeEntries,points:GridPoint[]){
 const m=coefficient(entries.m),b=coefficient(entries.b)
 const mCorrect=m!==null&&Math.abs(m+problem.a/problem.b)<1e-9,bCorrect=b!==null&&Math.abs(b-problem.c/problem.b)<1e-9
 const graphCorrect=correctGraph(problem.line,points)
 return {mCorrect,bCorrect,graphCorrect,correct:mCorrect&&bCorrect&&graphCorrect}
}
