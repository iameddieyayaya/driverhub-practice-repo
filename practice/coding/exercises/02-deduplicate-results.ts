export type ApiVehicle = { id: string; updatedAt: string; name: string };
/** Prompt: Deduplicate paged API results by id, keeping the most recently updated record.
 * Example: [{id:"1",updatedAt:"2025-01-01"},{id:"1",updatedAt:"2025-02-01"}] → [second record]
 */
export function deduplicateResults(items: ApiVehicle[]): ApiVehicle[] {
  const vehicleById = new Map<string, ApiVehicle>();

  for (const item of items){
    const existing = vehicleById.get(item.id)

    if(!existing || item.updatedAt > existing.updatedAt)
      vehicleById.set(item.id, item)
  }

  return Array.from(vehicleById.values())

}
