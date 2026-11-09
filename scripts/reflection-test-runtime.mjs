import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import {mockScorecard} from './scorecard-test-runtime.mjs'
const code=ts.transpileModule(fs.readFileSync('src/components/practice/PracticeReflection.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText
export function reflectionRuntime(react){const m={exports:{}},jsx=(type,props)=>({type,props:props??{}});vm.runInNewContext(code,{module:m,exports:m.exports,require:n=>n==='react'?{...react,useMemo:react.useMemo??(fn=>fn())}:n==='react/jsx-runtime'?{jsx,jsxs:jsx}:n==='@/lib/scorecard'?mockScorecard():{}});return m.exports}
export function completeReflection(nodes,render){const get=()=>nodes().find(n=>n.props?.state?.rate&&n.props.state.confirm);if(!get())return;get().props.state.rate('confidence',4);render();get().props.state.rate('difficulty',3);render();get().props.state.confirm();render()}
