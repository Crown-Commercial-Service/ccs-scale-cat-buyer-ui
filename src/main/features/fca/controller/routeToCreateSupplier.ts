import * as express from 'express'
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const ROUTE_TO_CREATE_SUPPLIER = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const {eventId} = req.session;
  try {
   req.session.selectedRoute = 'PA';   //req.session.selectedRoute = 'FCA';
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/50`, 'In progress');
    res.redirect('/fca/create-supplier-shortlist')
  }catch (error) {
      LoggTracer.errorLogger(
         res,
         error,
         `${req.headers.host}${req.originalUrl}`,
         null,
         TokenDecoder.decoder(SESSION_ID),
         'FCA - Journey service - update the status failed - Route to market Page',
         true,
      );
   }
}
