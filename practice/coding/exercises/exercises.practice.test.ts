import { describe, expect, it, vi } from "vitest";
import { groupVehiclesByMake } from "./01-group-vehicles";
import { deduplicateResults } from "./02-deduplicate-results";
import { debounce } from "./03-debounce";
import { retryWithBackoff } from "./04-retry-backoff";
import { paginate } from "./05-paginate";
import { toMemberSummary } from "./06-transform-api-data";
import { validateVehicleForm } from "./07-validate-vehicle";
import { createTtlCache } from "./08-ttl-cache";
import { mapWithConcurrency } from "./09-concurrent-promises";
import { TimeoutError, withTimeout } from "./10-timeout";
import { filterEventsByDate } from "./11-filter-events";
import { mergePreferences } from "./12-merge-preferences";

describe("coding exercises", () => {
  describe("01 groupVehiclesByMake", () => {
    it("groups makes case-insensitively", () => {
      const result = groupVehiclesByMake([
        { id: "1", make: "Mazda", model: "Miata" },
        { id: "2", make: "mazda", model: "RX-7" },
      ]);

      expect(result.Mazda.map((vehicle) => vehicle.id)).toEqual(["1", "2"]);
    });

    it("trims whitespace and groups uppercase variants together", () => {
      const result = groupVehiclesByMake([
        { id: "1", make: "Mazda", model: "Miata" },
        { id: "2", make: " mazda ", model: "RX-7" },
        { id: "3", make: "MAZDA", model: "CX-50" },
      ]);

      expect(Object.keys(result)).toEqual(["Mazda"]);
      expect(result.Mazda.map((vehicle) => vehicle.id)).toEqual(["1", "2", "3"]);
    });

    it("preserves the first trimmed spelling and does not mutate its input", () => {
      const vehicles = [
        { id: "1", make: " BMW ", model: "M3" },
        { id: "2", make: "bmw", model: "M5" },
      ];
      const originalVehicles = structuredClone(vehicles);

      const result = groupVehiclesByMake(vehicles);

      expect(Object.keys(result)).toEqual(["BMW"]);
      expect(result.BMW.map((vehicle) => vehicle.id)).toEqual(["1", "2"]);
      expect(vehicles).toEqual(originalVehicles);
    });
  });

  describe("02 deduplicateResults", () => {
    it("keeps a newer duplicate when it appears last", () => {
      const result = deduplicateResults([
        { id: "1", name: "old", updatedAt: "2025-01-01" },
        { id: "1", name: "new", updatedAt: "2025-02-01" },
      ]);

      expect(result).toEqual([
        { id: "1", name: "new", updatedAt: "2025-02-01" },
      ]);
    });

    it("keeps a newer duplicate when it appears first", () => {
      const result = deduplicateResults([
        { id: "1", name: "new", updatedAt: "2025-02-01" },
        { id: "1", name: "old", updatedAt: "2025-01-01" },
      ]);

      expect(result).toEqual([
        { id: "1", name: "new", updatedAt: "2025-02-01" },
      ]);
    });

    it("preserves first-seen ID order while replacing stale records", () => {
      const result = deduplicateResults([
        { id: "2", name: "Miata old", updatedAt: "2025-01-01" },
        { id: "1", name: "BRZ", updatedAt: "2025-03-01" },
        { id: "2", name: "Miata new", updatedAt: "2025-04-01" },
      ]);

      expect(result.map((vehicle) => vehicle.id)).toEqual(["2", "1"]);
      expect(result[0]).toEqual({
        id: "2",
        name: "Miata new",
        updatedAt: "2025-04-01",
      });
    });

    it("does not mutate its input", () => {
      const items = [
        { id: "1", name: "old", updatedAt: "2025-01-01" },
        { id: "1", name: "new", updatedAt: "2025-02-01" },
      ];
      const originalItems = structuredClone(items);

      deduplicateResults(items);

      expect(items).toEqual(originalItems);
    });
  });

  it("03 debounces to latest call", () => { vi.useFakeTimers(); const callback = vi.fn(); const fn = debounce(callback, 100); fn("a"); fn("b"); vi.advanceTimersByTime(100); expect(callback).toHaveBeenCalledWith("b"); vi.useRealTimers(); });
  describe("04 retryWithBackoff", () => {
    it("retries and returns a later success", async () => {
      const operation = vi
        .fn()
        .mockRejectedValueOnce(new Error("first failure"))
        .mockResolvedValue("yes");

      await expect(
        retryWithBackoff(operation, { attempts: 2, baseDelayMs: 0 }),
      ).resolves.toBe("yes");
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it("uses exponential backoff between attempts", async () => {
      vi.useFakeTimers();

      try {
        const operation = vi
          .fn()
          .mockRejectedValueOnce(new Error("first failure"))
          .mockRejectedValueOnce(new Error("second failure"))
          .mockResolvedValue("yes");

        const resultPromise = retryWithBackoff(operation, {
          attempts: 3,
          baseDelayMs: 100,
        });

        await vi.advanceTimersByTimeAsync(99);
        expect(operation).toHaveBeenCalledTimes(1);

        await vi.advanceTimersByTimeAsync(1);
        expect(operation).toHaveBeenCalledTimes(2);

        await vi.advanceTimersByTimeAsync(199);
        expect(operation).toHaveBeenCalledTimes(2);

        await vi.advanceTimersByTimeAsync(1);
        await expect(resultPromise).resolves.toBe("yes");
        expect(operation).toHaveBeenCalledTimes(3);
      } finally {
        vi.useRealTimers();
      }
    });

    it("throws the last error after exhausting all attempts", async () => {
      const firstError = new Error("first failure");
      const lastError = new Error("last failure");
      const operation = vi
        .fn()
        .mockRejectedValueOnce(firstError)
        .mockRejectedValueOnce(lastError);

      await expect(
        retryWithBackoff(operation, { attempts: 2, baseDelayMs: 0 }),
      ).rejects.toBe(lastError);
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it("stops immediately when shouldRetry returns false", async () => {
      const error = new Error("do not retry");
      const operation = vi.fn().mockRejectedValue(error);
      const shouldRetry = vi.fn().mockReturnValue(false);

      await expect(
        retryWithBackoff(operation, {
          attempts: 3,
          baseDelayMs: 0,
          shouldRetry,
        }),
      ).rejects.toBe(error);
      expect(operation).toHaveBeenCalledTimes(1);
      expect(shouldRetry).toHaveBeenCalledWith(error);
    });

    it("returns a successful falsy result without retrying", async () => {
      const operation = vi.fn().mockResolvedValue(0);

      await expect(
        retryWithBackoff(operation, { attempts: 3, baseDelayMs: 0 }),
      ).resolves.toBe(0);
      expect(operation).toHaveBeenCalledTimes(1);
    });
  });
  describe("05 paginate", () => {
    it("returns a one-indexed page", () => {
      expect(paginate([1, 2, 3, 4, 5], 1, 2)).toEqual({
        items: [1, 2],
        page: 1,
        pageSize: 2,
        totalItems: 5,
        totalPages: 3,
      });
    });

    it("returns a partial final page when page and pageSize differ", () => {
      expect(paginate([1, 2, 3, 4, 5], 2, 3)).toEqual({
        items: [4, 5],
        page: 2,
        pageSize: 3,
        totalItems: 5,
        totalPages: 2,
      });
    });

    it("returns an empty items array for a page beyond the end", () => {
      expect(paginate([1, 2, 3], 3, 2)).toEqual({
        items: [],
        page: 3,
        pageSize: 2,
        totalItems: 3,
        totalPages: 2,
      });
    });

    it("returns zero total pages for an empty input", () => {
      expect(paginate([], 1, 5)).toEqual({
        items: [],
        page: 1,
        pageSize: 5,
        totalItems: 0,
        totalPages: 0,
      });
    });

    it.each([
      { page: 0, pageSize: 2 },
      { page: -1, pageSize: 2 },
      { page: 1.5, pageSize: 2 },
      { page: 1, pageSize: 0 },
      { page: 1, pageSize: -2 },
      { page: 1, pageSize: 2.5 },
    ])(
      "rejects invalid pagination values: page=$page, pageSize=$pageSize",
      ({ page, pageSize }) => {
        expect(() => paginate([1, 2, 3], page, pageSize)).toThrow(RangeError);
      },
    );

    it("does not mutate the input", () => {
      const items = [{ id: "1" }, { id: "2" }, { id: "3" }];
      const originalItems = structuredClone(items);

      paginate(items, 2, 2);

      expect(items).toEqual(originalItems);
    });
  });
  it.todo("06 maps member API data", () => expect(toMemberSummary({ user: { first_name: "Alex", last_name: "Morgan" }, membership: null, vehicles: [] })).toEqual({ displayName: "Alex Morgan", tier: "None", vehicleLabels: [] }));
  it.todo("07 returns all validation errors", () => expect(validateVehicleForm({ year: "1800", make: "", model: "Miata" }, 2026)).toMatchObject({ year: expect.any(String), make: expect.any(String) }));
  it.todo("08 expires cache entries", () => { let now = 0; const cache = createTtlCache<number>(2, () => now); cache.set("a", 1, 10); now = 11; expect(cache.get("a")).toBeUndefined(); });
  it.todo("09 preserves order under concurrency", async () => expect(mapWithConcurrency([3,1,2], 2, async (n) => n * 2)).resolves.toEqual([6,2,4]));
  it.todo("10 rejects on timeout", async () => { vi.useFakeTimers(); const result = withTimeout(new Promise(() => undefined), 10); vi.advanceTimersByTime(10); await expect(result).rejects.toBeInstanceOf(TimeoutError); vi.useRealTimers(); });
  it.todo("11 includes overlapping event boundaries", () => expect(filterEventsByDate([{ id: "1", startDate: "2026-08-10", endDate: "2026-08-12" }], new Date("2026-08-12"), new Date("2026-08-14"))).toHaveLength(1));
  it.todo("12 merges in precedence order", () => expect(mergePreferences({ emailEnabled: true, smsEnabled: false, eventReminders: true, marketingEnabled: false }, { emailEnabled: false }, { smsEnabled: true })).toMatchObject({ emailEnabled: false, smsEnabled: true }));
});
