import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { requireUser } from "@/src/server/auth/authorize";
import { prisma } from "@/src/server/database/prisma";
import { EventService } from "@/src/server/services/event-service";
import { ResourceNotFoundError } from "@/src/server/services/vehicle-service";
import { formatDate } from "@/src/shared/format";
import { Card } from "@/src/components/ui/card";

export const metadata: Metadata = { title: "Event details" };
export const dynamic = "force-dynamic";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [user, { id }] = await Promise.all([requireUser(), params]);
  let event;
  try { event = await new EventService(prisma).get(user.id, id); } catch (error) { if (error instanceof ResourceNotFoundError) notFound(); throw error; }
  return <div className="mx-auto max-w-4xl animate-enter"><Link href="/events" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-road"><ArrowLeft size={16} />Back to events</Link><Card className="overflow-hidden"><div className="garage-strip p-8 text-white sm:p-12"><p className="data-type text-xs uppercase tracking-[.2em] text-mint">Member event</p><h1 className="display-type mt-3 max-w-3xl text-5xl leading-none sm:text-7xl">{event.name}</h1></div><div className="grid gap-8 p-7 sm:p-10 md:grid-cols-[1fr_220px]"><div><h2 className="display-type text-2xl">The route briefing</h2><p className="mt-3 leading-relaxed text-muted">{event.description}</p></div><dl className="grid content-start gap-4 rounded-xl bg-paper p-4"><div><dt className="flex items-center gap-2 text-xs font-semibold text-muted"><CalendarDays size={15} />Dates</dt><dd className="mt-1 text-sm font-semibold">{formatDate(event.startDate)} – {formatDate(event.endDate)}</dd></div><div><dt className="flex items-center gap-2 text-xs font-semibold text-muted"><MapPin size={15} />Location</dt><dd className="mt-1 text-sm font-semibold">{event.location}</dd></div></dl></div></Card></div>;
}
