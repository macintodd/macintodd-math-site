import BilingualWidget from '@/components/practice/BilingualWidget'
import Practice from './Practice'
import {reviewTitle} from '@/lib/precalc-review'
export const metadata={title:reviewTitle,description:'Self-evaluation companion to the 30-question Sections 1.6–1.7B review: parent functions, piecewise graphs, shifts, reflections, stretches, shrinks and point mapping.'}
export default function Page(){return <BilingualWidget spanishFirst><Practice/></BilingualWidget>}
