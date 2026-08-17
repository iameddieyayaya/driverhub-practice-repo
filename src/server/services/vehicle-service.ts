import type { PrismaClient } from "@prisma/client";
import { VehicleRepository } from "@/src/server/repositories/vehicle-repository";
import { vehicleInputSchema, type VehicleInput } from "@/src/server/validation/schemas";

export class ResourceNotFoundError extends Error {}

function cleanVehicleInput(input: VehicleInput) {
  return {
    year: input.year,
    make: input.make,
    model: input.model,
    nickname: input.nickname || null,
    vin: input.vin || null,
    imageUrl: input.imageUrl || null,
    isFavorite: input.isFavorite ?? false
  };
}

export class VehicleService {
  private readonly vehicles: VehicleRepository;

  constructor(private readonly db: PrismaClient) {
    this.vehicles = new VehicleRepository(db);
  }

  list(userId: string) {
    return this.vehicles.listForUser(userId);
  }

  async get(userId: string, id: string) {
    const vehicle = await this.vehicles.findOwned(id, userId);
    if (!vehicle) throw new ResourceNotFoundError("Vehicle not found");
    return vehicle;
  }

  async create(userId: string, rawInput: unknown) {
    const input = cleanVehicleInput(vehicleInputSchema.parse(rawInput));
    return this.db.$transaction(async (transaction) => {
      const vehicle = await new VehicleRepository(transaction).create(userId, input);
      await transaction.activity.create({ data: { userId, type: "VEHICLE_ADDED", summary: `Added ${vehicle.year} ${vehicle.make} ${vehicle.model}` } });
      return vehicle;
    });
  }

  async update(userId: string, id: string, rawInput: unknown) {
    await this.get(userId, id);
    const input = cleanVehicleInput(vehicleInputSchema.parse(rawInput));
    return this.vehicles.update(id, input);
  }

  async delete(userId: string, id: string) {
    const vehicle = await this.get(userId, id);
    await this.db.$transaction([
      this.db.vehicle.delete({ where: { id: vehicle.id } }),
      this.db.activity.create({ data: { userId, type: "VEHICLE_REMOVED", summary: `Removed ${vehicle.year} ${vehicle.make} ${vehicle.model}` } })
    ]);
    return true;
  }
}
