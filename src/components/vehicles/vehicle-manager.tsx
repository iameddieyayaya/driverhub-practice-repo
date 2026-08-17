"use client";

import { useState, useTransition } from "react";
import { CarFront, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";

export type VehicleView = { id: string; year: number; make: string; model: string; nickname: string | null; vin: string | null; imageUrl: string | null; isFavorite: boolean; createdAt: string; updatedAt: string };
type VehicleDraft = { year: string; make: string; model: string; nickname: string; vin: string; imageUrl: string; isFavorite: boolean };
const emptyDraft: VehicleDraft = { year: String(new Date().getFullYear()), make: "", model: "", nickname: "", vin: "", imageUrl: "", isFavorite: false };

async function graphql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const response = await fetch("/api/graphql", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query, variables }) });
  const result = await response.json() as { data?: T; errors?: { message: string }[] };
  if (!response.ok || result.errors?.length) throw new Error(result.errors?.[0]?.message ?? "Request failed");
  if (!result.data) throw new Error("No response data");
  return result.data;
}

export function VehicleManager({ initialVehicles }: { initialVehicles: VehicleView[] }) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [draft, setDraft] = useState<VehicleDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function openCreate() { setEditingId(null); setDraft(emptyDraft); setMessage(""); setShowForm(true); }
  function openEdit(vehicle: VehicleView) { setEditingId(vehicle.id); setDraft({ year: String(vehicle.year), make: vehicle.make, model: vehicle.model, nickname: vehicle.nickname ?? "", vin: vehicle.vin ?? "", imageUrl: vehicle.imageUrl ?? "", isFavorite: vehicle.isFavorite }); setMessage(""); setShowForm(true); }
  function submit(event: React.FormEvent) {
    event.preventDefault(); setMessage("");
    const input = { ...draft, year: Number(draft.year) };
    startTransition(async () => {
      try {
        if (editingId) {
          const data = await graphql<{ updateVehicle: VehicleView }>(`mutation Update($id: ID!, $input: VehicleInput!) { updateVehicle(id: $id, input: $input) { id year make model nickname vin imageUrl isFavorite createdAt updatedAt } }`, { id: editingId, input });
          setVehicles((current) => current.map((vehicle) => vehicle.id === editingId ? data.updateVehicle : vehicle));
        } else {
          const data = await graphql<{ createVehicle: VehicleView }>(`mutation Create($input: VehicleInput!) { createVehicle(input: $input) { id year make model nickname vin imageUrl isFavorite createdAt updatedAt } }`, { input });
          setVehicles((current) => [data.createVehicle, ...current]);
        }
        setShowForm(false);
      } catch (error) { setMessage(error instanceof Error ? error.message : "Could not save vehicle"); }
    });
  }
  function remove(vehicle: VehicleView) {
    if (!window.confirm(`Remove ${vehicle.year} ${vehicle.make} ${vehicle.model}?`)) return;
    startTransition(async () => {
      try { await graphql<{ deleteVehicle: boolean }>(`mutation Delete($id: ID!) { deleteVehicle(id: $id) }`, { id: vehicle.id }); setVehicles((current) => current.filter((item) => item.id !== vehicle.id)); }
      catch (error) { setMessage(error instanceof Error ? error.message : "Could not remove vehicle"); }
    });
  }

  return <div>
    <div className="mb-6 flex justify-end"><Button onClick={openCreate}><Plus size={17} />Add vehicle</Button></div>
    {message ? <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{message}</p> : null}
    {showForm ? <Card className="mb-6 p-5"><div className="mb-5 flex items-center justify-between"><h2 className="display-type text-2xl">{editingId ? "Edit vehicle" : "Add to your garage"}</h2><Button variant="quiet" size="sm" onClick={() => setShowForm(false)} aria-label="Close vehicle form"><X size={18} /></Button></div><form onSubmit={submit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Input label="Year" name="year" type="number" value={draft.year} onChange={(event) => setDraft((current) => ({ ...current, year: event.target.value }))} required />
      <Input label="Make" name="make" value={draft.make} onChange={(event) => setDraft((current) => ({ ...current, make: event.target.value }))} required />
      <Input label="Model" name="model" value={draft.model} onChange={(event) => setDraft((current) => ({ ...current, model: event.target.value }))} required />
      <Input label="Nickname" name="nickname" value={draft.nickname} onChange={(event) => setDraft((current) => ({ ...current, nickname: event.target.value }))} placeholder="Optional" />
      <Input label="VIN" name="vin" value={draft.vin} onChange={(event) => setDraft((current) => ({ ...current, vin: event.target.value.toUpperCase() }))} maxLength={17} placeholder="Optional, 17 characters" />
      <Input label="Image URL" name="imageUrl" type="url" value={draft.imageUrl} onChange={(event) => setDraft((current) => ({ ...current, imageUrl: event.target.value }))} placeholder="Optional" />
      <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={draft.isFavorite} onChange={(event) => setDraft((current) => ({ ...current, isFavorite: event.target.checked }))} /> Garage spotlight</label>
      <div className="flex gap-2 sm:col-span-2 lg:col-span-3"><Button disabled={isPending} type="submit">{isPending ? "Saving…" : "Save vehicle"}</Button><Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button></div>
    </form></Card> : null}
    {vehicles.length === 0 ? <Card className="grid min-h-64 place-items-center p-8 text-center"><div><CarFront className="mx-auto text-metal" size={54} /><h2 className="display-type mt-4 text-2xl">The garage is ready.</h2><p className="mt-2 text-sm text-muted">Add your first vehicle to begin your DriverHub logbook.</p></div></Card> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{vehicles.map((vehicle, index) => <Card key={vehicle.id} className="group overflow-hidden"><div className={`relative grid h-40 place-items-center ${index === 0 ? "garage-strip" : "bg-ink-soft"}`}><CarFront size={76} strokeWidth={1} className="text-white/35" />{vehicle.isFavorite ? <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-sun px-2.5 py-1 text-[10px] font-bold uppercase text-ink"><Star size={11} fill="currentColor" />Spotlight</span> : null}</div><div className="p-5"><p className="data-type text-[10px] uppercase tracking-[.16em] text-road">Vehicle {String(index + 1).padStart(2, "0")}</p><h2 className="display-type mt-1 text-2xl">{vehicle.year} {vehicle.make} {vehicle.model}</h2><p className="mt-1 h-5 text-sm text-muted">{vehicle.nickname ?? "No nickname yet"}</p><div className="mt-5 flex gap-2 border-t pt-4"><Button variant="secondary" size="sm" onClick={() => openEdit(vehicle)}><Pencil size={14} />Edit</Button><Button variant="quiet" size="sm" onClick={() => remove(vehicle)} disabled={isPending} className="text-red-700"><Trash2 size={14} />Remove</Button></div></div></Card>)}</div>}
  </div>;
}
