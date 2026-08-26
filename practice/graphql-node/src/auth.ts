import {
  AuthenticationError,
  AuthorizationError,
  PracticeNotImplementedError,
} from "./errors";
import type { AuthenticatedUser, Vehicle } from "./types";

export type VerifiedToken = { sub?: string };
export type VerifyAccessToken = (token: string) => Promise<VerifiedToken>;

export async function authenticateRequest(
  request: Request,
  verifyAccessToken: VerifyAccessToken,
): Promise<AuthenticatedUser | null> {
  // TODO(PRACTICE): Read a Bearer token, verify it, and translate its subject
  // into the small user object used by GraphQL context.
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    return null;
  }

  const prefix = "Bearer ";

  if (!authorization?.startsWith(prefix)) {
    throw new AuthenticationError("Invalid authorization header");
  }

  const token = authorization.slice(prefix.length).trim();

  if (!token) {
    throw new AuthenticationError("Bearer token is missing");
  }

  const payload = await verifyAccessToken(token);

  if (!payload.sub) {
    throw new AuthenticationError("Token subject is missing");
  }

  return { id: payload.sub };
}

export function requireAuthenticatedUser(
  user: AuthenticatedUser | null,
): AuthenticatedUser {
  // TODO(PRACTICE): Return an authenticated user or throw AuthenticationError.
  if (!user?.id) {
    throw new AuthenticationError()
  }

  return user;
}

export function assertVehicleOwner(
  user: AuthenticatedUser,
  vehicle: Pick<Vehicle, "userId">,
): void {
  // TODO(PRACTICE): Throw AuthorizationError when ownership does not match.
  if (user.id !== vehicle.userId) {
    throw new AuthorizationError("You cannot modify this vehicle");
  }

}

// Keep these imports visible as the intended errors for the exercises above.
void AuthenticationError;
void AuthorizationError;

