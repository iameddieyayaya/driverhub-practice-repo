# DriverHub on AWS (design only)

No resources are deployed by this repository.

```text
Member browser / mobile app
          │ DNS (Route 53)
          ▼
 CloudFront + AWS WAF ─────── S3 private assets
          │ HTTPS, dynamic origin
          ▼
   Application Load Balancer
          │
   private ECS/Fargate tasks (3 AZs)
      │          │           │
      │          │           └─ CloudWatch logs/metrics/alarms + traces
      │          └─ Secrets Manager (task-role read)
      ▼
 RDS PostgreSQL Multi-AZ ── read replica / backups / PITR

VPC: public subnets hold ALB/NAT; private app subnets hold ECS;
isolated database subnets hold RDS. Security groups allow only
internet→ALB:443, ALB→ECS:3000, and ECS→RDS:5432.
```

## Responsibilities

- **Route 53:** DNS, aliases, health-aware routing/failover policy.
- **CloudFront:** TLS edge, compression, static/event-page caching, origin shielding; never cache personalized responses without correct keys/policy.
- **ALB:** HTTPS origin termination, health checks, path/host routing, connection metrics.
- **ECS/Fargate:** immutable containers, multi-AZ tasks, autoscaling, deployment circuit breaker. EC2 is an alternative when specialized hosts/cost control justify node operations.
- **RDS PostgreSQL:** managed patching/backups, Multi-AZ failover, encryption, Performance Insights, carefully pooled connections.
- **S3:** private member-upload origin, lifecycle rules, versioning, malware/content checks, presigned access or CloudFront origin access control.
- **CloudWatch:** centralized JSON logs, dashboards, SLO alarms, deployment annotations; add OpenTelemetry/X-Ray compatible traces.
- **Secrets Manager:** database/session/provider secrets with rotation and audit. ECS task execution role reads only named secrets.
- **IAM:** separate CI deploy role, task execution role, and runtime task role. Prefer short-lived OIDC credentials over GitHub secrets.
- **VPC/security groups:** minimize public surface and egress. Prefer VPC endpoints for AWS services; NAT only where outbound internet is necessary.

## Request and failure behavior

CloudFront serves fingerprinted static assets and forwards private/RSC/API requests. ALB routes only to healthy tasks. Services time out before ALB limits, bound retries, and degrade optional enrichment. Database connections are pooled below RDS capacity. Deploys use health/readiness checks and stop on SLO regression.

RPO/RTO must be explicit: e.g., RPO ≤5 minutes via PITR and RTO ≤30 minutes with rehearsed restore/failover. Multi-AZ protects availability, not accidental deletion or bad writes.

## Frontend decisions have infrastructure cost

- Large vehicle images increase S3 transforms/storage, CloudFront egress, and LCP; resize at ingest and emit responsive formats.
- Excessive client/GraphQL requests multiply ALB, task, connection-pool, and database load; compose server reads, batch, cache, and paginate.
- SSR improves first view but consumes CPU/database capacity for each miss; use safe CDN/RSC caching and stream slow regions.
- Long-running requests occupy task/ALB connections and invite client retries; move durable work to queues and return operation status.

TODO(PRACTICE): Choose desired scale/SLO/RPO/RTO, calculate task/database capacity, and add ALB/ACM/autoscaling/remote state to Terraform after a threat and cost review.
