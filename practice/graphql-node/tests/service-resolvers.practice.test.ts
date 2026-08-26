// @vitest-environment node

import { describe, expect, it, vi } from "vitest";
import { AuthorizationError } from "../src/errors";
import type { Logger } from "../src/logger";
import type { UserByIdLoader } from "../src/loaders";
import type { VehicleRepository } from "../src/repository";
import { resolvers, type GraphQLContext } from "../src/resolvers";
import { VehicleService } from "../src/service";
import type { Vehicle } from "../src/types";

const vehicle: Vehicle = {
  id: "vehicle-1",
  year: 2025,
  make: "Mazda",
  model: "Miata",
  userId: "user-1",
};

function repositoryDouble(overrides: Partial<VehicleRepository> = {}) {
  return {
    listByUser: vi.fn().mockResolvedValue([vehicle]),
    countByUser: vi.fn().mockResolvedValue(1),
    findById: vi.fn().mockResolvedValue(vehicle),
    create: vi.fn().mockResolvedValue(vehicle),
    updateOwned: vi.fn().mockResolvedValue(vehicle),
    deleteOwned: vi.fn().mockResolvedValue(true),
    ...overrides,
  } as unknown as VehicleRepository;
}

function contextDouble(service: VehicleService): GraphQLContext {
  return {
    requestId: "request-1",
    user: { id: "user-1" },
    vehicleService: service,
    userByIdLoader: { load: vi.fn() } as unknown as UserByIdLoader,
    logger: { info: vi.fn(), error: vi.fn() } as unknown as Logger,
  };
}

describe("VehicleService", () => {
  it("lists only the authenticated user's requested page", async () => {
    const repository = repositoryDouble({
      countByUser: vi.fn().mockResolvedValue(21),
    });
    const service = new VehicleService(repository);

    await expect(
      service.list({ id: "user-1" }, { page: 2, pageSize: 10 }),
    ).resolves.toEqual({
      items: [vehicle],
      page: 2,
      pageSize: 10,
      totalItems: 21,
      totalPages: 3,
    });
    expect(repository.listByUser).toHaveBeenCalledWith("user-1", {
      skip: 10,
      take: 10,
    });
    expect(repository.countByUser).toHaveBeenCalledWith("user-1");
  });

  it("creates a vehicle for the authenticated user", async () => {
    const repository = repositoryDouble();
    const service = new VehicleService(repository);
    const input = { year: 2025, make: "Mazda", model: "Miata" };

    await expect(service.create({ id: "user-1" }, input)).resolves.toEqual(
      vehicle,
    );
    expect(repository.create).toHaveBeenCalledWith({
      ...input,
      userId: "user-1",
    });
  });

  it("does not update a vehicle owned by another user", async () => {
    const repository = repositoryDouble({
      findById: vi.fn().mockResolvedValue({ ...vehicle, userId: "user-2" }),
    });
    const service = new VehicleService(repository);

    await expect(
      service.update({ id: "user-1" }, vehicle.id, { model: "RX-7" }),
    ).rejects.toBeInstanceOf(AuthorizationError);
    expect(repository.updateOwned).not.toHaveBeenCalled();
  });

  it("deletes only through an ownership-scoped repository operation", async () => {
    const repository = repositoryDouble();
    const service = new VehicleService(repository);

    await expect(service.delete({ id: "user-1" }, vehicle.id)).resolves.toBe(
      true,
    );
    expect(repository.deleteOwned).toHaveBeenCalledWith(vehicle.id, "user-1");
  });
});

describe("GraphQL resolvers", () => {
  it("delegates the vehicles query with pagination defaults", async () => {
    const service = new VehicleService(repositoryDouble());
    const list = vi.spyOn(service, "list").mockResolvedValue({
      items: [vehicle],
      page: 1,
      pageSize: 20,
      totalItems: 1,
      totalPages: 1,
    });

    await resolvers.Query.vehicles(undefined, {}, contextDouble(service));

    expect(list).toHaveBeenCalledWith(
      { id: "user-1" },
      { page: 1, pageSize: 20 },
    );
  });

  it("delegates the single vehicle query", async () => {
    const service = new VehicleService(repositoryDouble());
    const get = vi.spyOn(service, "get").mockResolvedValue(vehicle);

    await resolvers.Query.vehicle(
      undefined,
      { id: vehicle.id },
      contextDouble(service),
    );

    expect(get).toHaveBeenCalledWith({ id: "user-1" }, vehicle.id);
  });

  it("delegates all three mutations", async () => {
    const service = new VehicleService(repositoryDouble());
    const create = vi.spyOn(service, "create").mockResolvedValue(vehicle);
    const update = vi.spyOn(service, "update").mockResolvedValue(vehicle);
    const remove = vi.spyOn(service, "delete").mockResolvedValue(true);
    const context = contextDouble(service);
    const input = { year: 2025, make: "Mazda", model: "Miata" };

    await resolvers.Mutation.createVehicle(undefined, { input }, context);
    await resolvers.Mutation.updateVehicle(
      undefined,
      { id: vehicle.id, input: { model: "MX-5" } },
      context,
    );
    await resolvers.Mutation.deleteVehicle(
      undefined,
      { id: vehicle.id },
      context,
    );

    expect(create).toHaveBeenCalledWith({ id: "user-1" }, input);
    expect(update).toHaveBeenCalledWith(
      { id: "user-1" },
      vehicle.id,
      { model: "MX-5" },
    );
    expect(remove).toHaveBeenCalledWith({ id: "user-1" }, vehicle.id);
  });
});
