import BilingualWidget from '@/components/practice/BilingualWidget'
import Practice from './Practice'
import {reviewTitle} from '@/lib/day1-review'
export const metadata={title:reviewTitle,description:'Self-evaluation review of Unit 1B Day 1: functions, slope, rates of change, intercepts, and graphs. Parts A and B, hints, retries, and saved progress.'}
export default function Page(){return <BilingualWidget spanishFirst><Practice/></BilingualWidget>}
