/** Restricted math grammar: no JavaScript evaluation, variables, property access or arbitrary calls. */
export type ParentFamily='linear'|'constant'|'quadratic'|'cubic'|'squareRoot'|'absolute'|'greatest'
export type FunctionRule={family:ParentFamily;a:number;h:number;k:number;b?:number}
type Node={kind:'number';n:number}|{kind:'x'}|{kind:'add'|'sub'|'mul'|'div'|'pow';a:Node;b:Node}|{kind:'abs';a:Node}|{kind:'sqrt';a:Node}
const num=(n:number):Node=>({kind:'number',n}),op=(kind:'add'|'sub'|'mul'|'div'|'pow',a:Node,b:Node):Node=>({kind,a,b})
function parentNode(family:ParentFamily,x:Node):Node{if(family==='linear')return x;if(family==='quadratic'||family==='cubic')return op('pow',x,num(family==='quadratic'?2:3));if(family==='squareRoot'||family==='absolute')return {kind:family==='squareRoot'?'sqrt':'abs',a:x};throw Error('Unsupported formula family.')}
export function parseReviewFunction(text:string,parent:ParentFamily='linear'):Node|null{
 try{let input=text.toLowerCase().replace(/²/g,'^2').replace(/³/g,'^3').replace(/−/g,'-').replace(/×|·/g,'*').replace(/√/g,'sqrt').replace(/\s/g,'').replace(/^[a-z]\(x\)=|^y=/,'');if(!input||input.length>160)return null
 let abs=false;input=input.replace(/\|/g,()=>{abs=!abs;return abs?'abs(':')'});if(abs)return null
 const tokens=input.match(/(?:\d+(?:\.\d*)?|\.\d+)|sqrt|abs|f|[x+\-*/^()]/g)??[];if(tokens.join('')!==input||tokens.length>100)return null;let i=0
 function primary():Node{const t=tokens[i++];if(t==='('){const a=sum();if(tokens[i++]!==')')throw Error();return a}if(t==='x')return {kind:'x'};if(t==='sqrt'||t==='abs'||t==='f'){if(tokens[i++]!=='(')throw Error();const a=sum();if(tokens[i++]!==')')throw Error();return t==='f'?parentNode(parent,a):{kind:t,a}}if(!t||!/^\d|^\.\d/.test(t))throw Error();const n=Number(t);if(!Number.isFinite(n)||Math.abs(n)>1e6)throw Error();return num(n)}
 function power():Node{let a=primary();if(tokens[i]==='^'){i++;const n=tokens[i++];if(!['0','1','2','3'].includes(n))throw Error();a=op('pow',a,num(Number(n)))}return a}
 function unary():Node{if(tokens[i]==='+'||tokens[i]==='-'){const sign=tokens[i++];const a=unary();return sign==='-'?op('mul',num(-1),a):a}return power()}
 function product():Node{let a=unary();while(i<tokens.length){const t=tokens[i],implicit=t==='x'||t==='('||t==='sqrt'||t==='abs'||t==='f';if(t!=='*'&&t!=='/'&&!implicit)break;if(!implicit)i++;a=op(t==='/'?'div':'mul',a,unary())}return a}
 function sum():Node{let a=product();while(tokens[i]==='+'||tokens[i]==='-'){const t=tokens[i++];a=op(t==='+'?'add':'sub',a,product())}return a}
 const node=sum();if(i!==tokens.length)return null;return node
 }catch{return null}
}
type Canonical={kind:'poly';c:number[]}|{kind:'abs'|'sqrt';scale:number;m:number;b:number;k:number}
const trim=(c:number[])=>{while(c.length>1&&Math.abs(c.at(-1)!)<1e-9)c.pop();return c}
function canonical(n:Node):Canonical|null{
 if(n.kind==='number')return {kind:'poly',c:[n.n]};if(n.kind==='x')return {kind:'poly',c:[0,1]}
 if(n.kind==='abs'||n.kind==='sqrt'){const a=canonical(n.a);return a?.kind==='poly'&&a.c.length===2&&a.c[1]!==0?{kind:n.kind,scale:1,m:a.c[1],b:a.c[0],k:0}:null}
 const a=canonical(n.a),b=canonical(n.b);if(!a||!b)return null
 const scalar=(v:Canonical):number|null=>v.kind==='poly'&&v.c.length===1?v.c[0]:null
 if(n.kind==='add'||n.kind==='sub'){const sign=n.kind==='sub'?-1:1;if(a.kind==='poly'&&b.kind==='poly')return {kind:'poly',c:trim(Array.from({length:Math.max(a.c.length,b.c.length)},(_,i)=>(a.c[i]??0)+sign*(b.c[i]??0)))};const x=scalar(a),y=scalar(b);if(a.kind!=='poly'&&y!==null)return {...a,k:a.k+sign*y};if(x!==null&&b.kind!=='poly')return {...b,scale:sign*b.scale,k:x+sign*b.k};return null}
 if(n.kind==='mul'){const x=scalar(a),y=scalar(b);if(a.kind!=='poly'&&y!==null)return {...a,scale:a.scale*y,k:a.k*y};if(b.kind!=='poly'&&x!==null)return {...b,scale:b.scale*x,k:b.k*x};if(a.kind!=='poly'||b.kind!=='poly'||a.c.length+b.c.length>5)return null;const c=Array(a.c.length+b.c.length-1).fill(0);a.c.forEach((v,i)=>b.c.forEach((w,j)=>c[i+j]+=v*w));return {kind:'poly',c:trim(c)}}
 if(n.kind==='div'){const d=scalar(b);if(d===null||d===0)return null;return a.kind==='poly'?{kind:'poly',c:a.c.map(c=>c/d)}:{...a,scale:a.scale/d,k:a.k/d}}
 if(n.kind==='pow'){const e=scalar(b);if(a.kind!=='poly'||e===null||!Number.isInteger(e)||e<0||e>3)return null;let c=[1];for(let k=0;k<e;k++){const next=Array(c.length+a.c.length-1).fill(0);c.forEach((v,i)=>a.c.forEach((w,j)=>next[i+j]+=v*w));c=next}return c.length<=4?{kind:'poly',c:trim(c)}:null}
 return null
}
const near=(a:number,b:number)=>Math.abs(a-b)<1e-7
export function functionCorrect(text:string,rule:FunctionRule){const node=parseReviewFunction(text,rule.family);if(!node||!/^\s*(?:[a-z]\s*\(\s*x\s*\)|y)\s*=/i.test(text))return false;const given=canonical(node);const input=op('mul',num(rule.b??1),op('sub',{kind:'x'},num(rule.h)));const expected=canonical(op('add',op('mul',num(rule.a),parentNode(rule.family,input)),num(rule.k)));if(!given||!expected||given.kind!==expected.kind)return false
 if(given.kind==='poly'&&expected.kind==='poly')return given.c.length===expected.c.length&&given.c.every((v,i)=>near(v,expected.c[i]))
 if(given.kind!=='poly'&&expected.kind!=='poly'){const normalize=(c:typeof given)=>({h:-c.b/c.m,a:c.scale*(c.kind==='abs'?Math.abs(c.m):Math.sqrt(Math.abs(c.m))),direction:c.kind==='sqrt'?Math.sign(c.m):1,k:c.k});const a=normalize(given),b=normalize(expected);return near(a.h,b.h)&&near(a.a,b.a)&&a.direction===b.direction&&near(a.k,b.k)}return false
}
function tex(n:Node):string{
 if(n.kind==='number')return String(n.n)
 if(n.kind==='x')return 'x'
 if(n.kind==='abs')return `\\left|${tex(n.a)}\\right|`
 if(n.kind==='sqrt')return `\\sqrt{${tex(n.a)}}`
 if(n.kind==='div')return `\\frac{${tex(n.a)}}{${tex(n.b)}}`
 if(n.kind==='pow')return `\\left(${tex(n.a)}\\right)^{${tex(n.b)}}`
 const group=(v:Node,negative=false)=>{const t=tex(v);return v.kind==='add'||v.kind==='sub'||negative&&t.startsWith('-')?`\\left(${t}\\right)`:t}
 if(n.kind==='add'||n.kind==='sub')return `${tex(n.a)}${n.kind==='add'?'+':'-'}${n.kind==='sub'?group(n.b,true):tex(n.b)}`
 if(n.a.kind==='number'&&n.a.n===-1)return '-'+group(n.b,true)
 return `${group(n.a)}${n.b.kind==='number'?'\\cdot ':''}${group(n.b,true)}`
}
export function functionPreview(text:string,rule?:FunctionRule){if(!/^\s*(?:[a-z]\s*\(\s*x\s*\)|y)\s*=/i.test(text))return null;const node=parseReviewFunction(text,rule?.family);const prefix=text.match(/^\s*([a-z]\s*\(\s*x\s*\)|y)\s*=/i)?.[1].replace(/\s/g,'')??'g(x)';return node?prefix+'='+tex(node):null}
export function curveValue(rule:FunctionRule,x:number):number|null{const u=(rule.b??1)*(x-rule.h),v=rule.family==='quadratic'?u*u:rule.family==='cubic'?u*u*u:rule.family==='absolute'?Math.abs(u):rule.family==='squareRoot'?(u<0?null:Math.sqrt(u)):rule.family==='constant'?0:rule.family==='greatest'?Math.floor(u):u;return v===null?null:rule.a*v+rule.k}
