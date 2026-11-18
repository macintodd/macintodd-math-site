import {rng} from './problems.js';
import {makeRound,startRound,applyCommand,settle,releasePlayer} from './round.js';
const animals=['fox','owl','otter','lynx','panda','tiger','koala','badger','falcon','gecko','eagle','bison','raven','heron','lemur','moose','robin','zebra','whale','shark','finch','crane','camel','dingo','horse','mouse','sloth','quail','goose','yak','ibis','manta','seal','wolf','hare','fawn','kiwi','newt','orca','wren'];
const clone=source=>structuredClone(source);
export function makeClassroom(seed,count=36,seconds=120){
 if(!Number.isInteger(count)||count<2||count>40)throw Error('Choose between 2 and 40 code names.');
 const random=rng(seed),players={};for(const animal of animals.slice(0,count))players[`${animal}-${10+Math.floor(random()*90)}`]={uid:'',online:false,points:0,correctCount:0,roundsPlayed:0,streak:0,bestStreak:0};
 return {mode:'classroom',id:'lobby',status:'lobby',roundNumber:0,seconds,players,processed:{},history:{},createdAt:Date.now()};
}
export function connected(room){return Object.entries(room.players||{}).filter(([,p])=>p.uid&&p.online).map(([name])=>name);}
export function standings(room){return Object.entries(room.players||{}).filter(([,p])=>p.uid||p.correctCount||p.points||p.roundsPlayed).sort((a,b)=>b[1].points-a[1].points||b[1].correctCount-a[1].correctCount||a[0].localeCompare(b[0]));}
export function beginRound(source,category,level,now,seed){
 const room=clone(source);if(room.paused)return room;if(!['lobby','review','difficulty'].includes(room.status)||!Number.isInteger(category)||category<1||category>8||!Number.isInteger(level)||level<1||level>4)return room;
 const names=connected(room);if(names.length<2)return room;
 const round=makeRound(seed,category,level,room.seconds);round.id=`${room.roundNumber+1}-${seed}`;round.seed=seed;round.players=Object.fromEntries(names.map(name=>[name,{uid:room.players[name].uid,online:true,points:0}]));
 room.round=startRound(round,now);room.roundNumber++;room.id=round.id;room.status='playing';room.showNames=false;room.processed={};room.commands={};delete room.spin;delete room.nextSpinner;delete room.phaseStartedAt;delete room.paused;return room;
}
function finalize(source,now){
 const room=source;if(room.status!=='playing'||!room.round)return room;
 room.round=settle(room.round,now);if(room.round.status!=='review')return room;
 room.status='review';const results={};
 for(const [name,p] of Object.entries(room.round.players)){
  const person=room.players[name];person.points=(person.points||0)+p.points;person.roundsPlayed=(person.roundsPlayed||0)+1;person.correctCount=(person.correctCount||0)+(p.correct?1:0);person.streak=p.correct?(person.streak||0)+1:0;person.bestStreak=Math.max(person.bestStreak||0,person.streak);results[name]={points:p.points,correct:!!p.correct,hints:p.hints||0,checks:p.checks||0};
 }
 const best=Object.entries(room.round.players).filter(([,p])=>p.correct).sort((a,b)=>b[1].points-a[1].points||a[1].finishedAt-b[1].finishedAt||a[0].localeCompare(b[0]));
 room.nextSpinner=best[0]?.[0]||'';room.history??={};room.history[room.id]={number:room.roundNumber,category:room.round.category,level:room.round.level,winner:room.nextSpinner,results,completedAt:now};return room;
}
export function selection(source,now){const room=clone(source);if(room.status!=='review')return room;room.status='spinReady';room.phaseStartedAt=now;return room;}
export function spin(source,now,seed){
 const room=clone(source);if(room.status!=='spinReady'||room.paused)return room;const names=connected(room),random=rng(seed);const category=1+Math.floor(random()*8),chooser=names.length?names[Math.floor(random()*names.length)]:'';
 room.spin={category,chooser,startedAt:now,duration:6500,angle:360*6+360-(category-.5)*45};room.status='spinning';return room;
}
export function tickClassroom(source,now,seed){
 let room=clone(source);if(room.paused)return room;
 if(room.status==='playing')room=finalize(room,now);
 if(room.status==='spinning'&&now>=room.spin.startedAt+room.spin.duration){
  room.status='difficulty';room.phaseStartedAt=now;
  const names=connected(room);if(!names.includes(room.spin.chooser))room.spin.chooser=names.length?names[Math.floor(rng(seed)()*names.length)]:'';
 }
 if(room.status==='difficulty'&&now>=room.phaseStartedAt+30000&&connected(room).length>=2)room=beginRound(room,room.spin.category,2,now,seed);
 return room;
}
export function commandClassroom(source,name,command,now,seed){
 let room=clone(source);const person=room.players?.[name];if(!person?.uid||!command||typeof command.id!=='string'||command.roundId!==room.id||room.processed?.[name]===command.id)return room;
 if(!['answer','hint','spin','difficulty'].includes(command.type))return room;
 room.processed??={};room.processed[name]=command.id;
 if(room.paused)return room;
 if(command.type==='spin'&&room.status==='spinReady'&&name===room.nextSpinner)return spin(room,now,seed);
 if(command.type==='difficulty'&&room.status==='difficulty'&&name===room.spin.chooser)return beginRound(room,room.spin.category,command.difficulty,now,seed);
 if(room.status!=='playing'||!room.round.players[name]||!['answer','hint'].includes(command.type))return room;
 room.round=applyCommand(room.round,name,command,now);return finalize(room,now);
}
export function endRound(source,now){const room=clone(source);if(room.status!=='playing'||room.paused)return room;for(const p of Object.values(room.round.players))if(!p.done){p.done=true;p.outcome='Round ended';p.finishedAt=now;}return finalize(room,now);}
export function pauseClassroom(source,now){const room=clone(source);if(room.paused||!['playing','spinning','difficulty','spinReady'].includes(room.status))return room;room.paused={at:now};return room;}
export function resumeClassroom(source,now){const room=clone(source);if(!room.paused)return room;const delta=Math.max(0,now-room.paused.at);if(room.status==='playing')room.round.startedAt+=delta;if(room.status==='spinning')room.spin.startedAt+=delta;if(room.phaseStartedAt)room.phaseStartedAt+=delta;delete room.paused;return room;}
export function finishClassroom(source,now){let room=clone(source);if(room.paused)room=resumeClassroom(room,now);if(room.status==='playing')room=endRound(room,now);room.status='ended';room.showNames=false;room.completedAt=now;delete room.paused;return room;}
export function releaseClassPlayer(source,name){return releasePlayer(source,name);}
