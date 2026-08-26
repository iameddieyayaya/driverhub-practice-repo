import { PracticeNotImplementedError } from "./errors";
import type { UserRepository } from "./repository";
import type { UserSummary, Vehicle } from "./types";

export interface UserByIdLoader {
  load(userId: string): Promise<UserSummary | null>;
}

export function createUserByIdLoader(
  _repository: UserRepository,
): UserByIdLoader {
  // TODO(PRACTICE): Implement request-scoped DataLoader behavior:
  // - coalesce loads made in the same turn
  // - deduplicate user IDs
  // - perform one findManyByIds call
  // - return results in the same order as the requested keys
  throw new PracticeNotImplementedError("implement user DataLoader batching");
}

export type BrokenOwnerContext = {
  userRepository: Pick<UserRepository, "findById">;
};

/**
 * DELIBERATELY BROKEN: resolving this once per Vehicle causes N database calls.
 * Diagnose it, keep it as a comparison, and use a request-scoped loader in the
 * real Vehicle.owner resolver.
 */
export async function brokenVehicleOwnerResolver(
  vehicle: Pick<Vehicle, "userId">,
  context: BrokenOwnerContext,
): Promise<UserSummary | null> {
  return context.userRepository.findById(vehicle.userId);
}

export async function vehicleOwnerResolver(
  _vehicle: Pick<Vehicle, "userId">,
  _loader: UserByIdLoader,
): Promise<UserSummary | null> {
  // TODO(PRACTICE): Replace the N+1 lookup with the request-scoped loader.
  throw new PracticeNotImplementedError("resolve a vehicle owner with DataLoader");
}

