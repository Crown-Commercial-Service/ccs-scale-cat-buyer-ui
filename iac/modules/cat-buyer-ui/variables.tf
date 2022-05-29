variable "organisation" {}

variable "space" {}

variable "environment" {}

variable "buildpack" {
  default = "https://github.com/cloudfoundry/nodejs-buildpack"
}

variable "disk_quota" {
  default = 2048
}

variable "healthcheck_timeout" {
  default = 0
}

variable "instances" {}

variable "memory" {}

variable "cf_username" {
  sensitive = true
}

variable "cf_password" {
  sensitive = true
}

variable "buyer_ui_domain_prefix" {}
