import * as express from 'express';
import * as cmsData from '../../../resources/content/requirements/rfp-eventpublished.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';

//@GET /rfi/event-sent
export const GET_EVENT_PUBLISHED  = async (req: express.Request, res: express.Response) => {
    const appendData = {
        data: cmsData,
        projPersistID: req.session['project_name'],
        rfi_ref_no : req.session.eventId
    }
    const { SESSION_ID } = req.cookies; //jwt
    const { projectId } = req.session;

try {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/41`, 'Completed');

    res.render('rfp-eventpublished.njk', appendData)
  }catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - update the status failed - RFI Publish Page',
      true,
    );
  }

}





