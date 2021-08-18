# CCS Scale CaT Buyer UI

## Overview
NodeJS skeleton component for the CaT UI. Uses the [CloudFoundry NodeJS Buildpack](https://docs.cloudfoundry.org/buildpacks/node/index.html), along with a `manifest.yml` file that will allow it to be deployed to [Gov.UK PaaS](https://www.cloud.service.gov.uk/).

It deploys the Node.js sample project from the [CloudFoundry Samples Git repository](https://github.com/cloudfoundry-samples/cf-sample-app-nodejs).

This is designed as a starting app for the development team to build on and take forward (and update this README appropriately). Nothing is concrete in terms of software versions/approach. The code in this demo app was created by someone who is not familiar with NodeJS - it is just enough to prove that we can deploy code via Travis, have it run in CloudFroundry/UK.Gov PaaS, have it connect to Conclave and Tenders API and log output to logit.io. Moving forwards, this code can be thrown away entirely and replaced by the developers as they see fit following CCS and NodeJS best practice.

## Cloud Foundry
The application is configured for deployment to the GOV.UK PaaS Cloud Foundry platform in the CCS organisation.

### Configuration
The Github repository enabled in the CCS Travis CI organisational account on travis-ci.com: https://travis-ci.com/github/Crown-Commercial-Service/ccs-scale-cat-buyer-ui/.

Multi-environment/branch build and deployment configuration is contained within the `.travis.yml` file. This file defines required environment variables (encrypted where appropriate) and installs the Cloud Foundry CLI tools on the build VM.

### Deployment
For each environment/branch deploy configuration block, the [script](https://docs.travis-ci.com/user/deployment/script/) provider is used to call `scripts/deploy.sh` which performs the tasks of logging into Cloud Foundry and pushing the app via its manifest.

The `manifest.yml` file defines the actual Cloud Foundry build and deployment, using the NodeJS Buildpack and variable substitution to utilise or pass through into the runtime environment required data from the CI deployment configuration.
