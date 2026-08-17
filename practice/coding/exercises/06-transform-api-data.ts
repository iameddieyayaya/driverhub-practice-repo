export type MemberApi = { user: { first_name: string; last_name: string }; membership: { tier: string } | null; vehicles: { make: string; model: string }[] };
export type MemberSummary = { displayName: string; tier: string; vehicleLabels: string[] };
/** Prompt: Transform nested snake_case API data into a UI-safe summary.
 * Example: first_name Alex + no membership → displayName "Alex …", tier "None".
 */
export function toMemberSummary(_input: MemberApi): MemberSummary {
  // TODO(PRACTICE): Implement a small, explicit boundary mapper.
  throw new Error("Not implemented");
}
