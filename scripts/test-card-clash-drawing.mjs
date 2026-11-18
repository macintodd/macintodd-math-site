import assert from 'node:assert/strict'
import fs from 'node:fs'
import {scratch} from '../public/cardclash/js/ui.js'
const calls=[]
const ctx={beginPath(){},moveTo(...p){calls.push(['move',...p])},lineTo(...p){calls.push(['line',...p])},stroke(){calls.push(['ink',this.strokeStyle,this.globalCompositeOperation,this.lineWidth])},clearRect(...r){calls.push(['clear',...r])}}
const canvas={getContext:()=>ctx,getBoundingClientRect:()=>({left:30,top:50,width:500,height:260}),setPointerCapture(){}}
const drawing=scratch(canvas),event=(x,y,id=1)=>({clientX:x,clientY:y,pointerId:id,preventDefault(){}})
canvas.onpointerdown(event(30,50));assert.deepEqual(calls.find(c=>c[0]==='move'),['move',0,0]);assert.deepEqual(calls.find(c=>c[0]==='ink'),['ink','#151515','source-over',5]);canvas.onpointermove(event(530,310));assert(calls.some(c=>c[0]==='line'&&c[1]===1000&&c[2]===520));const length=calls.length;canvas.onpointermove(event(100,100,2));assert.equal(calls.length,length);canvas.onpointerup(event(530,310));
drawing.setTool('eraser');canvas.onpointerdown(event(50,70));assert.equal(ctx.globalCompositeOperation,'destination-out');assert.equal(ctx.lineWidth,44);canvas.onpointercancel(event(50,70));
drawing.setTool('red');canvas.onpointerdown(event(100,100));assert.equal(ctx.strokeStyle,'#c52b37');assert.equal(ctx.globalCompositeOperation,'source-over');canvas.onpointerup(event(100,100));drawing.setTool('black');canvas.onpointerdown(event(100,100));assert.equal(ctx.strokeStyle,'#151515');canvas.onlostpointercapture(event(100,100));drawing.clear();assert.deepEqual(calls.at(-1),['clear',0,0,1000,520]);
const source=fs.readFileSync('public/cardclash/js/student.js','utf8');assert(source.indexOf('class="scratch-area"')<source.indexOf('</div><div>${fields}'));assert(!source.includes('<summary>Scratch paper'));for(const tool of ['black','red','eraser'])assert(source.includes(`data-tool="${tool}"`));assert(source.includes('scratchImage=oldCanvas.toDataURL()'));assert(source.includes('chooseTool(scratchTool)'));
console.log('Passed black/red pen, true eraser, pen restoration, edge-to-edge coordinates, pointer isolation, clear, visible scratch placement under the problem and selected-tool persistence.');
