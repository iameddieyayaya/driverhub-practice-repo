import { PracticeNotImplementedError } from "./errors";
import type { CreateVehicleInput, UpdateVehicleInput } from "./types";

export type VehicleValidationErrors = Partial<
  Record<keyof CreateVehicleInput, string>
> & { _form?: string };

export function validateCreateVehicleInput(
  input: CreateVehicleInput,
  currentYear = new Date().getFullYear(),
): VehicleValidationErrors {
  // TODO(PRACTICE): Return every validation error. Validate a plausible integer
  // year and non-empty, trimmed make/model values.

  let errors: VehicleValidationErrors = {};
  const minimumYear = 1886;
  const maximumYear = currentYear + 2;
  if (
    !Number.isInteger(input.year) ||
    input.year < minimumYear ||
    input.year > maximumYear
  ) {
    errors.year = "Year is not valid";
  }

  if (!input.make.trim()) {
    errors.make = "Make is required";
  }

  if (!input.model.trim()) {
    errors.model = "Model is required";
  }

  return errors
}

export function validateUpdateVehicleInput(
  input: UpdateVehicleInput,
  currentYear = new Date().getFullYear(),
): VehicleValidationErrors {
  const errors: VehicleValidationErrors = {};
  const minimumYear = 1886;
  const maximumYear = currentYear + 2;

  const isEmptyUpdate =
    input.year === undefined &&
    input.make === undefined &&
    input.model === undefined

  if (isEmptyUpdate) {
    errors._form = "Provide at least one field to update";
  }

  if (
    input.year !== undefined &&
    (
      !Number.isInteger(input.year) ||
      input.year < minimumYear ||
      input.year > maximumYear
    )
  ) {
    errors.year = "Enter a plausible model year";
  }

  if (input.make !== undefined && !input.make.trim()) {
    errors.make = "Make is required";
  }

  if (input.model !== undefined && !input.model.trim()) {
    errors.model = "Model is required";
  }


  return errors

}
