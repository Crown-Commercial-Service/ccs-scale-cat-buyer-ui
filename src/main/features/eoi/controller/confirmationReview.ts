import * as express from 'express';
import * as fcareviewContent from '../../../resources/content/MCF3/eoi/confirmationReview.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';

/**
 *
 * @Rediect
 * @param req
 * @param res
 *
 *
 */
export const GET_CONFIRMATION_REVIEW = async (req: express.Request, res: express.Response) => {
  const appendData = {
    data: fcareviewContent,
    projPersistID: req.session['project_name'],
    rfi_ref_no: req.session.eventId,
  };

  const { SESSION_ID } = req.cookies;
  const { eventId } = req.session;

  try {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/2`, 'Completed');

    res.render('eoiconfirmationReview', appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - update the status failed - Mcf3 RFI Publish Page',
      true
    );
  }
};
