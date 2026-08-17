"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, CarFront, Gauge, Settings2 } from "lucide-react";
import { cn } from "@/src/shared/cn";

const links = [
  { href: "/dashboard", label: "Overview", icon: Gauge },
  { href: "/vehicles", label: "My garage", icon: CarFront },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/settings", label: "Settings", icon: Settings2 }
];

export function PortalNav() {
  const pathname = usePathname();
  return <nav aria-label="Member navigation" className="grid gap-1">{links.map(({ href, label, icon: Icon }) => {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/68 transition hover:bg-white/8 hover:text-white", active && "bg-white text-ink hover:bg-white hover:text-ink")}><Icon size={18} strokeWidth={active ? 2.5 : 2} />{label}</Link>;
  })}</nav>;
}
