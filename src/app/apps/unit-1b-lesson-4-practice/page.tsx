import BilingualWidget from '@/components/practice/BilingualWidget'
import Practice from './Practice'
import {worksheetTitle} from '@/lib/linear-worksheet'
export const metadata={title:worksheetTitle}
export default function Page(){return <BilingualWidget spanishFirst><Practice/></BilingualWidget>}
