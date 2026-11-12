import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import {spanishText} from '../src/lib/beta-spanish.ts'
import {scorecardRuntime} from './scorecard-test-runtime.mjs'
const jsx=(type,props)=>({type,props:props??{}})
function load(file,extra={}){const m={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:m,exports:m.exports,require:n=>n==='react/jsx-runtime'?{jsx,jsxs:jsx}:extra[n]??{__esModule:true,default:n}});return m.exports}
const normal=load('src/app/apps/ActivitySkillIntro.tsx',{'next/navigation':{usePathname:()=>'/apps/parallel-perpendicular'},react:{useState:v=>[v,()=>{}],useSyncExternalStore:()=>false}}).default({children:'tutorial'});assert.equal(normal.props.spanishFirst,true);assert.equal(normal.props.children,'tutorial')
for(const [path,teacher] of [['beta/write-linear-parallel-perpendicular',false],['beta/parallel-perpendicular-lesson',false],['beta/parallel-perpendicular-lesson/teacher',true]]){const tree=load(`src/app/apps/${path}/page.tsx`).default();assert.equal(tree.props.spanishFirst,true,path);if(teacher)assert.equal(tree.props.children.type,'./TeacherLesson',path);else assert.equal(!!tree.props.children.props.teacher,false,path)}
const info=scorecardRuntime({});for(const slug of ['parallel-perpendicular','beta/write-linear-parallel-perpendicular','beta/parallel-perpendicular-lesson']){const skill=info.reportInfo(slug).skill,q=`How independently can you ${skill.charAt(0).toLowerCase()+skill.slice(1).replace(/\.$/,'')}?`;assert.notEqual(spanishText(q),q,slug)}
for(const dir of ['parallel-perpendicular','beta/write-linear-parallel-perpendicular','beta/parallel-perpendicular-lesson','beta/parallel-perpendicular-lesson/teacher'])for(const f of fs.readdirSync('src/app/apps/'+dir).filter(f=>f.endsWith('.tsx'))){const ast=ts.createSourceFile(f,fs.readFileSync('src/app/apps/'+dir+'/'+f,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);function visit(n){if(ts.isJsxText(n)){const s=n.text.replace(/\s+/g,' ').trim();if(/[a-zA-Z]{3}/.test(s))assert.notEqual(spanishText(s),s,dir+'/'+f+': '+s)}ts.forEachChild(n,visit)}visit(ast)}
console.log('Passed clean-English / Spanish-tap-English mode on the classroom widget, both betas and teacher presentation; all JSX prose and final skill-reflection prompts translated.')
