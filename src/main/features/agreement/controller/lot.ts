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
  const { agreement_id, lotNum } = req.query;
  const { agreementName, agreementEndDate } = req.session;
  const agreement = { name: agreementName, endDate: agreementEndDate };
  var appendData = { data: lotData, agreement_id, lotNum, agreement }

  res.render('lot', appendData);
}