// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import * as express from 'express';
import { ReleatedContent } from '../model/related-content';
import { AgreementAPI } from '../../../common/util/fetch/agreementservice/agreementsApiInstance';
import { LoggTracer } from '../../../common/logtracer/tracer'
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { logConstant } from '../../../common/logtracer/logConstant';

/**
 *
 * @Rediect
 * @endpoint '/oauth/login
 * @param req
 * @param res
 */
export const SELECTED_AGREEMENT = async (req: express.Request, res: express.Response) => {
  const { lotId, agreementLotName, agreementId, agreementName } = req.query;
  const { SESSION_ID } = req.cookies

 
  try {
    let lotRelatedName;
    if(agreementId =='RM1557.13' && lotId =='All'){
        req.session.agreementLotName =agreementLotName;
    }else{
      const BaseUrlAgreement = `/agreements/${agreementId}/lots/${lotId}`;
      const { data: retrieveAgreementLot } = await AgreementAPI.Instance(null).get(BaseUrlAgreement);

      //CAS-INFO-LOG
      LoggTracer.infoLogger(retrieveAgreementLot, logConstant.lotDetailsFromAggrement, req);

      req.session.agreementLotName = retrieveAgreementLot.name;
      lotRelatedName = retrieveAgreementLot.name;
    }
    req.session.agreement_id = agreementId;
    req.session.agreementName = agreementName;
    req.session.lotId = lotId;

    const releatedContent: ReleatedContent = new ReleatedContent();
    releatedContent.name = agreementName;
    releatedContent.lotName = (agreementId=='RM1557.13' && lotId =='All')? agreementLotName : lotRelatedName;
    releatedContent.lotUrl = (agreementId=='RM1557.13' && lotId =='All')?'/agreement/lot?agreement_id=' + agreementId + '&lotNum=':'/agreement/lot?agreement_id=' + agreementId + '&lotNum=' + lotId.replace(/ /g, '%20');
    releatedContent.title = 'Related content';
    req.session.releatedContent = releatedContent;
    req.session.selectedRoute = null;
    req.session.choosenViewPath=null;
    res.redirect('/projects/create-or-choose');
  } catch (err) {
    LoggTracer.errorLogger(
      res,
      err,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Selected Agreement page',
      true,
    );
  }
};
