import BilingualWidget from '@/components/practice/BilingualWidget'
import Practice from './Practice'
import {stpTitle} from '@/lib/slope-two-points'
export const metadata={title:stpTitle}
export default function Page(){return <BilingualWidget><Practice/></BilingualWidget>}
