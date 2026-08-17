import { recordRequest } from "@/src/server/observability/metrics";

export type LogSeverity = "debug" | "info" | "warn" | "error";

type LogFields = {
  severity: LogSeverity;
  message: string;
  requestId?: string;
  route?: string;
  userId?: string;
  duration?: number;
  statusCode?: number;
  error?: string;
  [key: string]: unknown;
};

export function log(fields: LogFields): void {
  const entry = { timestamp: new Date().toISOString(), ...fields };
  const output = JSON.stringify(entry);
  if (fields.severity === "error") console.error(output);
  else if (fields.severity === "warn") console.warn(output);
  else console.log(output);
}

export async function withRequestLogging(
  request: Request,
  handler: (requestId: string) => Promise<Response>
): Promise<Response> {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const startedAt = performance.now();
  let response: Response;
  try {
    response = await handler(requestId);
  } catch (error) {
    log({ severity: "error", message: "Unhandled request error", requestId, route: new URL(request.url).pathname, duration: performance.now() - startedAt, statusCode: 500, error: error instanceof Error ? error.message : "Unknown error" });
    throw error;
  }
  const route = new URL(request.url).pathname;
  const duration = Math.round(performance.now() - startedAt);
  recordRequest(route, duration, response.status);
  log({ severity: "info", message: "Request completed", requestId, route, duration, statusCode: response.status });
  response.headers.set("x-request-id", requestId);
  return response;
}
