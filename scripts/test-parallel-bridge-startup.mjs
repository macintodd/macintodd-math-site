import assert from 'node:assert/strict'
import vm from 'node:vm'
import {lessonBridgeBootstrap} from '../src/lib/mathboard/lesson-bridge.ts'

function host(search='',native=true,pathname='/apps/beta/parallel-perpendicular-lesson/teacher'){
 const callbacks=new Map()
 const window={
  location:{pathname,search},
  addEventListener:(name,listener)=>callbacks.set(name,listener),
 }
 if(native)window.MathBoardApplet={applyState:state=>window.mathBoardAppletSetState(state)}
 vm.runInNewContext(lessonBridgeBootstrap,{window,URLSearchParams})
 return {window,dispatch:(name,isTrusted)=>callbacks.get(name)?.({isTrusted})}
}

assert.equal(host('',false).window.mathBoardAppletSetState,undefined)
const controller=host()
const {window}=controller
const restore=window.mathBoardAppletSetState
assert.equal(typeof restore,'function','The native callback is installed before React subscribes')
const scene={index:3,equation:'y=2/3x-4'}
window.MathBoardApplet.applyState({index:2})
window.MathBoardApplet.applyState(scene)
const received=[]
const bridge=window.mathBoardLessonBridge
assert.equal(bridge.canPublish(),false,'A blank mount cannot overwrite the saved checkpoint')
const disconnect=bridge.listen(state=>{
 if(!state||!Number.isInteger(state.index))return false
 received.push(state)
 return true
})
assert.deepEqual(received,[scene])
assert.equal(window.mathBoardAppletSetState,restore)
assert.equal(bridge.canPublish(),false,'Restoration cannot echo through the publisher')
controller.dispatch('click',false)
assert.equal(bridge.canPublish(),false,'Synthetic events do not arm publishing')
controller.dispatch('pointerdown',true)
assert.equal(bridge.canPublish(),true,'Real controller input can publish further edits')
restore({invalid:true})
assert.equal(bridge.canPublish(),true)
restore({index:4})
assert.equal(bridge.canPublish(),false)
disconnect()
restore({index:5})
assert.equal(received.length,2)
bridge.listen(state=>{received.push(state);return true})
assert.deepEqual(received.at(-1),{index:5})

const display=host('?mathboardDisplay=1')
const displayBridge=display.window.mathBoardLessonBridge
assert(displayBridge.displayOnly)
display.dispatch('pointerdown',true)
assert(!displayBridge.canPublish())
console.log('Passed document-start restore queue, controller rearm, validation, stable callback, and read-only projector mode.')

for(const path of ['/apps/beta/parallel-lines','/apps/beta/parallel-lines/teacher','/apps/beta/parallel-perpendicular-lesson','/apps/beta/parallel-perpendicular-lesson/teacher'])assert.equal(typeof host('',true,path).window.mathBoardAppletSetState,'function',path);
assert.equal(host('',true,'/apps/parallel-drawing').window.mathBoardAppletSetState,undefined);
console.log('Passed canonical and legacy parallel-lesson bridge routes, excluding standalone game.');
