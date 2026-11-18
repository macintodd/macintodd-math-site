import {generate,checkAnswer} from './problems.js';
export function makeRound(seed,category=8,level=2,seconds=120){
 return {id:String(seed),category,level,seconds,status:'lobby',startedAt:0,players:{'fox-27':{uid:'',online:false,points:0},'owl-42':{uid:'',online:false,points:0}},processed:{},events:[]};
}
export function question(round){return generate(round.category,round.level,Number(round.id),{multipleChoice:false});}
export function settle(round,now){
 if(round.status!=='playing')return round;
 const expired=now>=round.startedAt+round.seconds*1000;
 for(const p of Object.values(round.players))if(expired&&!p.done){p.done=true;p.outcome='Time is up';p.finishedAt=now;}
 if(!Object.values(round.players).every(p=>p.done))return round;
 round.status='review';
 const correct=Object.entries(round.players).filter(([,p])=>p.correct).sort((a,b)=>a[1].finishedAt-b[1].finishedAt);
 for(const [name,p] of Object.entries(round.players)){
  const base=p.correct?(p.misses?Math.ceil(round.level/2):round.level):0;
  const speed=p.correct&&correct[0]?.[0]===name&&!(correct.length===2&&correct[0][1].finishedAt===correct[1][1].finishedAt)?1:0;
  p.points=p.correct?Math.max(0,base-(p.hints||0))+(p.hints?0:1)+speed:0;
  p.speedBonus=speed;
 }
 return round;
}
export function applyCommand(source,name,cmd,now){
 const r=structuredClone(source),p=r.players?.[name];
 if(!p||!cmd||typeof cmd.id!=='string'||!['hint','answer'].includes(cmd.type)||cmd.id===r.processed?.[name]||cmd.roundId!==r.id)return r;
 r.processed??={};r.processed[name]=cmd.id;
 settle(r,now);
 if(r.status!=='playing'||p.done)return r;
 if(cmd.type==='hint')p.hints=Math.min(2,(p.hints||0)+1);
 if(cmd.type==='answer'){
  let result;try{result=checkAnswer(question(r),cmd.answers||{});}catch{p.feedback='Please enter a valid answer using the controls on this page.';p.feedbackKind='form';return r;}
  p.feedback=result.message||'Correct! Your answer is locked in.';
  p.feedbackKind=result.status;
  if(result.status==='form'||result.status==='simplify')return r;
  p.checks=(p.checks||0)+1;p.lastAnswers=cmd.answers||{};
  if(result.status==='correct'){p.correct=true;p.done=true;p.finishedAt=now;p.outcome='Correct';}
  else {p.misses=(p.misses||0)+1;if(p.misses>=2){p.done=true;p.finishedAt=now;p.outcome='Review and learn';p.feedback='Let’s learn from this one. Review the worked solution below.';}}
 }
 return settle(r,now);
}
export function startRound(source,now){
 const r=structuredClone(source);
 if(r.status!=='lobby'||!Object.values(r.players).every(p=>p.uid))return r;
 r.status='playing';r.startedAt=now;return r;
}

// The host may transfer a code name between devices without resetting earned progress.
export function releasePlayer(source,name){
 const r=structuredClone(source),p=r.players?.[name];
 if(!p)return r;
 p.uid='';p.online=false;
 if(r.commands)delete r.commands[name];
 if(r.processed)delete r.processed[name];
 return r;
}
