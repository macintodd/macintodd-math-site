export type Line = { rise: number; run: number; x: number; y: number };
export type Answer = { rise: number; run: number };
export type ProblemRecord = { line: Line; answers: Answer[] };
export type Student = { firstName: string; lastName: string; hour: string };
export type SlopeReport = {
  id: string;
  student: Student;
  startedAt: string;
  finishedAt: string;
  problems: ProblemRecord[];
  finished?: boolean;
};
export function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : Math.abs(a);
}
export function fraction(rise: number, run: number): string {
  const divisor = gcd(rise, run),
    sign = run < 0 ? -1 : 1;
  const n = (rise / divisor) * sign,
    d = Math.abs(run) / divisor;
  return d === 1 ? String(n) : `${n}/${d}`;
}
export function isCorrect(line: Line, answer: Answer) {
  return answer.run !== 0 && answer.rise * line.run === answer.run * line.rise;
}
export function points(line: Line) {
  const result: { x: number; y: number }[] = [];
  for (let x = -10; x <= 10; x++) {
    const numerator = line.y * line.run + (x - line.x) * line.rise;
    if (numerator % line.run === 0 && Math.abs(numerator / line.run) <= 10)
      result.push({ x, y: numerator / line.run });
  }
  return result;
}
export function generateLine(random = Math.random, recent: Line[] = []): Line {
  const last = recent[recent.length - 1],
    previous = recent[recent.length - 2];
  const blocked = last && previous && isCorrect(last, previous) ? last : null;
  const choices: Answer[] = [];
  for (let rise = -5; rise <= 5; rise++)
    for (let run = 1; run <= 5; run++) {
      if (
        gcd(rise, run) === 1 &&
        (!blocked || !isCorrect(blocked, { rise, run }))
      )
        choices.push({ rise, run });
    }
  const slope = choices[Math.floor(random() * choices.length)];
  return {
    ...slope,
    x: -2 + Math.floor(random() * 5),
    y: -2 + Math.floor(random() * 5),
  };
}
export function summarize(problems: ProblemRecord[]) {
  let correct = 0,
    firstTry = 0,
    streak = 0,
    bestStreak = 0,
    attempts = 0;
  for (const problem of problems) {
    attempts += problem.answers.length;
    if (problem.answers[0] && isCorrect(problem.line, problem.answers[0])) {
      correct++;
      firstTry++;
      streak++;
      bestStreak = Math.max(bestStreak, streak);
    } else {
      streak = 0;
      if (problem.answers[1] && isCorrect(problem.line, problem.answers[1]))
        correct++;
    }
  }
  return {
    correct,
    firstTry,
    retryCorrect: correct - firstTry,
    streak,
    bestStreak,
    attempts,
    completed: correct >= 10 && bestStreak >= 5,
  };
}
export function feedback(line: Line, answer: Answer) {
  const simple = fraction(line.rise, line.run),
    entered = `${answer.rise}/${answer.run}`;
  return gcd(answer.rise, answer.run) > 1 || answer.run < 0
    ? `That is correct, the slope is ${entered}, but answer in simplest form ${simple}.`
    : `That’s correct, the slope is ${simple}.`;
}
export function validateReport(value: unknown): SlopeReport {
  if (!value || typeof value !== "object") throw Error("Invalid result.");
  const report = value as SlopeReport;
  if (
    !/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(
      report.id,
    )
  )
    throw Error("Invalid session.");
  if (report.finished !== undefined && typeof report.finished !== "boolean")
    throw Error("Invalid session status.");
  const student = report.student;
  if (
    !student ||
    ![student.firstName, student.lastName].every(
      (n) => typeof n === "string" && n.trim().length > 0 && n.length <= 60,
    ) ||
    !["3", "6", "7", "8"].includes(student.hour)
  )
    throw Error("Check the student name and class hour.");
  const start = Date.parse(report.startedAt),
    finish = Date.parse(report.finishedAt);
  if (
    !Number.isFinite(start) ||
    !Number.isFinite(finish) ||
    finish < start ||
    finish > Date.now() + 60000
  )
    throw Error("Invalid session time.");
  if (
    !Array.isArray(report.problems) ||
    !report.problems.length ||
    report.problems.length > 500
  )
    throw Error("Invalid problem history.");
  for (const p of report.problems) {
    if (
      !p.line ||
      !["rise", "run", "x", "y"].every((k) =>
        Number.isSafeInteger(p.line[k as keyof Line]),
      )
    )
      throw Error("Invalid graph.");
    if (
      Math.abs(p.line.rise) > 5 ||
      p.line.run < 1 ||
      p.line.run > 5 ||
      Math.abs(p.line.x) > 2 ||
      Math.abs(p.line.y) > 2 ||
      gcd(p.line.rise, p.line.run) !== 1
    )
      throw Error("Invalid graph.");
    if (
      !Array.isArray(p.answers) ||
      p.answers.length < 1 ||
      p.answers.length > 2
    )
      throw Error("Invalid attempts.");
    for (const a of p.answers)
      if (
        !a ||
        !Number.isSafeInteger(a.rise) ||
        !Number.isSafeInteger(a.run) ||
        Math.abs(a.rise) > 999 ||
        Math.abs(a.run) > 999 ||
        a.run === 0
      )
        throw Error("Invalid fraction.");
    if (p.answers.length === 2 && isCorrect(p.line, p.answers[0]))
      throw Error("Extra attempt after correct answer.");
  }
  return {
    id: report.id,
    ...(report.finished === undefined ? {} : { finished: report.finished }),
    student: {
      firstName: student.firstName.trim(),
      lastName: student.lastName.trim(),
      hour: student.hour,
    },
    startedAt: new Date(start).toISOString(),
    finishedAt: new Date(finish).toISOString(),
    problems: report.problems.map((p) => ({
      line: { rise: p.line.rise, run: p.line.run, x: p.line.x, y: p.line.y },
      answers: p.answers.map((a) => ({ rise: a.rise, run: a.run })),
    })),
  };
}
