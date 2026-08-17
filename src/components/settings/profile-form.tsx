"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

type ProfileView = { firstName: string; lastName: string; profile: { phone: string | null; city: string | null; state: string | null } | null; notificationPreference: { emailEnabled: boolean; smsEnabled: boolean; eventReminders: boolean; marketingEnabled: boolean } | null };
const defaults = { emailEnabled: true, smsEnabled: false, eventReminders: true, marketingEnabled: false };

export function ProfileForm({ initialProfile }: { initialProfile: ProfileView }) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const preferences = initialProfile.notificationPreference ?? defaults;
  function submit(formData: FormData) {
    setMessage("");
    const body = { firstName: formData.get("firstName"), lastName: formData.get("lastName"), phone: formData.get("phone"), city: formData.get("city"), state: formData.get("state"), notifications: { emailEnabled: formData.get("emailEnabled") === "on", smsEnabled: formData.get("smsEnabled") === "on", eventReminders: formData.get("eventReminders") === "on", marketingEnabled: formData.get("marketingEnabled") === "on" } };
    startTransition(async () => { const response = await fetch("/api/profile", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); const result = await response.json() as { error?: string }; setMessage(response.ok ? "Changes saved." : result.error ?? "Could not save changes."); });
  }
  return <form action={submit} className="grid gap-7"><section><h2 className="display-type text-2xl">Personal information</h2><p className="mt-1 text-sm text-muted">Used for your member account and event communication.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><Input label="First name" name="firstName" defaultValue={initialProfile.firstName} required /><Input label="Last name" name="lastName" defaultValue={initialProfile.lastName} required /><Input label="Phone" name="phone" type="tel" defaultValue={initialProfile.profile?.phone ?? ""} /><Input label="City" name="city" defaultValue={initialProfile.profile?.city ?? ""} /><Input label="State" name="state" maxLength={2} defaultValue={initialProfile.profile?.state ?? ""} /></div></section><hr /><section><h2 className="display-type text-2xl">Notification preferences</h2><p className="mt-1 text-sm text-muted">Choose which updates make it to your inbox or phone.</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{[
    ["emailEnabled", "Account email", "Membership and account notices", preferences.emailEnabled],
    ["smsEnabled", "Text messages", "Time-sensitive event updates", preferences.smsEnabled],
    ["eventReminders", "Event reminders", "A heads-up before saved events", preferences.eventReminders],
    ["marketingEnabled", "DriverHub news", "Stories, guides, and featured drives", preferences.marketingEnabled]
  ].map(([name, label, note, checked]) => <label key={String(name)} className="flex cursor-pointer gap-3 rounded-xl border p-4 hover:border-muted"><input name={String(name)} type="checkbox" defaultChecked={Boolean(checked)} className="mt-1 size-4 accent-road" /><span><span className="block text-sm font-semibold">{String(label)}</span><span className="mt-0.5 block text-xs text-muted">{String(note)}</span></span></label>)}</div></section><div className="flex items-center gap-4"><Button disabled={isPending} type="submit">{isPending ? "Saving…" : "Save changes"}</Button>{message ? <p role="status" className={`flex items-center gap-1.5 text-sm font-semibold ${message === "Changes saved." ? "text-green-800" : "text-red-700"}`}>{message === "Changes saved." ? <Check size={16} /> : null}{message}</p> : null}</div></form>;
}
