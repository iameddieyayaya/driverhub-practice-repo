import type { Prisma, PrismaClient } from "@prisma/client";

export class VehicleRepository {
  constructor(private readonly db: PrismaClient | Prisma.TransactionClient) {}

  listForUser(userId: string) {
    return this.db.vehicle.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  }

  findOwned(id: string, userId: string) {
    return this.db.vehicle.findFirst({ where: { id, userId } });
  }

  create(userId: string, data: Omit<Prisma.VehicleUncheckedCreateInput, "userId">) {
    return this.db.vehicle.create({ data: { ...data, userId } });
  }

  update(id: string, data: Prisma.VehicleUpdateInput) {
    return this.db.vehicle.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.db.vehicle.delete({ where: { id } });
  }
}
