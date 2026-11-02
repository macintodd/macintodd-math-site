export const families=['linear','absolute','quadratic','cubic','rational','greatest','squareRoot','constant'] as const
export type Family=typeof families[number]
export const familyNames:Record<Family,string>={linear:'Linear',absolute:'Absolute value',quadratic:'Quadratic',cubic:'Cubic',rational:'Rational',greatest:'Greatest integer',squareRoot:'Square root',constant:'Constant'}
export type InputKind='whole'|'decimal'|'fraction'
export type Settings={families:Family[];decimals:boolean;fractions:boolean}
export type Q={n:number;d:number}
export type Problem={family:Family;kind:InputKind;name:string;variable:string;input:Q;inputTex:string;rule:string;substituted:string;answer:Q}
export type EvaluationRecord={problem:Problem;typed:string;correct:boolean}
function gcd(a:number,b:number):number{return b?gcd(b,a%b):Math.abs(a)||1}
export function q(n:number,d=1):Q{const g=gcd(n,d),sign=d<0?-1:1;return {n:n/g*sign,d:Math.abs(d)/g}}
export function tex(a:Q):string{return a.d===1?String(a.n):`${a.n<0?'-':''}\\frac{${Math.abs(a.n)}}{${a.d}}`}
export function parseAnswer(text:string):Q|null{const m=text.trim().replace(/−/g,'-').match(/^(-?(?:\d+(?:\.\d*)?|\.\d+))(?:\/(-?(?:\d+(?:\.\d*)?|\.\d+)))?$/);if(!m||text.length>20||m.slice(1).some(v=>v&&(v.split('.')[1]?.length??0)>6)||m.slice(1).some(v=>v&&Math.abs(Number(v))>1000000000))return null;const decimal=(s:string)=>{const d=10**(s.split('.')[1]?.length??0);return q(Math.round(Number(s)*d),d)};const a=decimal(m[1]),b=m[2]?decimal(m[2]):q(1);if(!b.n)return null;const numerator=a.n*b.d,denominator=a.d*b.n;if(!Number.isSafeInteger(numerator)||!Number.isSafeInteger(denominator))return null;const result=q(numerator,denominator);return Number.isSafeInteger(result.n)&&Number.isSafeInteger(result.d)?result:null}
export function isAnswer(problem:Problem,text:string){const a=parseAnswer(text);return !!a&&a.n===problem.answer.n&&a.d===problem.answer.d}
function pick<T>(items:readonly T[],random:()=>number):T{return items[Math.floor(random()*items.length)]}
function shuffle<T>(items:T[],random:()=>number){const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}return result}
export function inputKinds(settings:Settings,random=Math.random):InputKind[]{
 if(settings.decimals&&settings.fractions)return Array.from({length:3},()=>shuffle<InputKind>(['decimal','fraction'],random).flatMap(kind=>['whole',kind] as InputKind[])).flat()
 if(settings.decimals||settings.fractions)return Array.from({length:6},()=>['whole',settings.decimals?'decimal':'fraction'] as InputKind[]).flat()
 return Array(12).fill('whole')
}
export function makeProblem(family:Family,kind:InputKind,random=Math.random):Problem{
 let input:Q
 if(kind==='whole')input=q(pick([1,2,3,4,5,6,7,8,9,10,11,12],random))
 else{const d=pick(kind==='decimal'?[2,4]:[2,3,4],random),ns=Array.from({length:24-d},(_,i)=>i+d+1).filter(n=>n<12*d&&n%d!==0);input=q(pick(ns,random),d)}
 const inputTex=kind==='decimal'?String(input.n/input.d):tex(input),name=pick(['f','g','h','v','T','M','P','A','Q','F'],random);let variable=pick(['x','t','h','n','s','r'],random);if(name===variable)variable='t'
 const offset=pick([-3,-2,-1,0,1,2,3],random),tail=offset?` ${offset<0?'-':'+'} ${Math.abs(offset)}`:''
 const argument=(x:string,d:number,k:number)=>`${d===1?'':d}${x}${k?` ${k<0?'+':'-'} ${Math.abs(k)}`:''}`
 const sub=`\\left(${inputTex}\\right)`
 let rule='',substituted='',answer=q(0)
 if(family==='linear'){const a=pick([-2,-1,1,2],random),coef=a===1?'':a===-1?'-':String(a);rule=`${coef}${variable}${tail}`;substituted=`${coef}${sub}${tail}`;answer=q(a*input.n+offset*input.d,input.d)}
 if(family==='absolute'){const k=Math.floor(input.n/input.d)+pick([-2,-1,0,1,2],random);rule=`\\left|${argument(variable,1,k)}\\right|${tail}`;substituted=`\\left|${argument(sub,1,k)}\\right|${tail}`;answer=q(Math.abs(input.n-k*input.d)+offset*input.d,input.d)}
 if(family==='quadratic'||family==='cubic'||family==='squareRoot'||family==='rational'){
  const target=family==='squareRoot'?pick([0,1,4,9],random):family==='rational'?pick([-4,-3,-2,-1,1,2,3,4],random):family==='quadratic'?pick([-3,-2,-1,0,1,2,3],random):pick([-2,-1,0,1,2],random),k=input.n-target
  const arg=argument(variable,input.d,k),replaced=argument(sub,input.d,k)
  if(family==='rational'){const numerator=pick([-6,-4,-3,-2,-1,1,2,3,4,6],random);rule=`\\frac{${numerator}}{${arg}}`;substituted=`\\frac{${numerator}}{${replaced}}`;answer=q(numerator,target)}
  else if(family==='squareRoot'){rule=`\\sqrt{${arg}}${tail}`;substituted=`\\sqrt{${replaced}}${tail}`;answer=q(Math.sqrt(target)+offset)}
  else{const power=family==='quadratic'?2:3;rule=`\\left(${arg}\\right)^{${power}}${tail}`;substituted=`\\left(${replaced}\\right)^{${power}}${tail}`;answer=q(target**power+offset)}
 }
 if(family==='greatest'){const k=Math.floor(input.n/input.d)+pick([-2,-1,0,1,2],random);rule=`\\left\\lfloor ${argument(variable,1,k)}\\right\\rfloor${tail}`;substituted=`\\left\\lfloor ${argument(sub,1,k)}\\right\\rfloor${tail}`;answer=q(Math.floor((input.n-k*input.d)/input.d)+offset)}
 if(family==='constant'){const c=pick([-9,-6,-4,-2,-1,0,1,2,4,6,9],random);rule=String(c);substituted=String(c);answer=q(c)}
 return {family,kind,name,variable,input,inputTex,rule,substituted,answer}
}
export function makeRound(settings:Settings,random=Math.random):Problem[]{const chosen=families.filter(f=>settings.families.includes(f));if(!chosen.length)throw Error('Choose at least one family');const order=shuffle(chosen,random),mixed=shuffle(Array.from({length:12},(_,i)=>order[i%order.length]),random);return inputKinds(settings,random).map((kind,i)=>makeProblem(mixed[i],kind,random))}
export function evaluationResults(records:EvaluationRecord[]){const correct=records.filter(r=>r.correct).length;let streak=0,best=0;for(const r of records){streak=r.correct?streak+1:0;best=Math.max(best,streak)}return {correct,answered:records.length,accuracy:records.length?Math.round(correct/records.length*100):0,streak,best,whole:records.filter(r=>r.correct&&r.problem.kind==='whole').length,decimal:records.filter(r=>r.correct&&r.problem.kind==='decimal').length,fraction:records.filter(r=>r.correct&&r.problem.kind==='fraction').length}}
