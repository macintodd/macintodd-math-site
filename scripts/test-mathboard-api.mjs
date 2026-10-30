import assert from 'node:assert/strict'
import {spawn} from 'node:child_process'
const password='local-api-test-teacher-password-only',origin='http://127.0.0.1:3099'
const app=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3099'],{env:{...process.env,RESULTS_TEACHER_PASSWORD:password},stdio:['ignore','pipe','pipe']})
async function post(path,body,auth){return fetch(origin+path,{method:'POST',headers:{'Content-Type':'application/json',...(auth?{Authorization:`Bearer ${auth}`}:{})},body:JSON.stringify(body)})}
try{
 await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Server did not start')),20000);app.stdout.on('data',data=>{if(data.toString().includes('Ready')){clearTimeout(timer);resolve()}});app.once('exit',()=>{clearTimeout(timer);reject(Error('Server exited'))})})
 const request={action:'create',hours:['3'],checkpoints:[]}
 assert.equal((await post('/api/mathboard/config',request)).status,410)
 const token='pool-session-1-v2'
 const publicResponse=await post('/api/mathboard/config',{token,grants:{}}),publicConfig=await publicResponse.json();assert.equal(publicResponse.status,200);assert.equal(publicResponse.headers.get('cache-control'),'no-store');assert.deepEqual(publicConfig,{hours:['1','2','3','4','5','6','7','8'],enabled:[true,true],released:[]});assert(!JSON.stringify(publicConfig).includes('Linear'))
 assert.equal((await post('/api/mathboard/release',{token,checkpoint:2,code:'Linear',grants:{}})).status,400)
 assert.equal((await post('/api/mathboard/release',{token,checkpoint:1,code:'incorrect',grants:{}})).status,400)
 const first=await (await post('/api/mathboard/release',{token,checkpoint:1,code:'Linear',grants:{}})).json();assert(first.grant)
 const second=await (await post('/api/mathboard/release',{token,checkpoint:2,code:'Linear',grants:{'1':first.grant}})).json();assert(second.grant)
 const resumed=await (await post('/api/mathboard/config',{token,grants:{'1':first.grant,'2':second.grant}})).json();assert.deepEqual(resumed.released,[1,2])
 assert.deepEqual((await (await post('/api/mathboard/config',{token,grants:{'1':'forged','2':'forged'}})).json()).released,[])
 assert.equal((await post('/api/slope/results',{anything:'still disabled'})).status,410)
 console.log('MathBoard API passed: setup retired, direct public lesson, no code disclosure, fixed Linear passcodes, checkpoint order, bad/forged codes, resume verification; slope collection still disabled.')
}finally{app.kill('SIGTERM')}
