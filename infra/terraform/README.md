# Terraform practice scaffold

This configuration is deliberately deployable-looking but is **not intended to be applied without review**. It creates chargeable resources and the module omits production details such as NAT/VPC endpoints, an ALB listener/certificate, autoscaling, WAF, Route 53 records, and remote state bootstrap.

```bash
cd infra/terraform
terraform init
terraform fmt -check -recursive
terraform validate
cp terraform.tfvars.example terraform.tfvars
terraform plan
# terraform apply   # only after explicit review/authorization
# terraform destroy # understand retention/final snapshot behavior first
```

Terraform state maps configuration to cloud resources and can contain sensitive values. In a team, store it in an encrypted, versioned S3 backend with DynamoDB/S3 locking and tightly scoped IAM—never commit local `*.tfstate`. Modules separate stable network concerns from the faster-changing application layer. Treat plans as review artifacts and pin provider/module versions.

TODO(PRACTICE): Add an ALB, ACM certificate, HTTPS listener, health-checked target group, autoscaling policy, and remote-state bootstrap without widening security-group access.
