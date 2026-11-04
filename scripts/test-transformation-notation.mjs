import assert from 'node:assert/strict'
import fs from 'node:fs'
import katex from 'katex'
import * as m from '../src/lib/transformation-notation.ts'
let seed=129;const rng=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
const seen=new Set(),pairs=new Set()
for(const level of [1,2,3])for(let i=0;i<1200;i++){
 const q=m.makeQuestion(level,i,rng);assert.equal(q.choices.length,6);assert.equal(new Set(q.choices).size,6);assert(q.choices.includes(q.answer));assert(q.hint.length);katex.renderToString(q.tex,{throwOnError:true,trust:false});const t=q.transform,count=Number(t.rx)+Number(t.ry)+Number(!!t.h)+Number(!!t.k);assert(count>=1&&count<=(level===3?2:1));assert(!(t.ry&&t.h));assert(!q.tex.includes('(-('));if(level===3)pairs.add(count)
 if(level===1){seen.add(q.kind);assert.deepEqual(new Set(q.choices),new Set(m.symbolicChoices));continue}
 assert.equal(q.answer,m.transformLabel(t));if(level===2){const shift=q.choices.filter(s=>s.startsWith('Translated'));assert.equal(shift.length,4);assert.equal(q.choices.filter(s=>s.startsWith('Reflected')).length,2);assert.equal(new Set(shift.map(s=>s.match(/\d+/)[0])).size,1)}
 // Independently apply the named operations to points, then compare to the
 // function value. Reflections must appear before all translations.
 let translationSeen=false
 for(const part of q.answer.split('; then ')){if(/^translated/i.test(part))translationSeen=true;else assert(!translationSeen)}
 for(const u of [-3,-.5,0,2]){let x=u,y=u*u+2*u+3;for(const part of q.answer.split('; then ')){if(part.includes('x-axis'))y=-y;else if(part.includes('y-axis'))x=-x;else{const n=Number(part.match(/\d+/)[0]);if(part.includes('left'))x-=n;if(part.includes('right'))x+=n;if(part.includes('up'))y+=n;if(part.includes('down'))y-=n}}const input=t.ry?-x:x-t.h,expected=(t.rx?-1:1)*(input*input+2*input+3)+t.k;assert(Math.abs(y-expected)<1e-9)}
}
assert.equal(seen.size,6);assert.deepEqual([...pairs].sort(),[1,2])
let s=m.startPractice(rng),types=new Set()
for(let i=0;i<5;i++){s=m.answerQuestion(s,s.question.answer,s.question.id,'today',rng);assert.equal(s.phase,'feedback');s=m.nextQuestion(s,rng)}
const miss=s.question.choices.find(a=>a!==s.question.answer);s=m.answerQuestion(s,miss,s.question.id,'today',rng);assert.equal(s.stats[0].correct,0);assert.equal(s.stats[0].streak,0);assert.equal(s.stats[0].earned,5);assert.equal(s.stats[0].resets,1);assert.equal(s.deck.length,6);const same=m.answerQuestion(s,s.question.answer,s.question.id,'today',rng);assert.equal(same,s)
s=m.nextQuestion(s,rng)
for(let i=0;i<6;i++){types.add(s.question.kind);assert.equal(m.answerQuestion(s,'invalid',s.question.id,'today',rng),s);s=m.answerQuestion(s,s.question.answer,s.question.id,'done one',rng);if(i<5)s=m.nextQuestion(s,rng)}
assert.equal(types.size,6);assert.equal(s.phase,'celebrate');assert.equal(m.nextLevel(s,rng),s);s=m.nextLevel(m.dismissCelebration(s),rng);assert.equal(s.level,2)
for(const level of [2,3]){for(let i=0;i<10;i++){const id=s.question.id;s=m.answerQuestion(s,s.question.answer,id,'done '+level,rng);assert.equal(m.answerQuestion(s,s.question.answer,id,'bad',rng),s);if(i<9)s=m.nextQuestion(s,rng)}assert.equal(s.phase,'celebrate');assert.equal(s.stats[level-1].correct,10);s=m.nextLevel(m.dismissCelebration(s),rng)}
assert.equal(s.phase,'finished');assert(m.reportLines('Demo Student','8','started',s,'now').join(' ').includes('10/10'));assert(m.reportLines('Demo Student','8','started',s,'now').includes('Demo Student'))
// A large total without the qualifying streak cannot complete either level.
for(const level of [2,3]){let a={...m.startPractice(rng),level,question:m.makeQuestion(level,1,rng)};for(let i=0;i<16;i++){a=m.answerQuestion(a,i%4===3?a.question.choices.find(c=>c!==a.question.answer):a.question.answer,a.question.id,'now',rng);assert.equal(a.phase,'feedback');a=m.nextQuestion(a,rng)}assert.equal(a.stats[level-1].correct,12);assert.equal(a.stats[level-1].best,3);for(let i=0;i<5;i++){a=m.answerQuestion(a,a.question.answer,a.question.id,'now',rng);if(i<4)a=m.nextQuestion(a,rng)}assert.equal(a.phase,'celebrate')}
const source=fs.readFileSync('src/app/apps/transformation-notation/TransformationNotation.tsx','utf8');assert(!/localStorage|sessionStorage|\bfetch\(|sendBeacon|XMLHttpRequest/.test(source))
console.log('Passed 3,600 generated questions: strict LaTeX, six unique choices, geometric answer verification, operation ordering, excluded y-reflection/horizontal shifts, six-type perfect runs, reset/accuracy rules, duplicate submissions, streak qualification and named reports.')
