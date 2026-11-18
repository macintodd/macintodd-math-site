import {firebaseConfig} from './firebase-config.js';
export async function connect(){
 const base='https://www.gstatic.com/firebasejs/13.3.0/';
 const [app,auth,db]=await Promise.all([import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-database.js')]);
 const instance=app.initializeApp(firebaseConfig),a=auth.getAuth(instance);
 await auth.setPersistence(a,auth.browserSessionPersistence);
 if(!a.currentUser)await auth.signInAnonymously(a);
 const database=db.getDatabase(instance);let offset=0;
 db.onValue(db.ref(database,'.info/serverTimeOffset'),s=>{offset=s.val()||0;});
 return {...db,database,uid:a.currentUser.uid,now:()=>Date.now()+offset};
}
export const friendlyError=e=>['auth/operation-not-allowed','auth/admin-restricted-operation'].includes(e?.code)?'Firebase rejected anonymous sign-in. In the Card Clash project, check Authentication → Sign-in method → Anonymous → Enable, then Save.':/permission|denied/i.test(e?.message||'')?'Database access is locked. The teacher must install the Card Clash database rules.':`Connection failed: ${e?.message||'Check your internet connection and try again.'}`;
