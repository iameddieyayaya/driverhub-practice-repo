import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/src/server/auth/session";

const protectedPrefixes = ["/dashboard", "/vehicles", "/events", "/settings"];

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", request.headers.get("x-request-id") ?? crypto.randomUUID());
  const isProtected = protectedPrefixes.some((path) => request.nextUrl.pathname.startsWith(path));
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (isProtected && !session) {
    const signIn = new URL("/signin", request.url);
    signIn.searchParams.set("returnTo", request.nextUrl.pathname);
    return NextResponse.redirect(signIn);
  }
  if (request.nextUrl.pathname === "/signin" && session) return NextResponse.redirect(new URL("/dashboard", request.url));
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = { matcher: ["/dashboard/:path*", "/vehicles/:path*", "/events/:path*", "/settings/:path*", "/signin"] };
