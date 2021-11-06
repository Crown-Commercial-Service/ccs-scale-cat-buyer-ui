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
import {NotFoundError} from './errors/errors'
import fs from 'fs'
export const app = express();
import glob from 'glob'
import {routeExceptionHandler} from './setup/routeexception'
import {RedisInstanceSetup} from './setup/redis'

const env = process.env.NODE_ENV || 'development';
const developmentMode = env === 'development';


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
 
/**
 * @RedisClient
 */
 RedisInstanceSetup(app);

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

