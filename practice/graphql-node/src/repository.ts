import type { PrismaClient } from "@prisma/client";
import { PracticeNotImplementedError } from "./errors";
import type {
  CreateVehicleInput,
  UpdateVehicleInput,
  UserSummary,
  Vehicle,
} from "./types";

export type VehicleListOptions = { skip: number; take: number };
export type OwnedCreateVehicleInput = CreateVehicleInput & { userId: string };

export interface VehicleRepository {
  listByUser(userId: string, options: VehicleListOptions): Promise<Vehicle[]>;
  countByUser(userId: string): Promise<number>;
  findById(id: string): Promise<Vehicle | null>;
  create(input: OwnedCreateVehicleInput): Promise<Vehicle>;
  updateOwned(
    id: string,
    userId: string,
    input: UpdateVehicleInput,
  ): Promise<Vehicle | null>;
  deleteOwned(id: string, userId: string): Promise<boolean>;
}

export interface UserRepository {
  findById(id: string): Promise<UserSummary | null>;
  findManyByIds(ids: readonly string[]): Promise<UserSummary[]>;
}

/**
 * PostgreSQL implementation backed by the existing Prisma Vehicle model.
 * Unit tests provide a mocked PrismaClient; no database is required for them.
 */
export class PrismaVehicleRepository implements VehicleRepository {
  constructor(private readonly db: PrismaClient) {}

  async listByUser(
    _userId: string,
    _options: VehicleListOptions,
  ): Promise<Vehicle[]> {
    void this.db;
    // TODO(PRACTICE): Use Prisma findMany with ownership, stable ordering,
    // skip, and take constraints.
    throw new PracticeNotImplementedError("list vehicles with Prisma");
  }

  async countByUser(_userId: string): Promise<number> {
    // TODO(PRACTICE): Count only the current user's vehicles.
    throw new PracticeNotImplementedError("count vehicles with Prisma");
  }

  async findById(_id: string): Promise<Vehicle | null> {
    // TODO(PRACTICE): Fetch one vehicle without converting not-found to a
    // database exception.
    throw new PracticeNotImplementedError("find a vehicle with Prisma");
  }

  async create(_input: OwnedCreateVehicleInput): Promise<Vehicle> {
    // TODO(PRACTICE): Persist only the fields allowed by this exercise.
    throw new PracticeNotImplementedError("create a vehicle with Prisma");
  }

  async updateOwned(
    _id: string,
    _userId: string,
    _input: UpdateVehicleInput,
  ): Promise<Vehicle | null> {
    // TODO(PRACTICE): Make the ownership condition part of the database write
    // to avoid a check-then-update race.
    throw new PracticeNotImplementedError("update an owned vehicle with Prisma");
  }

  async deleteOwned(_id: string, _userId: string): Promise<boolean> {
    // TODO(PRACTICE): Delete only when both id and userId match.
    throw new PracticeNotImplementedError("delete an owned vehicle with Prisma");
  }
}

