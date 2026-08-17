import type { Vehicle } from "../exercises/01-group-vehicles";
import type { ApiVehicle } from "../exercises/02-deduplicate-results";
import type { Debounced } from "../exercises/03-debounce";
import type { RetryOptions } from "../exercises/04-retry-backoff";
import type { Page } from "../exercises/05-paginate";
import type { MemberApi, MemberSummary } from "../exercises/06-transform-api-data";
import type { ValidationErrors, VehicleForm } from "../exercises/07-validate-vehicle";
import type { Cache } from "../exercises/08-ttl-cache";
import { TimeoutError } from "../exercises/10-timeout";
import type { DriverEvent } from "../exercises/11-filter-events";
import type { Preferences } from "../exercises/12-merge-preferences";

export function groupVehiclesByMake(vehicles: Vehicle[]): Record<string, Vehicle[]> {
  const canonical = new Map<string, string>();
  const result: Record<string, Vehicle[]> = {};
  for (const vehicle of vehicles) {
    const make = vehicle.make.trim();
    if (!make) continue;
    const normalized = make.toLocaleLowerCase();
    const key = canonical.get(normalized) ?? make;
    canonical.set(normalized, key);
    (result[key] ??= []).push(vehicle);
  }
  return result;
}

export function deduplicateResults(items: ApiVehicle[]): ApiVehicle[] {
  const byId = new Map<string, ApiVehicle>();
  for (const item of items) {
    const current = byId.get(item.id);
    if (!current || Date.parse(item.updatedAt) > Date.parse(current.updatedAt)) byId.set(item.id, item);
  }
  return [...byId.values()];
}

export function debounce<TArgs extends unknown[]>(callback: (...args: TArgs) => void, delayMs: number): Debounced<TArgs> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const debounced = ((...args: TArgs) => { if (timer) clearTimeout(timer); timer = setTimeout(() => callback(...args), delayMs); }) as Debounced<TArgs>;
  debounced.cancel = () => { if (timer) clearTimeout(timer); timer = undefined; };
  return debounced;
}

export async function retryWithBackoff<T>(operation: () => Promise<T>, options: RetryOptions): Promise<T> {
  if (options.attempts < 1) throw new RangeError("attempts must be at least 1");
  let lastError: unknown;
  for (let attempt = 0; attempt < options.attempts; attempt += 1) {
    try { return await operation(); } catch (error) {
      lastError = error;
      if (attempt === options.attempts - 1 || options.shouldRetry?.(error) === false) throw error;
      await new Promise((resolve) => setTimeout(resolve, options.baseDelayMs * (2 ** attempt)));
    }
  }
  throw lastError;
}

export function paginate<T>(items: readonly T[], page: number, pageSize: number): Page<T> {
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(pageSize) || pageSize < 1) throw new RangeError("page and pageSize must be positive integers");
  return { items: items.slice((page - 1) * pageSize, page * pageSize), page, pageSize, totalItems: items.length, totalPages: Math.ceil(items.length / pageSize) };
}

export function toMemberSummary(input: MemberApi): MemberSummary {
  return { displayName: `${input.user.first_name} ${input.user.last_name}`.trim(), tier: input.membership?.tier ?? "None", vehicleLabels: input.vehicles.map((vehicle) => `${vehicle.make} ${vehicle.model}`) };
}

export function validateVehicleForm(input: VehicleForm, currentYear = new Date().getFullYear()): ValidationErrors {
  const errors: ValidationErrors = {};
  const year = Number(input.year);
  if (!Number.isInteger(year) || year < 1886 || year > currentYear + 2) errors.year = "Enter a plausible model year";
  if (!input.make.trim()) errors.make = "Make is required";
  if (!input.model.trim()) errors.model = "Model is required";
  if (input.vin && input.vin.trim().length !== 17) errors.vin = "VIN must contain 17 characters";
  return errors;
}

export function createTtlCache<T>(maxEntries: number, now: () => number = Date.now): Cache<T> {
  if (!Number.isInteger(maxEntries) || maxEntries < 1) throw new RangeError("maxEntries must be positive");
  const entries = new Map<string, { value: T; expiresAt: number }>();
  function pruneExpired() { for (const [key, entry] of entries) if (entry.expiresAt <= now()) entries.delete(key); }
  return {
    get(key) { const entry = entries.get(key); if (!entry) return undefined; if (entry.expiresAt <= now()) { entries.delete(key); return undefined; } entries.delete(key); entries.set(key, entry); return entry.value; },
    set(key, value, ttlMs) { pruneExpired(); entries.delete(key); entries.set(key, { value, expiresAt: now() + ttlMs }); while (entries.size > maxEntries) { const oldest = entries.keys().next().value as string | undefined; if (oldest) entries.delete(oldest); else break; } },
    delete(key) { return entries.delete(key); },
    get size() { pruneExpired(); return entries.size; }
  };
}

export async function mapWithConcurrency<T, R>(items: readonly T[], limit: number, worker: (item: T, index: number) => Promise<R>): Promise<R[]> {
  if (!Number.isInteger(limit) || limit < 1) throw new RangeError("limit must be positive");
  const results = new Array<R>(items.length);
  let cursor = 0;
  async function run() { while (cursor < items.length) { const index = cursor; cursor += 1; results[index] = await worker(items[index], index); } }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

export async function withTimeout<T>(operation: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_resolve, reject) => { timer = setTimeout(() => reject(new TimeoutError(`Timed out after ${timeoutMs}ms`)), timeoutMs); });
  try { return await Promise.race([operation, timeout]); } finally { if (timer) clearTimeout(timer); }
}

export function filterEventsByDate(events: readonly DriverEvent[], from: Date, to: Date): DriverEvent[] {
  if (!Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime()) || from > to) throw new RangeError("Invalid date range");
  return events.filter((event) => new Date(event.startDate) <= to && new Date(event.endDate) >= from).toSorted((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate));
}

export function mergePreferences(defaults: Preferences, saved: Partial<Preferences> | null, patch: Partial<Preferences>): Preferences {
  return {
    emailEnabled: patch.emailEnabled ?? saved?.emailEnabled ?? defaults.emailEnabled,
    smsEnabled: patch.smsEnabled ?? saved?.smsEnabled ?? defaults.smsEnabled,
    eventReminders: patch.eventReminders ?? saved?.eventReminders ?? defaults.eventReminders,
    marketingEnabled: patch.marketingEnabled ?? saved?.marketingEnabled ?? defaults.marketingEnabled
  };
}
