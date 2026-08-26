# GraphQL + Node.js Vehicle API practice

Build a small Vehicle API using Node.js, TypeScript, GraphQL Yoga, Prisma, and
PostgreSQL. This directory is intentionally incomplete: source files compile as
scaffolds, but behavior tests begin red and every core implementation is marked
`TODO(PRACTICE)`.

Do not copy the production implementation under `src/server`. Treat this module
as a standalone interview exercise and work from its contracts and tests.

## API requirements

Implement these GraphQL operations:

- `vehicles(page, pageSize)` returns an authenticated user's paginated vehicles.
- `vehicle(id)` returns one visible vehicle or `null`, according to the policy
  you document.
- `createVehicle(input)` validates and creates a vehicle for the authenticated
  user.
- `updateVehicle(id, input)` validates and updates only an owned vehicle.
- `deleteVehicle(id)` deletes only an owned vehicle and returns a Boolean.

The GraphQL `Vehicle` must expose:

- `id: ID!`
- `year: Int!`
- `make: String!`
- `model: String!`
- `userId: ID!`
- `owner: User!` for the N+1/DataLoader exercise

Caller-controlled create/update inputs must not contain `userId`. Ownership
comes from authenticated context.

## Suggested implementation order

Keep the feedback loop small. Run one file or test name at a time.

1. `src/schema.ts`: define the SDL types, inputs, queries, mutations, and page.
2. `src/validation.ts`: collect all input errors without mutating input.
3. `src/auth.ts`: authenticate Bearer tokens and enforce ownership.
4. `src/repository.ts`: implement Prisma reads/writes against PostgreSQL.
5. `src/service.ts`: combine validation, authorization, pagination, and data.
6. `src/resolvers.ts`: keep resolvers thin and delegate to the service.
7. `src/errors.ts`: map internal errors to safe GraphQL errors.
8. `src/health.ts` and `src/logger.ts`: add REST health and structured logging.
9. `src/loaders.ts` and `src/advanced.ts`: fix N+1 and safe concurrency.
10. `src/server.ts`: wire Node HTTP, GraphQL Yoga, context, health, and logging.

## Expected behavior

### Authentication and authorization

- Read `Authorization: Bearer <token>` from the request.
- Verify the token through the injected verifier.
- Put only `{ id }` in GraphQL context.
- Reject protected operations when there is no authenticated user.
- Never accept `userId` from a create/update input.
- Scope writes by both `id` and authenticated `userId` at the database layer.
- Do not reveal whether another user's vehicle exists.

### Validation

- `year` must be an integer in a plausible automotive range.
- `make` and `model` must be non-empty after trimming.
- Return all validation issues, not only the first.
- An update validates only supplied fields and rejects an empty input object.
- Pagination values must be positive integers and should have a safe maximum.

### Pagination

Use one-indexed `page` and a bounded `pageSize`. Return:

```text
VehiclePage {
  items
  page
  pageSize
  totalItems
  totalPages
}
```

Use stable database ordering so records do not jump between pages. Fetching page
rows and the total count are independent reads and may use `Promise.all()`.

### Errors

Expose stable GraphQL `extensions.code` values:

- `UNAUTHENTICATED`
- `FORBIDDEN`
- `BAD_USER_INPUT`
- `NOT_FOUND` if that matches your documented visibility policy
- `SERVICE_UNAVAILABLE` for a database outage
- `INTERNAL_SERVER_ERROR` for unexpected failures

Clients must not receive connection strings, SQL, tokens, stack traces, or raw
database messages. Log internal details through the server logger instead.

### Structured logging

Emit one completion event per request with fields such as:

```json
{
  "event": "http_request_completed",
  "requestId": "request-123",
  "method": "POST",
  "path": "/graphql",
  "statusCode": 200,
  "durationMs": 12,
  "userId": "user-1"
}
```

Do not log authorization headers, tokens, passwords, database URLs, raw query
variables, or sensitive error messages.

### REST health endpoint

`GET /health` should check PostgreSQL and return `200`:

```json
{
  "status": "healthy",
  "service": "vehicle-api",
  "database": "connected",
  "timestamp": "2026-08-19T12:00:00.000Z"
}
```

On database failure, return the same safe shape with status `503`, `unavailable`,
and no internal database message. Other methods return `405` and `Allow: GET`.

## Example GraphQL operations

List vehicles:

```graphql
query Vehicles($page: Int, $pageSize: Int) {
  vehicles(page: $page, pageSize: $pageSize) {
    items {
      id
      year
      make
      model
      userId
      owner {
        id
        displayName
      }
    }
    page
    pageSize
    totalItems
    totalPages
  }
}
```

Get one vehicle:

```graphql
query Vehicle($id: ID!) {
  vehicle(id: $id) {
    id
    year
    make
    model
    userId
  }
}
```

Create a vehicle:

```graphql
mutation CreateVehicle($input: CreateVehicleInput!) {
  createVehicle(input: $input) {
    id
    year
    make
    model
    userId
  }
}
```

Variables:

```json
{
  "input": {
    "year": 2025,
    "make": "Mazda",
    "model": "Miata"
  }
}
```

Update and delete:

```graphql
mutation UpdateVehicle($id: ID!, $input: UpdateVehicleInput!) {
  updateVehicle(id: $id, input: $input) {
    id
    model
  }
}

mutation DeleteVehicle($id: ID!) {
  deleteVehicle(id: $id)
}
```

## Prisma and PostgreSQL

The root `prisma/schema.prisma` already contains `User` and `Vehicle` models with
the required fields and PostgreSQL indexes. Do not create a second Prisma schema.

Set a PostgreSQL connection string in the root `.env`:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/driverhub"
```

Then, when you intentionally want to exercise the database:

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

Repository unit tests use a mocked Prisma client and do not require PostgreSQL.
Add or activate integration tests only when you have a disposable practice
database; never point destructive tests at shared or production data.

## Advanced exercises

### N+1 diagnosis and DataLoader

`brokenVehicleOwnerResolver` deliberately calls the user repository once for
every vehicle. Run its demonstration test and explain why three vehicles cause
three calls, including duplicate user IDs.

Implement a request-scoped loader that:

- coalesces `.load()` calls from the same event-loop turn;
- deduplicates IDs;
- performs one `findManyByIds` query;
- restores requested order because SQL `IN` results are not order-guaranteed;
- returns `null` for missing users;
- does not share its cache across requests.

### Deliberately broken resolver

Compare `brokenVehicleOwnerResolver` with the TODO `vehicleOwnerResolver`. Note
what happens to database-call count as the number of vehicles grows. Wire only
the batched resolver into the final GraphQL resolver map.

### Database failure

Make repository failures observable internally but safe externally. Complete the
error-mapping and health tests without returning database credentials or raw
Prisma errors.

### Safe concurrency

Complete `loadVehicleOverview` and `VehicleService.list` using `Promise.all()`
for independent reads. Do not use it when the second operation depends on the
first or when concurrent writes would change correctness.

### REST versus GraphQL

Complete [decisions/rest-vs-graphql.md](decisions/rest-vs-graphql.md) and be ready
to explain the tradeoffs aloud.

## Running the exercises

Install dependencies from the repository root if needed:

```bash
pnpm install
```

Run the intentionally failing suite:

```bash
pnpm test:graphql-practice
```

Run one file:

```bash
pnpm exec vitest run practice/graphql-node/tests/schema.practice.test.ts
```

Run one behavior by name:

```bash
pnpm test:graphql-practice -t "requires authentication"
```

Watch while implementing:

```bash
pnpm test:graphql-practice:watch
```

After completing the `src/server.ts` wiring TODO, start the standalone practice
server with:

```bash
pnpm dev:graphql-practice
```

Check all TypeScript:

```bash
pnpm typecheck
```

The full practice suite is expected to be red initially. Work one describe block
at a time rather than trying to make every test pass at once.
