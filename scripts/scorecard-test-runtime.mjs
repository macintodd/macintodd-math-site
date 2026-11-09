import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as rigid from '../src/lib/rigid-skills.ts'
import {practiceApps} from '../src/content/practice-apps.ts'
const code=ts.transpileModule(fs.readFileSync('src/lib/scorecard.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText
export function scorecardRuntime(document){const m={exports:{}};vm.runInNewContext(code,{module:m,exports:m.exports,document,require:n=>n.includes('rigid-skills')?rigid:({practiceApps})});return m.exports}
export function mockScorecard(paint=[]){return scorecardRuntime({createElement:()=>({width:0,height:0,getContext:()=>({fillRect(){},fillText:s=>paint.push(s)}),toDataURL:()=> 'data:image/png;base64,local-report'})})}
