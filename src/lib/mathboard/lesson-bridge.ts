type RestoreListener=(state:unknown)=>boolean
export type LessonMathBoardWindow=Window & {
 MathBoardApplet?:{publishState?:(state:unknown)=>void}
 mathBoardAppletSetState?:RestoreListener
 mathBoardLessonBridge?:LessonBridge
}
type LessonBridge={
 listen:(restore:RestoreListener)=>()=>void
 canPublish:()=>boolean
 displayOnly:boolean
}

/** Self-contained so the same installer can run in the document head and on client navigation. */
export function installLessonBridge(host:LessonMathBoardWindow):LessonBridge{
 if(host.mathBoardLessonBridge)return host.mathBoardLessonBridge
 let listener:RestoreListener|undefined
 let queued:unknown
 let hasQueued=false
 let waitingForInput=true
 const displayOnly=new URLSearchParams(host.location?.search??'').get('mathboardDisplay')==='1'

 function restore(state:unknown){
  if(!listener){queued=state;hasQueued=true;return false}
  const previous=waitingForInput
  waitingForInput=true
  if(listener(state))return true
  waitingForInput=previous
  return false
 }
 function resumePublishing(event:Event){
  if(event.isTrusted)waitingForInput=false
 }
 for(const name of ['pointerdown','keydown','input','click','wheel']){
  host.addEventListener?.(name,resumePublishing,true)
 }

 const bridge:LessonBridge={
  displayOnly,
  canPublish:()=>!displayOnly&&!waitingForInput&&!hasQueued,
  listen(next){
   listener=next
   if(host.mathBoardAppletSetState!==restore)host.mathBoardAppletSetState=restore
   if(hasQueued){
    const state=queued
    queued=undefined
    hasQueued=false
    restore(state)
   }
   return ()=>{if(listener===next)listener=undefined}
  },
 }
 host.mathBoardAppletSetState=restore
 host.mathBoardLessonBridge=bridge
 return bridge
}

export const lessonBridgeBootstrap=`if(window.MathBoardApplet && /^\\/apps\\/beta\\/parallel-perpendicular-lesson(?:\\/teacher)?\\/?$/.test(window.location.pathname)){(${installLessonBridge.toString()})(window)}`
