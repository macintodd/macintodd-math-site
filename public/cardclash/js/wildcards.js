export const WILD_CARDS=[
 {kind:'everyone',title:'A point for your classmates!',description:'Everyone except the spinner gets 1 point.',automatic:true},
 {kind:'giveFive',title:'Pass out 5 points',description:'Tap classmates to give out 5 points. Use the trash button to undo a row.',budget:5,mode:'give'},
 {kind:'transfer',title:'Share the lead',description:'One point moves from the top score to the lowest score.',automatic:true},
 {kind:'giveTwo',title:'Give a classmate 2 points',description:'Choose one classmate to receive 2 points.',budget:2,mode:'single'},
 {kind:'takeThree',title:'Take away 3 points',description:'Remove a total of 3 points from other players. Scores never go below zero.',budget:3,mode:'take'}
];
export const WILD_GRACE=1500;
export function cardFor(kind){return WILD_CARDS.find(card=>card.kind===kind);}
export function wildParticipants(room){return Object.entries(room.players||{}).filter(([,p])=>p.uid||p.roundsPlayed||p.points).sort((a,b)=>(b[1].points||0)-(a[1].points||0)||(b[1].correctCount||0)-(a[1].correctCount||0)||a[0].localeCompare(b[0]));}
export function cleanAllocation(room,wild,input){
 let value=input;if(typeof input==='string'){if(input.length>4096)return null;try{value=JSON.parse(input);}catch{return null;}}
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length>40)return null;
 const card=cardFor(wild.kind),allowed=new Set(wildParticipants(room).map(([name])=>name)),draft={};let total=0;
 for(const [name,amount]of Object.entries(value)){
  if(!Number.isInteger(amount)||amount<0||amount>card.budget||!allowed.has(name)||name===wild.actor)return null;
  if(amount===0)continue;
  if(card.mode==='take'&&amount>(room.players[name].points||0))return null;
  if(card.mode==='single'&&amount!==2)return null;
  draft[name]=amount;total+=amount;
 }
 if(total>card.budget||card.mode==='single'&&Object.keys(draft).length>1)return null;
 return draft;
}
function changes(room,id,kind,actor,deltas,now){
 if(room.bonusLog?.[id])return;
 const applied={};for(const [name,delta]of Object.entries(deltas)){const p=room.players[name];if(!p)continue;p.mathPoints??=p.points||0;p.bonusPoints??=0;const next=Math.max(0,(p.points||0)+delta),actual=next-(p.points||0);if(actual){p.points=next;p.bonusPoints+=actual;applied[name]=actual;}}
 room.bonusLog??={};room.bonusLog[id]={kind,actor,changes:applied,at:now};return applied;
}
export function returnToSpinner(room,now){room.nextSpinner=room.wildcard?.actor||room.nextSpinner||'';room.status='spinReady';room.phaseStartedAt=now;delete room.spin;delete room.wildcard;return room;}
export function startWild(room,now){
 const definition=cardFor(room.spin.wildKind),actor=room.spin.actor,wild={id:room.spin.id,kind:definition.kind,actor,startedAt:now,duration:definition.automatic?6500:20000,revision:0,draft:{}};
 room.wildcard=wild;room.status='wildcard';
 if(definition.automatic){const people=wildParticipants(room),deltas={};if(definition.kind==='everyone')for(const [name]of people)if(name!==actor)deltas[name]=1;
  if(definition.kind==='transfer'&&people.length>=2){const first=people[0],last=people.at(-1);if((first[1].points||0)>(last[1].points||0)){deltas[first[0]]=-1;deltas[last[0]]=1;}}
  const applied=changes(room,wild.id,wild.kind,actor,deltas,now)||{};room.lastWild={kind:wild.kind,actor,changes:applied,unused:0,at:now};wild.applied=true;
 }
 return room;
}
export function commitWild(room,now){
 const wild=room.wildcard,definition=cardFor(wild.kind);if(!definition.automatic){const draft=cleanAllocation(room,wild,wild.draft)||{},deltas=Object.fromEntries(Object.entries(draft).map(([name,n])=>[name,definition.mode==='take'?-n:n]));const applied=changes(room,wild.id,wild.kind,wild.actor,deltas,now)||{};const used=Object.values(applied).reduce((a,n)=>a+Math.abs(n),0);room.lastWild={kind:wild.kind,actor:wild.actor,changes:applied,unused:definition.budget-used,at:now};}
 return returnToSpinner(room,now);
}
export function wildDueAt(room){if(!room.wildcard)return Infinity;return room.wildcard.startedAt+room.wildcard.duration+(cardFor(room.wildcard.kind).automatic?0:WILD_GRACE);}
export function wildAction(room,name,command,now,teacher=false){
 const wild=room.wildcard;if(room.status!=='wildcard'||room.paused||!wild||command.wildId!==wild.id||!teacher&&name!==wild.actor)return room;
 const card=cardFor(wild.kind);
 if(card.automatic){if(command.spinAction==='continue')return commitWild(room,now);return room;}
 if(!['draft','award'].includes(command.spinAction))return room;
 const deadline=wild.startedAt+wild.duration,sent=command.wildSentAt;
 // UI input closes at 20 seconds; a short delivery grace accepts already-sent drafts.
 const client=command.wildClientAt,lateFinger=Number.isFinite(client)&&client>=wild.startedAt&&client<=deadline&&sent>=client-1000&&sent<=deadline+WILD_GRACE;
 const deliveredInTime=Number.isFinite(sent)&&sent>=wild.startedAt&&(sent<=deadline||lateFinger)&&sent<=now+1000;
 if(!teacher&&now>deadline&&!deliveredInTime)return room;
 const revision=command.wildRevision;
 if(!Number.isSafeInteger(revision)||revision<=(wild.revision||0))return room;
 const draft=cleanAllocation(room,wild,command.wildAllocations);if(!draft)return room;
 wild.draft=draft;wild.revision=revision;
 if(command.spinAction==='award')return commitWild(room,now);
 return room;
}
