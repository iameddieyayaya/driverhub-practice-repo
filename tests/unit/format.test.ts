import { describe, expect, it } from "vitest";
import { initials, titleCaseEnum } from "@/src/shared/format";

describe("format utilities", () => {
  it("creates initials without leaking full profile data", () => expect(initials("Alex", "Morgan")).toBe("AM"));
  it("turns enum values into display labels", () => expect(titleCaseEnum("COMPETITION_MEMBER")).toBe("Competition Member"));
});
