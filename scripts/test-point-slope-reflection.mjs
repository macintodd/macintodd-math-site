import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as model from '../src/lib/point-slope-reflection.ts'
const jsx=(type,props)=>({type,props}),testModule={exports:{}}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/intro-point-slope/ReflectionRating.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:testModule,exports:testModule.exports,require:n=>n==='@/lib/point-slope-reflection'?model:{jsx,jsxs:jsx}})
function nodes(n){if(Array.isArray(n))return n.flatMap(nodes);if(!n||typeof n!=='object')return [];return [n,...nodes(n.props?.children??null)]}
for(const question of [0,1])for(const rating of [null,1,2,3,4,5]){let changed=null;const tree=testModule.exports.default({question,rating,onChange:value=>changed=value}),inputs=nodes(tree).filter(n=>n.type==='input');assert.equal(inputs.length,5);assert.equal(inputs.filter(n=>n.props.checked).length,rating===null?0:1);assert(inputs.every(n=>n.props.type==='radio'&&n.props.name===`point-slope-reflection-${question}`));inputs[4].props.onChange();assert.equal(changed,5)}
assert.equal(model.reflectionAnswer(0,1),'Not yet');assert.equal(model.reflectionAnswer(0,5),'Yes, confidently');assert.equal(model.reflectionAnswer(1,1),'Too easy');assert.equal(model.reflectionAnswer(1,3),'Just right');assert.equal(model.reflectionAnswer(1,5),'Too difficult');for(const n of [null,0,6,1.5])assert.equal(model.reflectionAnswer(0,n),'Not answered')
console.log('Passed both five-star radio scales, selection callbacks, clear endpoints and invalid/missing rating labels.')
