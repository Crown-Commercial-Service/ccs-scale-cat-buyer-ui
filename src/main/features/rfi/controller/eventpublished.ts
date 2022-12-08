import * as express from 'express';
import * as cmsData from '../../../resources/content/RFI/event-published.json';
import * as Mcf3cmsData from '../../../resources/content/MCF3/RFI/event-published.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';

//@GET /rfi/event-sent
export const GET_EVENT_PUBLISHED  = async (req: express.Request, res: express.Response) => {
  const agreement_id = req.session.agreement_id;
  let forceChangeDataJson = (agreement_id == 'RM6187')?Mcf3cmsData:cmsData;
    const appendData = {
        data: forceChangeDataJson,
        projPersistID: req.session['project_name'],
        rfi_ref_no : req.session.eventId
    }
    const { SESSION_ID } = req.cookies; //jwt
    const { eventId } = req.session;

try {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/2`, 'Completed');

    res.render('eventpublished.njk', appendData)
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





