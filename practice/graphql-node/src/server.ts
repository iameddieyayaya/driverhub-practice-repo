import type { Server } from "node:http";
import type { PrismaClient } from "@prisma/client";
import { PracticeNotImplementedError } from "./errors";
import type { Logger } from "./logger";
import type { VerifyAccessToken } from "./auth";

export type VehicleApiServerDependencies = {
  db: PrismaClient;
  logger: Logger;
  verifyAccessToken: VerifyAccessToken;
};

/**
 * TODO(PRACTICE): Wire Node's HTTP server, GraphQL Yoga at /graphql,
 * request-scoped context/loaders, GET /health, public error mapping, and
 * structured completion logging.
 */
export function createVehicleApiServer(
  _dependencies: VehicleApiServerDependencies,
): Server {
  throw new PracticeNotImplementedError("wire the Node.js Vehicle API server");
}

