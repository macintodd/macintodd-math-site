import { configured, reply } from "@/lib/slope-storage";
export const dynamic = "force-dynamic";
export function GET() {
  return reply({ configured: configured() });
}
