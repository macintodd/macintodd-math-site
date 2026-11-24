import BilingualWidget from '@/components/practice/BilingualWidget'
import FamilyGraphs from './FamilyGraphs'
import './family-graphs.css'

export const metadata = {
  title: 'Transformations 1 · Identify Function Family from Graph',
  description: 'Recognize constant, linear, absolute value, quadratic, and cubic graphs. Build a streak of ten, then try a one-minute speed round.',
}
export default function Page() {
  return <div className="ffg-root"><BilingualWidget spanishFirst><FamilyGraphs/></BilingualWidget></div>
}
