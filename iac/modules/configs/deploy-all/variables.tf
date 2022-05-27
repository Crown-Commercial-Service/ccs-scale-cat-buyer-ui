variable "organisation" {
  default = "ccs-scale-cat"
}

variable "space" {}

variable "environment" {}

variable "cf_username" {
  sensitive = true
}

variable "cf_password" {
  sensitive = true
}

variable "instances" {
  default = 2
}

variable "memory" {
  default = 1024
}

variable "buyer_ui_domain_prefix" {
  default = ""
}
