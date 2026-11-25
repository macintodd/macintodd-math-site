import assert from 'node:assert/strict'
import {
  activeFamilyQuestion, familyIds, freshGraphFamilyState, graphFamilyReducer,
  graphFamilySnapshot, readGraphFamilySnapshot,
} from '../src/lib/function-family-graphs.ts'
import {freshFamilyStarState, familyStarReducer, readStarTrail} from '../src/lib/function-family-stars.ts'
import {spanishText} from '../src/lib/beta-spanish.ts'

let core = freshGraphFamilyState(), ui = freshFamilyStarState()
function stripPresentation(snapshot) {
  const copy = JSON.parse(JSON.stringify(snapshot))
  delete copy.customState.state.starTrail
  return copy
}
function apply(action) {
  core = graphFamilyReducer(core, action)
  ui = familyStarReducer(ui, action)
  assert.deepEqual(stripPresentation(graphFamilySnapshot(ui, 'en', 0)), stripPresentation(graphFamilySnapshot(core, 'en', 0)), 'Presentation must never change the existing score, timer, completion, or native fields')
}
function answer(right) {
  const family = activeFamilyQuestion(ui).family
  apply({type:'answer', family:right ? family : familyIds.find(f => f !== family), now:10})
}
function next() {apply({type:'next'})}
for (const [field,value] of [['first','Test'],['last','Learner'],['hour','4']]) apply({type:'identity',field,value})
apply({type:'start',seed:12})
for (let i=0;i<3;i++) {answer(true); next()}
assert.equal(ui.practice.streak,3)
assert.deepEqual(readStarTrail(ui),{completed:[],earlierCorrect:0})
answer(false)
assert.deepEqual(readStarTrail(ui),{completed:[3],earlierCorrect:0})
assert.equal(ui.practice.streak,0)
const once = ui
answer(false)
assert.equal(ui,once,'Duplicate taps cannot add another finished star')
next(); answer(true)
assert.deepEqual(readStarTrail(ui),{completed:[3],earlierCorrect:0})
assert.equal(ui.practice.streak,1)
next(); answer(true); next(); answer(false)
assert.deepEqual(readStarTrail(ui),{completed:[3,2],earlierCorrect:0})
next(); answer(false); next(); answer(true)
assert.deepEqual(readStarTrail(ui),{completed:[3,2],earlierCorrect:0},'Misses at zero do not make zero-point stars')
assert.equal(ui.practice.streak,1)
assert.equal(graphFamilySnapshot(ui,'en',0).score,3,'The grade is still the best streak, not total accumulated stars')

const snapshot = JSON.parse(JSON.stringify(graphFamilySnapshot(ui,'es',180)))
const accepted = readGraphFamilySnapshot(snapshot)
assert(accepted, 'The existing native reader accepts the additional presentation metadata')
let restored = familyStarReducer(freshFamilyStarState(),{type:'restore',value:accepted.customState.state})
assert.deepEqual(readStarTrail(restored),{completed:[3,2],earlierCorrect:0})
assert.equal(restored.practice.streak,1)
assert.deepEqual(stripPresentation(graphFamilySnapshot(restored,'es',180)),stripPresentation(snapshot))

const legacy = JSON.parse(JSON.stringify(snapshot))
delete legacy.customState.state.starTrail
const legacyAccepted = readGraphFamilySnapshot(legacy)
restored = familyStarReducer(freshFamilyStarState(),{type:'restore',value:legacyAccepted.customState.state})
assert.deepEqual(readStarTrail(restored),{completed:[],earlierCorrect:5},'Old snapshots retain earlier totals without inventing separate streak lengths')
restored = familyStarReducer(restored,{type:'next'})
restored = familyStarReducer(restored,{type:'answer',family:familyIds.find(f=>f!==activeFamilyQuestion(restored).family),now:20})
assert.deepEqual(readStarTrail(restored),{completed:[1],earlierCorrect:5})
const invalid = {...ui,starTrail:{completed:[5],earlierCorrect:0}}
assert.deepEqual(readStarTrail(invalid),{completed:[],earlierCorrect:5},'A run longer than the actual best streak is invalid presentation data')

apply({type:'report',now:100})
assert.deepEqual(readStarTrail(ui),{completed:[3,2],earlierCorrect:0})
apply({type:'return'}); next(); answer(false); next()
for (let i=0;i<10;i++) {answer(true); if(i<9)next()}
const trail = readStarTrail(ui)
apply({type:'ready'}); apply({type:'start-speed',now:1000})
apply({type:'answer',family:activeFamilyQuestion(ui).family,now:1001})
apply({type:'tick',now:2000})
apply({type:'tick',now:61000})
assert.deepEqual(readStarTrail(ui),trail,'Speed rounds do not modify practice-star history')
for (const text of ['Your streaks','Completed streak','Earn your first star','Earlier correct answers','Practice score']) assert.notEqual(spanishText(text),text)
console.log('Passed separate numbered runs, live stars, repeated/zero misses, unchanged core/native score fields, current and legacy snapshot restoration, speed independence, and Spanish labels.')

// Opening information is restorable presentation, independent of the grade and timer.
const unopened=freshFamilyStarState(), opened=familyStarReducer(unopened,{type:'info',open:true})
assert.equal(opened.infoOpen,true)
const openedSnapshot=graphFamilySnapshot(opened,'en',0), reopened=readGraphFamilySnapshot(JSON.parse(JSON.stringify(openedSnapshot)))
assert(reopened)
const restoredInfo=familyStarReducer(freshFamilyStarState(),{type:'restore',value:reopened.customState.state})
assert.equal(restoredInfo.infoOpen,true)
const dismissed=familyStarReducer(restoredInfo,{type:'info',open:false})
assert.equal(dismissed.infoOpen,false)
for(const current of [opened,dismissed]){
 const native=JSON.parse(JSON.stringify(graphFamilySnapshot(current,'en',0)))
 delete native.customState.state.infoOpen
 assert.deepEqual(native,graphFamilySnapshot(unopened,'en',0),'Information must not change scores, counters, question state, timers or completion fields')
}
console.log('Passed optional information-dialog state restoration and unchanged native grading/timer fields.')
