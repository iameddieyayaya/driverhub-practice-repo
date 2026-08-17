import type { PrismaClient } from "@prisma/client";
import { EventRepository } from "@/src/server/repositories/event-repository";
import { ResourceNotFoundError } from "@/src/server/services/vehicle-service";

export class EventService {
  private readonly events: EventRepository;
  constructor(private readonly db: PrismaClient) { this.events = new EventRepository(db); }

  async list(userId: string, limit?: number) {
    const rows = await this.events.listUpcoming(userId, limit);
    return rows.map(({ favorites, ...event }) => ({ ...event, isFavorite: favorites.length > 0 }));
  }

  async get(userId: string, id: string) {
    const row = await this.events.findById(id, userId);
    if (!row) throw new ResourceNotFoundError("Event not found");
    const { favorites, ...event } = row;
    return { ...event, isFavorite: favorites.length > 0 };
  }

  async favorite(userId: string, eventId: string, favorite: boolean) {
    const event = await this.events.findById(eventId, userId);
    if (!event) throw new ResourceNotFoundError("Event not found");
    await this.events.setFavorite(userId, eventId, favorite);
    await this.db.activity.create({ data: { userId, type: favorite ? "EVENT_FAVORITED" : "EVENT_UNFAVORITED", summary: `${favorite ? "Saved" : "Removed"} ${event.name}` } });
    return this.get(userId, eventId);
  }
}
