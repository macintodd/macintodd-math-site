export const parentGraphTitle='Graphing Parent Functions'
export const parentGraphSkill='Plot points and recognize the graphs of linear, constant, quadratic, cubic, square-root, and absolute-value parent functions.'
export const parentGraphFamilies=['linear','constant','quadratic','cubic','squareRoot','absolute'] as const
export type ParentGraphFamily=typeof parentGraphFamilies[number]
export type ParentPoint={x:number;y:number}
export type ParentGraphQuestion={family:ParentGraphFamily;constant:number}
export type ParentGraphProgress={seed:number;results:number[]}
export const parentGraphNames:Record<ParentGraphFamily,string>={linear:'Linear',constant:'Constant',quadratic:'Quadratic',cubic:'Cubic',squareRoot:'Square root',absolute:'Absolute value'}
export function parentGraphValue(q:ParentGraphQuestion,x:number):number|null{return q.family==='squareRoot'&&x<0?null:q.family==='linear'?x:q.family==='constant'?q.constant:q.family==='quadratic'?x*x:q.family==='cubic'?x*x*x:q.family==='squareRoot'?Math.sqrt(x):Math.abs(x)}
export function parentGraphTex(q:ParentGraphQuestion){return 'y='+({linear:'x',constant:String(q.constant),quadratic:'x^2',cubic:'x^3',squareRoot:String.raw`\sqrt{x}`,absolute:String.raw`\lvert x\rvert`}[q.family])}
export function parentGraphDeck(seed:number):ParentGraphQuestion[]{let n=seed>>>0;const rng=()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/2**32},items=[...parentGraphFamilies];for(let i=items.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[items[i],items[j]]=[items[j],items[i]]}const c=[-4,-3,-2,-1,1,2,3,4][Math.floor(rng()*8)];return items.map(family=>({family,constant:c}))}
export function requiredParentPoints(q:ParentGraphQuestion){return q.family==='linear'||q.family==='constant'?3:q.family==='squareRoot'?4:5}
export function parentPointCorrect(q:ParentGraphQuestion,p:ParentPoint){const y=parentGraphValue(q,p.x);return Number.isInteger(p.x)&&Number.isInteger(p.y)&&Math.abs(p.x)<=10&&Math.abs(p.y)<=10&&y!==null&&Math.abs(y-p.y)<1e-8}
export function parentGraphCheck(q:ParentGraphQuestion,points:ParentPoint[]){
 const unique=points.filter((p,i)=>points.findIndex(v=>v.x===p.x&&v.y===p.y)===i),bad=unique.filter(p=>!parentPointCorrect(q,p))
 if(bad.length)return {correct:false,bad,hint:'Check the highlighted points. Substitute each x into the equation and compare its y-value.'}
 if(unique.length<requiredParentPoints(q))return {correct:false,bad,hint:'Plot more distinct points so the shape of the graph can be checked.'}
 if(q.family==='constant')return {correct:true,bad,hint:'Correct! Every point has the same y-value, so the graph is horizontal.'}
 if(!unique.some(p=>p.x===0&&p.y===0))return {correct:false,bad,hint:'Include the origin. What is y when x is zero?'}
 if(q.family==='squareRoot')return {correct:true,bad,hint:'Correct! The square-root graph starts at the origin and continues to the right.'}
 const count=q.family==='linear'?1:2
 if(unique.filter(p=>p.x<0).length<count||unique.filter(p=>p.x>0).length<count)return {correct:false,bad,hint:'Include points on both sides of the y-axis to show the whole shape.'}
 return {correct:true,bad,hint:'Correct! Your points show the parent function’s shape.'}
}
export function parentGraphExamples(q:ParentGraphQuestion){const xs=q.family==='squareRoot'?[0,1,4,9]:q.family==='constant'?[-4,0,4]:q.family==='linear'?[-3,0,3]:[-2,-1,0,1,2];return xs.map(x=>({x,y:parentGraphValue(q,x)!}))}
export function parentGraphPath(q:ParentGraphQuestion){let path='';for(let i=0;i<=800;i++){const x=-10+i/40,y=parentGraphValue(q,x);if(y===null||Math.abs(y)>10)continue;path+=`${path?'L':'M'}${(250+x*20).toFixed(2)},${(250-y*20).toFixed(2)} `}return path}
export function parentGraphSnap(x:number,y:number):ParentPoint|null{return x<50||x>450||y<50||y>450?null:{x:Math.round((x-250)/20),y:Math.round((250-y)/20)}}
const alphabet='23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
const checksum=(s:string)=>{let h=17;for(const c of s)h=(Math.imul(h,31)+c.charCodeAt(0))>>>0;return h&65535}
type Identity={first:string;last:string;hour:string}
function identity(id:Identity){const initial=(s:string)=>s.trim().normalize('NFKD').replace(/\p{M}/gu,'').toUpperCase().match(/\p{L}/u)?.[0];if(!initial(id.first)||!initial(id.last)||!['2','3','4','6','7','8'].includes(id.hour))throw Error('Enter your first name, last name, and class hour.');return checksum(`${initial(id.first)}|${initial(id.last)}|${id.hour}`)}
function valid(p:ParentGraphProgress){if(!Number.isInteger(p.seed)||p.seed<0||p.seed>0xffffffff||p.results.length>6||p.results.some(n=>![0,.5,1].includes(n)))throw Error('Check the complete practice code.')}
export function saveParentGraph(p:ParentGraphProgress,id:Identity){valid(p);let bits='1'+identity(id).toString(2).padStart(16,'0')+p.seed.toString(2).padStart(32,'0')+p.results.length.toString(2).padStart(3,'0');for(const result of p.results)bits+=(result*2).toString(2).padStart(2,'0');const body=BigInt('0b'+bits);let n=(body<<BigInt(16))|BigInt(checksum(body.toString(36))),code='';while(n){code=alphabet[Number(n%BigInt(32))]+code;n/=BigInt(32)}return 'PGF1-'+code.match(/.{1,4}/g)!.join('-')}
export function loadParentGraph(code:string,id:Identity):ParentGraphProgress{if(!/^PGF1-/i.test(code.trim()))throw Error('Use a code from Graphing Parent Functions.');const clean=code.trim().slice(5).replace(/[\s-]/g,'').toUpperCase();if(clean.length<12||clean.length>18||[...clean].some(c=>!alphabet.includes(c)))throw Error('Check the complete practice code.');let n=BigInt(0);for(const c of clean)n=n*BigInt(32)+BigInt(alphabet.indexOf(c));const body=n>>BigInt(16);if(Number(n&BigInt(65535))!==checksum(body.toString(36)))throw Error('Check the complete practice code.');const bits=body.toString(2);let cursor=1;function take(w:number){if(cursor+w>bits.length)throw Error('Check the complete practice code.');const v=parseInt(bits.slice(cursor,cursor+w),2);cursor+=w;return v}if(take(16)!==identity(id))throw Error('Use the same name initials and class hour as your saved card.');const seed=take(32),length=take(3),results=Array.from({length},()=>take(2)/2),p={seed,results};if(cursor!==bits.length)throw Error('Check the complete practice code.');valid(p);return p}
