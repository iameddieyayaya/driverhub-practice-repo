// @vitest-environment node

import { describe, expect, it, vi } from "vitest";
import { createHealthHandler } from "../src/health";
import { logCompletedRequest, type Logger } from "../src/logger";

describe("GET /health", () => {
  it("reports a healthy database", async () => {
    const checkDatabase = vi.fn().mockResolvedValue(undefined);
    const handler = createHealthHandler({
      checkDatabase,
      serviceName: "vehicle-api",
      now: () => new Date("2026-08-19T12:00:00.000Z"),
    });

    const response = await handler(new Request("http://localhost/health"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      status: "healthy",
      service: "vehicle-api",
      database: "connected",
      timestamp: "2026-08-19T12:00:00.000Z",
    });
    expect(checkDatabase).toHaveBeenCalledOnce();
  });

  it("returns a sanitized 503 response when PostgreSQL is unavailable", async () => {
    const handler = createHealthHandler({
      checkDatabase: vi
        .fn()
        .mockRejectedValue(new Error("postgres://admin:secret@database")),
      serviceName: "vehicle-api",
      now: () => new Date("2026-08-19T12:00:00.000Z"),
    });

    const response = await handler(new Request("http://localhost/health"));
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual({
      status: "unavailable",
      service: "vehicle-api",
      database: "unavailable",
      timestamp: "2026-08-19T12:00:00.000Z",
    });
    expect(JSON.stringify(body)).not.toContain("secret");
  });

  it("rejects non-GET methods without querying PostgreSQL", async () => {
    const checkDatabase = vi.fn();
    const handler = createHealthHandler({ checkDatabase });

    const response = await handler(
      new Request("http://localhost/health", { method: "POST" }),
    );

    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("GET");
    expect(checkDatabase).not.toHaveBeenCalled();
  });
});

describe("structured request logging", () => {
  it("emits a structured completion event", () => {
    const logger = { info: vi.fn(), error: vi.fn() } as unknown as Logger;

    logCompletedRequest(logger, {
      requestId: "request-1",
      method: "POST",
      path: "/graphql",
      statusCode: 200,
      durationMs: 12,
      userId: "user-1",
    });

    expect(logger.info).toHaveBeenCalledWith({
      event: "http_request_completed",
      requestId: "request-1",
      method: "POST",
      path: "/graphql",
      statusCode: 200,
      durationMs: 12,
      userId: "user-1",
    });
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("logs failures without exposing raw error messages", () => {
    const logger = { info: vi.fn(), error: vi.fn() } as unknown as Logger;

    logCompletedRequest(logger, {
      requestId: "request-2",
      method: "POST",
      path: "/graphql",
      statusCode: 500,
      durationMs: 8,
      error: new Error("postgres://admin:secret@database"),
    });

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "http_request_completed",
        errorName: "Error",
        statusCode: 500,
      }),
    );
    expect(JSON.stringify(vi.mocked(logger.error).mock.calls)).not.toContain(
      "secret",
    );
  });
});

