import type { StandardEquation } from '@/lib/standard-form'
function Fraction({top,bottom}:{top:string|number;bottom:string|number}){return <span className="work-fraction"><span>{top}</span><span>{bottom}</span></span>}
export default function InterceptWork({problem,axis}:{problem:StandardEquation;axis:'x'|'y'}){
  const isX=axis==='x',coefficient=isX?problem.a:problem.b,value=isX?problem.xIntercept:problem.yIntercept,other=isX?'y':'x'
  return <section className="intercept-work" aria-label={`Correct work for ${axis}-intercept`}>
    <h3>Find the {axis}-intercept</h3><p>Set {other} = 0.</p>
    <div className="intercept-steps" aria-label={`Substitute zero for ${other}, then divide both sides by ${coefficient}`}>
      <div><span>{isX?`${problem.a}x ${problem.b<0?'−':'+'} ${Math.abs(problem.b)}(0)`:`${problem.a}(0) ${problem.b<0?'−':'+'} ${Math.abs(problem.b)}y`}</span><span>=</span><span>{problem.c}</span></div>
      <div><span>{coefficient}{axis}</span><span>=</span><span>{problem.c}</span></div>
      <div><Fraction top={`${coefficient}${axis}`} bottom={coefficient}/><span>=</span><Fraction top={problem.c} bottom={coefficient}/></div>
      <div><span>{axis}</span><span>=</span><span>{value}</span></div>
    </div><p><strong>{axis}-intercept: {isX?`(${value}, 0)`:`(0, ${value})`}</strong></p>
  </section>
}
