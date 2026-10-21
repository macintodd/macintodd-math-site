"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { summarize, validateReport, type SlopeReport } from "@/lib/slope";
type Row = { id: string; created_at: string; report: SlopeReport };
export default function Results() {
  const [password, setPassword] = useState(""),
    [rows, setRows] = useState<Row[]>([]),
    [message, setMessage] = useState(""),
    [hour, setHour] = useState(""),
    [busy, setBusy] = useState(false),
    [accessKey, setAccessKey] = useState(""),
    [search, setSearch] = useState("");
  function load(event: React.FormEvent) {
    event.preventDefault();
    setAccessKey(password);
    setPassword("");
  }
  useEffect(() => {
    if (!accessKey) return;
    const controller = new AbortController();
    let running = false;
    async function refresh() {
      if (running) return;
      running = true;
      setBusy(true);
      try {
        const response = await fetch("/api/slope/results", {
          cache: "no-store",
          signal: controller.signal,
          headers: { Authorization: `Bearer ${accessKey}` },
        });
        const body = await response.json();
        if (!response.ok) {
          if (response.status === 401) setAccessKey("");
          throw Error(body.error);
        }
        if (!controller.signal.aborted) {
          setRows(body.results);
          setMessage(
            `Live · updated ${new Date().toLocaleTimeString()} · refreshes every 5 seconds. Showing the latest 500 sessions.`,
          );
        }
      } catch (error) {
        if (!controller.signal.aborted)
          setMessage(
            error instanceof Error
              ? error.message
              : "Could not refresh. Retrying shortly.",
          );
      } finally {
        running = false;
        setBusy(false);
      }
    }
    void refresh();
    const timer = window.setInterval(() => void refresh(), 5000);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [accessKey]);
  const visible = rows
    .filter(
      (row) =>
        (!hour || row.report.student.hour === hour) &&
        row.report.student.firstName
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase().trim()),
    )
    .sort(
      (a, b) =>
        a.report.student.firstName.localeCompare(b.report.student.firstName) ||
        a.report.student.lastName.localeCompare(b.report.student.lastName),
    );
  function csv() {
    const quote = (s: unknown) =>
      `"${String(s)
        .replace(/^[=+@\-\t\r]/, "'$&")
        .replace(/"/g, '""')}"`;
    const data = [
      [
        "Updated",
        "First name",
        "Last name",
        "Hour",
        "Correct",
        "First try",
        "Retry correct",
        "Best streak",
        "Attempts",
        "Goal reached",
      ],
      ...visible.map((r) => {
        const s = summarize(r.report.problems);
        return [
          r.created_at,
          r.report.student.firstName,
          r.report.student.lastName,
          r.report.student.hour,
          s.correct,
          s.firstTry,
          s.retryCorrect,
          s.bestStreak,
          s.attempts,
          s.completed ? "Yes" : "No",
        ];
      }),
    ]
      .map((r) => r.map(quote).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([data], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "slope-results.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="shell slope-results">
      <nav className="breadcrumb">
        <Link href="/apps/slope">Slope practice</Link>
        <span>/</span>
        <span>Teacher results</span>
      </nav>
      <h1>Live slope scores</h1>
      <p>
        Online results require the teacher access key. Student names are
        self-reported; school Google accounts are not authenticated.
      </p>
      <form onSubmit={load} className="slope-actions">
        <label>
          Teacher access key
          <input
            type="password"
            autoComplete="off"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="slope-primary" disabled={busy}>
          Connect live scores
        </button>
      </form>
      <p>
        Students can also attach downloaded result files in Google Classroom.
        Import those files here to view scores and export a spreadsheet.
        Imported files stay in this browser page.
      </p>
      <label>
        Import downloaded results
        <input
          type="file"
          accept=".json,application/json"
          multiple
          onChange={async (e) => {
            const files = Array.from(e.target.files ?? []);
            const imported: Row[] = [];
            let rejected = 0;
            for (const file of files) {
              try {
                if (file.size > 150000) throw Error();
                const report = validateReport(JSON.parse(await file.text()));
                imported.push({
                  id: report.id,
                  created_at: report.finishedAt,
                  report,
                });
              } catch {
                rejected++;
              }
            }
            setRows((current) =>
              Array.from(
                new Map(
                  [...current, ...imported].map((r) => [r.id, r]),
                ).values(),
              ),
            );
            setMessage(
              `Imported ${imported.length} results.${rejected ? ` ${rejected} invalid files skipped.` : ""}`,
            );
            e.target.value = "";
          }}
        />
      </label>
      {accessKey && (
        <button
          onClick={() => {
            setAccessKey("");
            setRows([]);
            setMessage("Disconnected. Results cleared from this page.");
          }}
        >
          Disconnect live scores
        </button>
      )}
      <p role="status">{message}</p>
      <div className="slope-actions">
        <label>
          Find a first name
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Student first name"
          />
        </label>
        <label>
          Class hour
          <select value={hour} onChange={(e) => setHour(e.target.value)}>
            <option value="">All hours</option>
            {["3", "6", "7", "8"].map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
        </label>
        <button onClick={csv} disabled={!visible.length}>
          Export CSV
        </button>
        <button
          onClick={() => {
            setAccessKey("");
            setRows([]);
            setMessage("Results cleared from this page.");
          }}
        >
          Clear this view
        </button>
      </div>
      <div className="slope-table-wrap">
        <table>
          <caption>{visible.length} results</caption>
          <thead>
            <tr>
              {[
                "First name",
                "Last name",
                "Hour",
                "Updated",
                "Correct",
                "First try",
                "Retry",
                "Best streak",
                "Status",
              ].map((t) => (
                <th key={t}>{t}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => {
              const s = summarize(r.report.problems);
              return (
                <tr key={r.id}>
                  <td>{r.report.student.firstName}</td>
                  <td>{r.report.student.lastName}</td>
                  <td>{r.report.student.hour}</td>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                  <td>{s.correct}</td>
                  <td>{s.firstTry}</td>
                  <td>{s.retryCorrect}</td>
                  <td>{s.bestStreak}</td>
                  <td>
                    {s.completed
                      ? "Goal reached"
                      : r.report.finished === false
                        ? "Practicing"
                        : "Finished"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="slope-small">
        These practice records are not identity-verified assessments. Clear this
        view before sharing the device.
      </p>
    </div>
  );
}
