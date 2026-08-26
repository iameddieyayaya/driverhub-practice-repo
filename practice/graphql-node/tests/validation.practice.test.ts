// @vitest-environment node

import { describe, expect, it } from "vitest";
import {
  validateCreateVehicleInput,
  validateUpdateVehicleInput,
} from "../src/validation";

describe("Vehicle input validation", () => {
  it("returns every create input error", () => {
    expect(
      validateCreateVehicleInput(
        { year: 1800, make: "   ", model: "" },
        2026,
      ),
    ).toMatchObject({
      year: expect.any(String),
      make: expect.any(String),
      model: expect.any(String),
    });
  });

  it("accepts a valid create input", () => {
    expect(
      validateCreateVehicleInput(
        { year: 2025, make: "Mazda", model: "Miata" },
        2026,
      ),
    ).toEqual({});
  });

  it("validates only supplied update fields and rejects an empty update", () => {
    expect(validateUpdateVehicleInput({ make: "  " }, 2026)).toMatchObject({
      make: expect.any(String),
    });
    expect(validateUpdateVehicleInput({}, 2026)).toMatchObject({
      _form: expect.any(String),
    });
  });
});

