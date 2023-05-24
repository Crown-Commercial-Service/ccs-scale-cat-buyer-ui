//@ts-nocheck
import * as express from 'express'
import { Logger } from '@hmcts/nodejs-logging';
const logger = Logger.getLogger('rfp offline page');

/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const RFP_OFFLINE_JOURNEY_PAGE = (req: express.Request, res: express.Response) => {
  const lotId = req.session?.lotId;
  const agreementLotName = req.session.agreementLotName;
  const appendData = { lotId, agreementLotName };
  logger.info("WIP page");
  res.render('rfp-offline', appendData);
}
