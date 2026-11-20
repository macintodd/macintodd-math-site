export const pollId='apcalc-break-2026';
export const cookieName='macintodd_apcalc_break_2026_vote';
export function classCodeMatches(value){return typeof value==='string'&&value.trim().toLowerCase()==='apcalc';}
export function validChoice(value){return value==='A'||value==='B';}
export function voteFromCookie(value){const part=value.split(';').map(s=>s.trim()).find(s=>s.startsWith(cookieName+'='));const choice=part?.slice(cookieName.length+1);return validChoice(choice)?choice:null;}
export function voteCookie(choice,secure=true){if(!validChoice(choice))throw Error('Choose A or B.');return `${cookieName}=${choice}; Max-Age=31536000; Path=/; SameSite=Lax${secure?'; Secure':''}`;}
export function voteTotals(votes){let A=0,B=0;for(const value of Object.values(votes??{})){if(value==='A')A++;if(value==='B')B++;}const total=A+B;return {A,B,total,percentA:total?Math.round(A/total*100):0,percentB:total?Math.round(B/total*100):0};}
