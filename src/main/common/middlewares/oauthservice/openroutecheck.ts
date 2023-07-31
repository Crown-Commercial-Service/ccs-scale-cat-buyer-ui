import { Request, Response, NextFunction } from 'express';
import { ppg } from 'main/services/publicProcurementGateway';

/**
 *
 * @Middleware
 * @param req
 * @param res
 * @param next
 */
export const NO_AUTH = async (req: Request, res: Response, next: NextFunction) => {
  const { SESSION_ID: accessToken } = req.cookies;
  if (accessToken !== undefined) {
    try {
      const authStatusCheck = (await ppg.api.oAuth.postValidateToken(accessToken)).unwrap();

      if (authStatusCheck) {
        const isAuthicated = {
          session: true,
        };
        res.locals.Session = isAuthicated;
      }
    } catch (error) {
      // Do nothing with the error
    }
  }
  next();
};
