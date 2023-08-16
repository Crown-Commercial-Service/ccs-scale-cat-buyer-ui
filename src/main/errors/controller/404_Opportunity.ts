import * as express from 'express';
/**
 *
 * @Rediect
 * @endpoint '/oauth/login
 * @param req
 * @param res
 */
export const Error_Opportunity_404 = (req: express.Request, res: express.Response) => {
  res.status(404).render('error/404_Opportunity');
};
