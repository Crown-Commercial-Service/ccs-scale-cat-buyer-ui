//@ts-nocheck
import * as express from 'express'
import * as lotData from '../../../resources/content/lot-agreement/lot.json'
const { Logger } = require('@hmcts/nodejs-logging');
import config from 'config';
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
  const { isAuthenticated } = req.session;
  const regExp = /[a-zA-Z]/g;
  let lot = lotNum;
  const lotId = lot.length > 2 ? lot.split(" ")[1] : 1 
  const lotSuppliers = config.get('CCS_agreements_url')+agreement_id+":"+lotId+"/lot-suppliers";
  const { agreementName, agreementEndDate, agreementDescription, suppliersCount } = req.session;
  regExp.test(lotNum) ? lot = lotNum : lot = "Lot " + lotNum;
  const agreement = { name: agreementName, endDate: agreementEndDate, agreementDescription, suppliersCount, lotSuppliers };
  let appendData = { data: lotData, agreement_id, lot, agreement }

  if (isAuthenticated) {
    appendData = Object.assign({}, { ...appendData, isAuth: true })
  }

  res.render('lot', appendData);
}
