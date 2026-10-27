import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import katex from 'katex'
import { lessons, courses } from '../src/content/lessons.ts'
import { precalculusAssessments } from '../src/content/precalculus.ts'
import { units, getUnit } from '../src/content/units.ts'
import { canonicalFactors } from '../src/lib/factoring.ts'
const root = path.resolve(import.meta.dirname, '..')
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'content-sources.json')))
const published = fs.readdirSync(path.join(root, 'public/materials'), { recursive: true, withFileTypes: true }).filter(e => e.isFile()).map(e => path.relative(path.join(root, 'public/materials'), path.join(e.parentPath, e.name)))
assert.deepEqual(published.sort(), manifest.materials.map(m => m.output).sort(), 'Unexpected file in public materials; publish only reviewed selections')
for (const unit of units) {
  assert(unit.skills.length > 0 && unit.relevance.length > 0, 'Unit must explain skills and relevance')
  assert(lessons.some(l => l.course === unit.course && l.unitSlug === unit.slug), 'Do not publish empty units')
}
for (const item of manifest.materials.filter(m => m.output.startsWith('precalculus/'))) {
  const name = path.basename(item.source ?? '').toLowerCase()
  assert(!/act\s*\d/.test(name) && (name.includes('review') || !/quiz|unit1_test_1/.test(name)), `Do not publish an assessment: ${name}`)
}
assert(precalculusAssessments.every(item => !('file' in item) && !('href' in item)), 'Assessments must be unlinked')
const ids = new Set()
let formulas = 0
for (const l of lessons) {
  assert(courses.some(c => c.id === l.course), `Unknown course: ${l.course}`)
  assert(getUnit(l.course, l.unitSlug), `Lesson has no linked unit overview: ${l.slug}`)
  const id = `${l.course}/${l.slug}`
  assert(!ids.has(id), `Duplicate lesson: ${id}`); ids.add(id)
  if (l.materialSet !== 'resources') assert.equal(l.materials.length, 4, `Required materials: ${id}`)
  if (l.followUpOf) assert(lessons.some(parent => parent.slug === l.followUpOf && parent.course === l.course && !parent.followUpOf), `Follow-up needs a parent lesson: ${id}`)
  assert(l.videos.length > 0)
  for (const v of l.videos) assert(/^[\w-]{11}$/.test(v.id), 'Invalid YouTube ID')
  const examples = new Set()
  for (const ex of l.examples) {
    assert(!examples.has(ex.id), 'Duplicate example anchor'); examples.add(ex.id)
    assert(ex.steps.length >= 2)
    for (const step of ex.steps) { katex.renderToString(step.math, { throwOnError: true, trust: false }); formulas++ }
  }
  for (const c of l.concepts) if (c.formula) { katex.renderToString(c.formula, { throwOnError: true }); formulas++ }
  if (l.check) { katex.renderToString(l.check.answer, { throwOnError: true }); formulas++ }
  assert(l.materials.some(m => m.file) || (l.materialSet === 'resources' && l.materialsNote), 'Lesson needs reviewed materials or an explicit note')
  for (const m of l.materials.flatMap(m => [m, ...(m.additional ?? [])])) {
    if (!m.file) {
      assert(m.unavailableReason && m.pages === 0, `Missing document needs an explicit reason: ${id}`)
      assert(m.kind === 'completed-notes' || m.kind === 'completed-practice', 'Only missing keys may be unpublished')
      continue
    }
    const item = manifest.materials.find(i => i.output === m.file)
    assert(item, `Material not in explicit publishing allowlist: ${m.file}`)
    const data = fs.readFileSync(path.join(root, 'public/materials', m.file))
    assert(data.subarray(0,4).equals(Buffer.from('%PDF')), `Invalid PDF: ${m.file}`)
    assert.equal(item.publishedPages, m.pages, `Page count mismatch: ${m.file}`)
    assert.equal(crypto.createHash('sha256').update(data).digest('hex'), item.publishedSha256, `PDF changed without a reviewed source update: ${m.file}`)
  }
}
assert.equal(canonicalFactors('(x+3)(x+2)'), canonicalFactors('(x+2)(x+3)'))
assert.equal(canonicalFactors('(x+3)^2'), canonicalFactors('(x+3)(x+3)'))
assert.equal(canonicalFactors('2(x+1)(x+3)'), canonicalFactors('(x+3)*2*(x+1)'))
assert.equal(canonicalFactors('(x+3)²'), canonicalFactors('(x+3)^2'))
assert.notEqual(canonicalFactors('(x-3)(x+2)'), canonicalFactors('(x+2)(x+3)'))
assert.equal(canonicalFactors('x^2+5x+6'), null)
assert.equal(canonicalFactors('alert(1)'), null)
console.log(`Passed: ${lessons.length} lessons, ${manifest.materials.length} allowlisted PDFs, ${formulas} math expressions, factoring regressions.`)
