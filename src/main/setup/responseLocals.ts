import { Express, Request, Response, NextFunction } from 'express';

// Middleware for setting res locals for Google Tag Manager and login director
const setupResLocalsMiddleware = (app: Express, environment: string) => {
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
    res.setHeader(
      'Content-Security-Policy',
      'script-src \'self\' \'unsafe-inline\' *.googletagmanager.com  https://www.google-analytics.com https://ssl.google-analytics.com https://cdn2.gbqofs.com https://report.crown-comm.gbqofs.com; img-src \'self\' *.google-analytics.com *.googletagmanager.com; connect-src \'self\' *.google-analytics.com *.analytics.google.com *.googletagmanager.com https://report.crown-comm.gbqofs.io; child-src blob:'
    );

    res.locals.LOGIN_DIRECTOR_URL = process.env.LOGIN_DIRECTOR_URL === 'NONE' ? '/oauth/login' : process.env.LOGIN_DIRECTOR_URL;
    res.locals.GOOGLE_TAG_MANAGER_ID = process.env.GOOGLE_TAG_MANAGER_ID;
    res.locals.GLOBAL_SITE_TAG_ID = process.env.GOOGLE_SITE_TAG_ID;
    res.locals.assetBundlerMode = environment.trim();
    next();
  });
};

export { setupResLocalsMiddleware };
