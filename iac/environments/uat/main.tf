#########################################################
# Environment: UAT
#
# Deploy CaT resources
#########################################################
module "deploy-all" {
  source      = "../../modules/configs/deploy-all"
  space       = "uat"
  environment = "uat"
  cf_username = var.cf_username
  cf_password = var.cf_password
  instances   = 3
}
