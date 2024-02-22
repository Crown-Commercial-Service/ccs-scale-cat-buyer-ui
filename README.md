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

Run the accessibility test case:

**NOTE:** currently not enabled

```bash
$ npm run test:a11y
```

Make sure all the paths in your application are covered by accessibility tests (see [a11y.ts](src/test/a11y/a11y.ts)).

### Test coverage

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

This application is hosted on [AWS](https://aws.amazon.com/) and we use [Jenkins](https://www.jenkins.io/) to deploy the code.

The environments are mapped as follows:

| Environment     | Branch              |
|-----------------|---------------------|
| Development     | `develop`           |
| Integration     | `release/sit`       |
| NFT             | `release/nftnew`    |
| UAT             | `release/uatnew`    |
| Pre-Production  | `release/pre-prod`  |
| Production      | `release/prod`      |

When your code changes are merged you will need to deploy the code manually.

To do this you must run the job to build the docker image for the app.
Make sure you are targeting the right branch for the environment you wish to deploy to.

Once the image has been built, the job to deploy the code can be run which releases the code to the selected environment.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
