# ccs-scale-cat-buyer-ui
CAT UI Component

Useful Info
https://github.com/cloudfoundry/php-buildpack
https://docs.cloudfoundry.org/buildpacks/php/index.html




```brew install composer```
```curl -sS https://get.symfony.com/cli/installer | bash```

### Create the Project
https://symfony.com/doc/current/setup.html

```Users/adge/.symfony/bin/symfony new --full ccs-scale-cat-buyer-ui```

### Local Testing
```cd ccs-scale-cat-buyer-ui/```
```Users/adge/.symfony/bin/symfony server:start --no-tls```

```http://localhost:8000/```

### Push to CloudFoundry
```cf login -a api.london.cloud.service.gov.uk -u adrian.milne@crowncommercial.gov.uk```
```cf push```


### Troubleshooting - View Logs
```cf logs ccs-scale-cat-buyer-ui --recent```