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
export const ROUTE_TO_MARKET = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const eventId = req.session.eventId;
  try {
    const eventTypes = req.session.types
    const eoiRoute = eventTypes.find(((element: string) => element == 'EOI'))
    if (eoiRoute == 'EOI') {
      res.redirect('/projects/events/choose-route')
    } else {
      req.session.selectedRoute = 'RFI'
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/2`, 'In progress');
      res.redirect('/rfi/rfi-tasklist')
    }
  }catch (error) {
      LoggTracer.errorLogger(
         res,
         error,
         `${req.headers.host}${req.originalUrl}`,
         null,
         TokenDecoder.decoder(SESSION_ID),
         'Journey service - update the status failed - Route to market Page',
         true,
      );
   }
}
