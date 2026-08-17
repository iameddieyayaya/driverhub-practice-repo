export type ApiVehicle = { id: string; updatedAt: string; name: string };
/** Prompt: Deduplicate paged API results by id, keeping the most recently updated record.
 * Example: [{id:"1",updatedAt:"2025-01-01"},{id:"1",updatedAt:"2025-02-01"}] → [second record]
 */
export function deduplicateResults(_items: ApiVehicle[]): ApiVehicle[] {
  // TODO(PRACTICE): Implement with deterministic output order.
  throw new Error("Not implemented");
}
