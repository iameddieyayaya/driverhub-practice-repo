import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/src/server/auth/session";

export async function POST(request: Request): Promise<Response> {
  const origin = request.headers.get("origin");
  if (origin && origin !== (process.env.APP_URL ?? new URL(request.url).origin)) return NextResponse.json({ error: "Untrusted request origin" }, { status: 403 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  return response;
}
