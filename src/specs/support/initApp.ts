import express, { Application } from 'express';
import { initNunjucks } from 'main/modules/nunjucks';
import session from 'express-session';
import cookieParser from 'cookie-parser';

type SetupRoutes = (app: Application) => void

const initApp = (...routes: SetupRoutes[]) => {
  const app = express();
  
  app.use(session({
    secret: 'Your blade, it did not cut deep enough',
    resave: false,
    saveUninitialized: true,
    cookie: {}
  }));
  app.use(cookieParser());
  
  initNunjucks(app, true);

  routes.forEach((route) => route(app));

  return app;
};

export { initApp };
