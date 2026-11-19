'use client'
import {categoryCookie,parseDirectoryCategory,type DirectoryCategory} from '@/lib/practice-directory'
let sessionCategory:DirectoryCategory|undefined
const eventName='macintodd-practice-category-change'
export function subscribeCategory(listener:()=>void){window.addEventListener(eventName,listener);return ()=>window.removeEventListener(eventName,listener)}
export function readCategory(){
 if(sessionCategory)return sessionCategory
 try{return parseDirectoryCategory(document.cookie.split('; ').find(item=>item.startsWith(`${categoryCookie}=`))?.slice(categoryCookie.length+1))}catch{return parseDirectoryCategory(undefined)}
}
export function rememberCategory(category:DirectoryCategory){
 sessionCategory=category
 try{document.cookie=`${categoryCookie}=${encodeURIComponent(category)}; Path=/apps; Max-Age=31536000; SameSite=Lax${location.protocol==='https:'?'; Secure':''}`}catch{/* The current tab still remembers the choice when cookies are blocked. */}
 window.dispatchEvent(new Event(eventName))
}
