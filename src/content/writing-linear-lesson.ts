import type {Lesson} from './lessons'
export const writingLinearLesson:Lesson={
 course:'algebra-2',unitSlug:'unit-1b',slug:'writing-linear-equations',title:'Writing Equations of Lines',unit:'Unit 1B',number:'Lesson 4',sortOrder:4,materialSet:'resources',
 description:'Write linear equations from slope and intercept, graphs, a point and slope, or two points. Use the blank or completed notes, paper practice, and online practice levels.',
 goals:['Identify or calculate the slope and a point on a line.','Use slope-intercept or point-slope form to write an equation.','Simplify to slope-intercept form and recognize horizontal and vertical lines.'],
 prerequisites:'Slope, ordered pairs, graphing lines, distribution and solving equations for y.',concepts:[],examples:[],videos:[],
 materials:[
  {
    "kind": "notes",
    "title": "Blank Notes",
    "label": "Blank Notes",
    "description": "Blank Notes for this section.",
    "pages": 2,
    "file": "algebra-2/writing-linear-equations/notes.pdf"
  },
  {
    "kind": "completed-notes",
    "title": "Completed Notes",
    "label": "Completed Notes",
    "description": "Completed Notes for this section.",
    "pages": 2,
    "file": "algebra-2/writing-linear-equations/completed-notes.pdf"
  },
  {
    "kind": "practice",
    "title": "Blank Practice",
    "label": "Blank Practice",
    "description": "Blank Practice for this section.",
    "pages": 2,
    "file": "algebra-2/writing-linear-equations/practice.pdf"
  },
  {kind:'completed-practice',title:'Completed Practice',label:'Completed Practice',file:'algebra-2/writing-linear-equations/completed-practice.pdf',description:'Matching handwritten key for all 16 questions. See the lesson-page correction for problem 7.',pages:2}
],
 materialsNote:String.raw`Correction to the handwritten practice key, problem 7: the final equation is $y=-\frac{5}{4}x+\frac{3}{2}$ (positive intercept). The original PDF is preserved.`,
 practiceActivities:[
  {slug:'unit-1b-lesson-4-practice',description:'Online companion to the 16-problem paper practice. Enter, check and revise your answers in any order. Submit both your paper work and your online record.'},
  {slug:'horizontal-vertical',description:'Level 0: identify horizontal and vertical lines, their equations, and zero or undefined slope.'},
  {slug:'write-linear-equation-level-1',description:'Write an equation when the slope and y-intercept are given.'},
  {slug:'write-linear-equation-level-2',description:'Read the y-intercept and slope from a graph, then write the equation.'},
  {slug:'write-linear-equation-level-3',description:'Use a given point and slope in point-slope form, distribute, and isolate y.'},
  {slug:'write-linear-equation-level-4',description:'Calculate slope from two points, then write the equation of their line.'},
  {slug:'write-linear-equation-level-5',description:'Mixed practice: choose a method using a graph, slope and intercept, a point and slope, or two points.'},
  {slug:'write-linear-equation',description:'Alternative combined activity containing Levels 1–3. Use this when assigned instead of the separate Levels 1–3.'},
 ],
}
