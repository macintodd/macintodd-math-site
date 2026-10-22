import {
  configured,
  database,
  reply,
  teacherAuthorized,
} from "@/lib/slope-storage";
export const dynamic = "force-dynamic";
export function POST() {
  // Do not read or log request bodies. New submissions belong in Classroom.
  return reply(
    {
      error:
        "Online score collection is disabled. Reload the practice app and save a results image for Google Classroom.",
    },
    410,
  );
}
export async function GET(request: Request) {
  if (!teacherAuthorized(request))
    return reply({ error: "Teacher access required." }, 401);
  if (!configured())
    return reply({ error: "Online score saving is not connected." }, 503);
  try {
    const response = await database(
      "?select=id,created_at,report,summary&order=created_at.desc&limit=500",
      {},
      "slope_latest_results",
    );
    if (!response.ok) return reply({ error: "Could not load results." }, 502);
    return reply({ results: await response.json() });
  } catch {
    return reply({ error: "Could not load results." }, 502);
  }
}
