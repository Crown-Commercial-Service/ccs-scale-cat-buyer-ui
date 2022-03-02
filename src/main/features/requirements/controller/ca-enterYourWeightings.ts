//@ts-nocheck
import * as express from 'express';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import * as caWeightingData from '../../../resources/content/requirements/caEnterYourWeightings.json';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const CA_GET_WEIGHTINGS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const {
    lotId,
    agreementLotName,
    agreementName,
    eventId,
    choosenViewPath,
    projectId,
    agreement_id,
    releatedContent,
    project_name,
  } = req.session;
  const lotid = req.session?.lotId;
  const agreementId_session = agreement_id;
  const assessmentId = req.session.currentEvent.assessmentId;
  const { isJaggaerError } = req.session;
  req.session['isJaggaerError'] = false;
  res.locals.agreement_header = {
    agreementName,
    project_name,
    agreementId_session,
    agreementLotName,
    lotid,
    error: isJaggaerError,
  };
  try {
    const assessmentDetail = await GET_ASSESSMENT_DETAIL(SESSION_ID, assessmentId);
    const dimensions = await GET_DIMENSIONS_BY_ID(SESSION_ID, assessmentDetail['external-tool-id']);
    let weightingsArray = [];
    if (dimensions.length > 0) {
      weightingsArray = dimensions.map(anItem => {
        return {
          id: anItem['dimension-id'],
          title: anItem['name'],
          description: '[Description for this dimension]',
          weightingRange: anItem['weightingRange'],
          value: assessmentDetail.dimensionRequirements?.find(item => item['dimension-id'] == anItem['dimension-id'])
            ?.weighting,
        };
      });
    }
    req.session['CapAss'].toolId = assessmentDetail['external-tool-id'];
    const windowAppendData = {
      data: caWeightingData,
      dimensions: weightingsArray,
      lotId,
      agreementLotName,
      choosenViewPath,
      releatedContent,
    };
    res.render('ca-enterYourWeightings', windowAppendData);
  } catch (error) {
    req.session['isJaggaerError'] = true;
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Get failed - CA weighting page',
      true,
    );
  }
};

const GET_ASSESSMENT_DETAIL = async (sessionId: any, assessmentId: string) => {
  const assessmentBaseUrl = `/assessments/${assessmentId}`;
  const assessmentApi = await TenderApi.Instance(sessionId).get(assessmentBaseUrl);
  return assessmentApi.data;
};

const GET_DIMENSIONS_BY_ID = async (sessionId: any, toolId: any) => {
  const baseUrl = `assessments/tools/${toolId}/dimensions`;
  const dimensionsApi = await TenderApi.Instance(sessionId).get(baseUrl);
  return dimensionsApi.data;
};

export const CA_POST_WEIGHTINGS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;
  const assessmentId = req.session.currentEvent.assessmentId;

  try {
    const toolId = req.session['CapAss']?.toolId;
    const dimensions = await GET_DIMENSIONS_BY_ID(SESSION_ID, toolId);

    for (var dimension of dimensions) {
      const body = {
        name: dimension.name,
        weighting: req.body[dimension['dimension-id']],
        requirements: [],
        includedCriteria: dimension.evaluationCriteria
          .map(criteria => {
            if (!req.session['CapAss']?.isSubContractorAccepted && criteria['name'] == 'Sub Contractor') {
              return null;
            } else
              return {
                'criterion-id': criteria['criterion-id'],
              };
          })
          .filter(criteria => criteria !== null),
      };
      await TenderApi.Instance(SESSION_ID).put(
        `/assessments/${assessmentId}/dimensions/${dimension['dimension-id']}`,
        body,
      );
    }

    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/46`, 'Completed');
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/47`, 'Not started');
    //await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/55`, 'To-do');
    res.redirect('/ca/accept-subcontractors');
  } catch (err) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'CA weightings page',
      true,
    );
  }
};
