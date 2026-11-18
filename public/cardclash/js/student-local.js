// This profile module has no Firebase imports or network calls. Names stay on this device.
const key=(game,code)=>`cardClashLocalName:${game}:${code}`;
export function loadLocalName(storage,game,code){try{return storage.getItem(key(game,code))||'';}catch{return '';}}
export function saveLocalName(storage,game,code,value){try{storage.setItem(key(game,code),value);return true;}catch{return false;}}
