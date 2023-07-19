import { Request, Response } from 'express';
import { LoggTracer } from '../../../common/logtracer/tracer';

/**
 *
 * @param req
 * @param res
 * @POSTController
 */

export const RFP_POST_RETAIN_SESSION = async (req: Request, res: Response) => {
  try {
    res.json({ status: true });
  } catch (error) {
    LoggTracer.errorLogger(
      req,
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      null,
      'Conclave refresh token flow error',
      false
    );
  }
};
