export type DrawingPoint={x:number;y:number}
export const openingPoint={x:6,y:7}
export const openingSlope=2/3
export type FittedLine={center:DrawingPoint;dx:number;dy:number;span:number;min:number;max:number}
/** Orthogonal regression fits the whole stroke, including vertical lines, instead of trusting two noisy endpoints. */
export function fitDrawing(points:DrawingPoint[]):FittedLine|null{
 if(points.length<2||points.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y)))return null
 const center={x:points.reduce((n,p)=>n+p.x,0)/points.length,y:points.reduce((n,p)=>n+p.y,0)/points.length}
 let xx=0,yy=0,xy=0;for(const p of points){const x=p.x-center.x,y=p.y-center.y;xx+=x*x;yy+=y*y;xy+=x*y}
 if(xx+yy<1e-8)return null
 const angle=.5*Math.atan2(2*xy,xx-yy),dx=Math.cos(angle),dy=Math.sin(angle),along=points.map(p=>(p.x-center.x)*dx+(p.y-center.y)*dy),min=Math.min(...along),max=Math.max(...along)
 return {center,dx,dy,span:max-min,min,max}
}
export function assessParallelDrawing(points:DrawingPoint[]){
 const fit=fitDrawing(points)
 if(!fit||fit.span<3)return {kind:'short' as const,fit,message:'Draw a longer line so its direction is clear. Start on one side of the gold point and draw through it.'}
 const x=openingPoint.x-fit.center.x,y=openingPoint.y-fit.center.y,distance=Math.abs(x*fit.dy-y*fit.dx),along=x*fit.dx+y*fit.dy
 if(distance>.65||along<fit.min-.75||along>fit.max+.75)return {kind:'miss-point' as const,fit,message:'The new line must go through (6, 7). Redraw your line through the gold point.'}
 const slope=Math.abs(fit.dx)<1e-6?Infinity:fit.dy/fit.dx
 if(Math.abs(slope-openingSlope)/openingSlope>.08)return {kind:'not-parallel' as const,fit,message:'Your line goes through the point, but its direction is not parallel to the blue line. Match the blue line’s tilt and redraw.'}
 return {kind:'correct' as const,fit,message:'Correct! Your line goes through (6, 7) and is parallel to the blue line.'}
}

/** Integer intersections on the two finished opening lines; no off-line points. */
export function openingIntegerPoints(){const points:(DrawingPoint & {curve:'given'|'parallel'})[]=[];for(const curve of ['given','parallel'] as const){const b=curve==='given'?-4:openingPoint.y-openingSlope*openingPoint.x;for(let x=-10;x<=10;x++){const y=openingSlope*x+b;if(Math.abs(y-Math.round(y))<1e-8&&Math.abs(y)<=10)points.push({x,y:Math.round(y),curve})}}return points}
