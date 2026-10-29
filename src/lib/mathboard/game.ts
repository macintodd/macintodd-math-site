export type Direction='left'|'right'|'up'|'down'
export function move2048(board:number[],direction:Direction){const next=board.slice(),size=4;const transitions:{from:number;to:number;value:number}[]=[];let gained=0,changed=false
 for(let lane=0;lane<size;lane++){
  const indices=Array.from({length:4},(_,n)=>direction==='left'?lane*4+n:direction==='right'?lane*4+3-n:direction==='up'?n*4+lane:(3-n)*4+lane)
  const values=indices.map(i=>({value:board[i],index:i})).filter(item=>item.value),merged:number[]=[]
  for(let i=0;i<values.length;i++){const destination=indices[merged.length],item=values[i];transitions.push({from:item.index,to:destination,value:item.value});if(item.value===values[i+1]?.value){transitions.push({from:values[i+1].index,to:destination,value:values[i+1].value});merged.push(item.value*2);gained+=item.value*2;i++}else merged.push(item.value)}
  while(merged.length<4)merged.push(0)
  indices.forEach((index,n)=>{next[index]=merged[n];if(next[index]!==board[index])changed=true})
 }
 return {board:next,gained,changed,transitions}
}
export function spawn2048(board:number[],random=Math.random){const empty=board.map((v,i)=>v? -1:i).filter(i=>i>=0);if(!empty.length)return board;const next=board.slice();next[empty[Math.floor(random()*empty.length)]]=random()<.9?2:4;return next}
export function start2048(random=Math.random){return spawn2048(spawn2048(Array(16).fill(0),random),random)}
