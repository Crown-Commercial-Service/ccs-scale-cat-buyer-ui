import * as express from 'express';
import * as fcabuildRfiContent from '../../../resources/content/RFI/choose-buildrfi.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';
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
 export const BUILD_RFI = async (req: express.Request, res: express.Response) => {
  
  let appendData: any = {...fcabuildRfiContent};
  
  const releatedContent = req.session.releatedContent;
  const { buildYorrfierror } = req.session;
  req.session['buildYorrfierror'] = false;
  const agreementName = req.session.agreementName;
  const lotid = req.session?.lotId;
  const project_name = req.session.project_name;
  const agreementId_session = req.session.agreement_id;
  const agreementLotName = req.session.agreementLotName;
  res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
  appendData = { ...appendData, agreementName,error:buildYorrfierror, releatedContent, agreementId_session, agreementLotName, lotid };
  res.render('chooseBuildrfi',appendData );
 }

export const POST_BUILD_RFI  = async (req: express.Request, res: express.Response) => {
    const { eventId } = req.session;
    const { SESSION_ID } = req.cookies;
    try {
    if(req.body.goto_choose == undefined || req.body.goto_choose == ''){
      req.session['buildYorrfierror'] = true;
      res.redirect('/rfi/choose-build-your-rfi');
    }else{
      
        let flag = await ShouldEventStatusBeUpdated(eventId, 81, req);
      
        if (flag) {
          // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/81`, 'In progress');
          await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/81`, 'Completed');
        }
      
      res.redirect('/rfi/online-task-list');
    }
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