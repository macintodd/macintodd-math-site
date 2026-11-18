import assert from 'node:assert/strict'
import fs from 'node:fs'
import katex from 'katex'
import {generate,checkAnswer,lattice,fraction,lineTex,isBanned} from '../public/cardclash/js/problems.js'
import {makeRound,question,applyCommand,startRound,settle,releasePlayer} from '../public/cardclash/js/round.js'
function answer(q){return Object.fromEntries(q.fields.map(f=>[f.key,f.type==='graph'?{points:[lattice(f.target)[0],lattice(f.target).at(-1)],drawn:true}:f.type==='point'?`(${f.target.x},${f.target.y})`:f.type==='equation'?lineTex(f.target).replace(/\\frac\{(\d+)\}\{(\d+)\}/g,'($1/$2)'):f.type==='expression'?`${fraction(Math.round(f.target.x*60),60)}a+(${fraction(Math.round(f.target.c*60),60)})`:typeof f.target==='number'?fraction(Math.round(f.target*600),600):f.target]))}
let count=0
for(const multipleChoice of [false,true])for(let category=1;category<=8;category++)for(let level=1;level<=4;level++)for(let seed=1;seed<=100;seed++){
 const q=generate(category,level,seed,{multipleChoice});assert.deepEqual(q,generate(category,level,seed,{multipleChoice}));assert(!isBanned(q));assert.equal(q.hints.length,2)
 for(const latex of [q.promptLatex,...q.solutionSteps].filter(Boolean))katex.renderToString(latex,{throwOnError:true})
 assert.equal(checkAnswer(q,answer(q)).status,'correct',`${category}/${level}/${seed}`)
 for(const f of q.fields)if(f.type==='choice')assert.equal(new Set(f.choices.map(c=>c.value)).size,f.choices.length)
 count++
}
const now=100000,seed=481
function playing(level=4){const r=makeRound(seed,8,level);r.players['fox-27'].uid='a';r.players['owl-42'].uid='b';return startRound(r,now)}
let id=0
function cmd(r,n,type,answers,at=now+1000){return applyCommand(r,n,{id:String(++id),roundId:r.id,type,...(answers?{answers}:{})},at)}
let r=playing();const correct=answer(question(r));r=cmd(r,'fox-27','answer',correct);assert.equal(r.status,'playing');r=cmd(r,'owl-42','answer',correct,now+2000);assert.equal(r.status,'review');assert.equal(r.players['fox-27'].points,6);assert.equal(r.players['owl-42'].points,5)
r=playing();r=cmd(r,'fox-27','hint');r=cmd(r,'fox-27','answer',{});assert.equal(r.players['fox-27'].misses,1);r=cmd(r,'owl-42','answer',answer(question(r)),now+1500);r=cmd(r,'fox-27','answer',answer(question(r)),now+2000);assert.equal(r.players['fox-27'].points,1)
r=playing(3);r=cmd(r,'fox-27','hint');r=cmd(r,'fox-27','hint');r=cmd(r,'fox-27','hint');assert.equal(r.players['fox-27'].hints,2);r=cmd(r,'fox-27','answer',answer(question(r)));r=settle(r,now+121000);assert.equal(r.players['fox-27'].points,2);assert.equal(r.players['owl-42'].points,0)
r=playing(1);r=cmd(r,'fox-27','hint');r=cmd(r,'owl-42','answer',answer(question(r)),now+500);r=cmd(r,'fox-27','answer',answer(question(r)),now+1000);assert.equal(r.players['fox-27'].points,0)
r=playing(2);r=cmd(r,'fox-27','answer',{});r=cmd(r,'fox-27','answer',{});assert.equal(r.players['fox-27'].done,true);r=cmd(r,'fox-27','answer',answer(question(r)));assert(!r.players['fox-27'].correct);r=settle(r,now+121000);assert.equal(r.players['fox-27'].points,0)
r=playing();const submission={id:'repeat',roundId:r.id,type:'hint'};r=applyCommand(r,'fox-27',submission,now+1);r=applyCommand(r,'fox-27',submission,now+2);assert.equal(r.players['fox-27'].hints,1);const old=structuredClone(r);r=applyCommand(r,'fox-27',{...submission,id:'old',roundId:'old-round'},now+3);assert.deepEqual(r,old);r=cmd(r,'fox-27','answer',answer(question(r)),now+121000);assert(!r.players['fox-27'].correct);assert.equal(r.status,'review')
r=makeRound(seed);assert.equal(startRound(r,now).status,'lobby');r=playing();r=settle(r,now+121000);const final=structuredClone(r);assert.deepEqual(settle(r,now+131000),final)
const q={fields:[{key:'n',type:'number',target:.5}]};assert.equal(checkAnswer(q,{n:'2/4'}).status,'simplify');assert.equal(checkAnswer(q,{n:'1/2'}).status,'correct')
assert.equal(checkAnswer({fields:[{key:'equation',type:'equation',form:true,target:{m:2,b:3}}]},{equation:'2y=4x+6'}).status,'form')
const rules=JSON.parse(fs.readFileSync('public/cardclash/database.rules.json'));assert.equal(rules.rules['.read'],false);assert.equal(rules.rules['.write'],false);assert(!JSON.stringify(rules).includes('numChildren'))
assert(!fs.readFileSync('public/cardclash/js/student.js','utf8').includes('firstName'));assert(!fs.readFileSync('public/cardclash/js/connection.js','utf8').includes('serviceAccount'))
console.log(`Passed ${count} deterministic generator/answer/LaTeX cases; scoring examples, two-attempt lockout, duplicate/stale commands, deadline enforcement, lobby gate and idempotent settlement. Rules parse checked; live rules enforcement still requires Firebase testing.`)

let transfer=playing();transfer=cmd(transfer,'fox-27','hint');transfer.commands={'fox-27':{id:'stale',roundId:transfer.id,type:'hint'}};const original=structuredClone(transfer);const released=releasePlayer(transfer,'fox-27');assert.equal(released.players['fox-27'].uid,'');assert.equal(released.players['fox-27'].online,false);assert.equal(released.players['fox-27'].hints,1);assert(!released.commands['fox-27']);assert(!released.processed['fox-27']);assert.deepEqual(transfer,original);assert.deepEqual(released.players['owl-42'],transfer.players['owl-42']);assert.equal(released.startedAt,transfer.startedAt);assert.deepEqual(releasePlayer(transfer,'missing'),transfer);console.log('Passed device transfer: old claim/commands cleared, progress/partner/timer preserved, source unchanged.');
