export type MemberApi = { user: { first_name: string; last_name: string }; membership: { tier: string } | null; vehicles: { make: string; model: string }[] };
export type MemberSummary = { displayName: string; tier: string; vehicleLabels: string[] };
/** Prompt: Transform nested snake_case API data into a UI-safe summary.
 * Example: first_name Alex + no membership → displayName "Alex …", tier "None".
 */
export function toMemberSummary(input: MemberApi): MemberSummary {
  // TODO(PRACTICE): Implement a small, explicit boundary mapper.
  const displayName = `${input.user.first_name} ${input.user.last_name}`.trim();
  const tier = input.membership?.tier ?? "None";
  return {
    displayName,
    tier,
    vehicleLabels: input.vehicles.map(({ make, model }) => `${make} ${model}`)
  }
}
