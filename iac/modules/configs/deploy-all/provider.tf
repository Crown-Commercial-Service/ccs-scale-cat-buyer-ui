terraform {
  required_providers {
    cloudfoundry = {
      source  = "cloudfoundry-community/cloudfoundry"
      version = "0.14.2"
    }
  }
}

provider "cloudfoundry" {
  api_url  = "https://api.london.cloud.service.gov.uk"
  user     = var.cf_username
  password = var.cf_password
}
