#!/bin/bash
#
# Login to GPaaS London Cloud Foundry ccs-scale-cat org with space determined by environment variable CF_SPACE.
# Push local app based on manifest, setting vars `CF_ROUTE_PREFIX` from env var `CF_ROUTE_PREFIX` and `CF_MEMORY` from `CF_MEMORY` 
#

set -meo pipefail

cf --version
cf api https://api.london.cloud.service.gov.uk
cf login -u $CLOUDFOUNDRY_USERNAME -p $CLOUDFOUNDRY_PASSWORD -o ccs-scale-cat -s $CF_SPACE
cf push --var CF_ROUTE_PREFIX-prefix=$CF_ROUTE_PREFIX \
		--var CF_MEMORY=$CF_MEMORY \
		--var ROLLBAR_ACCESS_TOKEN=$ROLLBAR_ACCESS_TOKEN \
		--var ROLLBAR_ENVIRONMENT=$ROLLBAR_ENVIRONMENT
