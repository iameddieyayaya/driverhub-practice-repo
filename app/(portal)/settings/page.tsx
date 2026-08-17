import type { Metadata } from "next";
import { PageHeading } from "@/src/components/dashboard/page-heading";
import { Card } from "@/src/components/ui/card";
import { ProfileForm } from "@/src/components/settings/profile-form";
import { requireUser } from "@/src/server/auth/authorize";
import { prisma } from "@/src/server/database/prisma";
import { MemberService } from "@/src/server/services/member-service";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireUser();
  const profile = await new MemberService(prisma).profile(user.id);
  if (!profile) return null;
  return <div className="mx-auto max-w-5xl animate-enter"><PageHeading eyebrow="Member controls" title="Profile & preferences" description="REST fits this bounded account resource: read or patch one member profile as a single document." /><Card className="p-6 sm:p-8"><ProfileForm initialProfile={profile} /></Card></div>;
}
