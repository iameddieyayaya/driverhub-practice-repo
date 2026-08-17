import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "driverhub_session";
const MAX_AGE_SECONDS = 60 * 60 * 8;

export type SessionUser = { id: string; email: string; firstName: string; lastName: string };

function secret(): Uint8Array {
  const value = process.env.SESSION_SECRET ?? (process.env.NODE_ENV === "production" ? "" : "development-only-secret-change-me-32chars");
  if (value.length < 32) throw new Error("SESSION_SECRET must contain at least 32 characters");
  return new TextEncoder().encode(value);
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ email: user.email, firstName: user.firstName, lastName: user.lastName })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret());
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub || typeof payload.email !== "string" || typeof payload.firstName !== "string" || typeof payload.lastName !== "string") return null;
    return { id: payload.sub, email: payload.email, firstName: payload.firstName, lastName: payload.lastName };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}

export function sessionCookieOptions() {
  return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, path: "/", maxAge: MAX_AGE_SECONDS };
}
