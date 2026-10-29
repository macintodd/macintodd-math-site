import { reply } from '@/lib/slope-storage'
import { readConfig,unlock } from '@/lib/mathboard/config'
export const dynamic='force-dynamic'
const windows=new Map<string,{start:number;count:number}>()
export async function POST(request:Request){try{const ip=request.headers.get('x-forwarded-for')?.split(',')[0]??'local',now=Date.now();if(windows.size>2000)for(const [k,v]of windows)if(now-v.start>60000)windows.delete(k);const bucket=windows.get(ip);if(bucket&&now-bucket.start<60000){if(bucket.count>=60)return reply({error:'Too many attempts. Wait a minute, then ask your teacher for help.'},429);bucket.count++}else windows.set(ip,{start:now,count:1});const body=await request.json();const config=readConfig(String(body.token??'')),checkpoint=Number(body.checkpoint);return reply({grant:unlock(config,checkpoint,String(body.code??''),body.grants??{})})}catch(error){return reply({error:error instanceof Error?error.message:'Could not release this checkpoint.'},400)}}
