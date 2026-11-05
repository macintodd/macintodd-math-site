'use client'
import {useEffect,useRef} from 'react'
import {goatRoute} from '@/lib/point-slope-celebration'
import {playGoatBleat} from '@/lib/goat-sound'
import type {IntroProblem} from '@/lib/intro-point-slope'
export default function GoatSurprise({problem,start,clipId,sx,sy,sound}:{problem:IntroProblem;start:number;clipId:string;sx:(x:number)=>number;sy:(y:number)=>number;sound:boolean}){
 const mounted=useRef<number|null>(null)
 const r=goatRoute(problem)
 useEffect(()=>{mounted.current??=performance.now();if(!sound||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const delay=(start+2.16)*1000-(performance.now()-mounted.current);if(delay<0)return;let stop=()=>{};const timer=setTimeout(()=>{stop=playGoatBleat()},delay);return ()=>{clearTimeout(timer);stop()}},[start,sound])
 const times=Array.from({length:55},(_,i)=>i/54),poses=times.map((t,i)=>t>=.27&&t<=.43||t>=.68&&t<=.84?0:i%2),bubbleY=Math.max(-68,65-sy(r.second.y))
 return <g clipPath={`url(#${clipId})`} className="goat-surprise" aria-hidden="true"><g opacity="0"><set attributeName="opacity" to="1" begin={`${start}s`} fill="freeze"/><set attributeName="opacity" to="0" begin={`${start+8}s`} fill="freeze"/><animateTransform attributeName="transform" type="translate" values={[r.start,r.first,r.first,r.second,r.second,r.exit].map(p=>`${sx(p.x)} ${sy(p.y)}`).join(';')} keyTimes="0;.27;.43;.68;.84;1" dur="8s" begin={`${start}s`} fill="freeze"/>
 <g transform={`rotate(${r.angle}) scale(${r.facing},1)`}>{[0,1].map(pose=><g key={pose} opacity={pose===0?1:0}><animate attributeName="opacity" values={poses.map(p=>p===pose?1:0).join(';')} keyTimes={times.join(';')} calcMode="discrete" dur="8s" begin={`${start}s`} fill="freeze"/><svg x="-43" y="-82" width="86" height="86" viewBox={`${pose*512} 0 512 512`}><image href="/images/goat-sprites.png" width="1024" height="512"/></svg></g>)}</g>
 <g opacity="0" transform={`translate(0,${bubbleY})`}><set attributeName="opacity" to="1" begin={`${start+5.44}s`} fill="freeze"/><path d="M -67 -20 H 67 Q 75 -20 75 -12 V 10 Q 75 18 67 18 H 8 L 0 32 L -4 18 H -67 Q -75 18 -75 10 V -12 Q -75 -20 -67 -20 Z" fill="#fffdf4" stroke="#172b4a" strokeWidth="2"/><text textAnchor="middle" y="5" fontSize="17" fontWeight="800" fill="#172b4a">{r.label}</text></g>
 <g opacity="0"><set attributeName="opacity" to="1" begin={`${start+2.16}s`} fill="freeze"/><set attributeName="opacity" to="0" begin={`${start+3.44}s`} fill="freeze"/><text x="0" y="-85" textAnchor="middle" fontSize="15" fontWeight="800" fill="#172b4a" stroke="white" strokeWidth="3" paintOrder="stroke">Baa-a-a!</text></g>
 </g></g>
}
