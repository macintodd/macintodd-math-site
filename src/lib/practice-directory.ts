import {appCategories,type AppCategory,type PracticeApp} from '../content/practice-apps.ts'
export type DirectoryCategory=AppCategory|'beta'|'all'
export const categoryCookie='macintodd-practice-category'
export const defaultCategory:DirectoryCategory='Functions'
export function parseDirectoryCategory(value:string|undefined):DirectoryCategory{
 try{const decoded=decodeURIComponent(value??'');return decoded==='beta'||decoded==='all'||appCategories.some(category=>category===decoded)?decoded as DirectoryCategory:defaultCategory}catch{return defaultCategory}
}
export function filterDirectoryApps<T extends Pick<PracticeApp,'slug'|'category'|'courses'|'title'|'description'>>(apps:T[],category:DirectoryCategory,course='',query=''):T[]{
 const search=query.trim().toLocaleLowerCase()
 return apps.filter(app=>(category==='all'||(category==='beta'?app.slug.startsWith('beta/'):!app.slug.startsWith('beta/')&&app.category===category))&&(!course||app.courses.some(item=>item===course))&&(!search||`${app.title} ${app.description}`.toLocaleLowerCase().includes(search)))
}
