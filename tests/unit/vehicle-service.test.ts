import type { PrismaClient } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import { ResourceNotFoundError, VehicleService } from "@/src/server/services/vehicle-service";

describe("VehicleService authorization", () => {
  it("scopes reads to the authenticated owner", async () => {
    const findFirst = vi.fn().mockResolvedValue(null);
    const db = { vehicle: { findFirst } } as unknown as PrismaClient;
    await expect(new VehicleService(db).get("member-a", "vehicle-b")).rejects.toBeInstanceOf(ResourceNotFoundError);
    expect(findFirst).toHaveBeenCalledWith({ where: { id: "vehicle-b", userId: "member-a" } });
  });
});
