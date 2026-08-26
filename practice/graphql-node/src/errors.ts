import { GraphQLError } from "graphql";

export class PracticeNotImplementedError extends Error {
  constructor(exercise: string) {
    super(`TODO(PRACTICE): ${exercise}`);
    this.name = "PracticeNotImplementedError";
  }
}

export class AuthenticationError extends Error {
  constructor(message = "Authentication required") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  constructor(message = "You cannot modify this vehicle") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class VehicleValidationError extends Error {
  constructor(
    public readonly fields: Record<string, string>,
    message = "Vehicle input is invalid",
  ) {
    super(message);
    this.name = "VehicleValidationError";
  }
}

export class DatabaseUnavailableError extends Error {
  constructor(message = "Database operation failed", options?: ErrorOptions) {
    super(message, options);
    this.name = "DatabaseUnavailableError";
  }
}

/** Convert internal failures to stable, non-sensitive GraphQL errors. */
export function toPublicGraphQLError(_error: unknown): GraphQLError {
  // TODO(PRACTICE): Map expected errors to extensions.code values and hide
  // database/internal details from clients while preserving them for logs.
  throw new PracticeNotImplementedError("implement GraphQL error mapping");
}

