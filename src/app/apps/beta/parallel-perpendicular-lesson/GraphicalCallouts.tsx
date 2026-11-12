import type {LessonProblem} from '@/lib/parallel-lesson'

export default function GraphicalCallouts({id,name,q,sx,sy}:{id:string;name:string;q:LessonProblem;sx:(x:number)=>number;sy:(y:number)=>number}){
 const first=q.id==='P1'
 const redY=first?270:330
 const leftBlue=q.given.m<0
 const blueX=leftBlue?62:254
 const lineX=leftBlue?-3:Math.min(8,(4-q.given.b)/q.given.m)
 const point={x:sx(q.point.x),y:sy(q.point.y)}
 const start={x:250,y:redY}
 const inset=13/Math.hypot(point.x-start.x,point.y-start.y)
 const pointLeader=first?'M277 317L357 297':`M${start.x} ${start.y}L${point.x+(start.x-point.x)*inset} ${point.y+(start.y-point.y)*inset}`
 const lineLeader=`M${blueX+(leftBlue?92:122)} 128L${sx(lineX)} ${sy(q.given.m*lineX+q.given.b)}`
 const arrow=`url(#${id}-callout-arrow)`
 return <g className="lp-graphical-callouts">
  <defs>
   <marker id={`${id}-callout-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
    <path d="M0 0L10 5L0 10z" fill="#253b52"/>
   </marker>
  </defs>
  <foreignObject x="48" y="0" width="404" height="50">
   <div className="lp-graphical-title" role="status"><span data-no-translate>{name}</span>, <span>you found the GRAPHICAL answer to the question!</span></div>
  </foreignObject>
  <path className="lp-callout-leader" d={pointLeader} markerEnd={arrow}/>
  <path className="lp-callout-leader" d={lineLeader} markerEnd={arrow}/>
  <foreignObject x="62" y={redY} width="222" height="112">
   <div className="lp-graphical-bubble lp-graphical-red"><span>The red line goes</span>{' '}<u>through the point</u>{' '}<span>{q.relation==='parallel'?'and is parallel to blue.':'and is perpendicular to blue.'}</span></div>
  </foreignObject>
  <foreignObject x={blueX} y="92" width="184" height="70">
   <div className="lp-graphical-bubble lp-graphical-blue">Given blue line</div>
  </foreignObject>
 </g>
}
