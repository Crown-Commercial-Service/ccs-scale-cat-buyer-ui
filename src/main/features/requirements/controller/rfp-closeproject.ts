import * as express from 'express';
import * as data from '../../../resources/content/requirements/rfp-closeproject.json';
// import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
// import { getValue } from '../../../utils/statusStepsDataFilter';

//@GET /rfi/event-sent
export const GET_RFP_CLOSE_PROJECT  = async (req: express.Request, res: express.Response) => {
    // const agreementName = req.session.agreementName;
    // const agreementId_session = req.session.agreement_id;
     const { SESSION_ID } = req.cookies; //jwt
    // const projectId = req.session.projectId;
    // const agreementLotName = req.session.agreementLotName;
     req.session.unpublishedeventmanagement="false";
    //const lotid = req.session?.lotId;
    const appendData = {
        data: data
    }
    
    //const { projectId } = req.session;

try {
     res.render('rfp-closeproject.njk', appendData)
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





