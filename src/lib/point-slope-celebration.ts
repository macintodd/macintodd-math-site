import type {IntroProblem} from './intro-point-slope.ts'
import {revealWindow,type Point} from './point-slope.ts'
export function celebrationGeometry(problem:IntroProblem){
 const {point,line}=problem,intercept={x:0,y:line.y},window=revealWindow(line,[point])
 let a=Math.abs(line.rise),b=Math.abs(line.run);while(b){const remainder=a%b;a=b;b=remainder}
 const divisor=a||1,simpleRun=Math.abs(line.run)/divisor,simpleRise=line.rise*Math.sign(line.run)/divisor,direction=Math.sign(point.x),run=direction*simpleRun,rise=direction*simpleRise,repetitions=Math.round(Math.abs(point.x)/simpleRun)
 const units:{from:Point;to:Point;kind:'run'|'rise';count:number;cycle:number}[]=[],cycles:{from:Point;to:Point;endIndex:number}[]=[]
 let current={...intercept}
 for(let cycle=1;cycle<=repetitions;cycle++){
  const from={...current}
  for(let count=1;count<=Math.abs(run);count++){const to={x:current.x+Math.sign(run),y:current.y};units.push({from:current,to,kind:'run',count,cycle});current=to}
  for(let count=1;count<=Math.abs(rise);count++){const to={x:current.x,y:current.y+Math.sign(rise)};units.push({from:current,to,kind:'rise',count,cycle});current=to}
  cycles.push({from,to:{...current},endIndex:units.length})
 }
 return {point,intercept,window,units,cycles,run,rise,simpleRun,simpleRise,repetitions}
}

// Clip the ski route to the visible graph, then travel from high y to low y.
export function skierRoute(problem:IntroProblem){
 const {window:w}=celebrationGeometry(problem),m=problem.line.rise/problem.line.run,b=problem.line.y
 const points=[{x:w.left,y:m*w.left+b},{x:w.left+w.size,y:m*(w.left+w.size)+b},{x:(w.bottom-b)/m,y:w.bottom},{x:(w.bottom+w.size-b)/m,y:w.bottom+w.size}].filter(p=>Number.isFinite(p.x)&&p.x>=w.left-1e-8&&p.x<=w.left+w.size+1e-8&&p.y>=w.bottom-1e-8&&p.y<=w.bottom+w.size+1e-8).sort((a,b)=>b.y-a.y)
 const high=points[0],low=points.at(-1)!,landing={x:high.x+(low.x-high.x)*.22,y:high.y+(low.y-high.y)*.22},exit={x:low.x+(low.x-high.x)*.3,y:low.y+(low.y-high.y)*.3}
 return {landing,exit,angle:Math.atan(-m)*180/Math.PI,facing:m>0?-1:1}
}
