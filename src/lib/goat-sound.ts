// Local cartoon bleat; no recording, requests, or student data.
let context:AudioContext|null=null
export function prepareGoatSound(){
 if(typeof window==='undefined')return
 try{context??=new AudioContext();void context.resume().catch(()=>{})}catch{/* Sound is optional on devices without audio support. */}
}
export function playGoatBleat(){
 if(!context||context.state!=='running')return ()=>{}
 const ctx=context,t=ctx.currentTime,voice=ctx.createOscillator(),vibrato=ctx.createOscillator(),depth=ctx.createGain(),filter=ctx.createBiquadFilter(),gain=ctx.createGain()
 voice.type='sawtooth';voice.frequency.setValueAtTime(190,t);voice.frequency.exponentialRampToValueAtTime(135,t+.65)
 vibrato.frequency.value=12;depth.gain.value=24;vibrato.connect(depth);depth.connect(voice.frequency)
 filter.type='bandpass';filter.frequency.value=850;filter.Q.value=1.4;voice.connect(filter);filter.connect(gain);gain.connect(ctx.destination)
 gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.13,t+.05);gain.gain.setValueAtTime(.1,t+.5);gain.gain.linearRampToValueAtTime(0,t+.8)
 voice.start(t);vibrato.start(t);voice.stop(t+.82);vibrato.stop(t+.82)
 return ()=>{try{voice.stop();vibrato.stop()}catch{}gain.disconnect()}
}
