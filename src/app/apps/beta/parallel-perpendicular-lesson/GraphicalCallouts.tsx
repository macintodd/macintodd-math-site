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
  <path className="lp-callout-leader" d="M277 317L357 297" markerEnd={arrow}/>
  <path className="lp-callout-leader" d="M376 128L410 223" markerEnd={arrow}/>
  <foreignObject x="62" y="270" width="222" height="112">
   <div className="lp-graphical-bubble lp-graphical-red"><span>The red line goes</span>{' '}<u>through the point</u>{' '}<span>and is parallel to blue.</span></div>
  </foreignObject>
  <foreignObject x="254" y="92" width="184" height="70">
   <div className="lp-graphical-bubble lp-graphical-blue">Given blue line</div>
  </foreignObject>
 </g>
}
