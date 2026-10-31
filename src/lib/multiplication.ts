export type Fact={a:number;b:number}
export type MultiplicationAnswer={a:number;b:number;answer:number;correct:boolean}
/** Selected magnitudes are practiced against 0–11; every product stays within ±110. */
export function multiplicationFacts(selected:number[],includeNegatives=false):Fact[]{
 const base=[...new Set(selected)].filter(n=>Number.isInteger(n)&&n>=0&&n<=11).flatMap(a=>Array.from({length:12},(_,b)=>({a,b})).filter(f=>f.a*f.b<=110))
 if(!includeNegatives)return base
 const signed=new Map<string,Fact>()
 for(const {a,b} of base)for(const sa of a?[a,-a]:[0])for(const sb of b?[b,-b]:[0])signed.set(`${sa},${sb}`,{a:sa,b:sb})
 return [...signed.values()]
}
export function signedEntry(current:string,key:string){if(key==='clear')return '';if(key==='back')return current.slice(0,-1);if(key==='sign')return current.startsWith('-')?current.slice(1):'-'+current;return /^\d$/.test(key)&&current.replace('-','').length<3?current+key:current}
export function shuffleFacts(facts:Fact[],random=Math.random){const deck=[...facts];for(let i=deck.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]]}return deck}
export function multiplicationResults(answers:MultiplicationAnswer[]){let correct=0,streak=0,best=0;for(const a of answers){if(a.correct){correct++;streak++;best=Math.max(best,streak)}else streak=0}return {correct,attempted:answers.length,streak,best,accuracy:answers.length?Math.round(correct/answers.length*100):0}}

export type CompletedMinute={id:string;completedAt:string;selectedFactors:number[];includeNegatives:boolean;answers:MultiplicationAnswer[]}
export function studentKey(first:string,last:string,hour:string){return JSON.stringify([first,last,hour].map(s=>s.trim().replace(/\s+/g,' ').toLocaleLowerCase()))}
export function completedMinute(id:string,completedAt:string,selectedFactors:number[],includeNegatives:boolean,answers:MultiplicationAnswer[]):CompletedMinute{return {id,completedAt,selectedFactors:[...selectedFactors],includeNegatives,answers:answers.map(answer=>({...answer}))}}
export function appendMinute(history:CompletedMinute[],minute:CompletedMinute){return history.some(s=>s.id===minute.id)?history:[...history,minute]}
export function practicedFactors(minute:CompletedMinute){return [...new Set(minute.answers.map(a=>Math.abs(a.a)))].sort((a,b)=>a-b)}
export function combinedResults(minutes:CompletedMinute[]){const attempted=minutes.reduce((n,m)=>n+m.answers.length,0),correct=minutes.reduce((n,m)=>n+multiplicationResults(m.answers).correct,0),best=minutes.reduce((n,m)=>Math.max(n,multiplicationResults(m.answers).best),0);return {minutes:minutes.length,attempted,correct,best,accuracy:attempted?Math.round(correct/attempted*100):0}}
