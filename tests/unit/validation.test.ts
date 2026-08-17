import { describe, expect, it } from "vitest";
import { vehicleInputSchema } from "@/src/server/validation/schemas";

describe("vehicle validation", () => {
  it("accepts a valid enthusiast vehicle", () => expect(vehicleInputSchema.parse({ year: 1990, make: "Mazda", model: "Miata", vin: "" })).toMatchObject({ year: 1990, make: "Mazda" }));
  it("returns useful errors for invalid boundaries", () => { const result = vehicleInputSchema.safeParse({ year: 1800, make: "", model: "" }); expect(result.success).toBe(false); if (!result.success) expect(result.error.issues).toHaveLength(3); });
  it("rejects malformed optional VIN values", () => expect(vehicleInputSchema.safeParse({ year: 2022, make: "Subaru", model: "BRZ", vin: "SHORT" }).success).toBe(false));
});
