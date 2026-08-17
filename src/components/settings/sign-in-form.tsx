"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

export function SignInForm({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  function submit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const response = await fetch("/api/auth/signin", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: formData.get("email"), password: formData.get("password") }) });
      if (!response.ok) { const result = await response.json() as { error?: string }; setError(result.error ?? "Sign in failed."); return; }
      router.replace(returnTo); router.refresh();
    });
  }
  return <form action={submit} className="grid gap-5" aria-describedby={error ? "signin-error" : undefined}>
    <Input label="Email address" name="email" type="email" defaultValue="alex@driverhub.local" autoComplete="email" required />
    <Input label="Password" name="password" type="password" defaultValue="driverhub123" autoComplete="current-password" required />
    {error ? <p id="signin-error" role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-800">{error}</p> : null}
    <Button disabled={isPending} className="w-full">{isPending ? "Starting your drive…" : "Sign in"}<ArrowRight size={17} /></Button>
  </form>;
}

export function DemoAccessNote() { return <div className="mt-6 flex gap-3 rounded-xl border border-metal bg-paper p-3 text-xs leading-relaxed text-muted"><KeyRound className="mt-0.5 shrink-0" size={16} /><p><strong className="text-ink">Practice account is prefilled.</strong><br />Seed the database before signing in.</p></div>; }
