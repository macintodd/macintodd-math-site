"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import Graph from "./Graph";
import ResultsImage from "./ResultsImage";
import {
  feedback,
  fraction,
  generateLine,
  isCorrect,
  points,
  practiceScore,
  summarize,
  type Line,
  type ProblemRecord,
  type SlopeReport,
  type Student,
} from "@/lib/slope";

type Phase = "answer" | "hint" | "retry" | "correct" | "revealed";
export default function SlopePractice() {
  const [student, setStudent] = useState<Student>({
    firstName: "",
    lastName: "",
    hour: "",
  });
  const [session, setSession] = useState<{
    id: string;
    startedAt: string;
  } | null>(null);
  const [line, setLine] = useState<Line | null>(null);
  const [history, setHistory] = useState<ProblemRecord[]>([]);
  const [answers, setAnswers] = useState<{ rise: number; run: number }[]>([]);
  const [rise, setRise] = useState(""),
    [run, setRun] = useState("");
  const [active, setActive] = useState<"rise" | "run">("rise");
  const [phase, setPhase] = useState<Phase>("answer"),
    [message, setMessage] = useState("");
  const [report, setReport] = useState<SlopeReport | null>(null);
  const riseInput = useRef<HTMLInputElement>(null),
    runInput = useRef<HTMLInputElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const allProblems =
    line && answers.length ? [...history, { line, answers }] : history;
  const progress = summarize(allProblems);
  const score = practiceScore(allProblems);
  const locked = !["answer", "retry"].includes(phase) || !!report;
  function key(value: string) {
    if (locked) return;
    const current = active === "rise" ? rise : run;
    const next =
      value === "clear"
        ? ""
        : value === "back"
          ? current.slice(0, -1)
          : value === "−"
            ? current.startsWith("-")
              ? current.slice(1)
              : "-" + current
            : current.replace("-", "").length < 3
              ? current + value
              : current;
    if (active === "rise") setRise(next);
    else setRun(next);
    (active === "rise" ? riseInput : runInput).current?.focus({
      preventScroll: true,
    });
  }
  function finish(records: ProblemRecord[]) {
    if (!session) return;
    const result: SlopeReport = {
      ...session,
      student,
      finishedAt: new Date().toISOString(),
      problems: records,
      finished: true,
    };
    setReport(result);
  }
  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!line || locked) return;
    if (!/^-?\d{1,3}$/.test(rise) || !/^-?\d{1,3}$/.test(run)) {
      setMessage("Enter a whole number for both rise and run.");
      return;
    }
    if (Number(run) === 0) {
      setMessage(
        "Run cannot be zero for these lines. Count the horizontal change between two different points.",
      );
      return;
    }
    const answer = { rise: Number(rise), run: Number(run) },
      next = [...answers, answer];
    setAnswers(next);
    if (isCorrect(line, answer)) {
      setPhase("correct");
      setMessage(feedback(line, answer));
      const records = [...history, { line, answers: next }];
      if (summarize(records).completed) {
        finish(records);
        return;
      }
    } else if (next.length === 1) {
      setPhase("hint");
      setMessage(
        "Not quite. Your streak has reset. Use the two marked grid intersections: move right for run, then count up (positive rise) or down (negative rise). A horizontal line has zero rise.",
      );
    } else {
      setPhase("revealed");
      setMessage(
        `The slope is ${fraction(line.rise, line.run)}. Compare the vertical change with the horizontal change between the marked points.`,
      );
    }
  }

  function nextProblem() {
    if (!line) return;
    setHistory([...history, { line, answers }]);
    setLine(generateLine(Math.random, [...history.map((p) => p.line), line]));
    setAnswers([]);
    setRise("");
    setRun("");
    setActive("rise");
    setPhase("answer");
    setMessage("");
    riseInput.current?.focus({ preventScroll: true });
  }
  const pair = line ? points(line) : [];
  return (
    <div className="slope-app shell">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/apps">Practice apps</Link>
        <span>/</span>
        <span>Slope</span>
      </nav>
      <header className="slope-title">
        <div>
          <p className="eyebrow">READ THE GRAPH</p>
          <h1>Slope practice</h1>
        </div>
      </header>
      {!session ? (
        <form
          className="slope-start"
          onSubmit={(e) => {
            e.preventDefault();
            setStudent({
              ...student,
              firstName: student.firstName.trim(),
              lastName: student.lastName.trim(),
            });
            setSession({
              id: crypto.randomUUID(),
              startedAt: new Date().toISOString(),
            });
            setLine(generateLine());
            setPhase("answer");
            setRise("");
            setRun("");
            setActive("rise");
          }}
        >
          <h2>Ready to find the slope?</h2>
          <p>
            Earn 10 gold stars and reach a streak of 5 first-try answers in this
            session. Your best streak counts even if it ends later. A correct
            retry earns a star, but does not add to your streak. You can submit
            early starting at 6/10. Your score stays at 9/10 until both goals
            are met.
          </p>
          <p>
            Tap integer grid points on the line to show their coordinates. Find
            your own grid points on rising, falling, and horizontal lines. Enter
            rise over run, then submit. Each square is 1 unit. These graphs do
            not include vertical lines.
          </p>
          <div className="slope-student-fields">
            <label>
              First name
              <input
                required
                maxLength={60}
                autoComplete="off"
                value={student.firstName}
                onChange={(e) =>
                  setStudent({ ...student, firstName: e.target.value })
                }
                pattern=".*\S.*"
              />
            </label>
            <label>
              Last name
              <input
                required
                maxLength={60}
                autoComplete="off"
                value={student.lastName}
                onChange={(e) =>
                  setStudent({ ...student, lastName: e.target.value })
                }
                pattern=".*\S.*"
              />
            </label>
            <label>
              Class hour
              <select
                required
                value={student.hour}
                onChange={(e) =>
                  setStudent({ ...student, hour: e.target.value })
                }
              >
                <option value="">Choose hour</option>
                {["3", "6", "7", "8"].map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            </label>
          </div>
          <p className="slope-storage">
            Your name and answers stay in this browser page. When you finish
            practice, save a results image showing the name you entered and
            submit it in Google Classroom. Reloading or leaving resets your
            practice.
          </p>
          <button className="slope-primary">Start practice</button>
        </form>
      ) : (
        <>
          <div className="slope-score" aria-label="Progress">
            <span>
              <b>{score}</b> / 10
            </span>
            <span>
              Streak <b>{progress.streak}</b>
            </span>
            <span>
              Best streak <b>{progress.bestStreak}</b> / 5
            </span>
            <span>
              Hour {student.hour} · {student.firstName} {student.lastName}
            </span>
          </div>
          <div
            className="slope-stars"
            aria-label={`${progress.correct} gold stars`}
          >
            {Array.from({ length: Math.min(progress.correct, 30) }, (_, i) => (
              <span
                className={i === progress.correct - 1 ? "slope-new-star" : ""}
                key={i}
                aria-hidden="true"
              >
                ★
              </span>
            ))}
            {progress.correct > 30 && <span>+{progress.correct - 30}</span>}
          </div>
          {report ? (
            <section className="slope-complete">
              <div className="slope-trophy" aria-hidden="true">
                ★
              </div>
              <h2>
                {progress.completed ? "Goal reached!" : "Practice submitted early"}
              </h2>
              <p>
                {student.firstName} {student.lastName} · Class hour{" "}
                {student.hour}
              </p>
              <p><strong>Score: {score}/10</strong></p>
              <p>
                {progress.correct} correct · {progress.firstTry} on the first
                try · {progress.retryCorrect} on a retry · best streak{" "}
                {progress.bestStreak}
              </p>
              <p>
                {report.problems.length} graphs · {progress.attempts} submitted
                answers
              </p>
              <p>{message}</p>
              <ResultsImage report={report} />
              <div className="slope-actions">
                <button
                  onClick={() => {
                    setSession(null);
                    setReport(null);
                    setHistory([]);
                    setAnswers([]);
                    setStudent({ firstName: "", lastName: "", hour: "" });
                    setMessage("");
                  }}
                >
                  Next student / new session
                </button>
              </div>
              <p className="slope-small">
                Submit your image using your own school account in Google
                Classroom.
              </p>
            </section>
          ) : (
            line && (
              <div className="slope-workspace">
                <section className="slope-graph-panel">
                  <h2>Graph {history.length + 1}</h2>
                  <Graph
                    key={history.length}
                    line={line}
                    hint={
                      phase !== "answer" &&
                      answers.length > 0 &&
                      !isCorrect(line, answers[0])
                    }
                  />
                  <p>
                    Each grid square is 1 unit. Tap a grid point on the line to
                    show its coordinates; tap it again to hide them.
                  </p>{" "}
                  <div
                    ref={feedbackRef}
                    className={`slope-feedback ${phase === "correct" ? "success" : ""}`}
                    role="status"
                    aria-live="polite"
                  >
                    {message}
                    {["hint", "retry", "revealed"].includes(phase) &&
                      pair.length > 1 && (
                        <p className="slope-small">
                          Try the marked points (
                          {pair[Math.floor((pair.length - 1) / 2)].x},{" "}
                          {pair[Math.floor((pair.length - 1) / 2)].y}) and (
                          {pair[Math.floor((pair.length - 1) / 2) + 1].x},{" "}
                          {pair[Math.floor((pair.length - 1) / 2) + 1].y}).
                        </p>
                      )}
                  </div>
                </section>
                <section className="slope-answer-panel">
                  <h2>What is the slope?</h2>
                  <form onSubmit={submit}>
                    <div className="slope-equation">
                      <i>m</i>
                      <span>=</span>
                      <span className="slope-fraction">
                        <span>rise</span>
                        <span>run</span>
                      </span>
                      <span>=</span>
                      <span className="slope-fraction slope-input-fraction">
                        {(["rise", "run"] as const).map((field) => (
                          <input
                            key={field}
                            ref={field === "rise" ? riseInput : runInput}
                            aria-label={
                              field === "rise"
                                ? "Rise (numerator)"
                                : "Run (denominator)"
                            }
                            autoComplete="off"
                            inputMode="none"
                            value={field === "rise" ? rise : run}
                            disabled={locked}
                            onFocus={() => setActive(field)}
                            onChange={(e) => {
                              if (/^-?\d{0,3}$/.test(e.target.value)) {
                                if (field === "rise") setRise(e.target.value);
                                else setRun(e.target.value);
                              }
                            }}
                            className={active === field ? "active" : ""}
                          />
                        ))}
                      </span>
                    </div>
                    <p className="slope-small">
                      Tap rise or run, then use the number pad. Give the
                      simplest form.
                    </p>
                    <div className="slope-keypad" aria-label="Number pad">
                      {[
                        "7",
                        "8",
                        "9",
                        "4",
                        "5",
                        "6",
                        "1",
                        "2",
                        "3",
                        "−",
                        "0",
                        "back",
                      ].map((k) => (
                        <button
                          key={k}
                          type="button"
                          disabled={locked}
                          onPointerDown={(e) => e.preventDefault()}
                          onClick={() => key(k)}
                          aria-label={
                            k === "back"
                              ? "Backspace"
                              : k === "−"
                                ? "Change sign"
                                : k
                          }
                        >
                          {k === "back" ? "⌫" : k}
                        </button>
                      ))}
                      <button
                        type="button"
                        disabled={locked}
                        onClick={() => key("clear")}
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        disabled={locked}
                        onClick={() => {
                          const next = active === "rise" ? "run" : "rise";
                          setActive(next);
                          (next === "rise"
                            ? riseInput
                            : runInput
                          ).current?.focus({ preventScroll: true });
                        }}
                      >
                        Rise ↔ Run
                      </button>
                    </div>
                    {!locked && (
                      <button
                        className="slope-primary slope-submit"
                        disabled={!rise || !run}
                      >
                        Submit{phase === "retry" ? " retry" : ""}
                      </button>
                    )}
                  </form>

                  {phase === "hint" && (
                    <button
                      className="slope-primary"
                      onClick={() => {
                        setPhase("retry");
                        riseInput.current?.focus({ preventScroll: true });
                      }}
                    >
                      Try again
                    </button>
                  )}
                  {["correct", "revealed"].includes(phase) && (
                    <div className="slope-actions">
                      <button className="slope-primary" onClick={nextProblem}>
                        Next graph →
                      </button>
                      {score >= 6 && (
                        <button onClick={() => finish(allProblems)}>
                          Submit {score}/10
                        </button>
                      )}
                    </div>
                  )}
                  <p className="slope-small">
                    Your work stays on this device. Keep this page open until
                    you submit your score and save your results image.
                  </p>
                </section>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}
