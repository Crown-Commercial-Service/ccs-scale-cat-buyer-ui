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
import { setLogitEnvVariables } from './setup/logit';
import { setRollbarEnvVariables, initRollbar } from './setup/rollbar';
import { uncaughtExceptionHandler } from './setup/handlers/uncaughtException';
import { unhandledRejectionHandler } from './setup/handlers/unhandledRejection';
import { routeExceptionHandler } from './setup/handlers/routeException';
import { redisSession } from './setup/redis/session';
import { setupErrorRoutes } from './setup/routes/setupErrorRoutes';
import { setupFeatureRoutes } from './setup/routes/setupFeatureRoutes';
import { setupHomeRoutes } from './setup/routes/setupHomeRoutes';

const logger = Logger.getLogger('app');

logger.info('Initialising the application');

const app = express();

const environment = process.env.NODE_ENV || 'development';
const isDevEnvironment = environment === 'development';

const SERVER_PORT: number = config.get('PORT');
const port = parseInt(process.env.PORT, 10) || SERVER_PORT;

// Set environment variables for the local environment
logger.info('Setting application environment variables');

setLocalEnvVariables();
setLogitEnvVariables();
setRollbarEnvVariables();

// Health check URL values
const url = new URL(process.env.CAT_URL);
process.env.PACKAGES_ENVIRONMENT = url.host;
process.env.PACKAGES_NAME = 'CCS Scale CAS Buyer UI';
process.env.PACKAGES_PROJECT = 'cas-buyer-frontend';

// Connect to redis
logger.info('Connecting to redis');

redisSession()
  .then((redisSessionMiddlewear) => {
    app.use(redisSessionMiddlewear);

    // Init Nunjucks (template framework)
    logger.info('Initialising Nunjucks');

    initNunjucks(app, isDevEnvironment);

    // Init Helmet (sets HTTP response headers)
    logger.info('Initialising Helmet');

    initHelmet(app);

    // Set app configurations
    logger.info('Initialising application configurations');

    app.use(Express.accessLogger());
    app.use(favicon(pathJoin(__dirname, 'public', 'assets', 'images', 'favicon.ico')));
    app.use(express.json({ limit: '500mb' }));
    app.use(express.urlencoded({ limit: '500mb', extended: true, parameterLimit: 1000000 }));
    app.use(express.static(pathJoin(__dirname, 'public')));
    app.use(cookieParser());
    app.use(fileUpload());

    new CsrfProtection().enableFor(app);

    setupRequestSecurity(app);
    setupResLocalsMiddleware(app, environment);

    app.enable('trust proxy');

    // Import app routes
    logger.info('Adding application routes');

    setupHomeRoutes(app);
    setupFeatureRoutes(app);
    setupErrorRoutes(app);

    // Setup rollbar and exception handling
    logger.info('Initialising Rollbar');

    const rollbar = initRollbar();

    if (rollbar) {
      app.use(rollbar.errorHandler());
    }

    logger.info('Initialising exception handlers');

    uncaughtExceptionHandler(logger);
    unhandledRejectionHandler(logger);
    routeExceptionHandler(app, logger);

    logger.info('Preparing to materialise');

    if (isDevEnvironment) {
      app.listen(port, () => {
        logger.info(`Application started: https://localhost:${port}`);
      });
    } else {
      const server = app.listen(port, () => {
        logger.info(`Application started: http://localhost:${port}`);
      });
    
      server.keepAliveTimeout = 60 * 100_000;
      server.headersTimeout = 61 * 100_000;
      server.requestTimeout = 61 * 100_000;
    
      server.on('connection', (socket) => {
        logger.info('A new connection was made by a client.');
        socket.setTimeout(30 * 100_000);
      });
    }
  })
  .catch((reason) => {
    logger.error(reason);

    throw reason;
  });
