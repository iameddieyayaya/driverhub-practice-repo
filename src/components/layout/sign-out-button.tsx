"use client";

import { LogOut } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  function signOut() { startTransition(async () => { await fetch("/api/auth/signout", { method: "POST" }); router.replace("/signin"); router.refresh(); }); }
  return <Button type="button" variant="quiet" size="sm" onClick={signOut} disabled={isPending} className="w-full justify-start text-white/75 hover:bg-white/10 hover:text-white"><LogOut size={16} />{isPending ? "Signing out…" : "Sign out"}</Button>;
}
