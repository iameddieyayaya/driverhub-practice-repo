output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}
output "rds_endpoint" {
  value     = aws_db_instance.postgres.endpoint
  sensitive = true
}
output "assets_bucket" {
  value = aws_s3_bucket.assets.id
}
