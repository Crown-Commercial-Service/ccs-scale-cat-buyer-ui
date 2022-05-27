#########################################################
# Config: deploy-all
#
# This configuration will deploy all components.
#########################################################

module "cat-buyer-ui" {
  source                 = "../../cat-buyer-ui"
  organisation           = var.organisation
  space                  = var.space
  environment            = var.environment
  cf_username            = var.cf_username
  cf_password            = var.cf_password
  instances              = var.instances
  memory                 = var.memory
  buyer_ui_domain_prefix = var.buyer_ui_domain_prefix
}
