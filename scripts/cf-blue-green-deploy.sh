#!/bin/bash

usage () {
	cat <<USAGE
NAME
$(basename $0) - Performs a blue-green deploy of a Cloud Foundry app.

SYNOPSIS
$(basename $0) APP_NAME MANIFEST_FILE CF_SPACE

ARGUMENTS
  APP_NAME
    Name of the cf app to be deployed
  MANIFEST_FILE
    Manifest.yml file to use for the deployment
  CF_SPACE
    CF space to which the app will be deployed 

ENVIRONMENT VARIABLES
  CF_API
    API endpoint targeted for CF deployment, e.g. api.ng.bluemix.net
  CF_USER
    User id of functional user being used to deploy to Cloud Foundry
  CF_PASS
    Password of functional user being used to deploy to Cloud Foundry
  CF_ORG
    CF organization to which the app will be deployed
    
USAGE
}

login_to_cf() {
  cf login -a "$CF_API" -u "$CF_USER" -p "$CF_PASS" -o "$CF_ORG" -s "$CF_SPACE" || cf create-space "$CF_SPACE"
  cf target -s "$CF_SPACE"
}

blue_green_deploy() {
    # Ensure that expected envvars are set, while printing them out.
  if ! (
    echo ":"
    set -u
    echo " CF_API=$CF_API"
    echo " CF_USER=$CF_USER"
    echo " CF_PASS=..." <<<"$CF_PASS"
    echo " CF_ORG=$CF_ORG"
    echo ""
  ); then
    usage >&2
    return 1
  fi

  if [ $# -ne 3 ]; then
    echo " Missing argument. Required arguments are: APP_NAME MANIFEST_FILE CF_SPACE"
    echo ""
    usage >&2
    return 1
  fi

  # Stash git commit, deploy timestamp, and travis build id in manifest.yml env var for /version endpoint
  sed -i "s/<GIT_COMMIT>/$TRAVIS_COMMIT/" $2
  sed -i "s/<DEPLOY_TIMESTAMP>/$DEPLOY_TIMESTAMP/" $2
  sed -i "s/<TRAVIS_BUILD_ID>/$TRAVIS_BUILD_ID/" $2

  CF_SPACE=$3
  echo "Logging in to Cloud Foundry"
  login_to_cf

  echo "Starting cf blue-green-deploy"
  cf blue-green-deploy $1 -f $2 --smoke-test ./scripts/deploySmokeTests.sh
}

blue_green_deploy $@