import {firebaseConfig} from '../cardclash/js/firebase-config.js';
import {pollId,validChoice} from './model.js';
export async function connectPoll({onVotes,onConnection,onError}){
 const base='https://www.gstatic.com/firebasejs/13.3.0/';
 const [app,auth,db]=await Promise.all([import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-database.js')]);
 const instance=app.getApps().find(a=>a.name==='class-survey')??app.initializeApp(firebaseConfig,'class-survey'),a=auth.getAuth(instance);
 await auth.setPersistence(a,auth.browserLocalPersistence);
 await a.authStateReady();
 if(!a.currentUser)await auth.signInAnonymously(a);
 const database=db.getDatabase(instance),root=db.ref(database,`classSurveys/${pollId}/votes`),own=db.ref(database,`classSurveys/${pollId}/votes/${a.currentUser.uid}`);
 const stops=[db.onValue(db.ref(database,'.info/connected'),s=>onConnection(s.val()===true)),db.onValue(root,s=>{const votes=s.val()??{};onVotes(votes,votes[a.currentUser.uid]??null)},onError)];
 return {async vote(choice){if(!validChoice(choice))throw Error('Choose A or B.');const result=await db.runTransaction(own,current=>current===null?choice:undefined,{applyLocally:false});const value=result.snapshot.val();if(!validChoice(value))throw Error('Your vote could not be saved. Please reconnect.');return {choice:value,alreadyVoted:!result.committed}},close(){stops.forEach(stop=>stop())}};
}
export function friendlyError(error){if(/permission|denied/i.test(error?.message??''))return 'The survey is not ready to accept votes yet. Please ask Mr. Todd to check the survey connection.';if(/storage|persist|cookie/i.test(error?.message??''))return 'Please enable browser storage and cookies, then reconnect.';return 'Connection interrupted. Check your internet connection and press Reconnect.';}
