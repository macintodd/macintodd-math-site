import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import katex from 'katex'
import * as geometry from '../src/lib/point-slope-celebration.ts'
import * as pointModel from '../src/lib/point-slope.ts'
let index=0,tree,shown=0,dismissed=0,next=0;const hooks=[],effects=[],dialog={open:false,showModal(){shown++;this.open=true}}
const react={useRef(){const id=index++;return hooks[id]||(hooks[id]={current:dialog})},useState(initial){const id=index++;if(!hooks[id])hooks[id]={value:initial};return [hooks[id].value,v=>hooks[id].value=typeof v==='function'?v(hooks[id].value):v]},useId(){return 'id-'+index++},useEffect(fn){const id=index++;if(!hooks[id]){hooks[id]={};effects.push(fn)}}}
const jsx=(type,props,key)=>({type,props:props??{},key}),testModule={exports:{}}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/intro-point-slope/PointSlopeCelebration.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:testModule,exports:testModule.exports,require:n=>n==='react'?react:n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='@/lib/point-slope-celebration'?geometry:n==='@/lib/point-slope'?pointModel:n==='@/components/Math'?{Math:'formula'}:(()=>{throw Error(n)})()})
const props={problem:{line:{x:0,y:-3,rise:-2,run:3},point:{x:-6,y:1}},name:'Demo Student',hour:'4',onDismiss:()=>dismissed++,onNext:()=>next++}
function render(){index=0;tree=testModule.exports.default(props);while(effects.length)effects.shift()()}
function nodes(n){if(arguments.length===0)n=tree;if(Array.isArray(n))return n.flatMap(x=>nodes(x));if(!n||typeof n!=='object')return [];return [n,...nodes(n.props?.children??null)]}
function text(n){if(Array.isArray(n))return n.map(text).join('');return n&&typeof n==='object'?text(n.props.children):n==null||typeof n==='boolean'?'':String(n)}
function button(label){nodes().find(n=>n.type==='button'&&text(n)===label).props.onClick();render()}
render();assert.equal(shown,1);assert(text(tree).includes('You did it.'));assert(text(tree).includes('Demo Student'));assert.equal(nodes().filter(n=>n.props.className==='success-scoring-star').length,1);for(const n of nodes().filter(n=>n.type==='formula'))katex.renderToString(n.props.children,{throwOnError:true})
assert(text(tree).includes('Given Point'));assert(text(tree).includes('y-intercept of your answer'));assert(nodes().some(n=>n.type==='formula'&&n.props.children.includes('change in ')));assert.equal(nodes().filter(n=>n.props.className==='success-callout-arrow').length,2)
const css=fs.readFileSync('src/app/apps/intro-point-slope/intro-point-slope.css','utf8');assert(css.includes('success-arrow-flash .6s .3s 5'));assert(css.includes('success-arrow-flash .6s 4.3s 5'))
const before=nodes().find(n=>n.props.className==='intro-celebration-sequence').key;button('Replay animation');assert.notEqual(nodes().find(n=>n.props.className==='intro-celebration-sequence').key,before);assert.equal(shown,1);assert.equal(next,0);assert.equal(dismissed,0);assert.equal(nodes().filter(n=>n.props.className==='success-scoring-star').length,1);button('Review my work');assert.equal(dismissed,1);button('Next problem →');assert.equal(next,1);tree.props.onCancel();assert.equal(dismissed,2)
let finished=0;props.canFinish=true;props.onFinish=()=>finished++;render();button('Finish & reflect →');assert.equal(finished,1)
console.log('Passed splash component events: modal opens once, dynamic named message, valid equations, replay resets animation without scoring/navigation, review/next/Escape callbacks.')
