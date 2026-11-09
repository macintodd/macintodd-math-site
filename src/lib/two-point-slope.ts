export type Coordinate='x1'|'y1'|'x2'|'y2'
export type SlopeSlots=Record<'topLeft'|'topRight'|'bottomLeft'|'bottomRight',Coordinate|null>
export const emptySlopeSlots=():SlopeSlots=>({topLeft:null,topRight:null,bottomLeft:null,bottomRight:null})
export function slopeSetup(slots:SlopeSlots,first:{x:number;y:number},second:{x:number;y:number}){
 const values={x1:first.x,y1:first.y,x2:second.x,y2:second.y},ids=[slots.topLeft,slots.topRight,slots.bottomLeft,slots.bottomRight]
 if(ids.some(v=>!v))return {correct:false,hint:'Fill all four positions in the slope formula.',rise:null,run:null,values}
 const [a,b,c,d]=ids as Coordinate[],rise=values[a]-values[b],run=values[c]-values[d]
 let hint=''
 if(a[0]==='x'&&b[0]==='x'&&c[0]==='y'&&d[0]==='y')hint='Your x- and y-coordinates are inverted. Slope is change in y over change in x: y-values on top, x-values on the bottom.'
 else if(a[0]!=='y'||b[0]!=='y'||c[0]!=='x'||d[0]!=='x')hint='You mixed x- and y-values. Use only y-coordinates in the numerator and only x-coordinates in the denominator.'
 else if(a===b||c===d)hint='Use both points once in each subtraction. Do not subtract a coordinate from itself.'
 else if(a[1]!==c[1]||b[1]!==d[1])hint='Subtract in the same point order on top and bottom. If you start with Point 2’s y, start with Point 2’s x as well.'
 else if(run===0)hint='A zero run makes the slope undefined. Check which x-coordinates you used.'
 let n=rise,den=run,g=Math.abs(n),h=Math.abs(den);while(h){[g,h]=[h,g%h]}if(g){n/=g;den/=g}if(den<0){n=-n;den=-den}
 return {correct:!hint,hint:hint||'Slope checked. Now use the first point and this slope in point-slope form.',rise,run,values,numerator:n,denominator:den}
}
