import type { PrismaClient } from "@prisma/client";

export class MemberRepository {
  constructor(private readonly db: PrismaClient) {}

  findForDashboard(userId: string) {
    return this.db.user.findUnique({
      where: { id: userId },
      include: {
        profile: true, notificationPreference: true,
        memberships: { where: { status: "ACTIVE" }, orderBy: { startDate: "desc" }, take: 1 },
        vehicles: { orderBy: { createdAt: "desc" } },
        favoriteEvents: { include: { event: true }, orderBy: { createdAt: "desc" }, take: 3 },
        activities: { orderBy: { createdAt: "desc" }, take: 5 }
      }
    });
  }

  getMembership(userId: string) {
    return this.db.membership.findFirst({ where: { userId, status: "ACTIVE" }, orderBy: { startDate: "desc" } });
  }

  getProfile(userId: string) {
    return this.db.user.findUnique({ where: { id: userId }, include: { profile: true, notificationPreference: true } });
  }
}
