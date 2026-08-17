import { NextResponse } from "next/server";
import { prisma } from "@/src/server/database/prisma";
import { metricsSnapshot } from "@/src/server/observability/metrics";

export async function GET(): Promise<Response> {
  const startedAt = performance.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "healthy", service: "driverhub-web", database: "connected", uptimeSeconds: Math.round(process.uptime()), databaseLatencyMs: Math.round(performance.now() - startedAt), metrics: metricsSnapshot(), timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: "degraded", service: "driverhub-web", database: "unavailable", timestamp: new Date().toISOString() }, { status: 503 });
  }
}
