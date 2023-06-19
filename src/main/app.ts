import express from 'express';
import config from 'config';
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { setLocalEnvVariables } from './setup/localEnvironmentVariables';
import { Express, Logger } from '@hmcts/nodejs-logging';
import { initNunjucks } from './modules/nunjucks';
import { initHelmet } from './modules/helmet';
import { join as pathJoin } from 'path';
import { CsrfProtection } from './modules/csrf';
import { setupRequestSecurity } from './setup/requestSecurity';
import { setupResLocalsMiddleware } from './setup/responseLocals';
import { glob } from 'glob';
import { setLogitEnvVariables } from './setup/logit';
import { setRollbarEnvVariables, initRollbar } from './setup/rollbar';
import { uncaughtExceptionHandler } from './setup/handlers/uncaughtException';
import { unhandledRejectionHandler } from './setup/handlers/unhandledRejection';
import { routeExceptionHandler } from './setup/handlers/routeException';
import { redisSession } from './setup/redis/session';

const app = express();

const environment = process.env.NODE_ENV || 'development';
const isDevEnvironment = environment === 'development';
const logger = Logger.getLogger('app');

app.locals.ENV = environment;

// Set environment variables for the local environment
setLocalEnvVariables();
setLogitEnvVariables();
setRollbarEnvVariables();

// Health check URL values
const url = new URL(process.env.CAT_URL);
process.env.PACKAGES_ENVIRONMENT = url.host;
process.env.PACKAGES_NAME = 'CCS Scale CAS Buyer UI';
process.env.PACKAGES_PROJECT = 'cas-buyer-frontend';

// Connect to redis
redisSession()
  .then((redisSessionMiddlewear) => {
    app.use(redisSessionMiddlewear);

    // Init Nunjucks (template framework)
    initNunjucks(app, isDevEnvironment);

    // Init Helmet (sets HTTP response headers)
    initHelmet(app, config.get('security'));

    // Set app configurations
    app.use(Express.accessLogger());
    app.use(favicon(pathJoin(__dirname, 'public', 'assets', 'images', 'favicon.ico')));
    app.use(express.json({ limit: '500mb' }));
    app.use(express.urlencoded({ limit: '500mb', extended: true, parameterLimit: 1000000 }));
    app.use(express.static(pathJoin(__dirname, 'public')));
    app.use(cookieParser());
    app.use(fileUpload());

    if (environment !== 'mocha') {
      new CsrfProtection().enableFor(app);
    }

    setupRequestSecurity(app);
    setupResLocalsMiddleware(app, environment);

    app.enable('trust proxy');

    // Dynamically import the application routes
    const featureRoutes: Array<{ path: string }> = config.get('featureDir');
    const CurrentOs: string = process.platform;
    const CurrentOsOutput = CurrentOs === 'win32' ? { windowsPathsNoEscape: true } : {};
    featureRoutes?.forEach((route: { path: string }) => {
      glob
        .sync(__dirname + route?.path, CurrentOsOutput)
        .map((filename: string) => require(filename))
        .forEach((route: any) => route.default(app));
    });

    // Setup rollbar and exception handling
    const rollbar = initRollbar();

    if (rollbar) {
      app.use(rollbar.errorHandler());
    }

    uncaughtExceptionHandler(logger);
    unhandledRejectionHandler(logger);
    routeExceptionHandler(app, logger);
  })
  .catch((reason) => {
    logger.error(reason);

    throw reason;
  });

export { app };
