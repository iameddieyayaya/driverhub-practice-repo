import { NextResponse } from "next/server";
import { prisma } from "@/src/server/database/prisma";
import { requireUser, AuthenticationError } from "@/src/server/auth/authorize";
import { MemberService } from "@/src/server/services/member-service";
import { withRequestLogging } from "@/src/server/observability/logger";

const service = new MemberService(prisma);

export async function GET(request: Request): Promise<Response> {
  return withRequestLogging(request, async () => {
    try {
      const user = await requireUser();
      const membership = await service.membership(user.id);
      return NextResponse.json({ membership });
    } catch (error) {
      if (error instanceof AuthenticationError) return NextResponse.json({ error: error.message }, { status: 401 });
      throw error;
    }
  });
}
