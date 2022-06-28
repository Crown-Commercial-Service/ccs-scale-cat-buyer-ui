import * as express from 'express'
import * as cmsData from '../../../resources/content/procurement/chooseRoute.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { RFI_PATHS } from 'main/features/rfi/model/rficonstant';
import { EOI_PATHS } from 'main/features/eoi/model/eoiconstant';
import { LoggTracer } from '@common/logtracer/tracer';
import { TokenDecoder } from '@common/tokendecoder/tokendecoder';
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('choseRoute');

/**
 * 
 * @Rediect 
 * @param req 
 * @param res 
 * 
 * 
 */
export const GET_CHOOSE_ROUTE = (req: express.Request, res: express.Response) => {
   const releatedContent = req.session.releatedContent
   const { isJaggaerError } = req.session;
   req.session['isJaggaerError'] = false;
   const windowAppendData = { data: cmsData, releatedContent, error: isJaggaerError }
   res.render('chooseRoute', windowAppendData);
}


/**
* @POSTController
* @description
* 
*/
//POST 'rfi/type'
/**
* 
* @param req 
* @param res 
* @GETController
*/

export const POST_CHOOSE_ROUTE = async (req: express.Request, res: express.Response) => {
   const { SESSION_ID } = req.cookies;
   const {eventId} = req.session;
   try {
      if (req.body['choose_eoi_type'].length == 2) {
         const choose_eoi_type = req.body['choose_eoi_type'][0]
         switch (choose_eoi_type) {
            case 'EOI':
               // eslint-disable-next-line no-case-declarations
               const redirect_address = EOI_PATHS.GET_TASKLIST;
               req.session.selectedRoute = 'EOI'
               await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/2`, 'In progress');
               logger.info("EOI Route selected");
               res.redirect(redirect_address);
               break;

            case 'RFI':
               // eslint-disable-next-line no-case-declarations
               const newAddress = RFI_PATHS.GET_TASKLIST;
               req.session.selectedRoute = 'RFI'
               await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/2`, 'In progress');
               logger.info("RFI Route selected");
               res.redirect(newAddress);
               break;

            default: res.redirect('/404');
         }
      } else {
         req.session['isJaggaerError'] = true;
         res.redirect('/projects/events/choose-route');
      }
   } catch (error) {
      LoggTracer.errorLogger(
         res,
         error,
         `${req.headers.host}${req.originalUrl}`,
         null,
         TokenDecoder.decoder(SESSION_ID),
         'Journey service - update the status failed - Choose route Page',
         true,
      );
   }
}