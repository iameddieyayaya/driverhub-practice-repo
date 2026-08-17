import type { PrismaClient } from "@prisma/client";
import { MemberRepository } from "@/src/server/repositories/member-repository";
import { profileInputSchema } from "@/src/server/validation/schemas";
import { ResourceNotFoundError } from "@/src/server/services/vehicle-service";

export class MemberService {
  private readonly members: MemberRepository;
  constructor(private readonly db: PrismaClient) { this.members = new MemberRepository(db); }

  async dashboard(userId: string) {
    const member = await this.members.findForDashboard(userId);
    if (!member) throw new ResourceNotFoundError("Member not found");
    return member;
  }

  membership(userId: string) { return this.members.getMembership(userId); }
  profile(userId: string) { return this.members.getProfile(userId); }

  async updateProfile(userId: string, rawInput: unknown) {
    const input = profileInputSchema.parse(rawInput);
    const { notifications, ...profile } = input;
    return this.db.$transaction(async (transaction) => {
      const user = await transaction.user.update({ where: { id: userId }, data: {
        firstName: profile.firstName, lastName: profile.lastName,
        profile: { upsert: { create: { phone: profile.phone || null, city: profile.city || null, state: profile.state || null }, update: { phone: profile.phone || null, city: profile.city || null, state: profile.state || null } } },
        notificationPreference: { upsert: { create: notifications, update: notifications } }
      }, include: { profile: true, notificationPreference: true } });
      await transaction.activity.create({ data: { userId, type: "PROFILE_UPDATED", summary: "Updated profile and notification preferences" } });
      return user;
    });
  }
}
