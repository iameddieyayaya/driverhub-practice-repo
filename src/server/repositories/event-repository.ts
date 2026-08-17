import type { PrismaClient } from "@prisma/client";

export class EventRepository {
  constructor(private readonly db: PrismaClient) {}

  listUpcoming(userId: string, limit = 30) {
    return this.db.event.findMany({
      where: { startDate: { gte: new Date() } }, orderBy: { startDate: "asc" }, take: limit,
      include: { favorites: { where: { userId }, select: { userId: true } } }
    });
  }

  findById(id: string, userId: string) {
    return this.db.event.findUnique({ where: { id }, include: { favorites: { where: { userId }, select: { userId: true } } } });
  }

  async setFavorite(userId: string, eventId: string, favorite: boolean) {
    if (favorite) return this.db.favoriteEvent.upsert({ where: { userId_eventId: { userId, eventId } }, create: { userId, eventId }, update: {} });
    return this.db.favoriteEvent.deleteMany({ where: { userId, eventId } });
  }
}
