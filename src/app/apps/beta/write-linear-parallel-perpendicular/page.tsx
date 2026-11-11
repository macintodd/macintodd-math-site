import Tutorial from './Tutorial'
import BilingualWidget from '@/components/beta/BilingualWidget'
import '../../intro-point-slope/intro-point-slope.css'
import '../../write-linear-equation/practice.css'
import '../../parallel-perpendicular/tutorial.css'
import './version-two.css'
export const metadata={title:'Write the Linear Equation: Parallel and Perpendicular · Beta'}
export default function Page(){return <BilingualWidget spanishFirst><Tutorial/></BilingualWidget>}
