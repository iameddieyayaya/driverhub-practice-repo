module "network" {
  source       = "./modules/network"
  project_name = var.project_name
  environment  = var.environment
}

module "app" {
  source          = "./modules/app"
  project_name    = var.project_name
  environment     = var.environment
  container_image = var.container_image
  db_password     = var.db_password
  vpc_id          = module.network.vpc_id
  public_subnets  = module.network.public_subnet_ids
  private_subnets = module.network.private_subnet_ids
}
