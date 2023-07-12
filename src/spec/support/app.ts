import express, { Application } from 'express';
import { initNunjucks } from 'main/modules/nunjucks';
import cookieParser from 'cookie-parser';

type SetupRoutes = (app: Application) => void

const initApp = (...routes: SetupRoutes[]) => {
  const app = express();

  app.use(cookieParser());

  initNunjucks(app, true);

  routes.forEach((route) => route(app));

  return app;
};

export { initApp };
