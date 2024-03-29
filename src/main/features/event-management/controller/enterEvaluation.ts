import * as express from 'express';
import { LoggTracer } from '@common/logtracer/tracer';
import { TokenDecoder } from '@common/tokendecoder/tokendecoder';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as eventManagementData from '../../../resources/content/event-management/enterEvaluation.json';
import * as localData from '../../../resources/content/event-management/local-SOI.json'; // replace this JSON with API endpoint
import { logConstant } from '../../../common/logtracer/logConstant';

/**
 *
 * @Rediect
 * @endpoint /event/management
 * @param req
 * @param res
 */

export const ENTER_EVALUATION = async (req: express.Request, res: express.Response) => {
  const { agreementLotName, agreementName, agreement_id, releatedContent, project_name } = req.session;
  const lotid = req.session?.lotId;
  const agreementId_session = agreement_id;
  const { SESSION_ID } = req.cookies;
  const { projectId, eventId } = req.session; //projectId,
  const { supplierid, suppliername } = req.query;
  const { Evaluation } = req.query;
  const { isEmptyProjectError } = req.session;
  req.session.isEmptyProjectError = false;
  let feedBack = '';
  let marks = '';

  // Event header

  res.locals.agreement_header = {
    projectName: project_name,
    projectId,
    Evaluation,
    agreementName,
    agreementIdSession: agreementId_session,
    agreementLotName,
    lotid,
  };

  try {
    //Supplier of interest

    const stage2BaseUrl = `/tenders/projects/${projectId}/events`;
    const stage2_dynamic_api = await TenderApi.Instance(SESSION_ID).get(stage2BaseUrl);
    const stage2_dynamic_api_data = stage2_dynamic_api.data;
    const stage2_data = stage2_dynamic_api_data?.filter(
      (anItem: any) => anItem.id == eventId && (anItem.templateGroupId == '13' || anItem.templateGroupId == '14')
    );

    let stage2_value = 'Stage 1';
    if (stage2_data.length > 0) {
      stage2_value = 'Stage 2';
    }

    const supplierInterestURL = `tenders/projects/${projectId}/events/${eventId}/scores`;
    const supplierdata = await TenderApi.Instance(SESSION_ID).get(supplierInterestURL);
    //CAS-INFO-LOG
    LoggTracer.infoLogger(supplierdata, logConstant.getSupplierScore, req);

    for (let m = 0; m < supplierdata.data.length; m++) {
      if (supplierdata.data[m].organisationId == supplierid && supplierdata.data[m].score != null) {
        feedBack = '';
        marks = supplierdata.data[m].score;
      }
    }

    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.evaluateFinalScorePageLogg, req);

    res.render('enterEvaluation', {
      stage2_value,
      releatedContent,
      data: eventManagementData,
      error: isEmptyProjectError,
      feedBack,
      marks,
      eventId,
      suppliername,
      supplierid,
      suppliers: localData,
      agreementId_session,
      lotid,
    });
  } catch (err) {
    LoggTracer.errorLogger(
      res,
      err,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management page',
      true
    );
  }
};

export const ENTER_EVALUATION_POST = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  const { supplierid, suppliername } = req.query;
  // const {enter_evaluation_feedback,enter_evaluation_score} =req.body;  Old Logics
  const { enter_evaluation_score } = req.body;

  try {
    // if (enter_evaluation_feedback && enter_evaluation_score ) {  Old Logics
    if (enter_evaluation_score) {
      const evaluation_score = enter_evaluation_score.includes('.')
        ? enter_evaluation_score
        : enter_evaluation_score + '.00';
      //comment: enter_evaluation_feedback,
      const body = [
        {
          organisationId: supplierid,
          score: evaluation_score,
        },
      ];

      req.session.individualScore = body[0];

      //let responseScore =
      TenderApi.Instance(SESSION_ID).put(`tenders/projects/${projectId}/events/${eventId}/scores`, body);

      //CAS-INFO-LOG
      // LoggTracer.infoLogger(responseScore, logConstant.evaluateScoreUpdated, req);

      res.redirect('/score-individual');
    } else {
      req.session.isEmptyProjectError = true;
      res.redirect('/enter-evaluation?' + 'supplierid=' + supplierid + '&suppliername=' + suppliername);
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management page',
      true
    );
  }
};

const scoreApis = async (sessionId: string, projectId: string, eventId: string): Promise<any> => {
  const scoreCompareUrl = `tenders/projects/${projectId}/events/${eventId}/scores`;
  const scoreCompare: any = await TenderApi.Instance(sessionId)
    .get(scoreCompareUrl)
    .then((x) => new Promise((resolve) => setTimeout(() => resolve(x), 6000)));
  return scoreCompare.data;
};

export const SCORE_INDIVIDUAL_GET = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;

  if (req.session.individualScore !== undefined) {
    let scoreIndividualGetState = true;
    do {
      const sessionScore = req.session.individualScore;
      let resScore: any = [];
      resScore = await scoreApis(SESSION_ID, projectId, eventId);

      if (resScore.length > 0) {
        const scoreFliter = resScore.filter((el: any) => {
          return el.organisationId === sessionScore.organisationId && el.score == sessionScore.score;
        });
        if (scoreFliter.length > 0) {
          scoreIndividualGetState = false;
        }
      }
    } while (scoreIndividualGetState);

    if (!scoreIndividualGetState) {
      req.session.isEmptyProjectError = false;
      res.redirect('/evaluate-suppliers');
    }
  } else {
    req.session.isEmptyProjectError = false;
    res.redirect('/evaluate-suppliers');
  }
};
//publisheddoc?download=1
