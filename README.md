# CCS Scale CaT Service (API)

## Overview
PHP/Symfony skeleton component for the CaT UI. Uses the [Symfony Framework](https://symfony.com/) and the [CloudFoundry PHP Buildpack](https://github.com/cloudfoundry/php-buildpack), along with a `manifest.yml` file that will allow it to be deployed to [Gov.UK PaaS](https://www.cloud.service.gov.uk/).

It has a simple landing page that makes an API call to the [CaT API](https://github.com/Crown-Commercial-Service/ccs-scale-cat-service) app to retrieve a list of agreement summaries. This landing page also demonstrates logging an error to Rollbar.

This is designed as a starting app for the development team to build on and take forward (and update this README appropriately). Nothing is concrete in terms of software versions/approach - it's just a demo to demonstrate that the tools and connectivity works and can be rebuilt from the ground up again if appropriate.

## Local
The app can be configured and run locally in the standard Symfony way using `symfony server:start --no-tls`.

Note - the following environment variables need to be set:
  - `ROLLBAR_ACCESS_TOKEN` (a valid access token for CCS organisation in Rollbar)
  - `ROLLBAR_ENVIRONMENT` (any environment identifying string, suggest `local` when running locally) 
  - `PRIVATE_APP_URL` (this is the root URL of the CaT API. When deployed this is a private URL, so you cannot access that locally, you will need to either create a mock service, or run the [CaT API](https://github.com/Crown-Commercial-Service/ccs-scale-cat-service) service locally too - instructions to do this are in README in that repo)

## Cloud Foundry
The application is configured for deployment to the GOV.UK PaaS Cloud Foundry platform in the CCS organisation.

### Configuration
The Github repository enabled in the CCS Travis CI organisational account on travis-ci.com: https://travis-ci.com/github/Crown-Commercial-Service/ccs-scale-cat-buyer-ui/.

Multi-environment/branch build and deployment configuration is contained within the `.travis.yml` file. This file defines required environment variables (encrypted where appropriate) and installs the Cloud Foundry CLI tools on the build VM.

### Deployment
For each environment/branch deploy configuration block, the [script](https://docs.travis-ci.com/user/deployment/script/) provider is used to call `scripts/deploy.sh` which performs the tasks of logging into Cloud Foundry and pushing the app via its manifest.

The `manifest.yml` file defines the actual Cloud Foundry build and deployment, using the PHP Buildpack and variable substitution to utilise or pass through into the runtime environment required data from the CI deployment configuration.

## Background
The code in this demo app was created by someone who is not familiar with PHP/Symfony - it is just enough to prove that we can deploy Symfony code via Travis, have it run in CloudFroundry/UK.Gov PaaS, have it connect to an API and log errors to Rollbar. It has acheived that. Moving forwards, this code can be modified/wholesale replaced by the developers as they see fit.

These were the tasks completed to get the app to the current state:

1. Symfony app was setup
 * Followed the steps here - https://symfony.com/doc/current/setup.html.
   * `curl -sS https://get.symfony.com/cli/installer | bash`
   * `symfony new --full ccs-scale-cat-buyer-ui`

2. `manifest.yml` was added
 * This tells it to use the [CloudFoundry PHP Buildpack](https://docs.cloudfoundry.org/buildpacks/php/index.html).

3. PHP buildpack configuration was added
 * Added the `.bp-config/options.json` to override some buildpack defaults. See [PHP Buildpack Configuration](https://docs.cloudfoundry.org/buildpacks/php/gsg-php-config.html) for more details.

4. [rollbar-symfony-php-bundle] (https://docs.rollbar.com/docs/symfony) was added, with extra configuration in `config/packages/dev/monolog.yaml`