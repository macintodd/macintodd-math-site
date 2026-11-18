export const WHEEL_LAYOUT='wild-v1';
export const WILD_DEGREES=18;
export const CATEGORY_DEGREES=(360-WILD_DEGREES)/8;
export function wheelSegments(layout=WHEEL_LAYOUT){const normal=layout===WHEEL_LAYOUT?CATEGORY_DEGREES:45,parts=Array.from({length:8},(_,i)=>({category:i+1,start:i*normal,end:(i+1)*normal}));if(layout===WHEEL_LAYOUT)parts.push({category:0,start:360-WILD_DEGREES,end:360});return parts;}
export function segmentCenter(category,layout=WHEEL_LAYOUT){const part=wheelSegments(layout).find(p=>p.category===category);return part?(part.start+part.end)/2:0;}
export function drawCategory(value){const angle=Math.max(0,Math.min(.999999999,value))*360;return angle>=360-WILD_DEGREES?0:1+Math.floor(angle/CATEGORY_DEGREES);}
