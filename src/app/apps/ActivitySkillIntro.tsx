'use client'
import BilingualWidget from '@/components/practice/BilingualWidget'
import {useSyncExternalStore,useState,type ReactNode} from 'react'
import {usePathname} from 'next/navigation'
import SkillGoal from '@/components/practice/SkillGoal'
import {Math as Formula} from '@/components/Math'
const goals:Record<string,{text:string;math?:string;connection:string}>={
 '2048':{text:'Combine equal powers of two and plan a sequence of moves.',connection:'Each equal pair doubles when it merges. Look ahead before you move.'},
 'mathboard/session-1':{text:'Connect a starting amount and a rate of change to a graph and a linear equation.',math:'y=mx+b',connection:'Explain what the intercept and slope mean in a real situation.'},
 slope:{text:'Determine the slope of a line from its graph.',math:String.raw`m=\frac{\text{change in }y}{\text{change in }x}`,connection:'Count signed rise and run between two points. Explain what the rate of change tells you.'},
 'line-equations':{text:'Write the equation of a line in slope-intercept form when you know or can determine its slope and y-intercept.',math:'y=mx+b',connection:'The slope m tells how y changes. The point (0, b) gives the starting value.'},
 'graph-linear':{text:'Graph a line from its slope-intercept equation.',math:'y=mx+b',connection:'Plot the y-intercept, then use signed rise and run to locate another point.'},
 'graph-standard':{text:'Find the x- and y-intercepts of a standard-form equation and use them to graph the line.',math:'Ax+By=C',connection:'Set y = 0 to find the x-intercept. Set x = 0 to find the y-intercept.'},
 'graph-standard-slope':{text:'Rewrite a standard-form equation in slope-intercept form and graph the line.',math:'Ax+By=C\\;\\longrightarrow\\;y=mx+b',connection:'Isolate y. Use the slope and starting value to locate two points.'},
 'graph-mixed':{text:'Choose a useful method to graph a linear equation.',math:'Ax+By=C\\qquad y=mx+b',connection:'Use intercepts or slope-intercept form. Your points must satisfy the original equation.'},
 'intro-point-slope':{text:'Find the equation of a line when you know a point and its slope.',math:'y-y_1=m(x-x_1)',connection:'Substitute the given quantities, distribute the slope, then isolate y to write slope-intercept form.'},
 'point-slope':{text:'Use a point and a slope to write the equation of a line.',math:'y-y_1=m(x-x_1)',connection:'Find slope from the graph, substitute a point, distribute, and isolate y.'},
 'function-evaluation':{text:'Evaluate a function at a given input using function notation.',math:'f(a)',connection:'Replace every input variable with the given value, then follow the order of operations.'},
 'function-families':{text:'Identify a parent-function family from the shape of its graph.',connection:'Look for defining features such as a straight line, a vertex, a turning point, or separate branches.'},
 multiplication:{text:'Multiply selected factors accurately and build fluency.',connection:'Connect each fact to equal groups or a fact you already know. If negatives are included, check the sign of the product.'},
 factoring:{text:'Rewrite a polynomial as a product of factors.',connection:'Look for a greatest common factor and number patterns. Multiply your factors to check the original expression.'},
 'transformation-notation':{text:'Read function notation to identify shifts and reflections.',math:'g(x)=af(b(x-h))+k',connection:'Identify changes inside and outside the function. For combined transformations, describe reflections first, then translations.'},
 transformations:{text:'Explain how changes to a, b, h, and k transform a parent function.',math:'g(x)=af(b(x-h))+k',connection:'Change one parameter at a time. Connect what moves on the graph to changes in inputs and outputs.'},
 'one-step-solver':{text:'Solve a one-step equation while keeping both sides equal.',connection:'Use the same inverse operation on both sides, then substitute your answer to check it.'},
 'tank-flow':{text:'Model a changing water volume using an initial amount and a net flow rate.',math:'V(t)=V_0+(r_{in}-r_{out})t',connection:'Connect the starting volume to the y-intercept and the net flow rate to the slope.'}
}
export const equationLanguageRoutes=new Set(["write-linear-equation", "write-linear-equation/teacher", "write-linear-equation-level-1", "write-linear-equation-level-2", "write-linear-equation-level-3", "write-linear-equation-level-4", "write-linear-equation-level-5", "line-equations", "point-slope", "intro-point-slope", "parallel-perpendicular"])
export const transformationLanguageRoutes=new Set(['transformations','transformation-notation','transformation-scales','parent-transformations','rigid-transformations',...Array.from({length:6},(_,i)=>`rigid-transformations/skill-${i+1}`)])
const subscribe=()=>()=>{}
const nativeBridge=()=> 'MathBoardApplet' in window
const serverBridge=()=>false
function Gate({children,goal}:{children:ReactNode;goal:typeof goals[string]}){
 const [acknowledged,setAcknowledged]=useState(false)
 // Native MathBoard demos retain their own mirrored UI and navigation.
 const nativeDemo=useSyncExternalStore(subscribe,nativeBridge,serverBridge)
 return <>{children}{!acknowledged&&!nativeDemo&&<SkillGoal onContinue={()=>setAcknowledged(true)}><p><strong>Skill:</strong> {goal.text}</p>{goal.math&&<p><Formula>{goal.math}</Formula></p>}<p className="skill-goal-method">{goal.connection}</p></SkillGoal>}</>
}
export default function ActivitySkillIntro({children}:{children:ReactNode}){
 const path=usePathname(),slug=path.replace(/^\/apps\//,'')
 // The linear-equation sequence shows its skill reminder AFTER each classroom example.
 const goal=slug.startsWith('rigid-transformations')?undefined:goals[slug]
 const content=goal?<Gate key={path} goal={goal}>{children}</Gate>:children
 if(transformationLanguageRoutes.has(slug))return <BilingualWidget key={path} spanishFirst>{content}</BilingualWidget>
 return equationLanguageRoutes.has(slug)?<BilingualWidget key={path}>{content}</BilingualWidget>:content
}
