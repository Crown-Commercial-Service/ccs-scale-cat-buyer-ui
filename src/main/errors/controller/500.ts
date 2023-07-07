import * as express from 'express';
/**
 *
 * @Rediect
 * @endpoint '/oauth/login
 * @param req
 * @param res
 */
export const Error_500 = (req: express.Request, res: express.Response) => {
  res.status(500).render('error/500');
};
