/** Apply a keypad operation at the text caret, replacing a selection when present. */
export function editAnswer(current:string,key:string,start:number,end:number){
 const from=Math.max(0,Math.min(start,current.length)),to=Math.max(from,Math.min(end,current.length))
 if(key==='clear')return {value:'',caret:0}
 if(key==='sign')return current.startsWith('-')?{value:current.slice(1),caret:Math.max(0,from-1)}:{value:'-'+current,caret:from+1}
 if(key==='back'){
  const cut=from===to?Math.max(0,from-1):from
  return {value:current.slice(0,cut)+current.slice(to),caret:cut}
 }
 return {value:current.slice(0,from)+key+current.slice(to),caret:from+key.length}
}
