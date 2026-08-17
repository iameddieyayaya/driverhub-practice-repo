export type VehicleForm = { year: string; make: string; model: string; vin?: string };
export type ValidationErrors = Partial<Record<keyof VehicleForm, string>>;
/** Prompt: Validate required fields, plausible year, and optional 17-character VIN.
 * Example: {year:"1800",make:"",model:"Miata"} → errors for year and make.
 */
export function validateVehicleForm(_input: VehicleForm, _currentYear = new Date().getFullYear()): ValidationErrors {
  // TODO(PRACTICE): Return all errors, not just the first one.
  throw new Error("Not implemented");
}
