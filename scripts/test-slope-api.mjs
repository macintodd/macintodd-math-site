// No real student data or external database: verify new writes remain disabled.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
let writes = 0,
  reads = 0;
const key = "test-only-teacher-key-not-a-real-credential";
const previous = {
  id: "previous-test-row",
  created_at: new Date().toISOString(),
  report: {
    student: { firstName: "Fictional", lastName: "Student", hour: "3" },
    problems: [],
  },
  summary: { correct: 1 },
};
const db = createServer(async (req, res) => {
  if (req.method !== "GET") {
    writes++;
    res.writeHead(500);
    res.end();
    return;
  }
  reads++;
  assert.equal(req.headers.apikey, "test-only-service-key");
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify([previous]));
});
await new Promise((resolve) => db.listen(0, "127.0.0.1", resolve));
const dbPort = db.address().port,
  origin = "http://127.0.0.1:3098";
const app = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3098",
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
  const status = await (await fetch(origin + "/api/slope/status")).json();
  assert.equal(status.configured, false);
  assert.equal(status.collectionEnabled, false);
  assert.equal(status.mode, "local-image");
  for (const body of [
    "{invalid JSON",
    JSON.stringify({
      student: { firstName: "Fictional", lastName: "Student" },
      correct: 10,
    }),
  ]) {
    const result = await fetch(origin + "/api/slope/results", {
      method: "POST",
      headers: { Origin: origin, "Content-Type": "application/json" },
      body,
    });
    assert.equal(result.status, 410);
    assert.match((await result.json()).error, /disabled/);
  }
  assert.equal(writes, 0);
  assert.equal(reads, 0);
  assert.equal((await fetch(origin + "/api/slope/results")).status, 401);
  assert.equal(
    (
      await fetch(origin + "/api/slope/results", {
        headers: { Authorization: "Bearer wrong" },
      })
    ).status,
    401,
  );
  const prior = await fetch(origin + "/api/slope/results", {
    headers: { Authorization: `Bearer ${key}` },
  });
  assert.equal(prior.status, 200);
  assert.match(prior.headers.get("cache-control"), /no-store/);
  assert.deepEqual((await prior.json()).results, [previous]);
  assert.equal(writes, 0);
  assert.equal(reads, 1);
  for (const path of [
    "src/app/apps/slope/SlopePractice.tsx",
    "src/app/apps/slope/ResultsImage.tsx",
    "src/lib/slope-image.ts",
  ]) {
    const source = await readFile(path, "utf8");
    assert.doesNotMatch(
      source,
      /\b(fetch|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage)\b/,
      path + " must not upload or persist student work",
    );
  }
  console.log(
    "Slope privacy checks passed: new score uploads disabled even with database credentials, no writes, prior records protected, student components have no network/storage APIs.",
  );
} finally {
  app.kill("SIGTERM");
  db.close();
}
