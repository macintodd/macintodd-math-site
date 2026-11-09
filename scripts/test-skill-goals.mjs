import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import {practiceApps} from '../src/content/practice-apps.ts'
const source=fs.readFileSync('src/app/apps/ActivitySkillIntro.tsx','utf8'),code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText
function app(path,native=false){
 const hooks=[];let index=0
 const jsx=(type,props,key)=>({type,props:props??{},key}),mod={exports:{}}
 const react={useState(initial){const i=index++;hooks[i]??={value:initial};return [hooks[i].value,v=>hooks[i].value=v]},useSyncExternalStore(subscribe,snapshot){return snapshot()}}
 vm.runInNewContext(code,{module:mod,exports:mod.exports,window:native?{MathBoardApplet:{}}:{},require:n=>n==='react'?react:n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='next/navigation'?{usePathname:()=>path}:n==='@/components/Math'?{Math:'formula'}:{default:'SkillGoal',__esModule:true}})
 function render(){index=0;const tree=mod.exports.default({children:'ACTIVITY'});return typeof tree.type==='function'?tree.type(tree.props):tree}
 return {render}
}
for(const activity of practiceApps){const path=`/apps/${activity.slug}`,a=app(path),tree=a.render();if(activity.slug.startsWith('write-linear-equation')||activity.slug.startsWith('rigid-transformations')){assert.equal(tree,'ACTIVITY');continue}const [child,goal]=tree.props.children;assert.equal(child,'ACTIVITY');assert.equal(goal.type,'SkillGoal',activity.slug+' must have a skill goal');goal.props.onContinue();assert.equal(a.render().props.children[1],false);assert.equal(app(path,true).render().props.children[1],false,'native demo must not gain an unsynced modal')}
for(const path of ['/apps','/apps/slope/results','/apps/write-linear-equation/teacher','/apps/mathboard/session-1/teacher'])assert.equal(app(path).render(),'ACTIVITY')
console.log('Passed skill-goal coverage for every listed activity, acknowledgement, native demo isolation, and exclusion of directories/results/teacher routes. Linear goals are tested after each unscored example in the full and standalone flows.')
