import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
import {spanishText} from '../src/lib/beta-spanish.ts'
import {equationSpanish,equationSpanishTemplates} from '../src/lib/equation-spanish.ts'
const routes=['write-linear-equation','write-linear-equation/teacher',...Array.from({length:5},(_,i)=>`write-linear-equation-level-${i+1}`),'line-equations','point-slope','intro-point-slope','parallel-perpendicular']
const boundary=fs.readFileSync('src/app/apps/ActivitySkillIntro.tsx','utf8');for(const route of routes)assert(boundary.includes(JSON.stringify(route)),route);assert(boundary.includes('<BilingualWidget key={path}>{content}</BilingualWidget>'),'Opening skill reminder and widget share the language boundary')
for(const [en,es] of [['Write the Linear Equation LEVEL 2','Escribe la ecuación lineal NIVEL 2'],['Correct slope: -2/3. Now write the equation of the line.','Pendiente correcta: -2/3. Ahora escribe la ecuación de la recta.'],['Fantastic, Maya!','¡Fantástico, Maya!'],['Class hour 3 | Completed 11/9/2026','Hora de clase 3 | Completado 11/9/2026']])assert.equal(spanishText(en),es)
for(const en of ['y = -2/3x + 5','(3, -2)','Maya Student','WL1-ABCD-2345'])assert.equal(spanishText(en),en)
for(const en of ['Use a resume code from Write the Linear Equation LEVEL 4.','Level 3: 5 correct | 7 scored checks | Best streak 5','Question 1: How was the practice?','If the line has a non-zero slope, it must have an x next to the slope. THIS IS YOUR FINAL WARNING. Next time I will WARN you again.'])assert.notEqual(spanishText(en),en)
// All actual JSX prose has a reviewed translation. Identical Spanish words and formulas are intentional.
let total=0;for(const dir of ['write-linear-equation','write-linear-equation-level-5','line-equations','point-slope','intro-point-slope','parallel-perpendicular'])for(const file of fs.readdirSync('src/app/apps/'+dir).filter(f=>f.endsWith('.tsx'))){const source=ts.createSourceFile(file,fs.readFileSync('src/app/apps/'+dir+'/'+file,'utf8'),ts.ScriptTarget.Latest,true);function visit(n){if(ts.isJsxText(n)){const en=n.text.replace(/\s+/g,' ').trim();if(/[A-Za-z]{2}/.test(en)&&!['y=mx+b','No','VARIABLE'].includes(en)){assert.notEqual(spanishText(en),en,file+': '+en);total++}}ts.forEachChild(n,visit)}visit(source)}
for(const row of equationSpanishTemplates.trim().split('\n')){const [en,es]=row.split('\t');assert(en&&es);assert.deepEqual([...en.matchAll(/__(\d+)__/g)].map(m=>m[1]).sort(),[...es.matchAll(/__(\d+)__/g)].map(m=>m[1]).sort(),'Template preserves every number/name/formula placeholder')}
assert(equationSpanish.split('\n').length>600)
console.log(`Passed all ${routes.length} equation routes, ${total} JSX passages, dynamic feedback/templates, unchanged names/math/codes, and complete placeholder preservation.`)
