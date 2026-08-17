# Security model

## Implemented controls

- Zod validates type, length, range, URL, email, and VIN inputs at server boundaries.
- Prisma parameterizes SQL; repositories never concatenate untrusted query strings.
- React escapes rendered strings by default; the production app avoids `dangerouslySetInnerHTML`.
- Signed, expiring session JWTs live in `HttpOnly`, `SameSite=Strict`, path-scoped cookies; `Secure` is enabled in production.
- Protected pages and every API/service mutation authenticate independently. Repository ownership filters prevent cross-member vehicle access (IDOR).
- Mutating REST/GraphQL routes validate the `Origin` header as a simple CSRF defense. SameSite cookies add defense in depth.
- Security response headers deny framing, MIME sniffing, and unnecessary browser capabilities.
- Secrets come from environment variables and are never exposed through `NEXT_PUBLIC_*`.

## Production controls represented by architecture

- TLS at CloudFront/ALB protects data in transit; TLS to RDS should be required. S3/RDS encryption with KMS protects data at rest. Neither protects an authorized but compromised application process.
- Secrets Manager, rotation, and task-role access replace plaintext environment files. Terraform state itself must be encrypted/restricted.
- WAF/API gateway or application middleware should enforce identity-aware rate limits. Define keys, windows, burst behavior, 429 response, trusted proxy headers, and shared storage.
- ECS task roles get only required secret/bucket/log actions. Security groups permit ALB→app and app→database, not public database access.
- Audit sensitive profile/membership actions separately from diagnostic logs, with retention and access controls.

## Remaining design questions

The local session model has no server-side revocation list, MFA, account lockout, password-reset workflow, breached-password screening, key rotation, or device management. A real portal should use a mature identity provider/Auth.js-backed store and formal threat modeling. Add CSP after inventorying required origins; test it in report-only mode. Treat image URLs as untrusted remote content and proxy/allowlist them before enabling remote optimization.

The intentionally vulnerable review material is isolated in `practice/security/` and excluded from compilation.
