variable "aws_region" {
  type    = string
  default = "us-west-2"
}
variable "project_name" {
  type    = string
  default = "driverhub"
}
variable "environment" {
  type    = string
  default = "practice"
}
variable "container_image" {
  type    = string
  default = "public.ecr.aws/docker/library/nginx:alpine"
}
variable "db_password" {
  type        = string
  sensitive   = true
  description = "Practice input only. Production should inject a generated secret without exposing plaintext in tfvars."
}
