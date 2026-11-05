import assert from 'node:assert/strict'
import {defaultTank,tankRate,tankEnd,tankAt,advanceTank,updateTank,tankEquation,graphTimeMax,formatTank} from '../src/lib/tank-flow.ts'
assert.equal(tankRate(defaultTank),-20);assert.equal(tankEnd(defaultTank),25);assert.equal(tankAt(defaultTank,10),300);assert.deepEqual(advanceTank(defaultTank,24,3),{time:25,volume:0,done:true})
const fill={initial:100,capacity:1000,inlet:60,outlet:10};assert.equal(tankEnd(fill),18);assert.deepEqual(advanceTank(fill,17,5),{time:18,volume:1000,done:true})
const balanced={initial:200,capacity:1000,inlet:30,outlet:30};assert.equal(tankEnd(balanced),Infinity);assert.equal(tankAt(balanced,100000),200);assert.equal(advanceTank(balanced,20,1).done,false)
assert.equal(tankEquation({...balanced,inlet:.3,outlet:.2}),'V(t)=200+0.1t');assert.equal(tankEquation(defaultTank),'V(t)=500-20t');assert.equal(tankEquation(balanced),'V(t)=200')
assert.equal(updateTank(defaultTank,'initial','1500').capacity,1500);assert.equal(updateTank(defaultTank,'capacity','100'),null);assert.equal(updateTank(defaultTank,'capacity','0'),null)
for(const invalid of ['','-1','Infinity','1e4','1.234','1000001','abc'])assert.equal(updateTank(defaultTank,'inlet',invalid),null)
assert.equal(formatTank(.000001),'0.000001');assert.equal(tankAt({...defaultTank,initial:0},0),0);assert.equal(advanceTank({...fill,initial:1000},0,1).done,true)
for(let i=1;i<=1000;i++){const s={initial:i%73,capacity:100,inlet:(i%17)/10,outlet:(i%13)/10};const end=tankEnd(s),time=Number.isFinite(end)?end*.7:77;assert(tankAt(s,time)>=0&&tankAt(s,time)<=100);assert(graphTimeMax(s,time)>=time);if(Number.isFinite(end)){const result=advanceTank(s,0,end+1);assert(result.done);assert.equal(result.time,end);assert.equal(result.volume,tankRate(s)>0?100:0)}}
console.log('Passed tank physics, exact boundaries, balanced flow, decimals, setup validation and 1,000 generated cases.')
