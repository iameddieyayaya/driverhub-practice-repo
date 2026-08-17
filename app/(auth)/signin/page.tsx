import type { Metadata } from "next";
import { CarFront, Flag, Route } from "lucide-react";
import { SignInForm, DemoAccessNote } from "@/src/components/settings/sign-in-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const requested = (await searchParams).returnTo;
  const returnTo = requested?.startsWith("/") && !requested.startsWith("//") ? requested : "/dashboard";
  return <main className="route-grid min-h-screen p-4 sm:p-8"><div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[2rem] border bg-white shadow-card lg:grid-cols-[1.15fr_.85fr]">
    <section className="garage-strip relative flex min-h-[360px] flex-col justify-between overflow-hidden p-8 text-white sm:p-12 lg:min-h-full">
      <div className="relative z-10 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-road"><CarFront /></span><span className="display-type text-3xl">DriverHub</span></div>
      <div className="relative z-10 max-w-lg"><p className="data-type mb-4 text-xs uppercase tracking-[.24em] text-mint">Member route · 08/14/26</p><h1 className="display-type text-5xl leading-[.94] sm:text-7xl">Good roads start in the garage.</h1><p className="mt-5 max-w-md text-base leading-relaxed text-white/70">Keep every car, event, and membership detail in one place—then get back behind the wheel.</p></div>
      <div className="relative z-10 flex gap-6 text-sm text-white/65"><span className="flex items-center gap-2"><Route size={17} />15 drives ahead</span><span className="flex items-center gap-2"><Flag size={17} />Member since 2024</span></div>
      <div aria-hidden="true" className="absolute -right-16 top-24 size-80 rounded-full border-[52px] border-white/5" />
    </section>
    <section className="flex items-center p-7 sm:p-12"><div className="mx-auto w-full max-w-sm"><p className="data-type text-xs uppercase tracking-[.2em] text-road">Member access</p><h2 className="display-type mt-2 text-4xl">Back in the driver’s seat.</h2><p className="mb-7 mt-3 text-sm leading-relaxed text-muted">Use your DriverHub member credentials to continue.</p><SignInForm returnTo={returnTo} /><DemoAccessNote /></div></section>
  </div></main>;
}
