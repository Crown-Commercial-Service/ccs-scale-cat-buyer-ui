import * as express from 'express'
import * as lotData from '../../../resources/content/lot-agreement/lot.json'

/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const LOT_BEFORE_START_PAGE = (req: express.Request, res: express.Response) => {
  const agreement_id = req.query.agreement_id;
  var appendData = { data: lotData, agreement_id }
  res.render('lot', appendData);
  // res.render('lot');
}