// Local integration test; the database double never uses real student storage.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
const rows = new Map(),
  key = "test-only-teacher-key-not-a-real-credential";
const db = createServer(async (req, res) => {
  if (req.headers.apikey !== "test-only-service-key") {
    res.writeHead(401);
    res.end();
    return;
  }
  if (req.method === "POST") {
    let raw = "";
    for await (const chunk of req) raw += chunk;
    const row = JSON.parse(raw);
    if (!rows.has(row.id))
      rows.set(row.id, { ...row, created_at: new Date().toISOString() });
    res.writeHead(201);
    res.end();
  } else {
    res.setHeader("Content-Type", "application/json");
    const latest = new Map();
    for (const row of rows.values()) {
      const id = row.report.id,
        old = latest.get(id);
      if (
        !old ||
        row.summary.attempts > old.summary.attempts ||
        (row.summary.attempts === old.summary.attempts &&
          row.report.finished !== false)
      )
        latest.set(id, row);
    }
    res.end(JSON.stringify([...latest.values()]));
  }
});
await new Promise((resolve) => db.listen(0, "127.0.0.1", resolve));
const dbPort = db.address().port,
  appPort = 3098,
  origin = `http://127.0.0.1:${appPort}`;
const app = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(appPort),
  ],
  {
    env: {
      ...process.env,
      SUPABASE_URL: `http://127.0.0.1:${dbPort}`,
      SUPABASE_SERVICE_ROLE_KEY: "test-only-service-key",
      RESULTS_TEACHER_PASSWORD: key,
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(Error("Server did not start")),
      20000,
    );
    app.stdout.on("data", (d) => {
      if (d.toString().includes("Ready")) {
        clearTimeout(timer);
        resolve();
      }
    });
    app.once("exit", () => {
      clearTimeout(timer);
      reject(Error("Server exited"));
    });
  });
  assert.equal(
    (await (await fetch(origin + "/api/slope/status")).json()).configured,
    true,
  );
  assert.equal((await fetch(origin + "/api/slope/results")).status, 401);
  assert.equal(
    (
      await fetch(origin + "/api/slope/results", {
        headers: { Authorization: "Bearer wrong" },
      })
    ).status,
    401,
  );
  const report = {
    id: randomUUID(),
    student: { firstName: "Fictional", lastName: "Student", hour: "6" },
    startedAt: new Date().toISOString(),
    finishedAt: new Date().toISOString(),
    problems: [
      {
        line: { rise: 3, run: 5, x: 0, y: 0 },
        answers: [{ rise: 6, run: 10 }],
      },
    ],
    summary: { correct: 999 },
  };
  const post = (body) =>
    fetch(origin + "/api/slope/results", {
      method: "POST",
      headers: { Origin: origin, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  assert.equal(
    (
      await fetch(origin + "/api/slope/results", {
        method: "POST",
        headers: { Origin: "https://wrong.example" },
      })
    ).status,
    403,
  );
  assert.equal(
    (await post({ ...report, student: { ...report.student, hour: "9" } }))
      .status,
    400,
  );
  assert.equal((await post(report)).status, 200);
  assert.equal((await post(report)).status, 200);
  const response = await fetch(origin + "/api/slope/results", {
    headers: { Authorization: `Bearer ${key}` },
  });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control"), /no-store/);
  const saved = (await response.json()).results;
  assert.equal(saved.length, 1);
  assert.equal(saved[0].summary.correct, 1);
  assert.equal(saved[0].summary.bestStreak, 1);
  assert.equal(saved[0].report.summary, undefined);
  const inProgress = {
    ...report,
    finished: false,
    problems: [
      ...report.problems,
      { line: { rise: 1, run: 2, x: 0, y: 0 }, answers: [{ rise: 2, run: 4 }] },
    ],
  };
  assert.equal((await post(inProgress)).status, 200);
  assert.equal((await post(inProgress)).status, 200);
  assert.equal(rows.size, 2);
  let latest = (
    await (
      await fetch(origin + "/api/slope/results", {
        headers: { Authorization: `Bearer ${key}` },
      })
    ).json()
  ).results;
  assert.equal(latest.length, 1);
  assert.equal(latest[0].summary.correct, 2);
  assert.equal(latest[0].report.finished, false);
  assert.equal((await post({ ...inProgress, finished: true })).status, 200);
  assert.equal((await post(report)).status, 200); // stale retry must not replace newer work
  latest = (
    await (
      await fetch(origin + "/api/slope/results", {
        headers: { Authorization: `Bearer ${key}` },
      })
    ).json()
  ).results;
  assert.equal(latest.length, 1);
  assert.equal(latest[0].summary.correct, 2);
  assert.equal(latest[0].report.finished, true);
  console.log(
    "Slope API integration passed: access control, origin/data checks, score recomputation, no-store responses, idempotent saves (mock database).",
  );
  if (process.argv.includes("--serve")) {
    console.log(
      `Mock-backed preview at ${origin}. Teacher key: test-only-teacher-key-not-a-real-credential. Ctrl-C to stop.`,
    );
    await new Promise((resolve) => process.once("SIGINT", resolve));
  }
} finally {
  app.kill("SIGTERM");
  db.close();
}
