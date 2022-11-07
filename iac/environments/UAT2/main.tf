#########################################################
# Environment: UAT2
#
# Deploy CaT resources
#########################################################
module "deploy-all" {
  source                 = "../../modules/configs/deploy-all"
  space                  = "uat2"
  environment            = "uat2"
  cf_username            = var.cf_username
  cf_password            = var.cf_password
  instances              = 1
  buyer_ui_domain_prefix = "uat2."
}
