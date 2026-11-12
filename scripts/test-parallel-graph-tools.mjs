import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as tools from '../src/lib/parallel-graph-tools.ts'
import {coordinateLabels} from '../src/lib/graph-coordinate-labels.ts'
for(const [text,prefix,x] of [['2x+3',true,false],['y=2+3',false,true],['2+3',true,true],['y=-2/3x+5',false,false],['',false,false]])assert.deepEqual(tools.missingLessonNotation(text,2),{prefix,x});assert.equal(tools.missingLessonNotation('y=5',0).x,false)
const jsx=(type,props)=>({type,props:props??{}})
let tree
function nodes(n=tree){return Array.isArray(n)?n.flatMap(v=>nodes(v??null)):n&&typeof n==='object'?[n,...nodes(n.props.children??null)]:[]}
function text(n){return Array.isArray(n)?n.map(text).join(''):n&&typeof n==='object'?text(n.props?.children):n==null||typeof n==='boolean'?'':String(n)}
const p=[{x:310,y:330,text:'(3, -4)',curve:'g'},{x:310,y:290,text:'(3, -2)',curve:'g'}],reserved={left:382,top:295,width:110,height:30},labels=coordinateLabels(p,{fontSize:18,reserved:[reserved]});assert(labels.every(l=>l.height===23));for(const l of labels)assert(l.left+l.width<=reserved.left||l.left>=reserved.left+reserved.width||l.top+l.height<=reserved.top||l.top>=reserved.top+reserved.height)
const warning={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/beta/parallel-perpendicular-lesson/EquationFormatWarning.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:warning,exports:warning.exports,require:n=>n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='@/components/Math'?{Math:'formula'}:{__esModule:true,default:n}});tree=warning.exports.default({missing:{prefix:true,x:true},onClose(){}});assert.equal(nodes().filter(n=>n.props.className==='lp-format-missing').length,2);assert(text(tree).includes('does not count as an incorrect equation'))
console.log('Passed missing-y=/x warnings and larger nonoverlapping coordinate labels.')
