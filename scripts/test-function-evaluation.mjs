import assert from 'node:assert/strict'
import katex from 'katex'
import {families,makeProblem,makeRound,inputKinds,parseAnswer,isAnswer,tex,evaluationResults,q} from '../src/lib/function-evaluation.ts'
// Independent arithmetic oracle for the trusted generated TeX, never user-entered input.
function oracle(problem){let expression=problem.substituted.replace(/\\left|\\right/g,'');for(let i=0;i<8&&expression.includes('\\frac');i++)expression=expression.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g,'(($1)/($2))');expression=expression.replace(/\\sqrt\{([^{}]+)\}/g,'Math.sqrt($1)').replace(/\\lfloor (.*?)\\rfloor/g,'Math.floor($1)').replace(/\|([^|]+)\|/g,'Math.abs($1)').replace(/\^\{([23])\}/g,'**$1').replace(/(\d|\))\(/g,'$1*(');return Function('return ('+expression+')')()}
for(const decimals of [false,true])for(const fractions of [false,true]){
 const settings={families:[...families],decimals,fractions},kinds=inputKinds(settings),round=makeRound(settings)
 assert.equal(round.length,12);assert.equal(new Set(round.map(p=>p.family)).size,8)
 assert.equal(kinds.filter(k=>k==='whole').length,decimals||fractions?6:12)
 assert.equal(kinds.filter(k=>k==='decimal').length,decimals?(fractions?3:6):0)
 assert.equal(kinds.filter(k=>k==='fraction').length,fractions?(decimals?3:6):0)
 for(let i=1;i<=12;i++)assert(kinds.slice(0,i).filter(k=>k!=='whole').length<=Math.floor(i/2),'No prefix has more than half non-integer inputs')
}
assert.throws(()=>makeRound({families:[],decimals:false,fractions:false}))
for(const family of families)for(const kind of ['whole','decimal','fraction'])for(let i=0;i<100;i++){
 const p=makeProblem(family,kind),input=p.input.n/p.input.d,expected=p.answer.n/p.answer.d
 assert(input>=1&&input<=12);assert.equal(Number.isInteger(input),kind==='whole');assert(Math.abs(expected)<=28)
 assert.equal(p.family,family);assert.notEqual(p.name,p.variable)
 assert(Math.abs(oracle(p)-expected)<1e-10,JSON.stringify(p))
 katex.renderToString(`${p.name}(${p.variable})=${p.rule}`,{throwOnError:true});katex.renderToString(`${p.name}(${p.inputTex})=${p.substituted}=${tex(p.answer)}`,{throwOnError:true})
 assert(isAnswer(p,p.answer.d===1?String(p.answer.n):`${p.answer.n}/${p.answer.d}`));assert(!isAnswer(p,String(expected+1)))
}
assert.deepEqual(parseAnswer('-6/8'),q(-3,4));assert.deepEqual(parseAnswer('0.75'),q(3,4));assert.deepEqual(parseAnswer('3/-4'),q(-3,4))
for(const s of ['','-','1/0','2/','NaN','1;alert(1)','99999999999999999999'])assert.equal(parseAnswer(s),null)
const records=['whole','decimal','fraction'].map(kind=>({problem:makeProblem('linear',kind),typed:'0',correct:true}))
assert.deepEqual(evaluationResults(records),{correct:3,answered:3,accuracy:100,streak:3,best:3,whole:1,decimal:1,fraction:1})
assert(makeRound({families:['rational'],decimals:true,fractions:true}).every(p=>p.family==='rational'))
console.log('Passed: 2,400 generated problems independently evaluated; valid KaTeX, mental-sized answers, domains, exact input mixes, all families, answer parsing, and colored-star counts.')
