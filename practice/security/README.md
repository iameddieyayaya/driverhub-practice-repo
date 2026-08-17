# Security review lab

Review `insecure-examples.ts` as if it appeared in a pull request. Do not run or import it.

For each TODO, document threat actor, entry point, asset, exploit path, impact, prevention, detection, and a regression test. Then compare the example with the production path in `src/server` and `app/api`.

Questions:

- Which controls prevent SQL injection, XSS, CSRF, and IDOR?
- What is still only conceptual (rate limiting, managed WAF, KMS-backed storage encryption)?
- Which session guarantees depend on TLS and production environment settings?
- Which secrets must never be prefixed `NEXT_PUBLIC_`?
