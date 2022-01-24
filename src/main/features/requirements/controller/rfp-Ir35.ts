import * as express from 'express';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';

export const RFP_GET_I35: express.Handler = (req: express.Request, res: express.Response) => {
    res.render('rfp-ir35.njk')
  };


  export const RFP_POST_I35: express.Handler = async (req: express.Request, res: express.Response) => {
      const {SESSION_ID} = req.cookies;
      const { eventId } = req.session;

    try {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/29`, 'Completed');
        res.redirect('/rfp/task-list')
        
    } catch (error) {
        LoggTracer.errorLogger(
            res,
            error,
            `${req.headers.host}${req.originalUrl}`,
            null,
            TokenDecoder.decoder(SESSION_ID),
            'Tenders Service Api cannot be connected',
            true,
          );
    }
     
  };
