import {reportInfo} from '@/lib/scorecard'
import './scorecard.css'
export default function ReportIdentity({slug}:{slug:string}){const {title,skill}=reportInfo(slug);return <div className="report-identity"><strong>{title}</strong><p><b>Skill practiced:</b> {skill}</p></div>}
