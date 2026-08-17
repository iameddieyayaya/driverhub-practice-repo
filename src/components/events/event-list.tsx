"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { CalendarDays, Heart, MapPin } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { formatDate } from "@/src/shared/format";
import { cn } from "@/src/shared/cn";

export type EventView = { id: string; name: string; description: string; location: string; startDate: string; endDate: string; imageUrl: string | null; isFavorite: boolean };

export function EventList({ initialEvents }: { initialEvents: EventView[] }) {
  const [events, setEvents] = useState(initialEvents);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  function toggle(eventId: string, favorite: boolean) {
    setError("");
    startTransition(async () => {
      const response = await fetch("/api/graphql", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query: `mutation Favorite($eventId: ID!, $favorite: Boolean!) { favoriteEvent(eventId: $eventId, favorite: $favorite) { id isFavorite } }`, variables: { eventId, favorite } }) });
      const result = await response.json() as { data?: { favoriteEvent: { id: string; isFavorite: boolean } }; errors?: { message: string }[] };
      if (!response.ok || !result.data) { setError(result.errors?.[0]?.message ?? "Could not update favorite"); return; }
      setEvents((current) => current.map((event) => event.id === eventId ? { ...event, isFavorite: result.data!.favoriteEvent.isFavorite } : event));
    });
  }
  return <div>{error ? <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}<div className="grid gap-4 lg:grid-cols-2">{events.map((event, index) => <Card key={event.id} className="overflow-hidden"><div className="grid sm:grid-cols-[132px_1fr]"><div className={cn("grid min-h-36 place-items-center p-4", index % 3 === 0 ? "bg-mint" : index % 3 === 1 ? "bg-sun/70" : "bg-metal")}><div className="text-center"><CalendarDays className="mx-auto mb-3 text-ink/45" /><p className="data-type text-[10px] uppercase tracking-[.14em]">{new Date(event.startDate).toLocaleString("en-US", { month: "short" })}</p><p className="display-type text-5xl leading-none">{new Date(event.startDate).getDate()}</p></div></div><div className="p-5"><div className="flex gap-3"><div className="min-w-0 flex-1"><p className="data-type text-[10px] uppercase tracking-[.16em] text-road">{formatDate(event.startDate)}</p><Link href={`/events/${event.id}`} className="hover:text-road"><h2 className="display-type mt-1 text-2xl">{event.name}</h2></Link></div><Button size="sm" variant="quiet" disabled={isPending} onClick={() => toggle(event.id, !event.isFavorite)} aria-label={`${event.isFavorite ? "Unfavorite" : "Favorite"} ${event.name}`} className={event.isFavorite ? "text-road" : "text-muted"}><Heart size={18} fill={event.isFavorite ? "currentColor" : "none"} /></Button></div><p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{event.description}</p><p className="mt-4 flex items-center gap-1.5 text-xs font-semibold"><MapPin size={14} className="text-road" />{event.location}</p></div></div></Card>)}</div></div>;
}
