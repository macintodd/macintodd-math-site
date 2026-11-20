import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import * as model from '../public/surveys/model.js';
const require=createRequire(process.env.SURVEY_TEST_DOM ?? '/private/tmp/card-clash-test-dom/package.json');
const {parseHTML}=require('linkedom');
assert(model.classCodeMatches(' APcalc '));assert(!model.classCodeMatches('wrong'));
assert.equal(model.voteFromCookie('x=B; '+model.cookieName+'=A'),'A');
assert.equal(model.voteFromCookie(model.cookieName+'=C'),null);
assert.match(model.voteCookie('B'),/Secure/);assert(!model.voteCookie('B',false).includes('Secure'));
assert.deepEqual(model.voteTotals({x:'A',y:'B',z:'B',bad:'C'}),{A:1,B:2,total:3,percentA:33,percentB:67});assert.equal(model.voteTotals(null).total,0);
const original=JSON.parse(fs.readFileSync('public/cardclash/database.rules.json'));
const rules=JSON.parse(fs.readFileSync('docs/apcalc-survey.rules.json'));
assert.deepEqual(rules.rules.cardClashRounds,original.rules.cardClashRounds);assert.equal(rules.rules['.write'],false);
const html=fs.readFileSync('public/surveys/apcalc.html','utf8');
const source=fs.readFileSync('public/surveys/survey.js','utf8').replace(/^import .*;$/gm,'');
function harness(cookie=''){
 const {window,document}=parseHTML(html);document.cookie=cookie;let callbacks,calls=0,writes=0,resolveVote;
 const context={...model,window,document,location:{protocol:'https:'},friendlyError:()=> 'Connection unavailable',connectPoll:async c=>{calls++;callbacks=c;return {close(){},vote(choice){writes++;return new Promise(r=>{resolveVote=()=>r({choice})})}}}};
 vm.runInNewContext(source,context);
 const $=id=>document.getElementById(id),flush=()=>new Promise(r=>setImmediate(r));
 const click=el=>el.dispatchEvent(new window.Event('click'));
 async function join(code){$('class-code').value=code;$('join-form').dispatchEvent(new window.Event('submit',{cancelable:true}));await flush()}
 return {$,click,join,flush,get calls(){return calls},get writes(){return writes},get callbacks(){return callbacks},resolve(){resolveVote()},document};
}
const h=harness();await h.join('bad');assert.equal(h.calls,0);await h.join('APcalc');assert.equal(h.calls,1);h.callbacks.onConnection(true);h.callbacks.onVotes({},null);assert.equal(h.$('total').textContent,'0 votes total');
h.click(h.document.querySelector('[data-choice="A"]'));h.click(h.$('submit'));h.click(h.$('submit'));assert.equal(h.writes,1);assert(!h.document.cookie.includes(model.cookieName));h.resolve();await h.flush();assert.match(h.document.cookie,/=A;/);assert(h.$('submit').disabled);
h.callbacks.onVotes({one:'A',two:'B',three:'B'},'A');assert.equal(h.$('total').textContent,'3 votes total');assert.equal(h.$('count-B').textContent,'2');
const reload=harness(model.cookieName+'=A');await reload.join('APcalc');reload.callbacks.onConnection(true);reload.callbacks.onVotes({one:'A'},null);reload.click(reload.$('submit'));assert.equal(reload.writes,0);assert(reload.$('submit').disabled);
const recovered=harness();await recovered.join('APcalc');recovered.callbacks.onVotes({one:'B'},'B');assert.match(recovered.document.cookie,/=B;/);assert(recovered.$('submit').disabled);
const failed=harness();await failed.join('APcalc');failed.callbacks.onError(Error('denied'));assert(failed.$('submit').disabled);assert.equal(failed.$('retry').hidden,false);assert.equal(failed.document.cookie,'');
console.log('PASS: survey code, cookie, totals, immutable vote UI, live chart, reconnect errors, existing vote recovery, and preserved game rules');
