import { PracticeNotImplementedError } from "./errors";
import type { CreateVehicleInput, UpdateVehicleInput } from "./types";

export type VehicleValidationErrors = Partial<
  Record<keyof CreateVehicleInput, string>
> & { _form?: string };

export function validateCreateVehicleInput(
  _input: CreateVehicleInput,
  _currentYear = new Date().getFullYear(),
): VehicleValidationErrors {
  // TODO(PRACTICE): Return every validation error. Validate a plausible integer
  // year and non-empty, trimmed make/model values.
  throw new PracticeNotImplementedError("validate createVehicle input");
}

export function validateUpdateVehicleInput(
  _input: UpdateVehicleInput,
  _currentYear = new Date().getFullYear(),
): VehicleValidationErrors {
  // TODO(PRACTICE): Validate only fields that were supplied and reject an input
  // object that contains no fields to update.
  throw new PracticeNotImplementedError("validate updateVehicle input");
}
