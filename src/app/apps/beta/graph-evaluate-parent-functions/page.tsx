import BilingualWidget from '@/components/practice/BilingualWidget'
import ParentLesson from './ParentLesson'
import '../function-family-graphs/family-graphs.css'
import './parent-lesson.css'
export const metadata={title:'3. Graphing and Evaluating Parent Functions',description:'Graph five parent functions twice without hints and connect function notation with ordered pairs. Worked evaluation feedback and recoverable points.'}
export default function Page(){return <div className="ffg-root pfl-root"><BilingualWidget spanishFirst><ParentLesson/></BilingualWidget></div>}
