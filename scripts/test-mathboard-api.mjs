import assert from 'node:assert/strict'
import {spawn} from 'node:child_process'
const password='local-api-test-teacher-password-only',origin='http://127.0.0.1:3099'
const app=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3099'],{env:{...process.env,RESULTS_TEACHER_PASSWORD:password},stdio:['ignore','pipe','pipe']})
async function post(path,body,auth){return fetch(origin+path,{method:'POST',headers:{'Content-Type':'application/json',...(auth?{Authorization:`Bearer ${auth}`}:{})},body:JSON.stringify(body)})}
try{
 await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Server did not start')),20000);app.stdout.on('data',data=>{if(data.toString().includes('Ready')){clearTimeout(timer);resolve()}});app.once('exit',()=>{clearTimeout(timer);reject(Error('Server exited'))})})
 const request={action:'create',hours:['3','6'],checkpoints:[{enabled:true,code:'ONLY-FIRST-123'},{enabled:true,code:'ONLY-SECOND-456'}]}
 assert.equal((await post('/api/mathboard/config',request)).status,401);assert.equal((await post('/api/mathboard/config',request,'wrong')).status,401)
 const created=await post('/api/mathboard/config',request,password);assert.equal(created.status,200);assert.equal(created.headers.get('cache-control'),'no-store');const {token}=await created.json()
 const publicResponse=await post('/api/mathboard/config',{token,grants:{}}),publicConfig=await publicResponse.json();assert.deepEqual(publicConfig,{hours:['3','6'],enabled:[true,true],released:[]});assert(!JSON.stringify(publicConfig).includes('ONLY-FIRST'));assert(!JSON.stringify(publicConfig).includes('hash'))
 assert.equal((await post('/api/mathboard/release',{token,checkpoint:2,code:'ONLY-SECOND-456',grants:{}})).status,400)
 assert.equal((await post('/api/mathboard/release',{token,checkpoint:1,code:'incorrect',grants:{}})).status,400)
 const first=await (await post('/api/mathboard/release',{token,checkpoint:1,code:'ONLY-FIRST-123',grants:{}})).json();assert(first.grant)
 const second=await (await post('/api/mathboard/release',{token,checkpoint:2,code:'ONLY-SECOND-456',grants:{'1':first.grant}})).json();assert(second.grant)
 const resumed=await (await post('/api/mathboard/config',{token,grants:{'1':first.grant,'2':second.grant}})).json();assert.deepEqual(resumed.released,[1,2])
 assert.deepEqual((await (await post('/api/mathboard/config',{token,grants:{'1':'forged','2':'forged'}})).json()).released,[])
 assert.equal((await post('/api/slope/results',{anything:'still disabled'})).status,410)
 console.log('MathBoard API passed: teacher authorization, encrypted class links, no code disclosure, checkpoint order, bad/forged codes, resume verification; slope collection still disabled.')
}finally{app.kill('SIGTERM')}
