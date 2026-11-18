// Gesture measurements are normalized by wheel width so iPad and display sizes agree.
export function swipeSettings(distance,elapsed,width,direction=1){
 const speed=distance/Math.max(40,elapsed)*1000/width;
 const valid=width>0&&distance>=Math.max(24,width*.12)&&speed>=.75;
 return {valid,spinMethod:'swipe',spinPower:Math.max(0,Math.min(1,(speed-.75)/4.25)),spinDirection:direction<0?-1:1,spinStartAngle:(direction<0?-1:1)*Math.min(180,distance/width*180)};
}
export function bindWheelSpin(root,onSpin){
 const button=root.querySelector('[data-spin]'),wheel=root.querySelector('.wheel'),help=root.querySelector('[data-spin-help]');
 if(!button||!wheel||button.disabled)return()=>{};
 let locked=false,gesture;
 const instruction='Tap Spin or give the wheel a quick swipe. Faster swipe = faster spin.';
 const message=text=>{if(help)help.textContent=text;};
 const reset=()=>{gesture=undefined;if(!locked){button.disabled=false;wheel.style.transform='rotate(0deg)';message(instruction);}};
 function submit(options){
  if(locked)return;locked=true;gesture=undefined;button.disabled=true;wheel.classList.remove('swipe-enabled');wheel.classList.add('spin-locked');message('Spinning…');
  Promise.resolve(onSpin(options)).then(result=>{if(result===false){locked=false;wheel.classList.remove('spin-locked');wheel.classList.add('swipe-enabled');reset();}}).catch(()=>{locked=false;wheel.classList.remove('spin-locked');wheel.classList.add('swipe-enabled');reset();});
 }
 button.onclick=()=>{if(locked||gesture?.reserved)return;submit({spinMethod:'button'});};
 const time=e=>Number.isFinite(e.timeStamp)?e.timeStamp:performance.now();
 function measure(e){
  const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;
  gesture.distance+=Math.hypot(dx,dy);gesture.cross+=(gesture.x-gesture.cx)*dy-(gesture.y-gesture.cy)*dx;
  if(dx||dy)gesture.fallback=Math.sign(Math.abs(dx)>=Math.abs(dy)?dx:dy);
  gesture.x=e.clientX;gesture.y=e.clientY;
  const direction=Math.abs(gesture.cross)>1?Math.sign(gesture.cross):gesture.fallback||1;
  return swipeSettings(gesture.distance,time(e)-gesture.start,gesture.width,direction);
 }
 wheel.classList.add('swipe-enabled');message(instruction);
 wheel.onpointerdown=e=>{if(locked||gesture||e.isPrimary===false||(e.button!==undefined&&e.button!==0))return;e.preventDefault();const box=wheel.getBoundingClientRect();gesture={id:e.pointerId,x:e.clientX,y:e.clientY,cx:box.left+box.width/2,cy:box.top+box.height/2,width:box.width,start:time(e),distance:0,cross:0,fallback:1,reserved:false};wheel.setPointerCapture?.(e.pointerId);};
 wheel.onpointermove=e=>{if(locked||!gesture||e.pointerId!==gesture.id)return;e.preventDefault();const options=measure(e);if(options.valid)gesture.reserved=true;if(gesture.reserved){button.disabled=true;wheel.style.transform=`rotate(${options.spinStartAngle}deg)`;message('Release to spin!');}};
 wheel.onpointerup=e=>{if(locked||!gesture||e.pointerId!==gesture.id)return;e.preventDefault();const options=measure(e);if(options.valid){wheel.style.transform=`rotate(${options.spinStartAngle}deg)`;submit(options);}else{reset();message('Try a quicker swipe, or tap Spin.');}};
 wheel.onpointercancel=wheel.onlostpointercapture=e=>{if(gesture?.id===e.pointerId)reset();};
 return()=>{gesture=undefined;wheel.classList.remove('swipe-enabled');button.onclick=null;wheel.onpointerdown=wheel.onpointermove=wheel.onpointerup=wheel.onpointercancel=wheel.onlostpointercapture=null;};
}
