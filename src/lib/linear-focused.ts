import {newSession,generateProblem,saveCode,loadCode,type Level,type Session} from './write-linear.ts'
import type {IntroProblem} from './intro-point-slope.ts'
export type FocusedLevel=1|2|3|4
export type ActivityProblem=IntroProblem & {secondPoint?:{x:number;y:number}}
export const focusedLabels={1:'Given slope and y-intercept',2:'Read the graph',3:'Given a point and slope',4:'Given Two Points on a Line'}
export function focusedSession(level:FocusedLevel):Session{return {...newSession(),level:Math.min(3,level) as Level}}
export function focusedProblem(level:FocusedLevel,example:boolean,rng=Math.random,recentSlope?:number):ActivityProblem{
 if(level!==4)return generateProblem(level,example,rng,recentSlope)
 if(example)return {line:{x:0,y:-1,rise:2,run:1},point:{x:1,y:1},secondPoint:{x:3,y:5}}
 const p=generateProblem(3,false,rng,recentSlope),direction=p.point.x>0?-1:1
 return {...p,secondPoint:{x:p.point.x+direction*p.line.run,y:p.point.y+direction*p.line.rise}}
}
export function focusedScore(s:Session,level:FocusedLevel){return Math.round(Math.min(1,s.stats[Math.min(3,level)-1].best/(level<3?3:5))*100)/10}
export function focusedBonus(s:Session){return s.targets.length===1&&s.bonus.length===1&&s.targets[0]===s.bonus[0]?1:0}
// Reuse the compact checksum/initials codec with an activity-bound identity salt.
// Padding exists only inside the codec envelope; the actual activity has one target.
export function saveFocused(s:Session,level:FocusedLevel,first:string,last:string,hour:string){const targets=s.phase==='bonus'||s.phase==='report'?[s.targets[0],1,1]:s.targets;return saveCode({...s,level:1,targets},first,last,`${hour}:WLE${level}`).replace(/^WL1-/,`WLE${level}-`)}
export function loadFocused(code:string,level:FocusedLevel,first:string,last:string,hour:string){const clean=code.trim().toUpperCase().replace(/\s/g,'');if(!clean.startsWith(`WLE${level}-`))throw Error(`Use a resume code from Write the Linear Equation LEVEL ${level}.`);const s=loadCode(clean.replace(/^WLE[1-4]-/,'WL1-'),first,last,`${hour}:WLE${level}`);return {...s,level:Math.min(3,level) as Level,targets:s.targets.slice(0,1)}}
