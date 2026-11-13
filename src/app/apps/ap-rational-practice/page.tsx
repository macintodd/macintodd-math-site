import BilingualWidget from '@/components/practice/BilingualWidget'
import Practice from './Practice'
import {rationalTitle} from '@/lib/rational-mcq'
export const metadata={title:rationalTitle}
export default function Page(){return <BilingualWidget spanishFirst><Practice/></BilingualWidget>}
