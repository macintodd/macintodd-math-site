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
    if (!rows.has(row.id)) rows.set(row.id, row);
    res.writeHead(201);
    res.end();
  } else {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify([...rows.values()]));
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
  console.log(
    "Slope API integration passed: access control, origin/data checks, score recomputation, no-store responses, idempotent saves (mock database).",
  );
} finally {
  app.kill("SIGTERM");
  db.close();
}
