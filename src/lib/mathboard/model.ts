import { screens,poolEmptyHours, type Point, type Screen, type GraphConfig } from '../../content/mathboard/session-one.ts'
export type Attempt={screen:string;skill:string;correct:boolean;value:string;at:string}
export type LessonState={version:2;storyStarted:boolean;parts:string[];name:string;hour:string;index:number;completed:string[];attempts:Attempt[];hints:string[];grants:Record<string,string>;values:Record<string,string>;units:[string,string];choice:number|null;points:Point[];drawn:boolean;movement:Point;slider:number;visited:number[];game:{board:number[];score:number};finished:string|null;updatedAt:string;configToken:string}
export const storageKey='macintodd.mathboard.session1.pool.v2'
export function initialState(name:string,hour:string,token:string):LessonState{return {version:2,storyStarted:false,parts:[],name:name.trim(),hour,index:0,completed:[],attempts:[],hints:[],grants:{},values:{},units:['',''],choice:null,points:[],drawn:false,movement:{x:0,y:0},slider:0,visited:[0],game:{board:[],score:0},finished:null,updatedAt:new Date().toISOString(),configToken:token}}
export function numeric(value:string):number|null{const match=value.trim().match(/^(-?(?:\d+(?:\.\d*)?|\.\d+))(?:\/(-?(?:\d+(?:\.\d*)?|\.\d+)))?$/);if(!match)return null;const n=Number(match[1]),d=match[2]===undefined?1:Number(match[2]);return d!==0&&Number.isFinite(n/d)?n/d:null}
export function near(a:number|null,b:number){return a!==null&&Math.abs(a-b)<1e-8}
export function pointEqual(a:Point,b:Point){return near(a.x,b.x)&&near(a.y,b.y)}
export function lineCorrect(points:Point[],m:number,b:number){return points.length===2&&!pointEqual(points[0],points[1])&&points.every(p=>near(p.y,m*p.x+b))}
export function evaluate(screen:Screen,state:LessonState){
 const checks:{skill:string;correct:boolean;feedback:string}[]=[]
 if(screen.kind==='rate'){
  const earned=numeric(state.values.change??''),hours=numeric(state.values.hours??'')
  checks.push({skill:'context',correct:earned!==null&&hours!==null&&earned<0&&hours>0&&near(earned/hours,-720)&&state.units[0]==='gallons'&&state.units[1]==='hour',feedback:state.units[0]!=='gallons'?'The numerator should describe volume: choose Gallons.':state.units[1]!=='hour'?'The denominator should describe time: choose hours.':'Compare the change in gallons with elapsed hours. Draining means a negative change of 720 gallons in one hour.'})
 }else for(const field of screen.fields??[])checks.push({skill:field.id==='m'?'slope':field.id==='b'?'intercept':screen.skills?.[0]??'context',correct:near(numeric(state.values[field.id]??''),field.answer),feedback:field.hint})
 if(screen.kind==='choice'||screen.kind==='slider')checks.push({skill:screen.skills?.[0]??'context',correct:state.choice===screen.correctChoice,feedback:screen.hint??'Look back at the question and compare the quantities.'})
 if(screen.kind==='start-point')checks.push({skill:'context',correct:state.units[0]==='gallons',feedback:'Choose Gallons for the initial volume units.'})
 if(screen.kind==='slider')checks.push({skill:'context',correct:[1,5,10,poolEmptyHours].every(hour=>state.visited.some(visited=>near(visited,hour))),feedback:'Visit 1 hour, 5 hours, 10 hours, and the empty-pool position before checking the pattern.'})
 if(screen.kind==='plot'){
  const good=screen.target?state.points.length===1&&pointEqual(state.points[0],screen.target):!!screen.line&&lineCorrect(state.points,screen.line.m,screen.line.b)&&state.drawn
  checks.push({skill:'graph',correct:good,feedback:state.points.length!==(screen.pointCount??2)?`Plot ${screen.pointCount??2} distinct point${screen.pointCount===1?'':'s'} first.`:screen.line&&lineCorrect(state.points,screen.line.m,screen.line.b)&&!state.drawn?'Your two points are correct. Connect them to complete the graph.':screen.hint??'Check the y-intercept and the sign of the slope. Remove only a point you want to change.'})
 }
 if(screen.kind==='move'&&screen.movement){const d=screen.movement;checks.push({skill:'graph',correct:pointEqual(state.movement,d)||pointEqual(state.movement,{x:-d.x,y:-d.y}),feedback:screen.hint??'Compare your horizontal run and vertical rise with the slope.'})}
 if(screen.kind==='connect')checks.push({skill:'graph',correct:state.drawn,feedback:'Connect the two correct points first.'})
 return {correct:checks.length>0&&checks.every(c=>c.correct),checks}
}
export function resetActivity(state:LessonState,index:number):LessonState{return {...state,index,parts:[],values:{},units:['',''],choice:null,points:[],drawn:false,movement:{x:0,y:0},slider:0,visited:[0],updatedAt:new Date().toISOString()}}
export function safeIndex(index:number,released:number[]){let max=screens.length-1;for(let i=0;i<screens.length;i++){const cp=screens[i].checkpoint;if(cp&&!released.includes(cp)){max=i;break}}return Math.max(0,Math.min(Number.isInteger(index)?index:0,max))}
export function restoreState(value:unknown):LessonState|null{
 if(!value||typeof value!=='object')return null
 const s=value as LessonState
 if(s.version!==2||typeof s.name!=='string'||!s.name.trim()||s.name.length>120||!/^([1-8])$/.test(s.hour)||!Number.isInteger(s.index)||s.index<0||s.index>=screens.length||!Array.isArray(s.completed)||!Array.isArray(s.attempts)||!Array.isArray(s.hints)||!Array.isArray(s.parts)||typeof s.storyStarted!=='boolean'||!s.grants||!s.values||!Array.isArray(s.points)||!Array.isArray(s.visited)||!s.game||typeof s.configToken!=='string')return null
 if(typeof s.values!=='object'||Object.values(s.values).some(v=>typeof v!=='string'||v.length>18)||!Array.isArray(s.units)||s.units.length!==2||s.units.some(u=>!['','gallons','hour'].includes(u))||!Number.isFinite(s.slider)||s.slider<0||s.slider>poolEmptyHours||!s.movement||![s.movement.x,s.movement.y].every(Number.isFinite)||!Array.isArray(s.game.board)||s.game.board.some(n=>!Number.isInteger(n)||n<0)||typeof s.game.score!=='number'||s.configToken.length>3000)return null
 if(s.points.some(p=>!p||!Number.isFinite(p.x)||!Number.isFinite(p.y)||Math.abs(p.x)>1000||Math.abs(p.y)>1000)||s.points.length>2)return null
 return {...initialState(s.name,s.hour,s.configToken),...s,attempts:s.attempts.filter(a=>a&&typeof a.screen==='string'&&typeof a.skill==='string'&&typeof a.correct==='boolean').slice(-2000),completed:[...new Set(s.completed.filter(id=>screens.some(screen=>screen.id===id)))],visited:s.visited.filter(n=>Number.isFinite(n)&&n>=0&&n<=poolEmptyHours)}
}
export function clipLine(m:number,b:number,config:GraphConfig):Point[]{const hits:Point[]=[];function add(x:number,y:number){if(x>=config.xmin-1e-8&&x<=config.xmax+1e-8&&y>=config.ymin-1e-8&&y<=config.ymax+1e-8&&!hits.some(p=>pointEqual(p,{x,y})))hits.push({x,y})}for(const x of [config.xmin,config.xmax])add(x,m*x+b);if(m)for(const y of [config.ymin,config.ymax])add((y-b)/m,y);return hits.sort((a,c)=>a.x-c.x)}
