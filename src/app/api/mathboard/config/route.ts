import { reply } from '@/lib/slope-storage'
import {readConfig,released} from '@/lib/mathboard/config'
export const dynamic='force-dynamic'
export async function POST(request:Request){try{const body=await request.json();if(body.action==='create')return reply({error:'Setup is no longer required. Open the lesson directly.'},410);const config=readConfig();return reply({hours:config.hours,enabled:[true,true],released:released(config,body.grants??{})})}catch{return reply({error:'Could not load lesson settings. Please try again.'},400)}}
