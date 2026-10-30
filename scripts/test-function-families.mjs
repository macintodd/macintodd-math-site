import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
const html=fs.readFileSync('public/widgets/function-families.html','utf8')
const elements=new Map(),choices=[],identities=[]
function element(){const classes=new Set();return {value:'',textContent:'',innerHTML:'',disabled:false,dataset:{},className:'',offsetWidth:100,classList:{add:k=>classes.add(k),remove:k=>classes.delete(k),toggle:(k,on)=>on?classes.add(k):classes.delete(k)},appendChild:b=>choices.push(b),prepend:b=>identities.push(b),blur(){},getContext(){return new Proxy({},{get:()=>()=>{}})},toDataURL:()=> 'data:image/png;base64,test'}}
const get=id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id)}
let now=0
const context=vm.createContext({console,Math,Date,isFinite,performance:{now:()=>now},requestAnimationFrame:()=>{},window:{devicePixelRatio:1},document:{getElementById:get,createElement:element,activeElement:element(),querySelectorAll:s=>s==='.choice'?choices:Array.from({length:5},element)}})
let script=html.match(/<script>([\s\S]*?)<\/script>/)[1]
// Expose the actual isolated widget closure only inside this test process.
script=script.replace(/\}\)\(\);\s*$/,`globalThis.app={showIntro,newQuestion,choose,tick,drawGraph,equationHTML,get snapshot(){return {Q,state,score,correct,attempted,remaining,running,results,playerName,playerHour}},families:FAMS};})();`)
vm.runInContext(script,context)
const app=context.app
get('firstName').value='Demo';get('lastName').value='Student';get('classHour').value='6'
get('nameForm').onsubmit({preventDefault(){}})
assert.equal(app.snapshot.playerName,'Demo Student');assert.equal(app.snapshot.playerHour,'6');assert.equal(identities.length,5)
for(const fam of app.families){app.drawGraph({fam,a:-2,h:3,k:1,form:'vertex'});assert.match(app.equationHTML({fam,a:-2,h:3,k:1,form:'vertex'}),/<i>y<\/i> =/)}
for(let level=0;level<3;level++){
 if(level) get('nextLevelBtn').onclick()
 get('goBtn').onclick()
 assert.equal(app.snapshot.running,true)
 assert.equal(app.snapshot.Q.mode,level===0?'graph':level===1?'eq':app.snapshot.Q.mode)
 let previous=app.snapshot.Q.fam
 const correctButton=choices.find(b=>b.dataset.fam===previous)
 app.choose(previous,correctButton)
 assert.equal(app.snapshot.score,10);assert.equal(app.snapshot.correct,1);assert.equal(app.snapshot.attempted,1)
 get('nextBtn').onclick();assert.notEqual(app.snapshot.Q.fam,previous)
 const wrong=choices.find(b=>b.dataset.fam!==app.snapshot.Q.fam)
 app.choose(wrong.dataset.fam,wrong)
 assert.equal(app.snapshot.running,false)
 const paused=app.snapshot.remaining;now+=5000;app.tick(now);assert.equal(app.snapshot.remaining,paused)
 get('dismissBtn').onclick();assert.equal(app.snapshot.running,true)
 now+=60001;app.tick(now)
 assert.equal(app.snapshot.state,'over');assert.equal(app.snapshot.results[level].score,10);assert.equal(app.snapshot.results[level].attempted,2)
}
get('nextLevelBtn').onclick()
assert.match(get('finalWho').textContent,/Demo Student · Hour 6/)
assert.match(get('finalTitle').textContent,/30/)
get('shotBtn').onclick();assert.match(get('shotImg').src,/^data:image\/png/);assert.match(get('shotDl').download,/Demo_Student/)
get('playAgainBtn').onclick();assert.equal(app.snapshot.score,0);assert.equal(app.snapshot.results.every(r=>r===null),true)
assert(!/\b(?:fetch|XMLHttpRequest|localStorage|sessionStorage|sendBeacon)\b/.test(script),'No networking or browser persistence')
console.log('Passed: all seven families; graph/equation/mixed rounds; scoring, paused clock, replay, named/hour results and local PNG export.')
