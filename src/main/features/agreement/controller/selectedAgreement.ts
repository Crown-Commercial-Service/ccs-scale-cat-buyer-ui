// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import * as express from 'express'
import { ReleatedContent } from '../model/related-content'
import { AgreementAPI } from '../../../common/util/fetch/agreementservice/agreementsApiInstance'

/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const SELECTED_AGREEMENT = async (req: express.Request, res: express.Response) => {
  const { lotId, agreementLotName, agreementId, agreementName } = req.query;

  const BaseUrlAgreement = `/agreements/${agreementId}/lots/${lotId}`
  const { data: retrieveAgreementLot } = await AgreementAPI.Instance.get(BaseUrlAgreement)

  req.session.agreement_id = agreementId;
  req.session.agreementLotName = retrieveAgreementLot.name
  req.session.agreementName = agreementName
  req.session.lotId = lotId

  const releatedContent: ReleatedContent = new ReleatedContent();
  releatedContent.name = agreementName
  releatedContent.lotName = retrieveAgreementLot.name
  releatedContent.lotUrl = "/agreement/lot?agreement_id="+agreementId+"&lotNum="+lotId.replace(/ /g,"%20");
  releatedContent.title = 'Related content'
  req.session.releatedContent = releatedContent
  req.session.selectedRoute = null

  res.redirect('/projects/create-or-choose')
}