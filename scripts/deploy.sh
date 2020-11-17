#!/bin/bash
#
# Login to GPaaS London Cloud Foundry ccs-scale-cat org with space determined by environment variable CF_SPACE.
# Push local app based on manifest, setting vars `route-prefix` from env var `CF_ROUTE_PREFIX` and `memory` from `CF_MEMORY` 
#

set -meo pipefail

cf --version
cf api https://api.london.cloud.service.gov.uk
cf login -u $CLOUDFOUNDRY_USERNAME -p $CLOUDFOUNDRY_PASSWORD -o ccs-scale-cat -s $CF_SPACE
cf push --var route-prefix=$CF_ROUTE_PREFIX --var memory=$CF_MEMORY 
