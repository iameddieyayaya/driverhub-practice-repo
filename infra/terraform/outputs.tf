output "vpc_id" {
  value = module.network.vpc_id
}
output "ecs_cluster_name" {
  value = module.app.ecs_cluster_name
}
output "rds_endpoint" {
  value     = module.app.rds_endpoint
  sensitive = true
}
output "assets_bucket" {
  value = module.app.assets_bucket
}
