import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import crypto from 'node:crypto'
const root='public/games/2048/',source=JSON.parse(fs.readFileSync(root+'SOURCE.json','utf8'))
for(const [file,hash] of Object.entries(source.unmodifiedFiles))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(root+file)).digest('hex'),hash,file+' matches pinned upstream')
function Input(){this.events={}}Input.prototype.on=function(event,fn){this.events[event]=fn}
function Actuator(){}Actuator.prototype.actuate=function(grid,metadata){this.metadata=metadata};Actuator.prototype.continueGame=function(){}
const context=vm.createContext({console,Math,Input,Actuator})
for(const file of ['grid.js','tile.js','game_manager.js','storage.js'])vm.runInContext(fs.readFileSync(root+'js/'+file,'utf8'),context)
const game=vm.runInContext('new GameManager(4,Input,Actuator,MemoryStorageManager)',context)
assert.equal(game.grid.availableCells().length,14)
assert.equal(game.score,0)
function board(rows){game.grid=new context.Grid(4);game.score=0;game.over=false;game.won=false;game.keepPlaying=false;rows.forEach((row,y)=>row.forEach((value,x)=>{if(value)game.grid.insertTile(new context.Tile({x,y},value))}));}
function row(y){return Array.from({length:4},(_,x)=>game.grid.cellContent({x,y})?.value??0)}
game.addRandomTile=function(){}
board([[2,2,2,2]]);game.move(3);assert.deepEqual(row(0),[4,4,0,0]);assert.equal(game.score,8)
board([[2,2,4,0]]);game.move(3);assert.deepEqual(row(0),[4,4,0,0]);assert.equal(game.score,4)
board([[2,0,0,2]]);game.move(1);assert.deepEqual(row(0),[0,0,0,4])
board([[2],[2],[0],[0]]);game.move(0);assert.equal(game.grid.cellContent({x:0,y:0}).value,4)
board([[2],[2],[0],[0]]);game.move(2);assert.equal(game.grid.cellContent({x:0,y:3}).value,4)
let spawns=0;game.addRandomTile=function(){spawns++}
board([[2,0,0,0]]);game.move(3);assert.equal(spawns,0);game.move(1);assert.equal(spawns,1)
board([[1024,1024,0,0]]);game.move(3);assert.equal(game.won,true);assert.equal(game.isGameTerminated(),true);game.inputManager.events.keepPlaying();assert.equal(game.isGameTerminated(),false)
board([[2,4,2,4],[4,2,4,2],[2,4,2,4],[4,2,4,2]]);assert.equal(game.movesAvailable(),false)
assert(!fs.existsSync(root+'js/local_storage_manager.js'))
const memory=new context.MemoryStorageManager();memory.setBestScore(123);assert.equal(memory.getBestScore(),123);assert.equal(new context.MemoryStorageManager().getBestScore(),0)
const html=fs.readFileSync(root+'index.html','utf8');assert(!/https?:.*<script/.test(html));assert(html.includes('LICENSE.txt'))
// Exercise the actual pointer/keyboard adapter without a browser dependency.
function control(direction){return {dataset:{direction},handlers:{},addEventListener(event,fn){this.handlers[event]=fn},focus(){},setPointerCapture(){this.captures=(this.captures||0)+1}}}
const boardControl=control(),arrows=[0,1,2,3].map(control),restart=control(),retry=control(),keep=control(),keys={}
context.document={addEventListener:(event,fn)=>{keys[event]=fn},querySelector:selector=>({'.game-container':boardControl,'.restart-button':restart,'.retry-button':retry,'.keep-playing-button':keep})[selector],querySelectorAll:()=>arrows}
vm.runInContext(fs.readFileSync(root+'js/input.js','utf8'),context)
const input=new context.TouchInputManager(),moves=[];let restarts=0
input.on('move',d=>moves.push(d));input.on('restart',()=>restarts++)
const pointer={isPrimary:true,button:0,pointerId:1,clientX:100,clientY:100,target:{closest:()=>null},preventDefault(){}}
boardControl.handlers.pointerdown(pointer);boardControl.handlers.pointerup({...pointer,clientX:160});assert.equal(moves.pop(),1)
boardControl.handlers.pointerdown(pointer);boardControl.handlers.pointerup({...pointer,clientY:40});assert.equal(moves.pop(),0)
boardControl.handlers.pointerdown(pointer);boardControl.handlers.pointercancel();boardControl.handlers.pointerup({...pointer,clientX:40});assert.equal(moves.length,0)
const captures=boardControl.captures;boardControl.handlers.pointerdown({...pointer,target:{closest:()=>true}});assert.equal(boardControl.captures,captures,'Overlay buttons must retain their own pointer clicks')
keys.keydown({key:'ArrowLeft',preventDefault(){}});assert.equal(moves.pop(),3)
keys.keydown({key:'ArrowLeft',ctrlKey:true,preventDefault(){throw Error('modified key blocked')}});assert.equal(moves.length,0)
arrows[2].handlers.click();assert.equal(moves.pop(),2);restart.handlers.click();assert.equal(restarts,1)
console.log('Passed: pinned MIT core; all merges/directions, score, win/continue, game-over, session storage, pointer swipes/cancel, keyboard, onscreen controls, and overlay buttons.')
