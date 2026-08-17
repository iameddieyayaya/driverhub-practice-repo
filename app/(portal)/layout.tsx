import { redirect } from "next/navigation";
import { CarFront } from "lucide-react";
import { getSession } from "@/src/server/auth/session";
import { PortalNav } from "@/src/components/layout/portal-nav";
import { SignOutButton } from "@/src/components/layout/sign-out-button";
import { initials } from "@/src/shared/format";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/signin");
  return <div className="min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
    <aside className="garage-strip sticky top-0 z-20 flex h-auto flex-col border-b border-white/10 p-4 text-white lg:h-screen lg:border-r lg:border-b-0 lg:p-5">
      <div className="flex items-center justify-between lg:block">
        <div className="flex items-center gap-3 px-2 py-2"><span className="grid size-9 place-items-center rounded-xl bg-road"><CarFront size={21} /></span><span className="display-type text-2xl tracking-tight">DriverHub</span></div>
        <div className="hidden lg:mt-8 lg:block"><PortalNav /></div>
      </div>
      <div className="mt-3 lg:mt-auto"><div className="mb-3 hidden items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 lg:flex"><span className="grid size-9 place-items-center rounded-full bg-mint text-sm font-bold text-ink">{initials(user.firstName, user.lastName)}</span><span className="min-w-0"><span className="block truncate text-sm font-semibold">{user.firstName} {user.lastName}</span><span className="block truncate text-xs text-white/55">Member</span></span></div><SignOutButton /></div>
      <div className="mt-3 lg:hidden"><PortalNav /></div>
    </aside>
    <main className="route-grid min-w-0 px-4 py-7 sm:px-7 lg:px-10 lg:py-9">{children}</main>
  </div>;
}
