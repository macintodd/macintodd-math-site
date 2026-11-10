export type HVQuestion={id:number;horizontal:boolean;value:number;kind:number;prompt:string;equation?:string;graph:boolean;choices:string[];answer:number;cue:string;answerText:string}
const integer=(n:number,rng:()=>number)=>Math.min(n-1,Math.floor(rng()*n))
export function hvDeck(rng=Math.random):HVQuestion[]{
 const kinds=Array.from({length:12},(_,i)=>i)
 for(let i=kinds.length-1;i>0;i--){const j=integer(i+1,rng);[kinds[i],kinds[j]]=[kinds[j],kinds[i]]}
 return kinds.map((kind,id)=>{
  const horizontal=kind<10?kind%2===0:rng()<.5,value=integer(11,rng)-5,variable=horizontal?'y':'x',slope=horizontal?'0':'Undefined',direction=horizontal?'Horizontal':'Vertical'
  let prompt='',equation:string|undefined,graph=false,choices:string[]=[],correct=''
  if(kind<2){graph=true;prompt='What is the slope of this line?';choices=['0','Undefined'];correct=slope}
  else if(kind<4){graph=true;prompt='Is this line horizontal or vertical?';choices=['Horizontal','Vertical'];correct=direction}
  else if(kind<8){equation=`${variable}=${value}`;prompt=kind<6?'What kind of line does this equation graph?':'What is the slope of the line?';choices=kind<6?['Horizontal','Vertical']:['0','Undefined'];correct=kind<6?direction:slope}
  else if(kind<10){const shift=1+integer(7,rng);equation=`${variable}-${shift}=${value-shift}`;prompt=rng()<.5?'What kind of line does this equation graph?':'What is the slope of the line?';choices=prompt.startsWith('What kind')?['Horizontal','Vertical']:['0','Undefined'];correct=choices[0]==='Horizontal'?direction:slope}
  else {prompt=kind===10?'Which equation is a horizontal line?':'Which equation has undefined slope?';choices=[`y=${value}`,`x=${value}`];correct=kind===10?choices[0]:choices[1]}
  if(rng()<.5)choices.reverse()
  const targetHorizontal=kind===10?true:kind===11?false:horizontal
  const cue=targetHorizontal?'Horizontal: y stays constant. Rise is 0, so slope is 0.':'Vertical: x stays constant. Run is 0, so slope is undefined. You cannot divide by 0.'
  return {id,horizontal:targetHorizontal,value,kind,prompt,equation,graph,choices,answer:choices.indexOf(correct),cue,answerText:correct}
 })
}
export type HVResult={right:boolean;question:HVQuestion;chosen:number}
export function hvTotals(results:HVResult[]){const correct=results.filter(r=>r.right).length;let streak=0,best=0;for(const r of results){streak=r.right?streak+1:0;best=Math.max(best,streak)}return {correct,points:correct*10,attempted:results.length,accuracy:results.length?Math.round(correct/results.length*100):0,streak,best}}
export function hvAnswerAllowed(deadline:number,now:number,locked:boolean){return !locked&&now<deadline}
