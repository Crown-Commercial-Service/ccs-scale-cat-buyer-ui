# ccs-scale-cat-buyer-ui
This holds the PHP/Symfony code for the CaT Buyer UI component.

## Initial Skeleton App
The current code is a simple skeleton app that uses the [Symfony Framework](https://symfony.com/) and the [CloudFoundry PHP Buildpack](https://github.com/cloudfoundry/php-buildpack), along with a `manifest.yml` file that will allow it to be deployed to [Gov.UK PaaS](https://www.cloud.service.gov.uk/).

This is designed as a starting app for the development team to build on and take foreward (and update this README appropriately).

These were the tasks completed to get the app to the current state:

1. Symfony app was setup
 * Followed the steps here - https://symfony.com/doc/current/setup.html.
   * `curl -sS https://get.symfony.com/cli/installer | bash`
   * `symfony new --full ccs-scale-cat-buyer-ui`

2. `manifest.yml` was added
 * This tells it to use the [CloudFoundry PHP Buildpack](https://docs.cloudfoundry.org/buildpacks/php/index.html).

3. PHP buildpack configuration was added
 * Added the `.bp-config/options.json` to override some buildpack defaults. See [PHP Buildpack Configuration](https://docs.cloudfoundry.org/buildpacks/php/gsg-php-config.html) for more details.


## Prerequisites 
Need to ensure that the network policy has been configured to allow this UI app to connect to the service app:
`cf add-network-policy ccs-scale-cat-buyer-ui-{space} --destination-app ccs-scale-cat-service --protocol tcp --port 8080`

## Secure Environment variables
The secure environment variables in `.travis.yml` are related to authentication with CloudFoundry. 
`travis encrypt CLOUDFOUNDRY_USERNAME="{USERNAME}" --pro --add env.global`
`travis encrypt CLOUDFOUNDRY_PASSWORD='{PASSWORD}' --pro --add env.global`

(note: single quotes can be used if there are complaints about special characters)

## Useful CloudFoundry commands
Just some useful CF commands.

### Login to CloudFoundry

`cf login -a api.london.cloud.service.gov.uk -u {USERNAME}`

### Push App
`cf push`

### Delete App
`cf delete -r ccs-scale-cat-buyer-ui`

### View Recent Logs
`cf logs ccs-scale-cat-buyer-ui --recent`

### SSH
`cf ssh ccs-scale-cat-buyer-ui`

### Running Locally
`symfony server:start --no-tls`
