export type Level=1|2|3
export type Kind='up'|'down'|'left'|'right'|'reflectX'|'reflectY'
export const kinds:Kind[]=['up','down','left','right','reflectX','reflectY']
export type Transform={h:number;k:number;rx:boolean;ry:boolean}
export type Question={id:number;tex:string;choices:string[];answer:string;hint:string;transform:Transform;kind?:Kind;symbolic:boolean}
export type Stats={correct:number;earned:number;attempts:number;streak:number;best:number;resets:number;completed:string|null}
export type Practice={level:Level;phase:'question'|'feedback'|'celebrate'|'summary'|'finished';question:Question;deck:Kind[];stats:Stats[];serial:number;right:boolean|null;selected:string|null;burst:number}
export const freshStats=():Stats=>({correct:0,earned:0,attempts:0,streak:0,best:0,resets:0,completed:null})
export function shuffled<T>(items:T[],rng=Math.random):T[]{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.min(i,Math.floor(rng()*(i+1)));[a[i],a[j]]=[a[j],a[i]]}return a}
const amount=(rng:()=>number)=>1+Math.min(8,Math.floor(rng()*9))
const empty=():Transform=>({h:0,k:0,rx:false,ry:false})
export function fromKind(kind:Kind,n:number):Transform{return {...empty(),...(kind==='up'?{k:n}:kind==='down'?{k:-n}:kind==='left'?{h:-n}:kind==='right'?{h:n}:kind==='reflectX'?{rx:true}:{ry:true})}}
export function transformLabel(t:Transform):string{const parts:string[]=[];if(t.rx)parts.push('Reflected over the x-axis');if(t.ry)parts.push('Reflected over the y-axis');if(t.h)parts.push(`Translated ${t.h>0?'right':'left'} ${Math.abs(t.h)} ${Math.abs(t.h)===1?'unit':'units'}`);if(t.k)parts.push(`Translated ${t.k>0?'up':'down'} ${Math.abs(t.k)} ${Math.abs(t.k)===1?'unit':'units'}`);return parts.join('; then ').replace(/; then Translated/g,'; then translated')}
export function transformTex(t:Transform){const inside=t.ry?'-x':`x${t.h>0?`-${t.h}`:t.h<0?`+${-t.h}`:''}`;return `g(x)=${t.rx?'-':''}f\\left(${inside}\\right)${t.k>0?`+${t.k}`:t.k<0?String(t.k):''}`}
export const symbolicChoices=['Translated up k units','Translated down k units','Translated left h units','Translated right h units','Reflected over the x-axis','Reflected over the y-axis']
const symbolicTex:Record<Kind,string>={up:'g(x)=f(x)+k',down:'g(x)=f(x)-k',left:'g(x)=f(x+h)',right:'g(x)=f(x-h)',reflectX:'g(x)=-f(x)',reflectY:'g(x)=f(-x)'}
export function memoryHint(t:Transform){const parts:string[]=[];if(t.rx)parts.push('A minus in front changes the outputs: reflect over the x-axis.');if(t.ry)parts.push('A minus on x inside changes the inputs: reflect over the y-axis.');if(t.h)parts.push('Inside goes the opposite way: x − h moves right, and x + h moves left.');if(t.k)parts.push('Outside does what it says: + k moves up, and − k moves down.');if(parts.length>1)parts.push('Read reflections first, then translations.');return parts.join(' ')}
export function makeQuestion(level:Level,id:number,rng=Math.random,kind?:Kind):Question{
 const chosen=kind??kinds[Math.min(5,Math.floor(rng()*6))],n=amount(rng),v=amount(rng);let t=fromKind(chosen,n)
 if(level===3){const pattern=Math.min(4,Math.floor(rng()*5));const h=(rng()<.5?-1:1)*n,k=(rng()<.5?-1:1)*v;if(pattern===1)t={...empty(),h,k};if(pattern===2)t={...empty(),rx:true,h};if(pattern===3)t={...empty(),rx:true,k};if(pattern===4)t={...empty(),ry:true,k}}
 if(level===1){const answer=symbolicChoices[kinds.indexOf(chosen)];return {id,tex:symbolicTex[chosen],choices:shuffled(symbolicChoices,rng),answer,hint:memoryHint(t),transform:t,kind:chosen,symbolic:true}}
 const answer=transformLabel(t)
 let pool:string[]
 if(level===2)pool=kinds.map(k=>transformLabel(fromKind(k,n)))
 else{const h=Math.abs(t.h)||n,k=Math.abs(t.k)||Math.abs(t.h)||n;const candidates:Transform[]=kinds.map(kind=>fromKind(kind,h));for(const sign of [-1,1]){candidates.push({...empty(),k:sign*k});for(const other of [-1,1])candidates.push({...empty(),h:sign*h,k:other*k});candidates.push({...empty(),rx:true,h:sign*h},{...empty(),rx:true,k:sign*k},{...empty(),ry:true,k:sign*k})}pool=[answer,...shuffled([...new Set(candidates.map(transformLabel))].filter(label=>label!==answer),rng).slice(0,5)]}
 return {id,tex:transformTex(t),choices:shuffled(pool,rng),answer,hint:memoryHint(t),transform:t,symbolic:false}
}
export function startPractice(rng=Math.random):Practice{const deck=shuffled(kinds,rng);return {level:1,phase:'question',question:makeQuestion(1,1,rng,deck[0]),deck:deck.slice(1),stats:[freshStats(),freshStats(),freshStats()],serial:1,right:null,selected:null,burst:0}}
export function levelDone(level:Level,s:Stats){return level===1?s.correct===6:s.correct>=10&&s.best>=5}
export function accuracy(s:Stats){return s.attempts?Math.round(s.earned/s.attempts*100):0}
export function praise(s:Stats){const a=accuracy(s);return a===100?'Outstanding':a>=85?'Excellent':a>=65?'Great':'Good'}
export function answerQuestion(state:Practice,choice:string,questionId:number,now:string,rng=Math.random):Practice{
 if(state.phase!=='question'||questionId!==state.question.id||!state.question.choices.includes(choice))return state
 const right=choice===state.question.answer,old=state.stats[state.level-1],streak=right?old.streak+1:0
 const stat:Stats={...old,attempts:old.attempts+1,earned:old.earned+(right?1:0),correct:right?old.correct+1:state.level===1?0:old.correct,streak,best:Math.max(old.best,streak),resets:old.resets+(!right&&state.level===1?1:0)}
 const complete=levelDone(state.level,stat);if(complete)stat.completed=now
 const stats=state.stats.map((s,i)=>i===state.level-1?stat:s)
 return {...state,stats,right,selected:choice,phase:complete?'celebrate':'feedback',deck:!right&&state.level===1?shuffled(kinds,rng):state.deck,burst:right?state.burst+1:state.burst}
}
export function nextQuestion(state:Practice,rng=Math.random):Practice{
 if(state.phase!=='feedback')return state
 const serial=state.serial+1;return {...state,serial,phase:'question',right:null,selected:null,question:makeQuestion(state.level,serial,rng,state.level===1?state.deck[0]:undefined),deck:state.level===1?state.deck.slice(1):state.deck}
}
export function dismissCelebration(state:Practice):Practice{return state.phase==='celebrate'?{...state,phase:'summary'}:state}
export function nextLevel(state:Practice,rng=Math.random):Practice{if(state.phase!=='summary')return state;if(state.level===3)return {...state,phase:'finished'};const level=(state.level+1) as Level,serial=state.serial+1;return {...state,level,serial,phase:'question',right:null,selected:null,question:makeQuestion(level,serial,rng)}}
export function reportLines(name:string,hour:string,started:string,state:Practice,now:string){const complete=state.stats.every(s=>!!s.completed);return ['MacInTodd · Transformation Notation Practice',name,`Class hour ${hour}`,`${complete?'Completed':'Progress saved'}: ${complete?formatPracticeDate(state.stats[2].completed!):formatPracticeDate(now)}`,`Session started: ${formatPracticeDate(started)}`,`Mastery score: ${state.stats.filter(s=>s.completed).length}/3 levels${complete?' · 10/10':''}`,...state.stats.flatMap((s,i)=>[`Level ${i+1}: ${s.completed?'Complete':i+1>state.level?'Not started':'In progress'} · ${s.correct}/${i===0?6:10} correct`,`Best streak ${s.best}/${i===0?6:5} · ${s.earned}/${s.attempts} answers correct · accuracy ${accuracy(s)}%`,...(i===0?[`Level 1 restarts: ${s.resets}`]:[]),...(s.completed?[`Completed: ${formatPracticeDate(s.completed)}`]:[])]),'Save this image or take a screenshot and upload it to Google Classroom.']}

export function formatPracticeDate(value:string){if(/^\d{4}-\d{2}-\d{2}$/.test(value)){const [y,m,d]=value.split('-').map(Number);return new Date(y,m-1,d).toLocaleDateString()}const date=new Date(value);return Number.isFinite(date.getTime())?date.toLocaleString():value}
