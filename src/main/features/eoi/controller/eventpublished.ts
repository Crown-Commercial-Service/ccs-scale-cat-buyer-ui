import * as express from 'express';
import * as cmsData from '../../../resources/content/eoi/eoieventPublished.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';

//@GET /rfi/event-sent
export const GET_EVENT_PUBLISHED = async (req: express.Request, res: express.Response) => {
    const appendData = {
        data: cmsData,
        projPersistID: req.session['project_name'],
        rfi_ref_no: req.session.eventId
    }
    const agreementName = req.session.agreementName;
    const lotid = req.session?.lotId;
    const project_name = req.session.project_name;
    const agreementId_session = req.session.agreement_id;
    const agreementLotName = req.session.agreementLotName;
    res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
    const { SESSION_ID } = req.cookies; //jwt
    const { eventId } = req.session;
    
    try {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/2`, 'Completed');
    
        res.render('eventPublishedEoi.njk', appendData)
      }catch (error) {
        LoggTracer.errorLogger(
          res,
          error,
          `${req.headers.host}${req.originalUrl}`,
          null,
          TokenDecoder.decoder(SESSION_ID),
          'Journey service - update the status failed - EOI publish Page',
          true,
        );
      }
}
