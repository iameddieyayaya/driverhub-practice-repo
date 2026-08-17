import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/src/server/database/prisma";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/src/server/auth/session";
import { signInSchema } from "@/src/server/validation/schemas";
import { withRequestLogging } from "@/src/server/observability/logger";

export async function POST(request: Request): Promise<Response> {
  return withRequestLogging(request, async () => {
    const parsed = signInSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user || !(await compare(parsed.data.password, user.passwordHash))) return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    const response = NextResponse.json({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
    response.cookies.set(SESSION_COOKIE, await createSessionToken(user), sessionCookieOptions());
    return response;
  });
}
