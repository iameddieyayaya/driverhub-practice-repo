export type Preferences = { emailEnabled: boolean; smsEnabled: boolean; eventReminders: boolean; marketingEnabled: boolean };
/** Prompt: Merge defaults, saved values, and an incoming patch in precedence order without accepting unknown keys.
 * Example: defaults email=true, saved email=false, patch sms=true → email=false, sms=true.
 */
export function mergePreferences(_defaults: Preferences, _saved: Partial<Preferences> | null, _patch: Partial<Preferences>): Preferences {
  // TODO(PRACTICE): Implement an explicit safe merge.
  throw new Error("Not implemented");
}
