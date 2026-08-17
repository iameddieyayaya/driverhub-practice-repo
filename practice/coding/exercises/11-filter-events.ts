export type DriverEvent = { id: string; startDate: string; endDate: string };
/** Prompt: Return events overlapping an inclusive date window, sorted by start time.
 * Example: event Aug 10–12 and window Aug 12–14 → included.
 */
export function filterEventsByDate(_events: readonly DriverEvent[], _from: Date, _to: Date): DriverEvent[] {
  // TODO(PRACTICE): Handle invalid dates/ranges and do not mutate input.
  throw new Error("Not implemented");
}
