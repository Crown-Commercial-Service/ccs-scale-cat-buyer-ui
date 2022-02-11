terraform {
  backend "s3" {
    region  = "eu-west-2"
    key     = "ccs-scale-cat-buyer-ui-dev"
    encrypt = true
  }

  # Can be removed when bug is resolved: https://github.com/hashicorp/terraform-provider-aws/issues/23110
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  profile = "default"
  region  = "eu-west-2"
}
