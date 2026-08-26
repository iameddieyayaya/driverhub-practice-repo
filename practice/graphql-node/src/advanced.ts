import { PracticeNotImplementedError } from "./errors";
import type { Vehicle } from "./types";

export type VehicleOverview = {
  vehicles: Vehicle[];
  totalVehicles: number;
};

export type VehicleOverviewDependencies = {
  listVehicles(userId: string): Promise<Vehicle[]>;
  countVehicles(userId: string): Promise<number>;
};

export async function loadVehicleOverview(
  _userId: string,
  _dependencies: VehicleOverviewDependencies,
): Promise<VehicleOverview> {
  // TODO(PRACTICE): These independent reads may safely start together. Use
  // Promise.all and preserve the named result shape.
  throw new PracticeNotImplementedError("load a vehicle overview concurrently");
}

