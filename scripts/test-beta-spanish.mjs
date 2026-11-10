import assert from 'node:assert/strict'
import {spanishText} from '../src/lib/beta-spanish.ts'
import {mockScorecard} from './scorecard-test-runtime.mjs'
for(const [en,es] of [['Play','Reproducir'],['A and D','A y D'],['First name','Nombre'],['Do your lines look parallel?','¿Tus rectas parecen paralelas?']])assert.equal(spanishText(en),es)
for(const value of ['Rosa Alvarez','y = 2/3x - 4','(5, 7)','RLP-12345'])assert.equal(spanishText(value),value)
assert.match(spanishText('You found the right line, Rosa! Keep the original slope.'),/Rosa/)
const paint=[];mockScorecard(paint).createReportImage('beta/write-linear-parallel-perpendicular','Rosa Alvarez',['Final score: 10/10 completion mastery','Parallel equations completed: 6/6'],spanishText)
assert(paint.some(s=>s==='Rosa Alvarez'))
assert(paint.some(s=>s.includes('Puntuación final: 10/10')))
assert(!paint.some(s=>s.includes('Final score:')))
console.log('Passed local Spanish copy, letter choices, preserved math/names/codes, and translated named final score image.')
