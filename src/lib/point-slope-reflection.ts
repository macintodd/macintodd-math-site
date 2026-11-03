export const pointSlopeReflection=[
 {question:'If you have the slope and a point on a line, can you find the equation of the line in slope-intercept form?',low:'Not yet',high:'Yes, confidently',labels:['Not yet','I need a lot of help','I can with some help','Mostly on my own','Yes, confidently']},
 {question:'How was the practice?',low:'Too easy',high:'Too difficult',labels:['Too easy','Somewhat easy','Just right','Somewhat difficult','Too difficult']},
] as const
export function reflectionAnswer(question:number,rating:number|null){return rating!==null&&Number.isInteger(rating)&&rating>=1&&rating<=5?pointSlopeReflection[question]?.labels[rating-1]??'Not answered':'Not answered'}
