import { getSession, type SessionUser } from "@/src/server/auth/session";

export class AuthenticationError extends Error {
  readonly statusCode = 401;
}

export async function requireUser(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) throw new AuthenticationError("Authentication required");
  return session;
}

export function isTrustedMutation(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";
  const expected = process.env.APP_URL ?? new URL(request.url).origin;
  return origin === expected;
}
