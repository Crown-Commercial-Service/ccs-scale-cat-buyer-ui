import * as express from 'express';
/**
 *
 * @Rediect
 * @endpoint '/oauth/login
 * @param req
 * @param res
 */
export const Error_401 = (req: express.Request, res: express.Response) => {
  res.status(401).render('error/401');
};
