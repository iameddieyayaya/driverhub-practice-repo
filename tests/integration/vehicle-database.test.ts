import { PrismaClient } from "@prisma/client";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { VehicleService } from "@/src/server/services/vehicle-service";

const databaseUrl = process.env.TEST_DATABASE_URL;
const describeWithDatabase = databaseUrl ? describe : describe.skip;

describeWithDatabase("VehicleService + PostgreSQL", () => {
  const db = new PrismaClient({ datasourceUrl: databaseUrl });
  let userId = "";
  beforeAll(async () => { const user = await db.user.findUniqueOrThrow({ where: { email: "alex@driverhub.local" } }); userId = user.id; });
  afterAll(async () => db.$disconnect());
  it("creates, authorizes, updates, and deletes a vehicle", async () => {
    const service = new VehicleService(db);
    const created = await service.create(userId, { year: 1984, make: "Volkswagen", model: "Rabbit GTI", nickname: "Integration test" });
    expect((await service.get(userId, created.id)).nickname).toBe("Integration test");
    const updated = await service.update(userId, created.id, { year: 1984, make: "Volkswagen", model: "Rabbit GTI", nickname: "Updated" });
    expect(updated.nickname).toBe("Updated");
    await expect(service.delete("not-the-owner", created.id)).rejects.toThrow("Vehicle not found");
    await service.delete(userId, created.id);
  });
});
