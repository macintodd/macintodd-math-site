import assert from 'node:assert/strict'
import {reflectionRuntime} from './reflection-test-runtime.mjs'
let index=0,tree,api,identity='Maya|3|round-1',invalidated=0,image='old-scorecard';const hooks=[]
const react={useState(initial){const i=index++;hooks[i]??={value:initial};return [hooks[i].value,v=>hooks[i].value=typeof v==='function'?v(hooks[i].value):v]},useMemo(fn,deps){const i=index++,old=hooks[i];if(old&&old.deps.every((v,n)=>v===deps[n]))return old.value;hooks[i]={deps,value:fn()};return hooks[i].value}}
const m=reflectionRuntime(react)
function render(){index=0;api=m.usePracticeReflection('graph-standard',identity,()=>{invalidated++;image=''});tree=m.default({state:api})}
function nodes(n=tree){return Array.isArray(n)?n.flatMap(nodes):n&&typeof n==='object'?[n,...nodes(n.props.children??null)]:[]}
function text(n=tree){return Array.isArray(n)?n.map(text).join(''):n&&typeof n==='object'?text(n.props.children??null):n==null||typeof n==='boolean'?'':String(n)}
function button(label){return nodes().find(n=>n.type==='button'&&(n.props['aria-label']===label||text(n)===label))}
function click(label){const b=button(label);assert(b&&!b.props.disabled,label);b.props.onClick();render()}
render();assert(api.question.includes('x- and y-intercepts'));assert(button('Show my final scorecard').props.disabled);api.confirm();render();assert(!api.confirmed)
click('Confidence 4 of 5');assert(button('Show my final scorecard').props.disabled);assert.equal(image,'');click('Difficulty 3 of 5');assert(!api.confirmed);assert(!button('Show my final scorecard').props.disabled);click('Show my final scorecard');assert(api.confirmed);assert(text().includes('4/5 — I can do it independently'));assert(text().includes('3/5 — Just right'));assert(!button('Confidence 4 of 5'));assert(api.lines.some(s=>s.includes('4/5 - I can do it independently')));assert(api.lines.some(s=>s.includes('3/5 - Just right')));const lines=api.lines;render();assert.equal(api.lines,lines,'unchanged answers keep stable image-effect dependencies')
image='new-scorecard';click('Edit reflection answers');assert(!api.confirmed);assert.equal(image,'');click('Difficulty 5 of 5');click('Show my final scorecard');assert(api.lines.some(s=>s.includes('Too difficult')))
identity='Maya|3|round-2';render();assert.equal(api.confidence,0);assert.equal(api.difficulty,0);assert(!api.confirmed);identity='New Student|4|round-1';render();assert.equal(api.confidence,0);api.rate('confidence',6);render();assert.equal(api.confidence,0);assert(invalidated>=4)
console.log('Passed skill-specific confidence question, two-rating gating, confirmation, selected labels in scorecard/export lines, stable dependencies, edit invalidation, valid ranges, and fresh ratings for a new student or session.')
