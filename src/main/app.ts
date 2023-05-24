const { Express, Logger } = require('@hmcts/nodejs-logging');
import config = require('config');
import cookieParser from 'cookie-parser';
import express from 'express';
import { initHelmet } from './modules/helmet';
import * as path from 'path';
import favicon from 'serve-favicon';
import { initNunjucks } from './modules/nunjucks';
const env = process.env.NODE_ENV || 'development';
const developmentMode = env === 'development';
import { NotFoundError } from './errors/errors';
import fs from 'fs';
export const app = express();
import { glob } from 'glob';
import { routeExceptionHandler } from './setup/routeexception';
import { RedisInstanceSetup } from './setup/redis';
import { fileUploadSetup } from './setup/fileUpload';
import { CsrfProtection } from './modules/csrf';
import { URL } from 'url';
import { RequestSecurity } from './setup/requestSecurity';

app.locals.ENV = env;

/**
 * Content Security Policy
 */



// setup logging of HTTP requests
/**
 * @env Local variables 
 */
const checkforenvFile = fs.existsSync('.env');
import { localEnvariables } from './setup/envs';
if (checkforenvFile) {
  localEnvariables(app);
}

/**
 * @RedisClient
 */
RedisInstanceSetup(app);
fileUploadSetup(app);

const logger = Logger.getLogger('app');

initNunjucks(app, developmentMode);
// secure the application by adding various HTTP headers to its responses
initHelmet(app, config.get('security'));

app.use(Express.accessLogger());
app.use(favicon(path.join(__dirname, '/public/assets/images/favicon.ico')));
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true, parameterLimit: 1000000 }));
app.use(cookieParser());
if (env !== 'mocha') {
  new CsrfProtection().enableFor(app);
}

//Implementation of secure Request Methods 
RequestSecurity(app);

app.use(express.static('src/main/public'));
app.use((req, res, next) => {
  res.setHeader(
    'Cache-Control',
    'no-cache, max-age=0, must-revalidate, no-store',
  );
  res.setHeader(
    'Content-Security-Policy',
    'script-src \'self\' \'unsafe-inline\' *.googletagmanager.com  https://www.google-analytics.com https://ssl.google-analytics.com https://cdn2.gbqofs.com https://report.crown-comm.gbqofs.com; img-src \'self\' *.google-analytics.com *.googletagmanager.com; connect-src \'self\' *.google-analytics.com *.analytics.google.com *.googletagmanager.com https://report.crown-comm.gbqofs.io; child-src blob:'
  );
  if (process.env.LOGIN_DIRECTOR_URL == 'NONE') {
    res.locals.LOGIN_DIRECTOR_URL = '/oauth/login';
  } else {
    res.locals.LOGIN_DIRECTOR_URL = process.env.LOGIN_DIRECTOR_URL;
  }

  res.locals.GOOGLE_TAG_MANAGER_ID = process.env.GOOGLE_TAG_MANAGER_ID;
  res.locals.GLOBAL_SITE_TAG_ID = process.env.GOOGLE_SITE_TAG_ID;
  res.locals.assetBundlerMode = env.trim();
  switch (process.env.ROLLBAR_HOST) {
  case 'local': {
    process.env.ROLLBAR_ENVIRONMENT = 'local';
    process.env.LOGIT_ENVIRONMENT = 'LOCAL';
    break;
  }
  case 'dev': {
    process.env.ROLLBAR_ENVIRONMENT = 'development';
    process.env.LOGIT_ENVIRONMENT = 'DEV';
    break;
  }
  case 'int': {
    process.env.ROLLBAR_ENVIRONMENT = 'integration';
    process.env.LOGIT_ENVIRONMENT = 'SIT';
    break;
  }
  case 'uat': {
    process.env.ROLLBAR_ENVIRONMENT = 'integration';
    process.env.LOGIT_ENVIRONMENT = 'UAT';
    break;
  }
  case 'nft': {
    process.env.ROLLBAR_ENVIRONMENT = 'sandbox';
    process.env.LOGIT_ENVIRONMENT = 'NFT';
    break;
  }
  case 'prd': {
    process.env.ROLLBAR_ENVIRONMENT = 'production';
    process.env.LOGIT_ENVIRONMENT = 'PROD';
    break;
  }
  case 'pre': {
    process.env.ROLLBAR_ENVIRONMENT = 'pre-production';
    process.env.LOGIT_ENVIRONMENT = 'PRE-PROD';
    break;
  }
  default: {
    process.env.ROLLBAR_ENVIRONMENT = 'sandbox';
    process.env.LOGIT_ENVIRONMENT = 'SANDBOX';
    break;
  }
  }

  // Health check URL values.
  const url = new URL(process.env.CAT_URL);
  process.env.PACKAGES_ENVIRONMENT = url.host;
  process.env.PACKAGES_NAME = 'CCS Scale CAS Buyer UI';
  process.env.PACKAGES_PROJECT = 'cas-buyer-frontend';
  next();
});

app.enable('trust proxy');

/**
 * @Routable path getting content from default.json
 */
const featureRoutes: Array<{ path: string }> = config.get('featureDir');
featureRoutes?.forEach((aRoute: { path: string }) => {
  glob.sync(__dirname + aRoute?.path)
    .map((filename: string) => require(filename))
    .forEach((route: any) => route.default(app));
});

/**
 * @ExceptionHandler
 *  All error Handler Routes 
 *  
 */
routeExceptionHandler(
  app,
  NotFoundError,
  logger,
  env
);
