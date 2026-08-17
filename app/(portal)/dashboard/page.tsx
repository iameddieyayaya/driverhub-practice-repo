import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, CarFront, ChevronRight, CircleGauge, ShieldCheck } from "lucide-react";
import { requireUser } from "@/src/server/auth/authorize";
import { prisma } from "@/src/server/database/prisma";
import { MemberService } from "@/src/server/services/member-service";
import { EventService } from "@/src/server/services/event-service";
import { formatDate, titleCaseEnum } from "@/src/shared/format";
import { PageHeading } from "@/src/components/dashboard/page-heading";
import { StatCard } from "@/src/components/dashboard/stat-card";
import { Card } from "@/src/components/ui/card";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const memberPromise = new MemberService(prisma).dashboard(user.id);
  const eventsPromise = new EventService(prisma).list(user.id, 3);
  const [member, events] = await Promise.all([memberPromise, eventsPromise]);
  const membership = member.memberships[0];
  const favoriteVehicle = member.vehicles.find((vehicle) => vehicle.isFavorite) ?? member.vehicles[0];
  return <div className="mx-auto max-w-7xl animate-enter">
    <PageHeading eyebrow="Route overview" title={`Welcome back, ${member.firstName}.`} description="Your garage, membership, and next reasons to drive." />
    <section aria-label="Membership summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Membership" value={membership ? titleCaseEnum(membership.tier) : "—"} note="Active member tier" icon={ShieldCheck} accent />
      <StatCard label="Renewal date" value={membership ? formatDate(membership.renewalDate) : "—"} note="Automatic renewal enabled" icon={CalendarClock} />
      <StatCard label="My garage" value={`${member.vehicles.length} vehicles`} note="Across your collection" icon={CarFront} />
      <StatCard label="Road ahead" value={`${events.length} events`} note="Upcoming near the calendar" icon={CircleGauge} />
    </section>
    <section className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
      <Card className="overflow-hidden"><div className="garage-strip flex items-end justify-between p-6 text-white"><div><p className="data-type text-[10px] uppercase tracking-[.18em] text-mint">Garage spotlight</p><h2 className="display-type mt-1 text-4xl">{favoriteVehicle ? `${favoriteVehicle.year} ${favoriteVehicle.make} ${favoriteVehicle.model}` : "Your first vehicle"}</h2><p className="mt-2 text-sm text-white/65">{favoriteVehicle?.nickname ? `Known around here as “${favoriteVehicle.nickname}.”` : "Add a nickname to make it yours."}</p></div><CarFront className="hidden text-white/15 sm:block" size={92} strokeWidth={1} /></div><Link href="/vehicles" className="flex items-center justify-between px-6 py-4 text-sm font-semibold hover:bg-paper">Open my garage <ChevronRight size={17} /></Link></Card>
      <Card className="p-6"><div className="flex items-center justify-between"><div><p className="data-type text-[10px] uppercase tracking-[.18em] text-road">Next departures</p><h2 className="display-type mt-1 text-2xl">Upcoming events</h2></div><Link href="/events" className="text-xs font-semibold text-road hover:underline">View all</Link></div><div className="mt-5 divide-y">{events.map((event) => <Link href={`/events/${event.id}`} key={event.id} className="grid grid-cols-[52px_1fr] gap-3 py-3 first:pt-0 hover:text-road"><div className="data-type grid place-items-center rounded-lg bg-paper py-2 text-center text-[10px] uppercase"><strong className="block text-lg leading-none">{event.startDate.getDate()}</strong>{event.startDate.toLocaleString("en-US", { month: "short" })}</div><div><p className="text-sm font-semibold">{event.name}</p><p className="mt-0.5 text-xs text-muted">{event.location}</p></div></Link>)}</div></Card>
    </section>
    <Card className="mt-5 p-6"><p className="data-type text-[10px] uppercase tracking-[.18em] text-road">Account log</p><h2 className="display-type mt-1 text-2xl">Recent activity</h2><ol className="mt-5 border-l-2 border-metal pl-5">{member.activities.map((activity) => <li key={activity.id} className="relative pb-5 last:pb-0"><span className="absolute -left-[27px] top-1 size-3 rounded-full border-2 border-white bg-road" /><p className="text-sm font-semibold">{activity.summary}</p><p className="data-type mt-1 text-[10px] uppercase text-muted">{formatDate(activity.createdAt)}</p></li>)}</ol></Card>
  </div>;
}
