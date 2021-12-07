//@ts-nocheck
import * as express from 'express'
import { ReleatedContent } from '../model/related-content'

/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const SELECTED_AGREEMENT = (req: express.Request, res: express.Response) => {
  const { lotId, agreementLotName, agreementId, agreementName } = req.query;
  req.session.agreement_id = agreementId;
  req.session.agreementLotName = agreementLotName
  req.session.agreementName = agreementName
  req.session.lotId = lotId

  const releatedContent: ReleatedContent = new ReleatedContent();
  releatedContent.name = agreementName
  releatedContent.lotName = agreementLotName
  releatedContent.lotUrl = "/agreement/lot?agreement_id="+agreementId+"&lotNum="+lotId.replace(/ /g,"%20");
  releatedContent.title = 'Releated Content'
  req.session.releatedContent = releatedContent

  res.redirect('/projects/create-or-choose')
}