import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
export function configured() {
  return !!(
    process.env.SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    (process.env.RESULTS_TEACHER_PASSWORD?.length ?? 0) >= 24
  );
}
export function teacherAuthorized(request: Request) {
  const expected = process.env.RESULTS_TEACHER_PASSWORD;
  if (!expected || expected.length < 24) return false;
  const supplied =
    request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "";
  return timingSafeEqual(
    createHash("sha256").update(expected).digest(),
    createHash("sha256").update(supplied).digest(),
  );
}
export async function database(path: string, init: RequestInit = {}) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return fetch(`${process.env.SUPABASE_URL}/rest/v1/slope_results${path}`, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
}
export function reply(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
