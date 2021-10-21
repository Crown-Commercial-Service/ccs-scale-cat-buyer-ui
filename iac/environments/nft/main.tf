#########################################################
# Environment: NFT
#
# Deploy CaT resources
#########################################################
module "deploy-all" {
  source      = "../../modules/configs/deploy-all"
  space       = "nft"
  environment = "nft"
  cf_username = var.cf_username
  cf_password = var.cf_password
  memory      = 2048
  instances   = 3
}
