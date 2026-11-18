import PracticeHub from '../PracticeHub'
import {practiceHubs} from '@/content/practice-hubs'
const hub=practiceHubs.find(hub=>hub.slug==='precalculus-1-6-1-7b-review')!
export const metadata={title:hub.title,description:hub.description}
export default function Page(){return <PracticeHub hub={hub}/>}
