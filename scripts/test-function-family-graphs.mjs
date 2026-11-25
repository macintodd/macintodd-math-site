import assert from 'node:assert/strict'
import vm from 'node:vm'
import katex from 'katex'
import {
  familyIds, familyNames, familyQuestion, familyValue, familyGraphPath, parentEquations,
  freshGraphFamilyState, graphFamilyReducer, activeFamilyQuestion, graphFamilySnapshot,
  readGraphFamilySnapshot, revealDuration, speedDuration,
} from '../src/lib/function-family-graphs.ts'
import {lessonBridgeBootstrap} from '../src/lib/mathboard/lesson-bridge.ts'
import {spanishText} from '../src/lib/beta-spanish.ts'

// Evaluate the independently parsed displayed equation, not the graph's evaluator.
function equationValue(tex, x) {
  const expression = tex.slice('g(x)='.length)
    .replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '($1/$2)')
    .replace(/\\lvert\s*(.*?)\\rvert/g, 'Math.abs($1)')
    .replace(/(\d|\))(?=x|\(|Math\.abs)/g, '$1*')
    .replace(/^-/,'-1*').replace(/\^/g, '**')
  return new Function('x', `return ${expression}`)(x)
}
for (const seed of [0, 1, 17, 1928, 4294967295, ...Array.from({length: 20}, (_, i) => i * 1999)]) {
  for (let block = 0; block < 8; block++) {
    const qs = Array.from({length: 5}, (_, i) => familyQuestion(seed, block * 5 + i))
    assert.deepEqual(new Set(qs.map(q => q.family)), new Set(familyIds))
    for (const q of qs) {
      assert(q.a !== 0)
      assert(q.b === 1 || q.h === 0, 'Never combine horizontal scaling and shifting')
      katex.renderToString(q.equation, {throwOnError: true, trust: false})
      katex.renderToString(parentEquations[q.family], {throwOnError: true, trust: false})
      for (const x of [-4, -1.5, 0, .5, 3]) assert(Math.abs(equationValue(q.equation, x) - familyValue(q, x)) < 1e-8, q.equation)
      if (block === 0) assert.deepEqual([familyValue(q, -1), familyValue(q, 0), familyValue(q, 1)], q.family === 'constant' ? [1, 1, 1] : q.family === 'quadratic' || q.family === 'absolute' ? [1, 0, 1] : [-1, 0, 1])
    }
    if (block) assert.notEqual(qs[0].family, familyQuestion(seed, block * 5 - 1).family)
  }
}
for (let index = 0; index < 25; index++) {
  const path = familyGraphPath(familyQuestion(777, index))
  assert(path.startsWith('M'))
  assert(!/NaN|Infinity|undefined/.test(path))
}

// Cumulative correctness is not the ten-in-a-row mastery gate.
let cumulative = {...freshGraphFamilyState(), scene:'practice', first:'Test', last:'Learner', hour:'4', seed:71}
const countedAnswer = right => {
  const family = activeFamilyQuestion(cumulative).family
  cumulative = graphFamilyReducer(cumulative,{type:'answer',family:right?family:familyIds.find(f=>f!==family),now:1})
  cumulative = graphFamilyReducer(cumulative,{type:'next'})
}
for(let run=0;run<3;run++){for(let i=0;i<4;i++)countedAnswer(true);countedAnswer(false)}
assert.equal(cumulative.practice.correct,12,'Number correct continues beyond ten and survives misses')
assert.equal(cumulative.practice.best,4)
assert.equal(graphFamilySnapshot(cumulative,'en',0).score,4,'The raw total does not replace the best-streak grade')
assert.equal(graphFamilyReducer(cumulative,{type:'ready'}).scene,'practice')
for(let i=0;i<5;i++)countedAnswer(true)
assert.equal(cumulative.practice.correct,17)
assert.equal(cumulative.practice.best,5)
assert.equal(graphFamilyReducer(cumulative,{type:'ready'}).scene,'practice','Five in a row with more than ten total is still not mastery in this widget')
for(let i=0;i<5;i++)countedAnswer(true)
assert.equal(cumulative.practice.best,10)
assert.equal(graphFamilyReducer(cumulative,{type:'ready'}).scene,'ready')

let s = freshGraphFamilyState()
const act = action => {s = graphFamilyReducer(s, action); return s}
act({type: 'start', seed: 77}); assert.equal(s.scene, 'welcome')
for (const [field, value] of [['first', 'Test'], ['last', 'Learner'], ['hour', '4']]) act({type: 'identity', field, value})
act({type: 'start', seed: 77})
assert.equal(s.scene, 'practice')
act({type: 'start-speed', now: 1}); assert.equal(s.scene, 'practice', 'Speed round is earned by a streak of ten')
act({type: 'report', now: 2})
assert.equal(graphFamilySnapshot(s, 'en', 0).score, 0, 'A report is available before any answers')
assert.equal(graphFamilySnapshot(s, 'en', 0).isComplete, false, 'The required reflection/image step must not be marked complete prematurely')
act({type: 'return'})
function answer(right = true, now = 3) {
  const family = activeFamilyQuestion(s).family
  act({type: 'answer', family: right ? family : familyIds.find(f => f !== family), now})
}
for (let i = 0; i < 4; i++) {answer(); const same = s; answer(); assert.equal(s, same, 'Repeated taps cannot double count'); act({type: 'next'})}
answer(false)
assert.equal(s.practice.streak, 0)
assert.equal(s.practice.best, 4)
act({type: 'report', now: 10})
assert.equal(graphFamilySnapshot(s, 'en', 0).score, 4, 'A miss never erases the best streak')
assert.equal(s.practice.attempts, 5)
assert(!('totalItems' in graphFamilySnapshot(s, 'en', 0)), 'An open-ended practice must not invent a fixed problem total')
act({type: 'return'}); act({type: 'next'})
for (let i = 0; i < 10; i++) {answer(); if (i < 9) act({type: 'next'})}
assert.equal(s.practice.best, 10)
let extended = s
for (let i = 0; i < 2; i++) {
  extended = graphFamilyReducer(extended, {type: 'next'})
  extended = graphFamilyReducer(extended, {type: 'answer', family: activeFamilyQuestion(extended).family, now: 99})
}
assert.equal(graphFamilySnapshot(extended, 'en', 0).score, 10, 'The grade stays capped even when a student practices beyond ten')
assert.equal(graphFamilySnapshot(extended, 'en', 0).longestStreak, 12, 'Optional streak data still reflects the actual run')
act({type: 'ready'}); act({type: 'start-speed', now: 1_000})
assert.equal(s.scene, 'speed')
assert.equal(s.speed.deadline, 1_000 + speedDuration)
const unchanged = s
act({type: 'tick', now: 1_100}); assert.equal(s, unchanged, 'Unchanged clock frames must not generate publishable state updates')
for (let i = 0; i < 13; i++) {
  const now = 1_001 + i * 700
  answer(true, now)
  const same = s; answer(true, now + 1); assert.equal(s, same)
  assert.equal(s.speed.count, i + 1)
  const index = s.speed.index
  act({type: 'tick', now: now + revealDuration - 1}); assert.equal(s.speed.index, index)
  act({type: 'tick', now: now + revealDuration}); assert.equal(s.speed.index, index + 1)
}
answer(false, 11_000)
assert.equal(s.scene, 'speed-result')
assert.equal(s.speed.reason, 'miss')
assert.equal(s.speed.last, 13, 'Speed score is the uncapped count in this run')
assert.equal(graphFamilySnapshot(s, 'en', 0).score, 10, 'Speed performance does not change the practice grade')
answer(true, 11_001); assert.equal(s.speed.count, 13, 'A finished round cannot accept another answer')
act({type: 'start-speed', now: 20_000})
assert.equal(s.speed.count, 0); assert.equal(s.speed.best, 13); assert.equal(s.speed.round, 2)
answer(true, 20_100)
act({type: 'tick', now: 80_000})
assert.equal(s.speed.reason, 'time'); assert.equal(s.speed.last, 1); assert.equal(s.speed.remainingMs, 0)
act({type: 'start-speed', now: 100_000})
answer(true, 160_000)
assert.equal(s.speed.count, 0, 'Answers at or after the deadline cannot earn points')
assert.equal(s.scene, 'speed-result')
act({type: 'start-speed', now: 200_000}); answer(true, 200_100)
act({type: 'report', now: 200_101})
assert.equal(s.speed.reason, 'report'); assert.equal(s.speed.last, 1)
const reflected = {...s, completion: {confidence: 4, difficulty: 3, notice: false, error: '', record: {image: 'data:image/png;base64,AAAA', language: 'es', identity: 'Test|4|date'}}}
const snapshot = graphFamilySnapshot(reflected, 'es', 400)
assert.equal(snapshot.isComplete, true, 'A prepared record finishes the session, including an early finish')
assert.equal(graphFamilySnapshot(reflected, 'en', 400).isComplete, false, 'Changing language requires the current-language record before completion')
assert.deepEqual(readGraphFamilySnapshot(JSON.parse(JSON.stringify(snapshot))), snapshot)
assert.deepEqual(readGraphFamilySnapshot(graphFamilySnapshot(s, 'en', 0)).customState.state, s)
for (const invalid of [null, {}, {...snapshot, app: 'another-widget'}, {...snapshot, version: 2}, {...snapshot, customState: {...snapshot.customState, state: {...s, practice: {...s.practice, selected: 'rational'}}}}]) assert.equal(readGraphFamilySnapshot(invalid), null)

// The head bootstrap must queue incoming state before React and never echo it.
function host(native = true, search = '') {
  const events = new Map(), window = {location: {pathname: '/apps/beta/function-family-graphs', search}, addEventListener: (name, fn) => events.set(name, fn)}
  if (native) window.MathBoardApplet = {publishState: () => {throw Error('Bootstrap must never publish')}}
  vm.runInNewContext(lessonBridgeBootstrap, {window, URLSearchParams})
  return {window, events}
}
for (const native of [true, false]) {
  const h = host(native)
  assert.equal(typeof h.window.mathBoardAppletSetState, 'function')
  h.window.mathBoardAppletSetState(snapshot)
  let restored
  h.window.mathBoardLessonBridge.listen(incoming => {restored = readGraphFamilySnapshot(incoming); return !!restored})
  assert.deepEqual(restored, snapshot)
  assert.equal(h.window.mathBoardLessonBridge.canPublish(), false)
  h.events.get('pointerdown')({isTrusted: true})
  assert.equal(h.window.mathBoardLessonBridge.canPublish(), true)
}
const projector = host(true, '?mathboardDisplay=1')
projector.events.get('pointerdown')({isTrusted: true})
assert.equal(projector.window.mathBoardLessonBridge.canPublish(), false)
for (const text of ['1. Identify Function Family from Graph', ...Object.values(familyNames), 'Recognize constant, linear, absolute value, quadratic, and cubic function families from their graphs.', 'Practice score = your best correct streak, up to 10. A miss never erases your best streak.']) assert.notEqual(spanishText(text), text, text)
console.log('Passed five-family coverage, graph/equation agreement, streak reports, speed deadlines/retries, JSON restoration, early native queue/no-echo, projector guard, and Spanish coverage.')
