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
  // TODO(PRACTICE): Add a Prisma-backed implementation for the owner/DataLoader
  // exercise. findManyByIds should use one `id in [...]` query, select only the
  // UserSummary fields, and must not assume PostgreSQL returns rows in key order.
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
    // TODO(PRACTICE): Implement the paginated read with db.vehicle.findMany.
    // Requirements:
    // 1. Scope `where` to userId so one user never receives another user's rows.
    // 2. Forward options.skip and options.take to Prisma.
    // 3. Order by id ascending so page boundaries are deterministic.
    // 4. Select only id, year, make, model, and userId. The Prisma Vehicle model
    //    has additional columns that are outside this exercise's API contract.
    // 5. Return Prisma's result directly; an empty page should be [].
    // The active "lists a stable, ownership-scoped page" test shows the exact
    // Prisma argument shape expected by this exercise.
    throw new PracticeNotImplementedError("list vehicles with Prisma");
  }

  async countByUser(_userId: string): Promise<number> {
    // TODO(PRACTICE): Use db.vehicle.count with a `where.userId` filter.
    // Do not count every vehicle and do not fetch rows just to calculate length.
    // This count is used by VehicleService.list to calculate totalPages.
    throw new PracticeNotImplementedError("count vehicles with Prisma");
  }

  async findById(_id: string): Promise<Vehicle | null> {
    // TODO(PRACTICE): Fetch a single vehicle by its unique id.
    // Requirements:
    // - Use a Prisma operation whose normal not-found result is null.
    // - Select only the five Vehicle API fields.
    // - Do not catch a genuine database outage and mislabel it as "not found".
    // Ownership is intentionally not applied here: the service uses the row's
    // userId when it needs to distinguish ownership before a mutation. The
    // ownership condition must still be repeated in the actual write.
    throw new PracticeNotImplementedError("find a vehicle with Prisma");
  }

  async create(_input: OwnedCreateVehicleInput): Promise<Vehicle> {
    // TODO(PRACTICE): Create a Vehicle with db.vehicle.create.
    // Requirements:
    // - Persist year, make, model, and the authenticated userId supplied by the
    //   service. GraphQL input must never be allowed to choose userId.
    // - Select/return only id, year, make, model, and userId.
    // - Let validation happen in the service layer; this repository translates
    //   data to a Prisma operation rather than duplicating form rules.
    // - Do not swallow foreign-key or connectivity failures.
    throw new PracticeNotImplementedError("create a vehicle with Prisma");
  }

  async updateOwned(
    _id: string,
    _userId: string,
    _input: UpdateVehicleInput,
  ): Promise<Vehicle | null> {
    // TODO(PRACTICE): Perform an ownership-scoped update.
    // Requirements:
    // 1. The database write itself must filter by BOTH id and userId. Checking
    //    ownership earlier in the service is not sufficient because the row can
    //    change between the check and the write.
    // 2. Apply only the supplied year/make/model fields from input.
    // 3. Return the updated five-field Vehicle when exactly one row matches.
    // 4. Return null when no owned row matches; do not reveal whether the id
    //    belongs to another user.
    // Consider updateMany + a follow-up read, an ownership-qualified update
    // with not-found translation, and whether a transaction is needed. Be ready
    // to explain the race/error tradeoffs of the approach you choose.
    throw new PracticeNotImplementedError("update an owned vehicle with Prisma");
  }

  async deleteOwned(_id: string, _userId: string): Promise<boolean> {
    // TODO(PRACTICE): Perform an ownership-scoped delete.
    // Requirements:
    // - Put id and userId in the same database `where` condition.
    // - Return true only when an owned row was deleted.
    // - Return false for both a missing id and another user's id so the result
    //   does not leak vehicle existence.
    // - Prefer a Prisma operation that reports an affected-row count instead of
    //   using exceptions for the expected no-match case.
    throw new PracticeNotImplementedError("delete an owned vehicle with Prisma");
  }
}
