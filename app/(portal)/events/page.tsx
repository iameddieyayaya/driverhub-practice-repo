import type { Metadata } from "next";
import { PageHeading } from "@/src/components/dashboard/page-heading";
import { EventList, type EventView } from "@/src/components/events/event-list";
import { requireUser } from "@/src/server/auth/authorize";
import { prisma } from "@/src/server/database/prisma";
import { EventService } from "@/src/server/services/event-service";

export const metadata: Metadata = { title: "Events" };
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const user = await requireUser();
  const events = await new EventService(prisma).list(user.id);
  const serialized: EventView[] = events.map((event) => ({ ...event, startDate: event.startDate.toISOString(), endDate: event.endDate.toISOString() }));
  return <div className="mx-auto max-w-7xl animate-enter"><PageHeading eyebrow="Road calendar" title="Events worth the drive" description="Browse upcoming gatherings and save the ones you want on your route." /><EventList initialEvents={serialized} /></div>;
}
