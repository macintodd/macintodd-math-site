import assert from 'node:assert/strict'
import katex from 'katex'
import {generatePointSlope,numberAnswer,finalEquation,pointSlopeTex,revealWindow} from '../src/lib/point-slope.ts'
let count=0
for(let i=0;i<1200;i++){
 let calls=0;const p=generatePointSlope(()=>calls++%2===0?(i%12)/12:((i%9)+.1)/9),{line,window}=p
 assert(window.left>0);assert(p.points.length>=2)
 for(const point of p.points){assert(point.x>0);assert(Number.isInteger(point.x)&&Number.isInteger(point.y));assert(Math.abs(point.y-line.y-point.x*line.rise/line.run)<1e-8);assert(point.y>=window.bottom&&point.y<=window.bottom+window.size);katex.renderToString(pointSlopeTex(line,point),{throwOnError:true});const expanded=-line.rise/line.run*point.x;assert(numberAnswer(String(expanded),expanded));assert(numberAnswer(`${line.rise}/${line.run}`,line.rise/line.run));assert(finalEquation(`${line.rise}/${line.run}x+(${line.y})`,line));count++}
 const revealed=revealWindow(line,p.points.slice(0,2));for(const point of [{x:0,y:line.y},...p.points.slice(0,2)])assert(point.x>=revealed.left&&point.x<=revealed.left+revealed.size&&point.y>=revealed.bottom&&point.y<=revealed.bottom+revealed.size)
}
assert(!numberAnswer('x',1));assert(!finalEquation('2x+1',{x:0,y:2,rise:2,run:1}));assert(!numberAnswer('1/0',0));assert(!numberAnswer('alert(1)',1))
let history=[];for(let i=0;i<30;i++){const p=generatePointSlope(()=>0,history);if(i>=2)assert(!(history[i-1].line.rise/history[i-1].line.run===p.line.rise/p.line.run&&history[i-2].line.rise/history[i-2].line.run===p.line.rise/p.line.run));history.push({line:p.line,correct:true,attempts:1})}
console.log(`Passed 1,200 cropped graphs and ${count} integer points; hidden intercepts, at least two visible points, distribution, equations, reveal bounds, LaTeX and repetition prevention.`)
