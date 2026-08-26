import { PracticeNotImplementedError } from "./errors";
import type { VehicleRepository } from "./repository";
import type {
  AuthenticatedUser,
  CreateVehicleInput,
  PaginationInput,
  UpdateVehicleInput,
  Vehicle,
  VehiclePage,
} from "./types";

export class VehicleService {
  constructor(private readonly repository: VehicleRepository) {}

  async list(
    _user: AuthenticatedUser,
    _pagination: PaginationInput,
  ): Promise<VehiclePage> {
    void this.repository;
    // TODO(PRACTICE): Validate pagination, calculate skip/take, and obtain the
    // page rows and count concurrently when it is safe to do so.
    throw new PracticeNotImplementedError("implement VehicleService.list");
  }

  async get(_user: AuthenticatedUser, _id: string): Promise<Vehicle | null> {
    // TODO(PRACTICE): Decide and document whether a vehicle owned by another
    // user is represented as null or an authorization error.
    throw new PracticeNotImplementedError("implement VehicleService.get");
  }

  async create(
    _user: AuthenticatedUser,
    _input: CreateVehicleInput,
  ): Promise<Vehicle> {
    // TODO(PRACTICE): Validate input and derive userId from authentication,
    // never from caller-controlled input.
    throw new PracticeNotImplementedError("implement VehicleService.create");
  }

  async update(
    _user: AuthenticatedUser,
    _id: string,
    _input: UpdateVehicleInput,
  ): Promise<Vehicle> {
    // TODO(PRACTICE): Validate input, enforce ownership, and handle a missing
    // or concurrently deleted record.
    throw new PracticeNotImplementedError("implement VehicleService.update");
  }

  async delete(_user: AuthenticatedUser, _id: string): Promise<boolean> {
    // TODO(PRACTICE): Enforce ownership without leaking another user's data.
    throw new PracticeNotImplementedError("implement VehicleService.delete");
  }
}

