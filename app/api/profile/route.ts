import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/src/server/database/prisma";
import { requireUser, AuthenticationError, isTrustedMutation } from "@/src/server/auth/authorize";
import { MemberService } from "@/src/server/services/member-service";
import { withRequestLogging } from "@/src/server/observability/logger";

const service = new MemberService(prisma);

export async function GET(request: Request): Promise<Response> {
  return withRequestLogging(request, async () => {
    try { const user = await requireUser(); return NextResponse.json({ profile: await service.profile(user.id) }); }
    catch (error) { if (error instanceof AuthenticationError) return NextResponse.json({ error: error.message }, { status: 401 }); throw error; }
  });
}

export async function PATCH(request: Request): Promise<Response> {
  return withRequestLogging(request, async () => {
    try {
      if (!isTrustedMutation(request)) return NextResponse.json({ error: "Untrusted request origin" }, { status: 403 });
      const user = await requireUser();
      return NextResponse.json({ profile: await service.updateProfile(user.id, await request.json()) });
    } catch (error) {
      if (error instanceof AuthenticationError) return NextResponse.json({ error: error.message }, { status: 401 });
      if (error instanceof ZodError) return NextResponse.json({ error: "Profile data is invalid", issues: error.issues }, { status: 400 });
      throw error;
    }
  });
}
