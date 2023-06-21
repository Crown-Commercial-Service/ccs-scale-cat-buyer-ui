import { Express, NextFunction, Request, Response } from 'express';

const setupRequestSecurity = (app: Express): void => {
  const allowedHTTPMethods = ['OPTIONS', 'HEAD', 'CONNECT', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (allowedHTTPMethods.includes(req.method)) {
      next();
    } else {
      res.status(405).send(`${req.method} not allowed.`);
    }
  });
};

export { setupRequestSecurity };
