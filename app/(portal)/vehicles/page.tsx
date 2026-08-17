import type { Metadata } from "next";
import { PageHeading } from "@/src/components/dashboard/page-heading";
import { VehicleManager, type VehicleView } from "@/src/components/vehicles/vehicle-manager";
import { requireUser } from "@/src/server/auth/authorize";
import { prisma } from "@/src/server/database/prisma";
import { VehicleService } from "@/src/server/services/vehicle-service";

export const metadata: Metadata = { title: "My garage" };
export const dynamic = "force-dynamic";

export default async function VehiclesPage() {
  const user = await requireUser();
  const vehicles = await new VehicleService(prisma).list(user.id);
  const serialized: VehicleView[] = vehicles.map((vehicle) => ({ ...vehicle, createdAt: vehicle.createdAt.toISOString(), updatedAt: vehicle.updatedAt.toISOString() }));
  return <div className="mx-auto max-w-7xl animate-enter"><PageHeading eyebrow="Collection log" title="My garage" description="Keep the details that matter close at hand. Every change travels through the GraphQL service layer." /><VehicleManager initialVehicles={serialized} /></div>;
}
