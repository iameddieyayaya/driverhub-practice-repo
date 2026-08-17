# Browser debugging labs

Do these with the app running, Chrome DevTools open, and “Preserve log” enabled. Record evidence before changing code. The solutions are intentionally omitted.

## 1. Slow API

Visit `/api/practice/slow`. In Network → Timing, determine whether the delay is DNS, connection setup, request upload, server wait, or download. Correlate the response with the route code.

- What is the total duration?
- Which timing bucket dominates?
- What telemetry would expose this without a browser?

## 2. Failed CORS request

From a page on another local origin, fetch `http://localhost:3000/api/practice/cors`. Change `PRACTICE_CORS_ORIGIN` to a mismatched origin and retry.

- Does the request leave the browser?
- What response reaches the browser?
- Why can the Network panel show a response that JavaScript cannot read?

## 3. 401 authentication failure

Sign out, then request `/api/membership` from the Console. Repeat with an expired or modified `driverhub_session` cookie.

- Where is the 401 generated?
- How is an API response different from the protected-page redirect?
- Which cookie flags can you verify under Application → Cookies?

## 4. Controlled 500

Open `/api/practice/error?trigger=true` and find the matching server log. Follow the `x-request-id` across the response and structured log.

- What detail is safe to return to a customer?
- What detail belongs only in logs?

## 5. GraphQL N+1

Run `query { events { id name favoriteCount } }` in GraphiQL and inspect `src/server/graphql/schema.ts`.

- Estimate query count as event count grows.
- Capture evidence before proposing batching or aggregation.

## 6. React re-render problem

Temporarily render `RenderLab` from `src/components/practice/render-lab.tsx`. Use React DevTools Profiler with “Record why each component rendered.”

- Which state changes?
- Which values actually need to reach each row?
- What change reduces work without hiding useful updates?

## 7. Bundle and request fan-out

Use Coverage, Performance, and Network panels on `/dashboard` and `/events`.

- Identify unused JavaScript and the largest route chunk.
- Compare initial document/RSC requests with client GraphQL mutations.
- Simulate Fast 3G and describe the first user-visible bottleneck.
