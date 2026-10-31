/* MacIntodd input adapter for Gabriele Cirulli's MIT-licensed 2048 engine. */
function TouchInputManager(){this.events={};this.listen();}
TouchInputManager.prototype.on=function(event,callback){(this.events[event]||(this.events[event]=[])).push(callback);};
TouchInputManager.prototype.emit=function(event,data){(this.events[event]||[]).forEach(function(callback){callback(data);});};
TouchInputManager.prototype.listen=function(){
 var self=this,board=document.querySelector('.game-container'),start=null;
 document.addEventListener('keydown',function(event){if(event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;var key={ArrowUp:0,ArrowRight:1,ArrowDown:2,ArrowLeft:3,w:0,d:1,s:2,a:3}[event.key];if(key!==undefined){event.preventDefault();self.emit('move',key);}});
 document.querySelectorAll('[data-direction]').forEach(function(button){button.addEventListener('click',function(){self.emit('move',Number(button.dataset.direction));board.focus({preventScroll:true});});});
 ['restart','retry','keep-playing'].forEach(function(kind){document.querySelector('.'+kind+'-button').addEventListener('click',function(){self.emit(kind==='keep-playing'?'keepPlaying':'restart');board.focus({preventScroll:true});});});
 board.addEventListener('pointerdown',function(event){if(!event.isPrimary||event.button!==0||event.target.closest('button,a'))return;event.preventDefault();start={x:event.clientX,y:event.clientY,id:event.pointerId};board.setPointerCapture(event.pointerId);board.focus({preventScroll:true});});
 board.addEventListener('pointerup',function(event){if(!start||event.pointerId!==start.id)return;event.preventDefault();var dx=event.clientX-start.x,dy=event.clientY-start.y;start=null;if(Math.max(Math.abs(dx),Math.abs(dy))>=18)self.emit('move',Math.abs(dx)>Math.abs(dy)?dx>0?1:3:dy>0?2:0);});
 board.addEventListener('pointercancel',function(){start=null;});board.addEventListener('lostpointercapture',function(){start=null;});
};
