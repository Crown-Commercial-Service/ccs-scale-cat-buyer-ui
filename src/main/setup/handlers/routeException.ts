import { Application, NextFunction, Request, Response } from 'express';
import { NotFoundError } from 'main/errors/errors';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';

/**
 * @ErrorHandler
 * @param app
 * @param logger
 */
const routeExceptionHandler = (app: Application, logger: any): void => {
  app.use((req: Request, res: Response, _next: NextFunction): void => {
    const notFoundError = new NotFoundError(req.url);
    logger.error(notFoundError.message);

    res.status(notFoundError.statusCode);
    return res.render('error/404');
  });

  app.use((error: any, _req: Request, res: Response, _next: NextFunction): void => {
    logger.error(`${error.stack || error}`);

    res.status(error.status || HttpStatusCode.INTERNAL_SERVER);
    return res.render('error/500');
  });
};

export { routeExceptionHandler };
