import { PracticeNotImplementedError } from "./errors";

export type HealthDependencies = {
  checkDatabase(): Promise<void>;
  serviceName?: string;
  now?: () => Date;
};

export type HealthHandler = (request: Request) => Promise<Response>;

export function createHealthHandler(
  _dependencies: HealthDependencies,
): HealthHandler {
  // TODO(PRACTICE): Implement GET /health. Return JSON with a stable shape,
  // 200 when PostgreSQL is reachable, 503 when it is not, and 405 otherwise.
  throw new PracticeNotImplementedError("implement the GET /health endpoint");
}

