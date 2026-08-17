variable "project_name" {
  type = string
}
variable "environment" {
  type = string
}
variable "container_image" {
  type = string
}
variable "db_password" {
  type      = string
  sensitive = true
}
variable "vpc_id" {
  type = string
}
variable "public_subnets" {
  type = list(string)
}
variable "private_subnets" {
  type = list(string)
}
