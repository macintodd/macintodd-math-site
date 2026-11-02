import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as jsxRuntime from 'react/jsx-runtime'
import {renderToStaticMarkup} from 'react-dom/server'
import katex from 'katex'
import {practiceApps} from '../src/content/practice-apps.ts'
const testModule={exports:{}}
const Math=({children})=>jsxRuntime.jsx('span',{dangerouslySetInnerHTML:{__html:katex.renderToString(children,{throwOnError:true,trust:false,output:'htmlAndMathml'})}})
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/apps/AppPreview.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:testModule,exports:testModule.exports,require:n=>n==='@/components/Math'?{Math}:jsxRuntime})
for(const app of practiceApps){const html=renderToStaticMarkup(jsxRuntime.jsx(testModule.exports.AppPreview,{slug:app.slug}));assert(html.includes('Example activity'),app.slug);assert(!html.includes('katex-error'),app.slug);if(app.slug!=='2048')assert(html.includes('<math'),app.slug)}
console.log(`Passed: all ${practiceApps.length} representative app visuals render; every example formula parses with strict KaTeX.`)
