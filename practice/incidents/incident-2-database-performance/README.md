# Incident 2 — Slow garage dashboards

Dashboard p95 rose from 180 ms to 2.8 s after the fleet passed 1.2 million vehicles. CPU on the web service is steady; RDS CPU is 88% and read IOPS doubled.

The incident branch replaced the indexed ownership lookup with this query:

```ts
await prisma.vehicle.findMany({
  where: { nickname: { contains: search, mode: "insensitive" } },
  orderBy: { createdAt: "desc" }
})
```

Representative log:

```json
{"timestamp":"2026-08-14T16:21:44.902Z","severity":"warn","requestId":"req-d-31ac","route":"/dashboard","userId":"usr_422","duration":2841,"statusCode":200,"db":{"operation":"Vehicle.findMany","duration":2712,"rows":4}}
```

TODO(PRACTICE): Use the schema and a hypothetical `EXPLAIN ANALYZE` to identify missing filters/index support, then propose a pagination contract.
