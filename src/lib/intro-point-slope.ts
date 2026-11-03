import {generatePointSlope,numberAnswer,finalEquation,slopeTex,type Point} from './point-slope.ts'
import type {EquationRecord} from './line-equation.ts'
import type {Line} from './slope.ts'
export type IntroProblem={line:Line;point:Point}
export type Quantity='m'|'x'|'y'
export type Slot='m'|'x1'|'y1'
export type Placements=Record<Slot,Quantity|null>
export const emptyPlacements=():Placements=>({m:null,x1:null,y1:null})
export function generateIntroPointSlope(random=Math.random,recent:EquationRecord[]=[]):IntroProblem{if(recent.length===0)return {line:{x:0,y:-2,rise:2,run:1},point:{x:3,y:4}};const {line}=generatePointSlope(random,recent),xs=[-2,-1,1,2],x=xs[Math.min(3,Math.floor(random()*4))]*line.run;return {line,point:{x,y:line.rise/line.run*x+line.y}}}
export function quantityValue(p:IntroProblem,q:Quantity){return q==='m'?p.line.rise/p.line.run:q==='x'?p.point.x:p.point.y}
export function quantityTex(p:IntroProblem,q:Quantity){return q==='m'?slopeTex(p.line):String(quantityValue(p,q))}
export function placeQuantity(current:Placements,slot:Slot,quantity:Quantity):Placements{const next={...current};for(const key of ['m','x1','y1'] as Slot[])if(next[key]===quantity)next[key]=null;next[slot]=quantity;return next}
export function placementsCorrect(p:IntroProblem,slots:Placements){return (['m','x1','y1'] as Slot[]).every(slot=>{const q=slots[slot],expected=slot==='m'?p.line.rise/p.line.run:slot==='x1'?p.point.x:p.point.y;return q!==null&&Math.abs(quantityValue(p,q)-expected)<1e-9})}
export function checkDistribution(p:IntroProblem,m:string,c:string){return numberAnswer(m,p.line.rise/p.line.run)&&numberAnswer(c,-p.line.rise/p.line.run*p.point.x)}
export {finalEquation}
