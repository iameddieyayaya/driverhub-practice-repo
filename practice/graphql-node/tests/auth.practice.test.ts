// @vitest-environment node

import { describe, expect, it, vi } from "vitest";
import {
  assertVehicleOwner,
  authenticateRequest,
  requireAuthenticatedUser,
} from "../src/auth";
import { AuthenticationError, AuthorizationError } from "../src/errors";

describe("authentication and authorization", () => {
  it("treats a request without a Bearer token as anonymous", async () => {
    const verifier = vi.fn();

    await expect(
      authenticateRequest(new Request("http://localhost/graphql"), verifier),
    ).resolves.toBeNull();
    expect(verifier).not.toHaveBeenCalled();
  });

  it("verifies a Bearer token and uses its subject as user id", async () => {
    const verifier = vi.fn().mockResolvedValue({ sub: "user-1" });
    const request = new Request("http://localhost/graphql", {
      headers: { authorization: "Bearer signed-token" },
    });

    await expect(authenticateRequest(request, verifier)).resolves.toEqual({
      id: "user-1",
    });
    expect(verifier).toHaveBeenCalledWith("signed-token");
  });

  it("requires authentication", () => {
    expect(() => requireAuthenticatedUser(null)).toThrow(AuthenticationError);
    expect(requireAuthenticatedUser({ id: "user-1" })).toEqual({ id: "user-1" });
  });

  it("allows owners and rejects other users", () => {
    expect(() =>
      assertVehicleOwner({ id: "user-1" }, { userId: "user-1" }),
    ).not.toThrow();
    expect(() =>
      assertVehicleOwner({ id: "user-2" }, { userId: "user-1" }),
    ).toThrow(AuthorizationError);
  });
});

