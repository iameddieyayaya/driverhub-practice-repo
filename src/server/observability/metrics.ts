type RouteMetric = { count: number; errors: number; totalLatencyMs: number };

const routeMetrics = new Map<string, RouteMetric>();

export function recordRequest(route: string, durationMs: number, statusCode: number): void {
  const current = routeMetrics.get(route) ?? { count: 0, errors: 0, totalLatencyMs: 0 };
  current.count += 1;
  current.totalLatencyMs += durationMs;
  if (statusCode >= 500) current.errors += 1;
  routeMetrics.set(route, current);
}

export function recordDatabaseDuration(operation: string, durationMs: number): void {
  console.log(JSON.stringify({ timestamp: new Date().toISOString(), severity: "debug", metric: "database_query_duration_ms", operation, value: durationMs }));
}

export function metricsSnapshot(): Record<string, { requestCount: number; averageLatencyMs: number; errorRate: number }> {
  return Object.fromEntries([...routeMetrics].map(([route, value]) => [route, {
    requestCount: value.count,
    averageLatencyMs: value.count === 0 ? 0 : Math.round(value.totalLatencyMs / value.count),
    errorRate: value.count === 0 ? 0 : value.errors / value.count
  }]));
}
