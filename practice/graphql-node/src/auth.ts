import {
  AuthenticationError,
  AuthorizationError,
  PracticeNotImplementedError,
} from "./errors";
import type { AuthenticatedUser, Vehicle } from "./types";

export type VerifiedToken = { sub?: string };
export type VerifyAccessToken = (token: string) => Promise<VerifiedToken>;

export async function authenticateRequest(
  _request: Request,
  _verifyAccessToken: VerifyAccessToken,
): Promise<AuthenticatedUser | null> {
  // TODO(PRACTICE): Read a Bearer token, verify it, and translate its subject
  // into the small user object used by GraphQL context.
  throw new PracticeNotImplementedError("authenticate a request");
}

export function requireAuthenticatedUser(
  _user: AuthenticatedUser | null,
): AuthenticatedUser {
  // TODO(PRACTICE): Return an authenticated user or throw AuthenticationError.
  throw new PracticeNotImplementedError("require an authenticated user");
}

export function assertVehicleOwner(
  _user: AuthenticatedUser,
  _vehicle: Pick<Vehicle, "userId">,
): void {
  // TODO(PRACTICE): Throw AuthorizationError when ownership does not match.
  throw new PracticeNotImplementedError("authorize vehicle ownership");
}

// Keep these imports visible as the intended errors for the exercises above.
void AuthenticationError;
void AuthorizationError;

