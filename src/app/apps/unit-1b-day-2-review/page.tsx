import BilingualWidget from '@/components/practice/BilingualWidget'
import Practice from './Practice'
import {reviewTitle} from '@/lib/day2-review'
export const metadata={title:reviewTitle,description:'Self-evaluation review of Unit 1B Day 2: writing linear equations, slope-intercept and point-slope form, two points, horizontal lines, and cost models. Parts A and B, hints, retries, and saved progress.'}
export default function Page(){return <BilingualWidget spanishFirst><Practice/></BilingualWidget>}
