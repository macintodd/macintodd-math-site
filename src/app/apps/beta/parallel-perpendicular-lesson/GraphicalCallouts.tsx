// The leaders are placed for P1's fixed grid and lines.
export default function GraphicalCallouts({id,name}:{id:string;name:string}){
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
  <path className="lp-callout-leader" d="M170 346L190 410" markerEnd={arrow}/>
  <path className="lp-callout-leader" d="M251 321L357 297" markerEnd={arrow}/>
  <path className="lp-callout-leader" d="M376 146L410 223" markerEnd={arrow}/>
  <foreignObject x="62" y="289" width="200" height="96">
   <div className="lp-graphical-bubble lp-graphical-red"><span>The red line goes</span><u>through the point</u></div>
  </foreignObject>
  <foreignObject x="220" y="92" width="218" height="96">
   <div className="lp-graphical-bubble lp-graphical-blue">and is parallel to the given blue line.</div>
  </foreignObject>
 </g>
}
