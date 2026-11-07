import assert from 'node:assert/strict'
import {markAnswer,equationTex,distributionText,distributionTex,checkDistributedExpression,missingXParts,newSession,nextStats,done,mathScore,bonusPoint,generateProblem,challenge,checkFinal,saveCode,loadCode} from '../src/lib/write-linear.ts'
let s=newSession();assert.equal(mathScore(s),0)
for(let level=1;level<=3;level++){s.level=level;let stats=s.stats[level-1];for(let i=0;i<(level===3?5:3);i++)stats=nextStats(stats,true,true);s.stats[level-1]=stats;assert(done(level,stats));s.targets.push(level+2)}
assert.equal(mathScore(s),10);s.bonus=[3,4,5];assert.equal(bonusPoint(s),1)
s.bonus=[3,0,5];assert.equal(bonusPoint(s),0)
assert.equal(nextStats(s.stats[0],true,false).streak,0);assert.equal(nextStats(s.stats[0],false,false).streak,0)
assert.equal(checkFinal('y=3/4x+1.25',challenge),'correct');assert.equal(checkFinal('y=.75x+5/4',challenge),'correct');assert.equal(checkFinal('y=.75+1.25',challenge),'missing-x');assert.equal(checkFinal('y=',challenge),'wrong');assert.equal(checkFinal('3/4x+1.25',challenge),'format');assert.equal(checkFinal('y=3/4(x-1)+2',challenge),'format')
for(let i=0;i<1000;i++){for(const level of [1,2,3]){const p=generateProblem(level,false);assert.notEqual(p.line.rise,0);assert(p.line.run>0);assert.equal(p.point.y,p.line.y+p.point.x*p.line.rise/p.line.run);assert.equal(checkFinal(`y=${p.line.rise}/${p.line.run}x+${p.line.y}`,p),'correct')}}
for(const phase of ['work','challenge','spin','bonus','report']){s.phase=phase;s.example=false;const code=saveCode(s,'Mary','Todd','3'),restored=loadCode(code,'Mary','Todd','3');assert.deepEqual(restored.stats,s.stats);assert.deepEqual(restored.targets,s.targets);assert.deepEqual(restored.bonus,s.bonus);assert.equal(restored.phase,phase);assert.throws(()=>loadCode(code,'Jane','Todd','3'));assert.throws(()=>loadCode(code.slice(0,-1)+'!', 'Mary','Todd','3'))}
assert.deepEqual(generateProblem(1,true),generateProblem(1,true));console.log('Passed generators, equation grammar, streaks, weighted scores, bonus, and resume round trips.')

let trail=newSession();trail=markAnswer(trail,false);trail=markAnswer(trail,false);assert.equal(trail.trail[0].count,2);for(let i=0;i<20;i++)trail=markAnswer(trail,true);assert(trail.trail.length<=6);assert.equal(trail.archived.correct+trail.trail.filter(v=>v.gold).reduce((n,v)=>n+v.count,0),20);assert.equal(trail.archived.misses,2);trail.readingWarnings=2;const restored=loadCode(saveCode(trail,'Mary','Todd','3'),'Mary','Todd','3');assert.deepEqual(restored.trail,trail.trail);assert.deepEqual(restored.archived,trail.archived);assert.equal(restored.readingWarnings,2);assert.equal(loadCode('WL1-3YFE-N3DB-9PJQ-GWLU','Demo','Teacher','3').level,2);assert.equal(equationTex(challenge),String.raw`y=\frac{3}{4}x+1.25`);assert.deepEqual(missingXParts('y=1/2+1'),{before:String.raw`y=\frac{1}{2}`,after:'+1'});console.log('Passed grouped/archived star history, saved warning counters, old checkpoint compatibility and formatted equation feedback.')

trail.distributionWarnings=2;assert.equal(loadCode(saveCode(trail,'Mary','Todd','3'),'Mary','Todd','3').distributionWarnings,2);assert.equal(loadCode('WL1-3Z24-5CEB-EXDB-9PML-RC6R','Demo','Teacher','3').distributionWarnings,0);console.log('Passed saved distribution-warning budget and legacy checkpoint compatibility.')

assert.equal(s.stats[2].correct,5);assert.equal(mathScore(s),10);s.stats[2]={correct:20,attempts:25,streak:2,best:4};assert.equal(mathScore(s),8.8);assert(!done(3,s.stats[2]));console.log('Passed five-correct five-streak full credit, partial mastery scoring and no total-only completion.');

const example=generateProblem(3,true);
for(const text of ['2x-6','2x + -6','2*x + (-6)','-6+2x','2x − 6'])assert.equal(checkDistributedExpression(text,example),'correct',text);
for(const text of ['2x+6','3x-6','2x-2','2x+'])assert.equal(checkDistributedExpression(text,example),'wrong',text);
for(const text of ['2(x-3)','y-4=2x-6','2-6','2x+x-6','alert(1)','2x+2*-3'])assert.equal(checkDistributedExpression(text,example),'format',text);
assert.equal(distributionTex(example),'2x-6');
for(let i=0;i<1000;i++){const p=generateProblem(3,false);assert.equal(checkDistributedExpression(distributionText(p),p),'correct');const c=-p.line.rise/p.line.run*p.point.x;assert.equal(checkDistributedExpression(`${p.line.rise}/${p.line.run}x+${c}`,p),'correct')}
assert.equal(checkDistributedExpression('(1/2)x+(-2)',{line:{x:0,y:3,rise:1,run:2},point:{x:4,y:5}}),'correct');
console.log('Passed complete distributed expressions, plus-negative/unicode/fraction notation, actual distribution requirement, malformed/wrong answers and generated-problem regression.');
