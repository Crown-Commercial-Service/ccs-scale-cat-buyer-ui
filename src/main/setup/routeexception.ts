import * as express from 'express';
import Rollbar from 'rollbar';

/**
 * @ErrorHandler
 * @param app 
 * @param NotFoundError 
 * @param logger 
 * @param env 
 */
const routeExceptionHandler = (app: express.Express, NotFoundError: any, logger: any, env: string): void => {
    
    app.use((req, res) => {
        const notFoundError = new NotFoundError;
        res.status(notFoundError.statusCode);
        
        if (process.env.ROLLBAR_ACCESS_TOKEN) {
          const rollbar = new Rollbar({
            accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
            captureUncaught: true,
            captureUnhandledRejections: true,
            environment: process.env.ROLLBAR_ENVIRONMENT,
          })
          const LogMessage = { 
            AppName: 'CaT frontend', 
            host: req.headers.host, 
            browser: req.headers["sec-ch-ua"],
            mobile: req.headers["sec-ch-ua-mobile"],
            platform: req.headers["sec-ch-ua-platform"],
            baseURL: req.hostname,
            type: 'info', 
            path: req.url, 
            statusCode: '404', 
            message: "User accessed page '"+ req.url +"' which is not exist" 
          };
          rollbar.info("User accessed page which is not exist", LogMessage, req)
        }

        res.redirect('/404')
      });

      app.use((err: any, req: express.Request, res: express.Response) => {
        logger.error(`${err.stack || err}`);
        res.locals.message = err.message;
        res.locals.error = env === 'development' ? err : {};
        res.status(err.status || 500);
        res.render('error/500')
      });
};
export {routeExceptionHandler}
