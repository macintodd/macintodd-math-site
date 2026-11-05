import {formatTank,graphTimeMax,tankAt,tankEnd,type TankSetup} from '@/lib/tank-flow'
export default function TankGraph({setup,time}:{setup:TankSetup;time:number}){
 const maxT=graphTimeMax(setup,time),x=(t:number)=>78+t/maxT*440,y=(v:number)=>235-v/setup.capacity*190,end=Math.min(maxT,tankEnd(setup)),v=tankAt(setup,time)
 return <svg className="tank-visual" viewBox="0 0 600 300" role="img" aria-label={`Volume versus time graph. Starts at ${setup.initial} gallons. Current point: ${formatTank(time)} minutes, ${formatTank(v)} gallons.`}>
 {[0,1,2,3,4,5].map(i=><g key={i}><path d={`M 78 ${y(setup.capacity*i/5)} H 518 M ${x(maxT*i/5)} 45 V 235`} stroke="#d7e5ec"/><text x="67" y={y(setup.capacity*i/5)+4} textAnchor="end" fontSize="12" fill="#526b80">{formatTank(setup.capacity*i/5)}</text><text x={x(maxT*i/5)} y="257" textAnchor="middle" fontSize="12" fill="#526b80">{formatTank(maxT*i/5)}</text></g>)}
 <path d="M 78 35 V 235 H 528" fill="none" stroke="#526b80" strokeWidth="2"/><text x="78" y="25" fontSize="15" fontWeight="700" fill="#172b4a">V(t) · gallons</text><text x="300" y="289" textAnchor="middle" fontSize="14" fill="#172b4a">t · minutes</text>
 <path d={`M ${x(0)} ${y(setup.initial)} L ${x(end)} ${y(tankAt(setup,end))}`} fill="none" stroke="#90b6cc" strokeDasharray="7 6" strokeWidth="2"/>
 <path d={`M ${x(0)} ${y(setup.initial)} L ${x(time)} ${y(v)}`} fill="none" stroke="#1685a0" strokeWidth="4"/><path d={`M ${x(time)} 235 V ${y(v)} H 78`} fill="none" stroke="#b78234" strokeDasharray="4 4"/>
 <circle cx={x(0)} cy={y(setup.initial)} r="5" fill="#172b4a"/><circle cx={x(time)} cy={y(v)} r="7" fill="#d29b35" stroke="white" strokeWidth="2"/>
 <rect x={Math.max(85,Math.min(348,x(time)-75))} y={Math.max(40,Math.min(198,y(v)-43))} width="163" height="28" rx="7" fill="#fff9e9" stroke="#dfc28b"/><text x={Math.max(85,Math.min(348,x(time)-75))+81.5} y={Math.max(40,Math.min(198,y(v)-43))+19} textAnchor="middle" fontSize="12" fill="#172b4a">({formatTank(time)}, {formatTank(v)})</text>
 </svg>
}
