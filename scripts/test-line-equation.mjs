import assert from 'node:assert/strict'
import { parseLinearExpression, generateEquationLine, checkEquationAnswer, equationProgress, equationText } from '../src/lib/line-equation.ts'
import { points, isCorrect } from '../src/lib/slope.ts'
const line = { rise: -3, run: 5, x: 0, y: 2 }
for (const text of ['-3/5x+2','(-3/5)x+2','y = 2 - 0.6x','f(x)=-3*x/5+2','(10-3x)/5','2+(-3/5)*x']) {
  const value = parseLinearExpression(text)
  assert(value && Math.abs(value.m + .6) < 1e-9 && value.b === 2, text)
  assert(checkEquationAnswer(line,{interceptX:'0',interceptY:'2',rise:'-6',run:'10',equation:text}).correct, text)
}
for (const text of ['', 'x*x','x/x','1/0','alert(1)','x**2','x+','(x+2','1.2.3x','x=2','Infinity','<script>']) assert.equal(parseLinearExpression(text),null,text)
assert.equal(checkEquationAnswer(line,{interceptX:'2',interceptY:'0',rise:'-3',run:'5',equation:'-3/5x+2'}).correct,false)
assert.equal(checkEquationAnswer(line,{interceptX:'0',interceptY:'2',rise:'-3',run:'0',equation:'-3/5x+2'}).slopeCorrect,false)
for (const [rise,run,y,text] of [[0,1,0,'0'],[1,1,0,'x'],[-1,1,-2,'−x − 2'],[2,3,4,'2/3x + 4']]) assert.equal(equationText({rise,run,x:0,y}),text)
const ok = (attempts=1) => ({line,attempts,correct:true}), miss = () => ({line,attempts:2,correct:false})
let p=equationProgress([ok(),ok(),ok(),miss(),ok(),ok(),ok(),miss(),ok(),ok(),ok(),miss(),ok()])
assert.equal(p.correct,10);assert.equal(p.bestStreak,3);assert.equal(p.score,8);assert(p.canSubmit);assert(!p.completed)
p=equationProgress(Array.from({length:5},()=>ok())); assert.equal(p.score,5);assert(p.canSubmit);assert(!p.completed)
p=equationProgress([...Array.from({length:5},()=>ok()),miss(),...Array.from({length:5},()=>ok(2))]);assert(p.completed);assert.equal(p.score,10);assert.equal(p.bestStreak,5);assert.equal(p.streak,0)
p=equationProgress([ok(),ok(),ok(2)]);assert.equal(p.streak,0);assert.equal(p.bestStreak,2);assert.equal(p.correct,3);assert(!p.canSubmit)
let recent=[]
for(let i=0;i<2000;i++) {
 const next=generateEquationLine(Math.random,recent)
 assert.equal(next.x,0);assert(Number.isInteger(next.y));assert(Math.abs(next.y)<=5);assert(points(next).length>=2)
 assert(points(next).some(point=>point.x===0 && point.y===next.y))
 if(recent.length>=2) assert(!(isCorrect(next,recent.at(-1)) && isCorrect(next,recent.at(-2))), 'Three identical slopes')
 recent.push(next)
 const answer={interceptX:'0',interceptY:String(next.y),rise:String(next.rise),run:String(next.run),equation:equationText(next)}
 assert(checkEquationAnswer(next,answer).correct,JSON.stringify(answer))
}
console.log('Passed: equivalent equations, invalid input, intercept/slope checks, grade/streak/retry rules, 2,000 countable graphs, no three repeated slopes.')
