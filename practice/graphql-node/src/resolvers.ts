import { PracticeNotImplementedError } from "./errors";
import type { UserByIdLoader } from "./loaders";
import type { Logger } from "./logger";
import type { VehicleService } from "./service";
import type {
  AuthenticatedUser,
  CreateVehicleInput,
  UpdateVehicleInput,
  Vehicle,
} from "./types";

export type GraphQLContext = {
  requestId: string;
  user: AuthenticatedUser | null;
  vehicleService: VehicleService;
  userByIdLoader: UserByIdLoader;
  logger: Logger;
};

type IdArgs = { id: string };
type VehiclesArgs = { page?: number; pageSize?: number };
type CreateArgs = { input: CreateVehicleInput };
type UpdateArgs = { id: string; input: UpdateVehicleInput };

export const resolvers = {
  Query: {
    vehicles(
      _root: unknown,
      _args: VehiclesArgs,
      _context: GraphQLContext,
    ) {
      // TODO(PRACTICE): Authenticate, apply pagination defaults, and delegate.
      throw new PracticeNotImplementedError("resolve Query.vehicles");
    },
    vehicle(_root: unknown, _args: IdArgs, _context: GraphQLContext) {
      // TODO(PRACTICE): Authenticate and delegate to the service layer.
      throw new PracticeNotImplementedError("resolve Query.vehicle");
    },
  },
  Mutation: {
    createVehicle(
      _root: unknown,
      _args: CreateArgs,
      _context: GraphQLContext,
    ) {
      // TODO(PRACTICE): Authenticate and delegate without accepting userId.
      throw new PracticeNotImplementedError("resolve Mutation.createVehicle");
    },
    updateVehicle(
      _root: unknown,
      _args: UpdateArgs,
      _context: GraphQLContext,
    ) {
      // TODO(PRACTICE): Authenticate and let the service enforce ownership.
      throw new PracticeNotImplementedError("resolve Mutation.updateVehicle");
    },
    deleteVehicle(
      _root: unknown,
      _args: IdArgs,
      _context: GraphQLContext,
    ) {
      // TODO(PRACTICE): Authenticate and let the service enforce ownership.
      throw new PracticeNotImplementedError("resolve Mutation.deleteVehicle");
    },
  },
  Vehicle: {
    owner(_vehicle: Vehicle, _args: unknown, _context: GraphQLContext) {
      // TODO(PRACTICE): Use context.userByIdLoader, not one query per vehicle.
      throw new PracticeNotImplementedError("resolve Vehicle.owner without N+1");
    },
  },
};

