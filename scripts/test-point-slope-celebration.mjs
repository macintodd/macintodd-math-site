import assert from 'node:assert/strict'
import {generateIntroPointSlope} from '../src/lib/intro-point-slope.ts'
import {celebrationGeometry} from '../src/lib/point-slope-celebration.ts'
for(let i=0;i<600;i++){let count=0;const p=generateIntroPointSlope(()=>((i*13+count++*31)%100)/100,[{line:{x:0,y:-2,rise:2,run:1},attempts:1,correct:true}]),g=celebrationGeometry(p);assert.deepEqual(g.intercept,{x:0,y:p.line.y});assert(g.units.length>0);assert.deepEqual(g.units[0].from,g.intercept);assert.deepEqual(g.units.at(-1).to,p.point);for(let j=0;j<g.units.length;j++){const u=g.units[j];assert.equal(Math.abs(u.to.x-u.from.x)+Math.abs(u.to.y-u.from.y),1);if(j)assert.deepEqual(u.from,g.units[j-1].to)}assert(Math.abs(g.rise/g.run-p.line.rise/p.line.run)<1e-9)}
console.log('Passed 600 celebration paths: signed unit counts connect the intercept to the given point and represent the correct slope.')
