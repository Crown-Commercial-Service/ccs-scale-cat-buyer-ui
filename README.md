# CCS Scale CAS buyer application

CCS Scale CAS Buyer UI - ‘Contract Award Service’ (CAS).

## Getting Started

### Prerequisites

Running the application requires the following tools to be installed in your environment:

- [Node.js](https://nodejs.org/) v16.13.1 or later 

### Running the application

Install dependencies by executing the following command:

```bash
$ npm install
```

You will then need to build the assets by running:

```bash
$ npm run build-assets
```

If you want the assets (the `css` and the `JavaScripts`) to be automatically updated when you change them, in a separate terminal run:

```bash
$ npm run watch-assets
``

Run:

```bash
$ npm run start:dev
```

Or for windows PC

```bash
$ npm start:win
```

The applications's home page will be available at http://localhost:3000

## Developing

### Making CSS / JS Changes

We use packed and minified scripts and stylesheets in the web application.

When you have made changes to scripts/styles and want to promote them to the packed files you will need to run the following command:

```bash
$ npm run build-assets
```

**NOTE:** if you have run `npm run watch-assets` then your packed assets will be automatically updated when you make changes to a CSS or JavaScript file.

### Code style

We use [ESLint](https://github.com/typescript-eslint/typescript-eslint).

Run the linting:

```bash
$ npm run lint
```

To automatically fix issues run:
```bash
$ npm run lint:fix
```

### Unit tests

**NOTE:** if you are using windows, you need to run `SET NODE_ENV=development` before running the tests.

This template app uses [Mocha](https://mochajs.org/) as the test engine.
After running the tests you should be able to find the generated reports in the `mochawesome-report/` folder.

Run all the test case:

```bash
$ npm test
```

Run the routes test case:

```bash
$ npm run test:routes
```

Run the unit test case:

```bash
$ npm run test:unit
```

Run the accessibility test case:

```bash
$ npm run test:a11y
```
Make sure all the paths in your application are covered by accessibility tests (see [a11y.ts](src/test/a11y/a11y.ts)).

### Test coverage

**NOTE:** due to a memory issue, the cause of which is currently unknown, this script does not yet work

We use [Instanbul nyc](https://github.com/istanbuljs/nyc).

To run the tests and record test coverage, run the command:

```bash
$ npm run test:coverage
```

### Feature tests

TODO: This are still to be added

### Healthcheck

The application exposes a health endpoint (https://localhost:3000/health), created with the use of
[Nodejs Healthcheck](https://github.com/hmcts/nodejs-healthcheck) library. This endpoint is defined
in [health.ts](src/main/routes/health.ts) file. Make sure you adjust it correctly in your application.
In particular, remember to replace the sample check with checks specific to your frontend app,
e.g. the ones verifying the state of each service it depends on.

## Deployment

This application is hosted on [GOV.UK PaaS](https://www.cloud.service.gov.uk/) and we use [Travis CI](https://www.travis-ci.com/) to deploy the code.
When your code changes are merged they will automatically be deployed to the relevant environment.

The environments are mapped as follows:

| Environment     | Branch              |
|-----------------|---------------------|
| Development     | `develop`           |
| Integration     | `release/sit`       |
| NFT             | `release/nftnew`    |
| UAT             | `release/uatnew`    |
| Pre-Production  | `release/pre-prod`  |
| Production      | `release/prod`      |

So, for example, if you merge your changes into `release/nftnew` the code changes will be deployed into the NFT environment.

### Deploying to Sandbox

The Sandbox environment, specifically Sandbox 2, does not have a "main" branch so to speak of.
Instead, if you push a branch that matches the following regular expression:

```sh
^(feature|bugfix)\\/(CAS)-[0-9]+.*$
```

## Provisioning

### Prerequisites

The [Terraform CaT infra](https://github.com/Crown-Commercial-Service/ccs-scale-cat-paas-infra) and [CaT Service API](https://github.com/Crown-Commercial-Service/ccs-scale-cat-service) should have been provisioned against the target environment(s) prior to provisioning of this UI component.

### Local initialisation & provisioning

Terraform state for each space (environment) is persisted to a dedicated AWS account. Access keys for an account in this environment with the appropriate permissions must be obtained before provisioning any infrastructure from a local development machine. The S3 state bucket name and Dynamo DB locaking table name must also be known.

1. The AWS credentials, state bucket name and DDB locking table name must be supplied during the `terraform init` operation to setup the backend. `cd` to the `iac/environments/{env}` folder corresponding to the environment you are provisioning, and execute the following command to initialise the backend:

   ```
   terraform init \
   -backend-config="access_key=ACCESS_KEY_ID" \
   -backend-config="secret_key=SECRET_ACCESS_KEY" \
   -backend-config="bucket=S3_STATE_BUCKET_NAME" \
   -backend-config="dynamodb_table=DDB_LOCK_TABLE_NAME"
   ```

   Note: some static/non-sensitive options are supplied in the `backend.tf` file. Any sensitive config supplied via command line only (this may change in the future if we can use Vault or similar).

   This will ensure all Terraform state is persisted to the dedicated bucket and that concurrent builds are prevented via the DDB locking table.

2. `cd` to `./iac/environments/{env}`

3. We use Terraform to provision the underlying service infrastructure in a space. We will need to supply the Cloud Foundry login credentials for the user who will provision the infrastructure.

   These credentials can be supplied in one of 3 ways:

   - via a `secret.tfvars` file, e.g. `terraform apply -var-file="secret.tfvars"` (this file should not be committed to Git)
   - via input variables in the terminal, e.g. `terraform apply -var="cf_username=USERNAME" -var="cf_password=PASSWORD"`
   - via environment variables, e.g. `$ export TF_VAR_cf_username=USERNAME`

   Assume one of these approaches is used in the commands below (TBD)

4. Run `terraform plan` to confirm the changes look ok
5. Run `terraform apply` to deploy to UK.Gov PaaS

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
