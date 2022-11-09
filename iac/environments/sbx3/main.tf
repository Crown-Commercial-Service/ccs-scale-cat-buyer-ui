#########################################################
# Environment: SBX3
#
# Deploy CaT resources
#########################################################
module "deploy-all" {
  source                 = "../../modules/configs/deploy-all"
  space                  = "sandbox-3"
  environment            = "sbx3"
  cf_username            = var.cf_username
  cf_password            = var.cf_password
  instances              = 1
  buyer_ui_domain_prefix = "sbx3."
}
