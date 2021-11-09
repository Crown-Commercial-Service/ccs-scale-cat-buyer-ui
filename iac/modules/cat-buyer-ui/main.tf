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

resource "cloudfoundry_app" "cat_buyer_ui" {
  annotations = {}
  buildpack   = var.buildpack
  disk_quota  = var.disk_quota
  enable_ssh  = true
  environment = {
    TENDERS_SERVICE_API_URL : "http://${var.environment}-ccs-scale-cat-service.apps.internal:8080"
    AGREEMENTS_SERVICE_API_URL : "https://${var.environment}-ccs-scale-shared-agreements-service.london.cloudapps.digital"
    AUTH_SERVER_CLIENT_ID : data.aws_ssm_parameter.env_auth_server_client_id.value
    AUTH_SERVER_CLIENT_SECRET : data.aws_ssm_parameter.env_auth_server_client_secret.value
    AUTH_SERVER_BASE_URL : data.aws_ssm_parameter.env_auth_server_base_url.value
    CAT_URL : "https://${var.environment}-ccs-scale-cat-buyer-ui.london.cloudapps.digital"
    LOGIT_API_KEY : data.aws_ssm_parameter.env_logit_api_key.value
    SESSION_SECRET : data.aws_ssm_parameter.env_session_secret.value
    CONCLAVE_WRAPPER_API_BASE_URL : data.aws_ssm_parameter.conclave_wrapper_api_base_url.value
    CONCLAVE_WRAPPER_API_KEY : data.aws_ssm_parameter.conclave_wrapper_api_key.value
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

# Bind to nginx IP Router UPS
resource "cloudfoundry_route_service_binding" "cat_buyer_ui" {
  service_instance = data.cloudfoundry_user_provided_service.ip_router.id
  route            = cloudfoundry_route.cat_buyer_ui.id
}
