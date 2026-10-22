import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import {
  fraction,
  generateLine,
  points,
  isCorrect,
  summarize,
  practiceScore,
  feedback,
  validateReport,
} from "../src/lib/slope.ts";
const line = { rise: 3, run: 5, x: 0, y: 0 };
assert.equal(isCorrect(line, { rise: 6, run: 10 }), true);
assert.equal(isCorrect(line, { rise: -6, run: -10 }), true);
assert.equal(isCorrect(line, { rise: 3, run: 0 }), false);
assert.equal(isCorrect(line, { rise: -3, run: 5 }), false);
assert.equal(fraction(-6, -10), "3/5");
assert.equal(fraction(0, 5), "0");
assert.equal(fraction(8, 4), "2");
assert.match(feedback(line, { rise: 6, run: 10 }), /6\/10.*simplest form 3\/5/);
// Exhaust all generated slopes and center anchors: at least two clear lattice points.
for (let rise = -5; rise <= 5; rise++)
  for (let run = 1; run <= 5; run++)
    for (let x = -2; x <= 2; x++)
      for (let y = -2; y <= 2; y++) {
        const ps = points({ rise, run, x, y });
        assert.ok(ps.length >= 2);
        for (const p of ps) assert.ok((p.y - y) * run === (p.x - x) * rise);
      }
for (let i = 0; i < 1000; i++) {
  const l = generateLine();
  assert.ok(points(l).length >= 2);
  assert.ok(l.run > 0);
}
const right = { line, answers: [{ rise: 3, run: 5 }] },
  retry = {
    line,
    answers: [
      { rise: 4, run: 5 },
      { rise: 6, run: 10 },
    ],
  },
  wrong = {
    line,
    answers: [
      { rise: 4, run: 5 },
      { rise: 5, run: 5 },
    ],
  };
const s = summarize([right, right, retry, right, wrong]);
assert.deepEqual(s, {
  correct: 4,
  firstTry: 3,
  retryCorrect: 1,
  streak: 0,
  bestStreak: 2,
  attempts: 7,
  completed: false,
});
assert.equal(summarize(Array(9).fill(right)).completed, false);
assert.equal(summarize(Array(10).fill(retry)).completed, false);
assert.equal(
  summarize([...Array(5).fill(right), wrong, ...Array(5).fill(retry)])
    .completed,
  true,
);
const report = {
  id: randomUUID(),
  student: { firstName: "Test", lastName: "Student", hour: "3" },
  startedAt: new Date().toISOString(),
  finishedAt: new Date().toISOString(),
  problems: [right, retry],
};
assert.deepEqual(validateReport(report), report);
for (const bad of [
  { ...report, student: { ...report.student, hour: "4" } },
  { ...report, problems: [{ line, answers: [{ rise: 1, run: 0 }] }] },
  {
    ...report,
    problems: [
      {
        line,
        answers: [
          { rise: 3, run: 5 },
          { rise: 3, run: 5 },
        ],
      },
    ],
  },
  { ...report, problems: [] },
])
  assert.throws(() => validateReport(bad));
console.log(
  "Slope tests passed: fraction equivalence, sign/zero handling, 1,375 graph configurations, retry/streak goals, result validation.",
);

// The third identical slope is excluded even when the random source never changes.
for (let rise = -5; rise <= 5; rise++)
  for (let run = 1; run <= 5; run++) {
    const repeated = { rise, run, x: 0, y: 0 };
    assert.equal(
      isCorrect(
        repeated,
        generateLine(() => 0, [repeated, repeated]),
      ),
      false,
    );
  }
const recent = [];
for (let i = 0; i < 10000; i++) {
  const l = generateLine(Math.random, recent);
  if (
    recent.length >= 2 &&
    isCorrect(recent[recent.length - 1], recent[recent.length - 2])
  )
    assert.equal(isCorrect(l, recent[recent.length - 1]), false);
  recent.push(l);
}
assert.ok(
  points({ rise: 1, run: 1, x: 0, y: 0 }).some((p) => p.x === 10 && p.y === 10),
);
assert.equal(validateReport({ ...report, finished: false }).finished, false);
console.log(
  "Repeat prevention passed: adversarial constant randomness and 10,000 sequential graphs.",
);

// Early submission grades and the streak gate must match on screen and PNG.
for (const count of [0, 5, 6, 7, 8, 9, 10, 20, 100]) {
  assert.equal(practiceScore(Array(count).fill(retry)), Math.min(count, 9));
}
assert.equal(practiceScore(Array(9).fill(right)), 9);
assert.equal(practiceScore(Array(10).fill(right)), 10);
assert.equal(practiceScore([...Array(20).fill(retry), ...Array(5).fill(right)]), 10);
assert.equal(practiceScore([...Array(5).fill(right), wrong, ...Array(5).fill(retry)]), 10);
console.log("Early scores passed: 6–9/10 available, capped at 9 until the streak goal is earned.");
