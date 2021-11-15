//@ts-nocheck
import * as express from 'express'
import * as lotData from '../../../resources/content/lot-agreement/lot.json'
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('lot page');

/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const LOT_BEFORE_START_PAGE = (req: express.Request, res: express.Response) => {
  const { agreement_id, lotNum } = req.query;
  const regExp = /[a-zA-Z]/g;
  let lot = lotNum;
  const { agreementName, agreementEndDate } = req.session;
  regExp.test(lotNum) ? lot = lotNum : lot = "Lot " + lotNum;
  const agreement = { name: agreementName, endDate: agreementEndDate };
  var appendData = { data: lotData, agreement_id, lot, agreement }

  res.render('lot', appendData);
}
