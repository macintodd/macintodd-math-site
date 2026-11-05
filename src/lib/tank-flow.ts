export type TankSetup={initial:number;inlet:number;outlet:number;capacity:number}
export const defaultTank:TankSetup={initial:500,inlet:20,outlet:40,capacity:1000}
export function tankRate(s:TankSetup){return Number((s.inlet-s.outlet).toFixed(2))}
export function tankEnd(s:TankSetup){const rate=tankRate(s);return rate>0?(s.capacity-s.initial)/rate:rate<0?s.initial/-rate:Infinity}
export function tankAt(s:TankSetup,minutes:number){if(Number.isFinite(tankEnd(s))&&minutes>=tankEnd(s))return tankRate(s)>0?s.capacity:0;return Math.max(0,Math.min(s.capacity,s.initial+tankRate(s)*Math.max(0,minutes)))}
export function advanceTank(s:TankSetup,minutes:number,delta:number){const end=tankEnd(s);const time=Math.max(0,Math.min(end,minutes+Math.max(0,delta)));return {time,volume:tankAt(s,time),done:Number.isFinite(end)&&time>=end}}
export function formatTank(n:number){if(n!==0&&Math.abs(n)<.01)return n.toLocaleString('en-US',{maximumSignificantDigits:3});return Number(n.toFixed(2)).toLocaleString('en-US',{maximumFractionDigits:2})}
export function tankEquation(s:TankSetup){const rate=tankRate(s);return `V(t)=${s.initial}${rate===0?'':`${rate<0?'-':'+'}${Math.abs(rate)}t`}`}
export function updateTank(s:TankSetup,field:keyof TankSetup,value:string):TankSetup|null{
 if(!/^\d*(?:\.\d{0,2})?$/.test(value)||value===''||!Number.isFinite(Number(value)))return null
 const n=Number(value);if(n<0||n>1000000||field==='capacity'&&n<=0)return null
 const next={...s,[field]:n};if(field==='initial'&&n>next.capacity)next.capacity=Math.ceil(n/100)*100
 if(next.initial>next.capacity)return null
 return next
}
export function graphTimeMax(s:TankSetup,time:number){const end=tankEnd(s),target=Math.max(1,Number.isFinite(end)?end:Math.max(10,time*1.25));const step=10**Math.floor(Math.log10(target));return Math.ceil(target/step)*step}
