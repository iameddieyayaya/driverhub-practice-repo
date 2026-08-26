// @vitest-environment node

import type { PrismaClient } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import { PrismaVehicleRepository } from "../src/repository";
import type { Vehicle } from "../src/types";

const vehicle: Vehicle = {
  id: "vehicle-1",
  year: 2025,
  make: "Mazda",
  model: "Miata",
  userId: "user-1",
};

function prismaDouble() {
  const vehicleDelegate = {
    findMany: vi.fn().mockResolvedValue([vehicle]),
    count: vi.fn().mockResolvedValue(1),
    findUnique: vi.fn().mockResolvedValue(vehicle),
    findFirst: vi.fn().mockResolvedValue(vehicle),
    create: vi.fn().mockResolvedValue(vehicle),
    update: vi.fn().mockResolvedValue(vehicle),
    updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    delete: vi.fn().mockResolvedValue(vehicle),
    deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
  };

  return {
    db: { vehicle: vehicleDelegate } as unknown as PrismaClient,
    vehicleDelegate,
  };
}

describe("PrismaVehicleRepository", () => {
  it("lists a stable, ownership-scoped page", async () => {
    const { db, vehicleDelegate } = prismaDouble();
    const repository = new PrismaVehicleRepository(db);

    await expect(
      repository.listByUser("user-1", { skip: 10, take: 10 }),
    ).resolves.toEqual([vehicle]);
    expect(vehicleDelegate.findMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      skip: 10,
      take: 10,
      orderBy: { id: "asc" },
      select: {
        id: true,
        year: true,
        make: true,
        model: true,
        userId: true,
      },
    });
  });

  it("counts only a user's vehicles", async () => {
    const { db, vehicleDelegate } = prismaDouble();
    const repository = new PrismaVehicleRepository(db);

    await expect(repository.countByUser("user-1")).resolves.toBe(1);
    expect(vehicleDelegate.count).toHaveBeenCalledWith({
      where: { userId: "user-1" },
    });
  });

  it("creates a vehicle with its authenticated owner", async () => {
    const { db, vehicleDelegate } = prismaDouble();
    const repository = new PrismaVehicleRepository(db);
    const input = {
      userId: "user-1",
      year: 2025,
      make: "Mazda",
      model: "Miata",
    };

    await expect(repository.create(input)).resolves.toEqual(vehicle);
    expect(vehicleDelegate.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: input }),
    );
  });

  it.todo("updates only when id and userId match");
  it.todo("deletes only when id and userId match");
  it.todo("translates a Prisma connectivity failure without leaking its URL");
});

