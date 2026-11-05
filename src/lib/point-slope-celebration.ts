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
