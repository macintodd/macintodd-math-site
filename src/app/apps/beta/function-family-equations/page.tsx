import BilingualWidget from '@/components/practice/BilingualWidget'
import FamilyEquations from './FamilyEquations'
import '../function-family-graphs/family-graphs.css'
import './equations.css'
export const metadata = {
 title: '2. Identify Function Family by Equation',
 description: 'Identify constant, linear, absolute value, quadratic, and cubic families from equations. Parent practice followed by advanced identification.',
}
export default function Page(){return <div className="ffg-root fe-root"><BilingualWidget spanishFirst><FamilyEquations/></BilingualWidget></div>}
