import type { LucideIcon } from "lucide-react";
import { Card } from "@/src/components/ui/card";

export function StatCard({ label, value, note, icon: Icon, accent = false }: { label: string; value: string; note: string; icon: LucideIcon; accent?: boolean }) {
  return <Card className={accent ? "border-road bg-road text-white" : ""}><div className="flex min-h-36 flex-col justify-between p-5"><div className="flex items-center justify-between"><p className={`data-type text-[10px] uppercase tracking-[.18em] ${accent ? "text-white/70" : "text-muted"}`}>{label}</p><Icon size={18} className={accent ? "text-white/70" : "text-road"} /></div><div><p className="display-type text-3xl">{value}</p><p className={`mt-1 text-xs ${accent ? "text-white/70" : "text-muted"}`}>{note}</p></div></div></Card>;
}
