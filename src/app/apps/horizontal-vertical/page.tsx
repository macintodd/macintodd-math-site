import BilingualWidget from '@/components/practice/BilingualWidget'
import Practice from './Practice'
import {hvTitle} from '@/lib/horizontal-vertical'
export const metadata={title:hvTitle}
export default function Page(){return <BilingualWidget><Practice/></BilingualWidget>}
