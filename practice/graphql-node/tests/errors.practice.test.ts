// @vitest-environment node

import { GraphQLError } from "graphql";
import { describe, expect, it } from "vitest";
import {
  AuthenticationError,
  AuthorizationError,
  DatabaseUnavailableError,
  toPublicGraphQLError,
  VehicleValidationError,
} from "../src/errors";

describe("public GraphQL error handling", () => {
  it.each([
    [new AuthenticationError(), "UNAUTHENTICATED"],
    [new AuthorizationError(), "FORBIDDEN"],
    [new VehicleValidationError({ year: "bad year" }), "BAD_USER_INPUT"],
  ])("maps an expected error to %s", (error, code) => {
    const result = toPublicGraphQLError(error);

    expect(result).toBeInstanceOf(GraphQLError);
    expect(result.extensions.code).toBe(code);
  });

  it("hides database details behind a service-unavailable error", () => {
    const result = toPublicGraphQLError(
      new DatabaseUnavailableError(
        "password authentication failed for postgres://secret@db",
      ),
    );

    expect(result.extensions.code).toBe("SERVICE_UNAVAILABLE");
    expect(result.message).not.toContain("secret");
    expect(result.message).not.toContain("postgres");
  });
});

