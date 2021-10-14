import { glob } from 'glob';
const { Express, Logger } = require('@hmcts/nodejs-logging');
import config = require('config');
import cookieParser from 'cookie-parser';
import express from 'express';
import { Helmet } from './modules/helmet';
import * as path from 'path';
import favicon from 'serve-favicon';
import { Nunjucks } from './modules/nunjucks';
const { setupDev } = require('./development');
import  i18next from 'i18next'
const env = process.env.NODE_ENV || 'development';
const developmentMode = env === 'development';
import {HTTPError, NotFoundError} from './errors/errors'
export const app = express();
app.locals.ENV = env;

// setup logging of HTTP requests
app.use(Express.accessLogger());

const logger = Logger.getLogger('app');


new Nunjucks(developmentMode, i18next).enableFor(app);

// secure the application by adding various HTTP headers to its responses
new Helmet(config.get('security')).enableFor(app);

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

  //Authentication related routes
  glob.sync(__dirname + '/features/auth/path.ts')
  .map(filename => require(filename))
  .forEach(route => route.default(app));


   
//Setting up the routes and looping through individuals Paths
glob.sync(__dirname + '/routes/**/*.+(ts|js)')
  .map(filename => require(filename))
  .forEach(route => route.default(app));


 //RFI Related routes 
 glob.sync(__dirname + '/features/rfi/path.ts')
 .map(filename => require(filename))
 .forEach(route => route.default(app));





setupDev(app,developmentMode);


/**
 *  All error Handler Routes 
 *  
 */
 app.use((req, res) => {
  const notFoundError = new NotFoundError;
  res.status(notFoundError.statusCode);
  res.render(notFoundError.associatedView);
});


app.use((err: HTTPError, req: express.Request, res: express.Response) => {
  logger.error(`${err.stack || err}`);
  res.locals.message = err.message;
  res.locals.error = env === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error/500');
});



