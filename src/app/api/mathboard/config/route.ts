import { teacherAuthorized, reply } from '@/lib/slope-storage'
import { makeConfig,readConfig,released } from '@/lib/mathboard/config'
export const dynamic='force-dynamic'
export async function POST(request:Request){try{const body=await request.json();if(body.action==='create'){if(!teacherAuthorized(request))return reply({error:'Teacher access required.'},401);const token=makeConfig(body.hours,body.checkpoints);return reply({token,path:`/apps/mathboard/session-1?lesson=${token}`})}const config=readConfig(String(body.token??''));return reply({hours:config.hours,enabled:config.checkpoints.map(c=>c.enabled),released:released(config,body.grants??{})})}catch{return reply({error:'The class lesson link or settings are invalid. Ask your teacher for the current link.'},400)}}
