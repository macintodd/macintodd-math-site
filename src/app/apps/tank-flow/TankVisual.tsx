import {formatTank,tankRate,type TankSetup} from '@/lib/tank-flow'
export default function TankVisual({setup,volume,running}:{setup:TankSetup;volume:number;running:boolean}){
 const level=335-260*volume/setup.capacity,inOpen=running&&setup.inlet>0,outOpen=running&&setup.outlet>0
 return <svg className="tank-visual" viewBox="0 0 600 420" role="img" aria-label={`Tank contains ${formatTank(volume)} of ${formatTank(setup.capacity)} gallons. Inlet ${setup.inlet} gallons per minute; drain ${setup.outlet} gallons per minute. ${running?'Valves open.':'Valves closed.'}`}>
 <defs><linearGradient id="tank-water" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#5dd8ec"/><stop offset="1" stopColor="#1288b1"/></linearGradient><clipPath id="tank-vessel"><rect x="150" y="75" width="280" height="260" rx="18"/></clipPath></defs>
 <path d="M 28 118 H 100 V 48 H 220 V 87" fill="none" stroke="#9aafbf" strokeWidth="23" strokeLinejoin="round"/><path d="M 28 118 H 100 V 48 H 220 V 87" fill="none" stroke="#e1eaf0" strokeWidth="14" strokeLinejoin="round"/>
 <rect x="150" y="75" width="280" height="260" rx="18" fill="#eaf5fa" stroke="#52758f" strokeWidth="4"/>
 <g clipPath="url(#tank-vessel)"><rect x="150" y={level} width="280" height={335-level} fill="url(#tank-water)"/>{volume>0&&<path d={`M 150 ${level+2} Q 220 ${level-3} 290 ${level+2} T 430 ${level+2}`} stroke="#d5f8ff" strokeWidth="3" fill="none"/>}<path d="M 165 95 V 310" stroke="#ffffff70" strokeWidth="7" strokeLinecap="round"/>{inOpen&&<path className="tank-stream" d={`M 220 78 V ${Math.max(90,level)}`} stroke="#20acd0" strokeWidth="12" strokeDasharray="12 7"/>}</g>
 <path d="M 380 335 V 355 H 530 V 378" fill="none" stroke="#9aafbf" strokeWidth="23" strokeLinejoin="round"/><path d="M 380 335 V 355 H 530 V 378" fill="none" stroke="#e1eaf0" strokeWidth="14" strokeLinejoin="round"/>{outOpen&&<path className="tank-stream" d="M 530 375 V 410" stroke="#20acd0" strokeWidth="12" strokeDasharray="12 7"/>}
 <g transform="translate(160,48)"><circle r="21" fill={inOpen?'#2d899b':'#d59545'} stroke="#fff" strokeWidth="3"/><path d="M -13 0 H 13 M 0 -13 V 13" stroke="white" strokeWidth="4" transform={`rotate(${inOpen?45:0})`}/></g>
 <g transform="translate(485,355)"><circle r="21" fill={outOpen?'#2d899b':'#d59545'} stroke="#fff" strokeWidth="3"/><path d="M -13 0 H 13 M 0 -13 V 13" stroke="white" strokeWidth="4" transform={`rotate(${outOpen?45:0})`}/></g>
 <text x="27" y="177" fontSize="13" fill="#526b80">INLET</text><text x="27" y="199" fontSize="17" fontWeight="700" fill="#172b4a">{formatTank(setup.inlet)}</text><text x="27" y="218" fontSize="12" fill="#526b80">gal/min</text>
 <text x="471" y="234" fontSize="13" fill="#526b80">DRAIN</text><text x="471" y="257" fontSize="17" fontWeight="700" fill="#172b4a">{formatTank(setup.outlet)}</text><text x="471" y="276" fontSize="12" fill="#526b80">gal/min</text>
 {[0,.25,.5,.75,1].map(f=><g key={f}><path d={`M 435 ${335-f*260} h 10`} stroke="#668397"/><text x="442" y={331-f*260} fontSize="10" fill="#526b80">{formatTank(setup.capacity*f)}</text></g>)}
 <rect x="192" y="185" width="196" height="70" rx="15" fill="#ffffffec"/><text x="290" y="216" textAnchor="middle" fontSize="27" fontWeight="800" fill="#172b4a">{formatTank(volume)}</text><text x="290" y="239" textAnchor="middle" fontSize="13" fill="#526b80">gallons</text>
 <text x="290" y="400" textAnchor="middle" fontSize="14" fontWeight="650" fill="#172b4a">{tankRate(setup)>0?'Filling':tankRate(setup)<0?'Draining':'Balanced flow'} · {formatTank(Math.abs(tankRate(setup)))} gal/min net</text>
 </svg>
}
