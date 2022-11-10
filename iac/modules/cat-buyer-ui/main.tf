data "cloudfoundry_org" "ccs_scale_cat" {
  name = var.organisation
}

data "cloudfoundry_space" "space" {
  name = var.space
  org  = data.cloudfoundry_org.ccs_scale_cat.id
}

data "cloudfoundry_domain" "domain" {
  name = "london.cloudapps.digital"
}

data "cloudfoundry_domain" "cat_buyer_ui_custom" {
  name = format("%s%s", var.buyer_ui_domain_prefix, data.aws_ssm_parameter.buyer_ui_domain.value)
}

data "cloudfoundry_app" "cat_service" {
  name_or_id = "${var.environment}-ccs-scale-cat-service"
  space      = data.cloudfoundry_space.space.id
}

data "archive_file" "cat_buyer_ui" {
  type       = "zip"
  source_dir = "${path.module}/../../.."
  excludes = [
    "${path.module}/../../../iac",
    "${path.module}/../../../.git",
    "${path.module}/../../../.gitignore",
    "${path.module}/../../../.build",

  ]
  output_path = "${path.module}/../../../.build/cat-buyer-ui.zip"
}

data "cloudfoundry_user_provided_service" "logit" {
  name  = "${var.environment}-ccs-scale-cat-logit-ssl-drain"
  space = data.cloudfoundry_space.space.id
}

data "cloudfoundry_user_provided_service" "ip_router" {
  name  = "${var.environment}-ccs-scale-cat-ip-router"
  space = data.cloudfoundry_space.space.id
}

data "cloudfoundry_service_instance" "redis" {
  name_or_id = "${var.environment}-ccs-scale-cat-redis-buyer-ui"
  space      = data.cloudfoundry_space.space.id
}

data "aws_ssm_parameter" "env_auth_server_client_id" {
  name = "/cat/${var.environment}/auth-server-client-id"
}

data "aws_ssm_parameter" "env_auth_server_client_secret" {
  name = "/cat/${var.environment}/auth-server-client-secret"
}

data "aws_ssm_parameter" "env_auth_server_base_url" {
  name = "/cat/${var.environment}/auth-server-base-url"
}

data "aws_ssm_parameter" "env_logit_api_key" {
  name = "/cat/${var.environment}/logit-api-key"
}

data "aws_ssm_parameter" "env_session_secret" {
  name = "/cat/${var.environment}/buyer-ui-session-secret"
}

data "aws_ssm_parameter" "conclave_wrapper_api_base_url" {
  name = "/cat/${var.environment}/conclave-wrapper-api-base-url"
}

data "aws_ssm_parameter" "conclave_wrapper_api_key" {
  name = "/cat/${var.environment}/conclave-wrapper-api-key"
}

data "aws_ssm_parameter" "google_tag_manager_id" {
  name = "/cat/${var.environment}/google-tag-manager-id"
}

data "aws_ssm_parameter" "gcloud_token" {
  name = "/cat/${var.environment}/gcloud_token"
}

data "aws_ssm_parameter" "gcloud_search_api_token" {
  name = "/cat/${var.environment}/gcloud_search_api_token"
}

data "aws_ssm_parameter" "gcloud_index" {
  name = "/cat/${var.environment}/gcloud_index"
}

data "aws_ssm_parameter" "gcloud_search_api_url" {
  name = "/cat/${var.environment}/gcloud_search_api_url"
}

data "aws_ssm_parameter" "gcloud_services_api_url" {
  name = "/cat/${var.environment}/gcloud_services_api_url"
}

data "aws_ssm_parameter" "gcloud_supplier_api_url" {
  name = "/cat/${var.environment}/gcloud_supplier_api_url"
}

data "aws_ssm_parameter" "google_site_tag_id" {
  name = "/cat/${var.environment}/google-site-tag-id"
}

data "aws_ssm_parameter" "rollbar_access_token" {
  name = "/cat/${var.environment}/rollbar-access-token"
}

data "aws_ssm_parameter" "buyer_ui_domain" {
  name = "/cat/default/buyer-ui-domain"
}

resource "cloudfoundry_app" "cat_buyer_ui" {
  annotations = {}
  buildpack   = var.buildpack
  disk_quota  = var.disk_quota
  enable_ssh  = true
  environment = {
    TENDERS_SERVICE_API_URL : "https://${var.environment}-ccs-scale-cat-service.${data.cloudfoundry_domain.domain.name}"
    AGREEMENTS_SERVICE_API_URL : "https://${var.environment}-ccs-scale-shared-agreements-service.${data.cloudfoundry_domain.domain.name}"
    AUTH_SERVER_CLIENT_ID : data.aws_ssm_parameter.env_auth_server_client_id.value
    AUTH_SERVER_CLIENT_SECRET : data.aws_ssm_parameter.env_auth_server_client_secret.value
    AUTH_SERVER_BASE_URL : data.aws_ssm_parameter.env_auth_server_base_url.value
    CAT_URL : "https://${format("%s%s", var.buyer_ui_domain_prefix, data.aws_ssm_parameter.buyer_ui_domain.value)}"
    LOGIT_API_KEY : data.aws_ssm_parameter.env_logit_api_key.value
    SESSION_SECRET : data.aws_ssm_parameter.env_session_secret.value
    CONCLAVE_WRAPPER_API_BASE_URL : data.aws_ssm_parameter.conclave_wrapper_api_base_url.value
    CONCLAVE_WRAPPER_API_KEY : data.aws_ssm_parameter.conclave_wrapper_api_key.value
    GOOGLE_TAG_MANAGER_ID : data.aws_ssm_parameter.google_tag_manager_id.value
    GOOGLE_SITE_TAG_ID : data.aws_ssm_parameter.google_site_tag_id.value
    ROLLBAR_HOST : var.environment
    ROLLBAR_ACCESS_TOKEN : data.aws_ssm_parameter.rollbar_access_token.value
    GCLOUD_TOKEN : data.aws_ssm_parameter.gcloud_token.value
    GCLOUD_INDEX : data.aws_ssm_parameter.gcloud_index.value
    GCLOUD_SEARCH_API_TOKEN : data.aws_ssm_parameter.gcloud_search_api_token.value
    GCLOUD_SEARCH_API_URL : data.aws_ssm_parameter.gcloud_search_api_url.value
    GCLOUD_SERVICES_API_URL : data.aws_ssm_parameter.gcloud_services_api_url.value
    GCLOUD_SUPPLIER_API_URL : data.aws_ssm_parameter.gcloud_supplier_api_url.value
  }
  health_check_timeout = var.healthcheck_timeout
  health_check_type    = "port"
  instances            = var.instances
  labels               = {}
  memory               = var.memory
  name                 = "${var.environment}-ccs-scale-cat-buyer-ui"
  path                 = data.archive_file.cat_buyer_ui.output_path
  source_code_hash     = data.archive_file.cat_buyer_ui.output_base64sha256
  ports                = [8080]
  space                = data.cloudfoundry_space.space.id
  stopped              = false
  timeout              = 600

  service_binding {
    service_instance = data.cloudfoundry_user_provided_service.logit.id
  }

  service_binding {
    service_instance = data.cloudfoundry_service_instance.redis.id
  }
}

resource "cloudfoundry_network_policy" "cat_service" {
  policy {
    source_app      = cloudfoundry_app.cat_buyer_ui.id
    destination_app = data.cloudfoundry_app.cat_service.id
    port            = "8080"
  }
}

resource "cloudfoundry_route" "cat_buyer_ui" {
  domain   = data.cloudfoundry_domain.domain.id
  space    = data.cloudfoundry_space.space.id
  hostname = "${var.environment}-ccs-scale-cat-buyer-ui"

  target {
    app  = cloudfoundry_app.cat_buyer_ui.id
    port = 8080
  }
}

resource "cloudfoundry_route" "cat_buyer_ui_custom" {
  domain   = data.cloudfoundry_domain.cat_buyer_ui_custom.id
  space    = data.cloudfoundry_space.space.id

  target {
    app  = cloudfoundry_app.cat_buyer_ui.id
    port = 8080
  }
}

# Bind to nginx IP Router UPS
resource "cloudfoundry_route_service_binding" "cat_buyer_ui" {
  service_instance = data.cloudfoundry_user_provided_service.ip_router.id
  route            = cloudfoundry_route.cat_buyer_ui.id
}
