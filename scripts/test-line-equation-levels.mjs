import assert from 'node:assert/strict'
import {checkTappedIntercept,checkGuidedSlope,levelProgress} from '../src/lib/line-equation-levels.ts'
const line={x:0,y:2,rise:3,run:2},answer={interceptX:'0',interceptY:'2',rise:'6',run:'4',equation:'3/2x+2'}
assert(checkTappedIntercept(line,{x:0,y:2}));assert(!checkTappedIntercept(line,{x:2,y:5}));assert(!checkTappedIntercept(line,null))
assert(checkGuidedSlope(line,answer,{x:2,y:5}));assert(!checkGuidedSlope(line,answer,{x:0,y:2}));assert(!checkGuidedSlope(line,answer,{x:2,y:6}));assert(!checkGuidedSlope(line,answer,null))
const good={line,level:1,attempts:1,correct:true,checks:3},retry={...good,attempts:2,checks:4}
assert(!levelProgress(Array(4).fill(good)).unlocked);assert(levelProgress(Array(5).fill(good)).unlocked)
const broken=levelProgress([...Array(4).fill(good),retry,good]);assert(!broken.unlocked);assert.equal(broken.guided.streak,1);assert.equal(broken.totalStars,6)
const qualified=levelProgress(Array(5).fill(good));assert.equal(qualified.independent.correct,0);assert.equal(qualified.checks,15)
const completed=levelProgress([...Array(5).fill(good),...Array(10).fill({...good,level:2,checks:1})]);assert(completed.independent.completed);assert.equal(completed.independent.score,10)
console.log('Passed guided stage validation, distinct points, equivalent slopes, consecutive-problem qualification and separate Level 2 scoring.')
