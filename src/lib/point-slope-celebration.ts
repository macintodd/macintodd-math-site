import type {IntroProblem} from './intro-point-slope.ts'
import {revealWindow,type Point} from './point-slope.ts'
export function celebrationGeometry(problem:IntroProblem){
 const {point,line}=problem,intercept={x:0,y:line.y},window=revealWindow(line,[point]),units:{from:Point;to:Point;kind:'run'|'rise';count:number}[]=[]
 let current={...intercept};const run=Math.abs(point.x),rise=Math.abs(point.y-intercept.y)
 for(let i=1;i<=run;i++){const to={x:current.x+Math.sign(point.x),y:current.y};units.push({from:current,to,kind:'run',count:i});current=to}
 for(let i=1;i<=rise;i++){const to={x:current.x,y:current.y+Math.sign(point.y-intercept.y)};units.push({from:current,to,kind:'rise',count:i});current=to}
 return {point,intercept,window,units,run:point.x,rise:point.y-intercept.y}
}
