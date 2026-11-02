import {parseLinearExpression,type EquationRecord} from './line-equation.ts'
import {fraction,type Line} from './slope.ts'
export type Point={x:number;y:number}
export type Window={left:number;bottom:number;size:number}
export type PointSlopeProblem={line:Line;window:Window;points:Point[]}
const slopes=[[1,1],[-1,1],[2,1],[-2,1],[3,1],[-3,1],[1,2],[-1,2],[2,3],[-2,3],[3,2],[-3,2]]
export function generatePointSlope(random=Math.random,recent:EquationRecord[]=[]):PointSlopeProblem{
 let index=Math.min(slopes.length-1,Math.floor(random()*slopes.length));const last=recent.slice(-2)
 if(last.length===2&&last.every(r=>r.line.rise/r.line.run===slopes[index][0]/slopes[index][1]))index=(index+1)%slopes.length
 const [rise,run]=slopes[index],line={x:0,y:Math.floor(random()*9)-4,rise,run},center=6*rise/run+line.y,window={left:2,bottom:center-4,size:8},points=[]
 for(let x=2;x<=10;x++){const y=rise/run*x+line.y;if(Math.abs(y-Math.round(y))<1e-8&&y>=window.bottom&&y<=window.bottom+8)points.push({x,y:Math.round(y)})}
 return {line,window,points}
}
export function numberAnswer(text:string,expected:number){const value=parseLinearExpression(text);return !!value&&value.m===0&&Math.abs(value.b-expected)<1e-9}
export function finalEquation(text:string,line:Line){const value=parseLinearExpression(text);return !!value&&Math.abs(value.m-line.rise/line.run)<1e-9&&Math.abs(value.b-line.y)<1e-9}
export function pointSlopeTex(line:Line,p:Point){return `y-(${p.y})=${slopeTex(line)}\\left(x-(${p.x})\\right)`}
export function slopeTex(line:Line){const f=fraction(line.rise,line.run).split('/');return f.length===1?f[0]:`${f[0].startsWith('-')?'-':''}\\frac{${f[0].replace('-','')}}{${f[1]}}`}
export function revealWindow(line:Line,points:Point[]):Window{const ys=[0,line.y,...points.map(p=>p.y)],xs=[0,...points.map(p=>p.x)],bottom=Math.min(...ys)-2,left=Math.min(...xs)-2;return {left,bottom,size:Math.max(12,Math.max(...ys)-bottom+2,Math.max(...xs)-left+2)}}
