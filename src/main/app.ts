const { Express, Logger } = require('@hmcts/nodejs-logging');
import config = require('config');
import cookieParser from 'cookie-parser';
import express from 'express';
import { Helmet } from './modules/helmet';
import * as path from 'path';
import favicon from 'serve-favicon';
import { Nunjucks } from './modules/nunjucks';
const { setupDev } = require('./setup/development');
import  i18next from 'i18next'
const env = process.env.NODE_ENV || 'development';
const developmentMode = env === 'development';
import {NotFoundError} from './errors/errors'
import fs from 'fs'
export const app = express();
import glob from 'glob'
import {routeExceptionHandler} from './setup/routeexception'

import {setupRedisInstance} from './setup/redis'


app.locals.ENV = env;

// setup logging of HTTP requests
/**
 * @env Local variables 
 */
 let checkforenvFile = fs.existsSync('.env')
 import {localEnvariables} from './setup/envs'
 if(checkforenvFile){   
   localEnvariables(app);
 }

const logger = Logger.getLogger('app');

new Nunjucks(developmentMode, i18next).enableFor(app);
// secure the application by adding various HTTP headers to its responses
new Helmet(config.get('security')).enableFor(app);

app.use(Express.accessLogger());
app.use(favicon(path.join(__dirname, '/public/assets/images/favicon.ico')));
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static('src/main/public'));
app.use((req, res, next) => {
  res.setHeader(
    'Cache-Control',
    'no-cache, max-age=0, must-revalidate, no-store',
  );
  next();
});
app.enable('trust proxy')


/**
 * @RedisClient
 */
 setupRedisInstance(app);


app.get('/envs', (req, res)=> res.json({
  "1": process.env['AUTH_SERVER_CLIENT_ID'],
  "2": process.env['AUTH_SERVER_CLIENT_SECRET'],
  "3": process.env['AUTH_SERVER_BASE_URL'],
  "4": process.env['CAT_URL'],
  "5": process.env['TENDERS_SERVICE_API_URL'],
  "6": process.env['LOGIT_API_KEY'],
  "7": JSON.parse(process.env['VCAP_SERVICES']),
  "8": process.env['SESSION_SECRET']
}))


/**
 * @Routable path getting content from default.json
 */
    let featureRoutes : Array<Object> = config.get('featureDir')
    featureRoutes?.forEach((aRoute: any) => {
      glob.sync(__dirname + aRoute?.['path'])
      .map((filename : string )=> require(filename))
      .forEach((route: any) => route.default(app));
    });

/**
 * @developementEnvironment
 *  Setting up development environment
 *  
 */
    setupDev(app,developmentMode);

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
    )
