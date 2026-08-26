// @vitest-environment node

import { describe, expect, it, vi } from "vitest";
import { loadVehicleOverview } from "../src/advanced";
import {
  brokenVehicleOwnerResolver,
  createUserByIdLoader,
  vehicleOwnerResolver,
} from "../src/loaders";
import type { UserRepository } from "../src/repository";
import type { UserSummary, Vehicle } from "../src/types";

const vehicles: Vehicle[] = [
  { id: "v1", year: 2025, make: "Mazda", model: "Miata", userId: "u1" },
  { id: "v2", year: 2024, make: "Subaru", model: "BRZ", userId: "u2" },
  { id: "v3", year: 2023, make: "BMW", model: "M3", userId: "u1" },
];

describe("N+1 diagnosis and DataLoader batching", () => {
  it("demonstrates that the deliberately broken resolver performs N lookups", async () => {
    const findById = vi.fn(async (id: string): Promise<UserSummary> => ({
      id,
      displayName: id.toUpperCase(),
    }));

    await Promise.all(
      vehicles.map((vehicle) =>
        brokenVehicleOwnerResolver(vehicle, {
          userRepository: { findById },
        }),
      ),
    );

    expect(findById).toHaveBeenCalledTimes(3);
  });

  it("batches and deduplicates owner loads while preserving result order", async () => {
    const findManyByIds = vi.fn(async (ids: readonly string[]) =>
      [...ids]
        .reverse()
        .map((id) => ({ id, displayName: id.toUpperCase() })),
    );
    const repository = {
      findManyByIds,
      findById: vi.fn(),
    } as unknown as UserRepository;
    const loader = createUserByIdLoader(repository);

    const results = await Promise.all([
      loader.load("u1"),
      loader.load("u2"),
      loader.load("u1"),
    ]);

    expect(findManyByIds).toHaveBeenCalledTimes(1);
    expect(findManyByIds).toHaveBeenCalledWith(["u1", "u2"]);
    expect(results.map((result) => result?.id)).toEqual(["u1", "u2", "u1"]);
  });

  it("uses the loader from the working owner resolver", async () => {
    const owner = { id: "u1", displayName: "Alex Morgan" };
    const loader = { load: vi.fn().mockResolvedValue(owner) };

    await expect(vehicleOwnerResolver(vehicles[0], loader)).resolves.toEqual(
      owner,
    );
    expect(loader.load).toHaveBeenCalledWith("u1");
  });
});

describe("safe concurrency", () => {
  it("starts independent overview reads before awaiting either result", async () => {
    let resolveVehicles!: (value: Vehicle[]) => void;
    let resolveCount!: (value: number) => void;
    const listVehicles = vi.fn(
      () => new Promise<Vehicle[]>((resolve) => (resolveVehicles = resolve)),
    );
    const countVehicles = vi.fn(
      () => new Promise<number>((resolve) => (resolveCount = resolve)),
    );

    const resultPromise = loadVehicleOverview("u1", {
      listVehicles,
      countVehicles,
    });
    void resultPromise.catch(() => undefined);

    expect(listVehicles).toHaveBeenCalledWith("u1");
    expect(countVehicles).toHaveBeenCalledWith("u1");

    resolveVehicles(vehicles);
    resolveCount(3);

    await expect(resultPromise).resolves.toEqual({
      vehicles,
      totalVehicles: 3,
    });
  });
});

