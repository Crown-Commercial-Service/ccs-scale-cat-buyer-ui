//@ts-nocheck
import * as express from 'express'
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('da offline page');

/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const DA_OFFLINE_JOURNEY_PAGE = (req: express.Request, res: express.Response) => {
  const lotId = req.session?.lotId;
  const agreementLotName = req.session.agreementLotName;
  const appendData = { lotId, agreementLotName };
  logger.info("WIP page");
  res.render('da-offline', appendData);
}
