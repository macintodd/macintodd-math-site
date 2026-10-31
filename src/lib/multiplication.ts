export type Fact={a:number;b:number}
export type MultiplicationAnswer={a:number;b:number;answer:number;correct:boolean}
/** Selected factors are practiced against 0–11; 11×11 is excluded. */
export function multiplicationFacts(selected:number[]):Fact[]{
 return [...new Set(selected)].filter(n=>Number.isInteger(n)&&n>=0&&n<=11).flatMap(a=>Array.from({length:12},(_,b)=>({a,b})).filter(f=>f.a*f.b<=110))
}
export function shuffleFacts(facts:Fact[],random=Math.random){const deck=[...facts];for(let i=deck.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]]}return deck}
export function multiplicationResults(answers:MultiplicationAnswer[]){let correct=0,streak=0,best=0;for(const a of answers){if(a.correct){correct++;streak++;best=Math.max(best,streak)}else streak=0}return {correct,attempted:answers.length,streak,best,accuracy:answers.length?Math.round(correct/answers.length*100):0}}
