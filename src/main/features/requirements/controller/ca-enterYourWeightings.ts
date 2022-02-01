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
  const { lotId, agreementLotName, agreementName, eventId, projectId, agreement_id, releatedContent, project_name } =
    req.session;
  const agreementId_session = agreement_id;
  const { isJaggaerError } = req.session;
  req.session['isJaggaerError'] = false;
  res.locals.agreement_header = {
    agreementName,
    project_name,
    agreementId_session,
    agreementLotName,
    lotId,
    error: isJaggaerError,
  };
  try {
    const windowAppendData = {
      data: caWeightingData,
      dimensions: [
        {
          id: 1,
          title: 'Capacity',
          description: 'description for this dimenstion',
          value: 20,
          minRange: 10,
          maxRange: 90,
        },
        {
          id: 2,
          title: 'Scalability',
          description: 'description for this dimenstion',
          value: 0,
          minRange: 5,
          maxRange: 95,
        },
      ],
      lotId,
      agreementLotName,
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

export const CA_POST_WEIGHTINGS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { eventId } = req.session;
  try {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/49`, 'Completed');
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/55`, 'To-do');
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
