#!/bin/bash
#
# Deploys the CF CaT Buyer UI
#

echo "Executing Terraform scripts in [$CF_ENVIRONMENT]"
cd ./iac/environments/$CF_ENVIRONMENT/
rm -rf .terraform
terraform init -backend-config="bucket=$S3_STATE_BUCKET_NAME" -backend-config="dynamodb_table=$DDB_LOCK_TABLE_NAME"
terraform validate
terraform apply -auto-approve -input=false -var="cf_username=$CF_USERNAME" -var="cf_password=$CF_PASSWORD"
