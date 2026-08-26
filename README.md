# DriverHub

DriverHub is a fictional automotive membership portal and a hands-on full-stack interview lab. The customer path is intentionally production-shaped; practice faults and incomplete exercises are isolated under `practice/` and `/api/practice/*`.

## Architecture

```text
Browser / React Server + Client Components
              │
       Next.js App Router
        ┌─────┴─────┐
   REST routes   GraphQL Yoga
        └─────┬─────┘
     validation + auth
          services
        repositories
       Prisma → PostgreSQL
              │
 structured logs / metrics / request IDs
```

REST represents bounded account resources (`health`, `membership`, `profile`). GraphQL supports the connected, evolving garage/events experience. Route handlers and resolvers authenticate and delegate; business rules live in services; ownership filters live in repository queries.

## Directory map

```text
app/                 Next.js pages, layouts, REST and GraphQL routes
src/components/      accessible UI and client interactions
src/server/          auth, database, validation, repositories, services, observability
prisma/              schema, migrations, and realistic seed data
tests/               unit, RTL, and database integration tests
e2e/                 focused Playwright member journey
practice/            coding, GraphQL/Node, debugging, incident, and security labs
docs/                systems, operations, testing, and interview guides
infra/               AWS architecture and Terraform scaffold
.github/workflows/   CI and mock deployment stage
```

## Prerequisites

- Node.js 20.19+ (Node 22 recommended)
- npm 10+
- Docker Desktop or a local PostgreSQL 17 instance
- Optional: Terraform 1.7+ for infrastructure validation

## Local installation

```bash
npm install
cp .env.example .env
docker compose up -d postgres
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open `http://localhost:3000` and sign in with `alex@driverhub.local` / `driverhub123`.

Environment variables:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Prisma PostgreSQL connection string |
| `SESSION_SECRET` | HS256 session signing secret; use 32+ random characters |
| `APP_URL` | Trusted mutation origin and canonical app URL |
| `PRACTICE_CORS_ORIGIN` | Allowed origin in the CORS lab |
| `TEST_DATABASE_URL` | Opts integration tests into a disposable database |

Never use production credentials locally or prefix secrets with `NEXT_PUBLIC_`.

## Database workflow

```bash
npx prisma generate
npx prisma migrate dev --name describe_change
npx prisma db seed
npx prisma studio
```

Use `prisma migrate deploy` in CI/production. Migrations belong in version control; `db push` is useful for disposable experiments but is not the deployment workflow. The seed creates 3 users, 5 membership records, 10 vehicles, 15 events, preferences, favorites, and recent activity.

## Docker

```bash
docker compose up -d
docker compose ps
docker compose logs -f app
docker compose down
```

Compose applies committed migrations before starting the app. Load the practice data from the host on first run:

```bash
npx prisma db seed
```

The multi-stage image runs as a non-root user, uses Next.js standalone output, and both services include health checks.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start Next.js development server |
| `npm run build` / `npm start` | Build and run production output |
| `npm run lint` | ESLint with Next.js core web vitals |
| `npm run typecheck` | Strict TypeScript check |
| `npm test` | Unit and React component tests |
| `npm run test:watch` | Interactive Vitest loop |
| `npm run test:integration` | PostgreSQL tests (skips without `TEST_DATABASE_URL`) |
| `npm run test:e2e` | Playwright Chromium journey |
| `npm run test:e2e:ui` | Playwright UI mode |
| `npm run test:practice` | Coding exercise/reference suite |
| `pnpm test:graphql-practice` | Intentionally red GraphQL/Node Vehicle API practice suite |
| `pnpm test:graphql-practice:watch` | Watch the GraphQL/Node practice tests |
| `npm run prisma:migrate` | Create/apply a development migration |
| `npm run prisma:seed` | Load deterministic sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run ci` | Local quality/build pipeline (without E2E) |

## Testing

```bash
npm test
TEST_DATABASE_URL="$DATABASE_URL" npm run test:integration
npx playwright install chromium
npm run test:e2e
```

Seed the E2E database first. Test placement rationale is in `tests/TESTING_STRATEGY.md`.

## Terraform

```bash
cd infra/terraform
terraform init
terraform fmt -check -recursive
terraform validate
terraform plan
```

Do not apply: the scaffold creates chargeable AWS resources. Read `infra/terraform/README.md` and `infra/aws-architecture.md` first.

## How to use the practice environment

Start with `PRACTICE_GUIDE.md`, keep DevTools open, and treat each TODO as an interview prompt. Capture evidence before changing practice faults. Incident/security labs omit answers; ask for a guided review only after writing your hypothesis. Coding reference solutions are intentionally separated.

The standalone [GraphQL + Node.js Vehicle API lab](practice/graphql-node/README.md)
contains compile-safe scaffolds and intentionally failing contract tests for
GraphQL, Prisma/PostgreSQL, auth, authorization, observability, and batching.

The base app uses fictional content and no Hagerty branding or proprietary data.
# driverhub-practice-repo
