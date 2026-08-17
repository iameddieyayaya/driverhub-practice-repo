// Deliberately insecure examples. This file is excluded from TypeScript compilation and must never be imported by the app.

export function unsafeVehicleSearch(query: string) {
  // TODO(PRACTICE): Identify SQL injection and propose a parameterized/Prisma equivalent.
  return `SELECT * FROM "Vehicle" WHERE make = '${query}'`;
}

export function unsafeBiographyHtml(userInput: string) {
  // TODO(PRACTICE): Explain the stored-XSS path if this string reaches dangerouslySetInnerHTML.
  return { __html: userInput };
}

export const unsafeCookie = "session=secret; Path=/"; // TODO(PRACTICE): List the missing cookie attributes.

export async function insecureAdminDelete(vehicleId: string) {
  // TODO(PRACTICE): Find the missing authentication, object authorization, CSRF, and audit controls.
  return fetch(`/api/admin/vehicles/${vehicleId}`, { method: "DELETE" });
}
