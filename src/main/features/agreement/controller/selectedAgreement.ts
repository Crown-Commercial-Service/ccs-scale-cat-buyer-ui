//@ts-nocheck
import * as express from 'express'

/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const SELECTED_AGREEMENT = (req: express.Request, res: express.Response) => {
  const { lotId, agreementLotName, agreementId } = req.query;
  req.session.agreement_id = agreementId;
  req.session.agreementLotName = agreementLotName
  req.session.lotId = lotId
  res.redirect('/projects/create-or-choose')
}