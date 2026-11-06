'use client'
import GoatSurprise from '../intro-point-slope/GoatSurprise'
import {skierRoute,goatRoute} from '@/lib/point-slope-celebration'
import type {IntroProblem} from '@/lib/intro-point-slope'
import type {StreakScene} from '@/lib/write-linear'
type Props={scene:StreakScene;problem:IntroProblem;start:number;clipId:string;sx:(x:number)=>number;sy:(y:number)=>number;sound:boolean}
const captions={skier:'Nice slope!',goat:'Goat for it!',chase:'Hey! Wait for me!', 'goat-skis':'Now THAT is slope style!',haggard:'Five in a row... worth the climb!',ride:'Six in a row! Teamwork!'}
/** All travel follows the solved line. Chase actors use the same route, offset in time. */
export default function StudentSurprise({scene,problem,start,clipId,sx,sy,sound}:Props){
 if(scene==='goat')return <GoatSurprise problem={problem} start={start} clipId={clipId} sx={sx} sy={sy} sound={sound}/>
 const ski=skierRoute(problem),goat=goatRoute(problem),up=scene==='haggard',from=up?goat.start:ski.landing,to=up?goat.exit:ski.exit,duration=up?6:5.2
 const sprite=(kind:'skier'|'goat'|'goat-skis'|'haggard'|'ride')=>{
  if(kind==='skier'||kind==='goat')return <svg x="-48" y="-88" width="96" height="96" viewBox={`${kind==='skier'?512:0} 0 512 512`}><image href={`/images/${kind==='skier'?'skier':'goat'}-sprites.png`} width="1024" height="512"/></svg>
  const cells=kind==='haggard'?[[0,0],[512,0]]:kind==='goat-skis'?[[0,512],[512,512]]:[[1024,512]]
  return cells.map(([x,y],i)=><g key={i} opacity={i===0?1:0}>{cells.length===2&&<animate attributeName="opacity" values={i===0?'1;0;1':'0;1;0'} calcMode="discrete" dur=".55s" repeatCount="indefinite"/>}<svg x="-57" y="-102" width="114" height="114" viewBox={`${x} ${y} 512 512`}><image href="/images/linear-streak-characters.png" width="1536" height="1024"/></svg></g>)
 }
 const actor=(kind:'skier'|'goat'|'goat-skis'|'haggard'|'ride',delay:number)=> <g opacity="0"><set attributeName="opacity" to="1" begin={`${delay}s`} fill="freeze"/><set attributeName="opacity" to="0" begin={`${delay+duration}s`} fill="freeze"/><animateTransform attributeName="transform" type="translate" values={`${sx(from.x)} ${sy(from.y)};${sx(to.x)} ${sy(to.y)}`} begin={`${delay}s`} dur={`${duration}s`} fill="freeze"/>
 <g transform={`rotate(${ski.angle}) scale(${up?goat.facing:ski.facing},1)`}><g className="wl-surprise-bob">{sprite(kind)}</g></g>
 {kind!=='goat'&&<g transform="translate(0,-112)"><rect x="-125" y="-24" width="250" height="44" rx="12" fill="#fffbea" stroke="#172b4a" strokeWidth="1.5"/><path d="M -5 20 L 0 30 L 8 20" fill="#fffbea" stroke="#172b4a"/><text textAnchor="middle" y="3" fontSize="13" fontWeight="800" fill="#172b4a">{captions[scene]}</text></g>}</g>
 return <g className="wl-student-surprise" clipPath={`url(#${clipId})`} aria-hidden="true" data-scene={scene}>
 {actor(scene==='chase'?'skier':scene,start)}{scene==='chase'&&actor('goat',start+.8)}
 </g>
}
