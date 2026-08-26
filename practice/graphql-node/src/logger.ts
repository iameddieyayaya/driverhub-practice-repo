import { PracticeNotImplementedError } from "./errors";

export type StructuredLog = {
  event: string;
  requestId: string;
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
  userId?: string;
  errorName?: string;
};

export interface Logger {
  info(entry: StructuredLog): void;
  error(entry: StructuredLog): void;
}

export type CompletedRequest = Omit<StructuredLog, "event"> & {
  error?: unknown;
};

export function logCompletedRequest(
  _logger: Logger,
  _request: CompletedRequest,
): void {
  // TODO(PRACTICE): Emit a stable structured event, choose info/error from the
  // status, and avoid serializing secrets or raw error messages.
  throw new PracticeNotImplementedError("implement structured request logging");
}

