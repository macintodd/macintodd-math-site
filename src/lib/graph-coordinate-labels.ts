export type CoordinateAnchor={x:number;y:number;text:string;curve:'f'|'g'}
export type CoordinateLabel=CoordinateAnchor & {left:number;top:number;width:number;height:number}
/** Place compact labels in graph coordinates, keeping them clear of pins and one another. */
export function coordinateLabels(points:CoordinateAnchor[],options:{fontSize?:number;reserved?:{left:number;top:number;width:number;height:number}[]}={}):CoordinateLabel[]{
 const labels:CoordinateLabel[]=[]
 const overlap=(a:{left:number;top:number;width:number;height:number},b:{left:number;top:number;width:number;height:number})=>Math.max(0,Math.min(a.left+a.width,b.left+b.width)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.top+a.height,b.top+b.height)-Math.max(a.top,b.top))
 for(const p of points){
  const size=options.fontSize??13,width=p.text.length*(size===13?7.5:size*.58)+4,height=size+5,candidates=[]
  for(let distance=20;distance<=180;distance+=20){
   const above=p.curve==='f'?1:-1
   for(const [dx,dy] of [[0,above*distance],[0,-above*distance],[distance,0],[-distance,0],[distance,distance],[-distance,-distance],[distance,-distance],[-distance,distance]]){
    const left=Math.max(43,Math.min(457-width,p.x+dx-width/2)),top=Math.max(43,Math.min(457-height,p.y+dy-height/2))
    const box={left,top,width,height},collision=(options.reserved??[]).reduce((sum,r)=>sum+overlap(box,r),0)+labels.reduce((sum,l)=>sum+overlap(box,{left:l.left-3,top:l.top-3,width:l.width+6,height:l.height+6}),0)+points.reduce((sum,v)=>sum+overlap(box,{left:v.x-8,top:v.y-8,width:16,height:16}),0)
    candidates.push({...p,...box,cost:collision*1000+Math.hypot(left+width/2-p.x,top+height/2-p.y)})
   }
  }
  candidates.sort((a,b)=>a.cost-b.cost);labels.push(candidates[0])
 }
 return labels
}
