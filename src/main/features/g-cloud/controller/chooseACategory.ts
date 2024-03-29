import * as express from 'express';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import * as chooseACategoryData from '../../../resources/content/gcloud/chooseACategory.json';
import { logConstant } from '../../../common/logtracer/logConstant';
import { agreementsService } from 'main/services/agreementsService';

export const GET_CHOOSE_A_CATEGORY = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { agreement_id } = req.session;

  try {
    let retrieveAgreement = (await agreementsService.api.getAgreementLots(agreement_id)).unwrap();

    //CAS-INFO-LOG
    LoggTracer.infoLogger(retrieveAgreement, logConstant.lotDetailsFromAggrement, req);

    retrieveAgreement = retrieveAgreement.sort((a: any, b: any) => (a.number < b.number ? -1 : 1));

    const releatedContent = req.session.releatedContent;
    const { isJaggaerError } = req.session;
    req.session['isJaggaerError'] = false;
    req.session.searchKeywords = [];
    const appendData = {
      data: chooseACategoryData,
      retrieveAgreement: retrieveAgreement,
      releatedContent: releatedContent,
      lotId: req.session.lotId,
      agreementLotName: req.session.agreementLotName,
      error: isJaggaerError,
    };
    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.chooseACategoryLog, req);

    res.render('chooseACategory', appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'G-Cloud 13 throws error - Tenders Api is causing problem',
      true
    );
  }
};

export const POST_CHOOSE_A_CATEGORY = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  try {
    if (typeof req.body.lot !== 'undefined') {
      if (req.body.lot == 'all') {
        res.redirect('/g-cloud/search');
      } else {
        res.redirect('/g-cloud/search?lot=' + req.body.lot);
      }
    } else {
      req.session['isJaggaerError'] = true;
      res.redirect('/g-cloud/choose-category');
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'G-Cloud 13 throws error - Tenders Api is causing problem',
      true
    );
  }
};
