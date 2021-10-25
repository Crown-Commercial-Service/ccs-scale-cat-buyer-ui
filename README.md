# CCS Scale CaT Buyer UI

CCS Scale CaT Buyer UI - ‘Contract a Thing’ (CaT)/'Create and award a contract'.

## Getting Started

### Prerequisites

Running the application requires the following tools to be installed in your environment:

- [Node.js](https://nodejs.org/) v12.0.0 or later

### Running the application

Install dependencies by executing the following command:

```bash
$ npm install
```

```bash
$ npm configure
```

Run:

```bash
$ npm start
```

Or

```bash
$ npm start:win
```

The applications's home page will be available at https://localhost:3000

## Developing

### Code style

We use [ESLint](https://github.com/typescript-eslint/typescript-eslint)
alongside [sass-lint](https://github.com/sasstools/sass-lint)

Running the linting with auto fix:

```bash
$ yarn lint --fix
```

### Running the tests

This template app uses [Jest](https://jestjs.io//) as the test engine. You can run unit tests by executing
the following command:

Running accessibility tests:

```bash
$ yarn test:a11y
```

Make sure all the paths in your application are covered by accessibility tests (see [a11y.ts](src/test/a11y/a11y.ts)).

### Healthcheck

The application exposes a health endpoint (https://localhost:3000/health), created with the use of
[Nodejs Healthcheck](https://github.com/hmcts/nodejs-healthcheck) library. This endpoint is defined
in [health.ts](src/main/routes/health.ts) file. Make sure you adjust it correctly in your application.
In particular, remember to replace the sample check with checks specific to your frontend app,
e.g. the ones verifying the state of each service it depends on.

## Provisioning

### Prerequisites

The [Terraform CaT infra](https://github.com/Crown-Commercial-Service/ccs-scale-cat-paas-infra) and [CaT Service API](https://github.com/Crown-Commercial-Service/ccs-scale-cat-service) should have been provisioned against the target environment(s) prior to provisioning of this UI component.

### Local initialisation & provisioning (sandbox spaces only)

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

### Provision the service via Travis

The main environments are provisioned automatically via Travis CI. Merges to key branches will trigger an automatic deployment to certain environments - mapped below:

- `develop` branch -> `development` space
- `release/int` branch -> `int` space
- `release/nft` branch -> `nft` space
- `release/uat` branch -> `uat` space

* other environments TBD (these mappings may change as we evolve the process as more environments come online)
* feature branches can be deployed to specific sandboxes by making minor changes in the `travis.yml` file (follow instructions)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
