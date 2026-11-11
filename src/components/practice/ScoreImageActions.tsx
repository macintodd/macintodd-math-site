'use client'
import {useEffect,useState} from 'react'
import './scorecard.css'
export default function ScoreImageActions({image,filename='practice-scorecard.png',buttonLabel='Save or Share Image'}:{image:string;filename?:string;buttonLabel?:string}){
 const [prepared,setPrepared]=useState<{image:string;file:File}|null>(null),[message,setMessage]=useState(''),[busy,setBusy]=useState(false)
 useEffect(()=>{let active=true;void fetch(image).then(r=>r.blob()).then(blob=>{if(active)setPrepared({image,file:new File([blob],filename,{type:'image/png'})})}).catch(()=>{if(active)setMessage('Touch and hold the image below, then choose Save to Photos or Save Image.')});return()=>{active=false}},[image,filename])
 async function share(){if(!prepared||prepared.image!==image||busy)return;const data={files:[prepared.file]};if(!navigator.share||!navigator.canShare?.(data)){setMessage('This browser cannot open the image share menu. Touch and hold the image below, then choose Save to Photos or Save Image.');return}setMessage('');setBusy(true);try{await navigator.share(data);setMessage('If you saved the image, open Google Classroom and attach it to your assignment.')}catch(error){if(!(error instanceof Error&&error.name==='AbortError'))setMessage('The menu could not open. Touch and hold the image below to save it instead.')}finally{setBusy(false)}}
 return <div className="score-image-actions"><button type="button" disabled={!prepared||prepared.image!==image||busy} onClick={share}>{busy?'Share menu open…':buttonLabel}</button><p>On iPad, choose “Save Image” or “Save to Photos” if offered. You can also touch and hold the image below.</p>{message&&<p role="status">{message}</p>}</div>
}
