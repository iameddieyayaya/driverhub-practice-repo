export type VehicleForm = { year: string; make: string; model: string; vin?: string };
export type ValidationErrors = Partial<Record<keyof VehicleForm, string>>;
/** Prompt: Validate required fields, plausible year, and optional 17-character VIN.
 * Example: {year:"1800",make:"",model:"Miata"} → errors for year and make.
 */
export function validateVehicleForm(input: VehicleForm, currentYear = new Date().getFullYear()): ValidationErrors {
  // TODO(PRACTICE): Return all errors, not just the first one.
  const errors: ValidationErrors = {}
  const year = Number(input.year)

  if (
    !Number.isInteger(year) ||
    year < 1886 ||
    year > currentYear + 2
  ) {
    errors.year = "Enter a plausible model year";
  }

  if (!input.make.trim()) {
    errors.make = "Make is required"
  }

  if (!input.model.trim()) {
    errors.make = "Model is required"
  }


  if (input.vin && input.vin.trim().length !== 17) {
    errors.vin = "VIN must contain 17 characters";
  }


  return errors
}
