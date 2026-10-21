import {
  configured,
  database,
  reply,
  teacherAuthorized,
} from "@/lib/slope-storage";
import { summarize, validateReport } from "@/lib/slope";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  // Next may normalize request.url to an internal host behind a proxy.
  // Compare the browser Origin to the HTTP Host that received the request.
  let originHost = "";
  try {
    originHost = new URL(request.headers.get("origin") ?? "").host;
  } catch {}
  if (!originHost || originHost !== request.headers.get("host"))
    return reply({ error: "Same-origin request required." }, 403);
  if (!configured())
    return reply({ error: "Online score saving is not connected." }, 503);
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return reply({ error: "JSON required." }, 415);
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: "Missing result." }, 400);
    let length = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 150000) {
        await reader.cancel();
        return reply({ error: "Result too large." }, 413);
      }
      chunks.push(value);
    }
    const raw = Buffer.concat(chunks).toString("utf8");
    let report;
    try {
      report = validateReport(JSON.parse(raw));
    } catch {
      return reply({ error: "Invalid result." }, 400);
    }
    // Ignore any client-supplied score. Derive all totals from the submitted attempts.
    const response = await database("?on_conflict=id", {
      method: "POST",
      headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
      body: JSON.stringify({
        id: report.id,
        report,
        summary: summarize(report.problems),
      }),
    });
    if (!response.ok)
      return reply({ error: "Could not save. Please retry." }, 502);
    return reply({ saved: true });
  } catch {
    return reply({ error: "Could not save. Please retry." }, 502);
  }
}
export async function GET(request: Request) {
  if (!teacherAuthorized(request))
    return reply({ error: "Teacher access required." }, 401);
  if (!configured())
    return reply({ error: "Online score saving is not connected." }, 503);
  try {
    const response = await database(
      "?select=id,created_at,report,summary&order=created_at.desc&limit=500",
    );
    if (!response.ok) return reply({ error: "Could not load results." }, 502);
    return reply({ results: await response.json() });
  } catch {
    return reply({ error: "Could not load results." }, 502);
  }
}
