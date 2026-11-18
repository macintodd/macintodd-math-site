export type PracticeRow = {slug:string; title?:string; description:string; label?:string}
export type PracticeSection = {id:string; title:string; description?:string; items:PracticeRow[]}
export type PracticeHub = {slug:string; title:string; description:string; sections:PracticeSection[]}
const levels:PracticeRow[] = [
 {slug:'horizontal-vertical',title:'Horizontal & Vertical Lines',label:'Level 0',description:'Recognize horizontal and vertical lines, their equations, and slopes of zero or undefined.'},
 {slug:'write-linear-equation-level-1',title:'Given Slope & Y-Intercept',label:'Level 1',description:'Write a slope-intercept equation from the given slope and y-intercept.'},
 {slug:'write-linear-equation-level-2',title:'Given a Graph',label:'Level 2',description:'Find the y-intercept and slope on a graph, then write the equation of the line.'},
 {slug:'write-linear-equation-level-3',title:'Given a Point & Slope',label:'Level 3',description:'Use point-slope form, distribute, and simplify to slope-intercept form.'},
 {slug:'write-linear-equation-level-4',title:'Given Two Points',label:'Level 4',description:'Calculate slope between two points, then use point-slope form to find the equation.'},
 {slug:'write-linear-equation-level-5',title:'Mixed Equation Practice',label:'Level 5',description:'Choose your method for ten mixed problems. Use the scratch pad and optional hints.'}
]
const slopes:PracticeRow[] = [
 {slug:'slope-two-points',description:'Calculate slope from two ordered pairs: begin with a guided setup, then work independently.'},
 {slug:'slope',description:'Read a line’s slope from its graph by counting signed rise and run.'}
]
const graphing:PracticeRow[] = [
 {slug:'graph-linear',description:'Plot the y-intercept, use the slope to find another point, and draw the line.'},
 {slug:'graph-standard',description:'Find the x- and y-intercepts of a standard-form equation, then graph the line.'},
 {slug:'graph-standard-slope',description:'Rewrite standard form in slope-intercept form on the scratch pad, then graph.'},
 {slug:'graph-mixed',description:'Mix slope-intercept and standard-form equations, with guided and independent graphing.'}
]
const guided:PracticeRow[] = [
 {slug:'line-equations',description:'Use a graph to identify the y-intercept and slope, then write the line’s equation.'},
 {slug:'intro-point-slope',description:'Drag a point and slope into point-slope form, distribute, and isolate y.'},
 {slug:'point-slope',description:'Use points on a cropped graph to build point-slope form and write the final equation.'},
 {slug:'write-linear-equation',description:'Work through Levels 1–3 together in the original connected practice sequence.'}
]
export const practiceHubs:PracticeHub[] = [
 {slug:'writing-linear-equations',title:'Writing Linear Equations',description:'Follow Levels 0–5 in order, or jump directly to the skill you need. Extra guided practice and extensions follow the sequence.',sections:[
  {id:'levels',title:'The Level 0–5 sequence',items:levels},
  {id:'slope',title:'Strengthen your slope skills',items:slopes},
  {id:'guided',title:'More guided equation practice',items:guided},
  {id:'apply',title:'Apply and extend',items:[
   {slug:'unit-1b-lesson-4-practice',description:'Check the Lesson 1.4 paper practice, revisit any problem, and use hints when needed.'},
   {slug:'parallel-perpendicular',label:'Extension',description:'Explore parallel and perpendicular lines, then write equations through a given point.'}
  ]}
 ]},
 {slug:'graphing-linear-equations',title:'Graphing Linear Equations',description:'Practice plotting lines using slope-intercept form, intercepts, or a method of your choice. Each activity opens separately.',sections:[
  {id:'start',title:'Start with lines and slope',items:[levels[0],...slopes]},
  {id:'graph',title:'Graph the equation',items:graphing},
  {id:'connect',title:'Connect graphs and equations',items:[levels[2],guided[0]]},
  {id:'models',title:'Explore rates of change',items:[
   {slug:'mathboard/session-1',description:'Connect a draining pool’s starting volume and rate of change to a graph and equation.'},
   {slug:'tank-flow',label:'Demonstration',description:'Adjust initial water volume and inflow or outflow. Compare the tank with its volume-versus-time graph.'}
  ]}
 ]},
 {slug:'unit-1b-test-practice',title:'Unit 1B Test Practice',description:'Review functions, slope, rate of change, graphing, and writing equations. Choose the skills you need; you do not need to complete every overlapping activity.',sections:[
  {id:'review',title:'Begin with the review',items:[{slug:'unit-1b-day-1-review',description:'Work through Parts A and B of the Day 1 review with checks and hints. The online score is for self-evaluation.'}]},
  {id:'functions',title:'Day 1 · Function evaluation',items:[{slug:'function-evaluation',description:'Practice function notation and substituting inputs. Choose the function types assigned in class.'}]},
  {id:'slope',title:'Day 1 · Slope and rate of change',items:slopes},
  {id:'graph',title:'Day 1 · Lines, intercepts, and graphing',items:[levels[0],...graphing]},
  {id:'equations',title:'Day 2 · Write the equation',items:levels.slice(1)},
  {id:'support',title:'Need another guided example?',items:[guided[1],{slug:'unit-1b-lesson-4-practice',description:'For this test, practice Problems 1–13. Problems 14–16 are parallel-line extension work, outside this test’s scope.'}]}
 ]}
]
