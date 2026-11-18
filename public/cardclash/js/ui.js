export const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderMath(root=document){for(const el of root.querySelectorAll('[data-math]')){if(window.katex)window.katex.render(el.dataset.math,el,{throwOnError:false,displayMode:el.dataset.display==='true'});else el.textContent=el.dataset.math;}}
export const prose=s=>escape(s).replace(/\\frac\{(-?\d+)\}\{(\d+)\}/g,token=>`<span data-math="${escape(token)}"></span>`);
export const math=s=>`<div class="math" data-math="${escape(s)}"></div>`;
export function drawGraph(svg,{line,marked=[],points=[],drawn=false,onTap}={}){
 const at=(x,y)=>[250+x*27,250-y*27];let html='';
 for(let n=-8;n<=8;n++){const [x,y]=at(n,n);html+=`<path d="M${x} 24V476 M24 ${y}H476" stroke="${n===0?'#263e62':'#c8d2de'}" stroke-width="${n===0?2:1}"/>`;if(n&&n%2===0)html+=`<text x="${x}" y="267" font-size="13" text-anchor="middle">${n}</text><text x="240" y="${y+5}" font-size="13" text-anchor="end">${n}</text>`;}
 function segment(l,color){if(!l)return '';const a=l.x!==undefined?at(l.x,-8.3):at(-8.3,l.m*-8.3+l.b),b=l.x!==undefined?at(l.x,8.3):at(8.3,l.m*8.3+l.b);return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${color}" stroke-width="3"/>`;}
 html+=segment(line,'#265bd7');for(const p of marked||[]){const [x,y]=at(p.x,p.y);html+=`<circle cx="${x}" cy="${y}" r="5" fill="#265bd7"/>`;}if(drawn&&points.length===2){const [a,b]=points;html+=segment(a.x===b.x?{x:a.x}:{m:(b.y-a.y)/(b.x-a.x),b:a.y-(b.y-a.y)/(b.x-a.x)*a.x},'#c73549');}
 for(const p of points){const [x,y]=at(p.x,p.y);html+=`<circle cx="${x}" cy="${y}" r="6" fill="#ba2845"/><text x="${Math.min(418,Math.max(25,x+8))}" y="${y-10}" fill="#182d50" font-size="17">(${p.x}, ${p.y})</text>`;}
 svg.setAttribute('viewBox','0 0 500 500');svg.innerHTML=`<defs><clipPath id="gridclip"><rect x="24" y="24" width="452" height="452"/></clipPath></defs><g clip-path="url(#gridclip)">${html}</g><text x="470" y="242">x</text><text x="260" y="30">y</text>`;
 svg.onpointerdown=onTap?e=>{e.preventDefault();const box=svg.getBoundingClientRect(),x=Math.round(((e.clientX-box.left)*500/box.width-250)/27),y=Math.round((250-(e.clientY-box.top)*500/box.height)/27);if(Math.abs(x)<=8&&Math.abs(y)<=8)onTap({x,y});}:null;
}
export function keypad(root,getInput){
 const keys=['7','8','9','x','4','5','6','+','1','2','3','−','0','.','/','=','(',')',',','y','a','undefined','⌫','Clear'];
 root.innerHTML=keys.map(k=>`<button type="button" class="${['+','−','/','=','x','(',')',','].includes(k)?'op':['⌫','Clear'].includes(k)?'erase':''}" data-key="${k}">${k}</button>`).join('');
 root.onpointerdown=e=>{if(e.target.closest('button'))e.preventDefault();};
 root.onclick=e=>{const b=e.target.closest('button');if(!b)return;const input=getInput();if(!input)return;input.focus();const k=b.dataset.key,a=input.selectionStart??input.value.length,z=input.selectionEnd??a;if(k==='Clear'){input.value='';input.setSelectionRange(0,0);}else if(k==='⌫'){const start=a===z?Math.max(0,a-1):a;input.setRangeText('',start,z,'end');}else input.setRangeText(k==='−'?'-':k,a,z,'end');input.dispatchEvent(new Event('input',{bubbles:true}));};
}
export function scratch(canvas){
 const ctx=canvas.getContext('2d');canvas.width=1000;canvas.height=520;let down=false,tool='black',pointer;
 const point=e=>{const r=canvas.getBoundingClientRect();return [(e.clientX-r.left)*canvas.width/r.width,(e.clientY-r.top)*canvas.height/r.height];};
 const ink=()=>{ctx.globalCompositeOperation=tool==='eraser'?'destination-out':'source-over';ctx.strokeStyle=tool==='red'?'#c52b37':'#151515';ctx.lineWidth=(tool==='eraser'?22:2.5)*canvas.width/canvas.getBoundingClientRect().width;ctx.lineCap='round';ctx.lineJoin='round';};
 canvas.onpointerdown=e=>{if(down)return;e.preventDefault();down=true;pointer=e.pointerId;canvas.setPointerCapture(e.pointerId);ink();const [x,y]=point(e);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+.01,y+.01);ctx.stroke();};
 canvas.onpointermove=e=>{if(!down||e.pointerId!==pointer)return;e.preventDefault();ctx.lineTo(...point(e));ctx.stroke();};
 canvas.onpointerup=canvas.onpointercancel=canvas.onlostpointercapture=e=>{if(e.pointerId===pointer){down=false;pointer=undefined;}};
 return {clear(){ctx.clearRect(0,0,canvas.width,canvas.height);},setTool(value){if(['black','red','eraser'].includes(value))tool=value;}};
}
