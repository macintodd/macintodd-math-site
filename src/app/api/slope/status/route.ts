import { reply } from "@/lib/slope-storage";
export const dynamic = "force-dynamic";
export function GET() {
  return reply({
    configured: false,
    collectionEnabled: false,
    mode: "local-image",
  });
}
