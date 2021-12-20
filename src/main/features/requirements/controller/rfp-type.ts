import * as express from 'express'
import * as chooseRouteData from '../../../resources/content/requirements/rfpType.json'
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { REQUIREMENT_PATHS } from '../model/requirementConstants'
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('RFP TYP');

/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const REQUIREMENT_RFP_TYPE = (req: express.Request, res: express.Response) => {
  const releatedContent = req.session.releatedContent
  const agreementName = req.session.agreementName;
  const lotid = req.session?.lotId;
  const project_name = req.session.project_name;
  const agreementId_session = req.session.agreement_id;
  const agreementLotName = req.session.agreementLotName;
  const { isJaggaerError } = req.session;
  req.session['isJaggaerError'] = false;
  res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
  const appendData = { data: chooseRouteData, releatedContent, error: isJaggaerError  }
  res.render('rfp-type', appendData);
}

//POST 'rfp/type'
/**
 *
 * @param req
 * @param res
 * @GETController
 */

 export const POST_RFP_TYPE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
 try {
  const filtered_body_content_removed_fc_key = ObjectModifiers._deleteKeyofEntryinObject(req.body, 'choose_fc_rfp_type');

  const { fc_rfp_type } = filtered_body_content_removed_fc_key;

  if (fc_rfp_type) {
  
    switch (fc_rfp_type) {
       case 'all_online':
          // eslint-disable-next-line no-case-declarations
          const redirect_address = REQUIREMENT_PATHS.REQUIREMENT_RFP_TASK_LIST;
          req.session.caSelectedRoute = fc_rfp_type
          logger.info(fc_rfp_type + "selected");
          res.redirect(redirect_address);
          break;
  
       case 'all_offline':
          // eslint-disable-next-line no-case-declarations
          const newAddress = REQUIREMENT_PATHS.REQUIREMENT_RFP_TASK_LIST;
          req.session.caSelectedRoute = fc_rfp_type
          logger.info(fc_rfp_type + "selected");
          res.redirect(newAddress);
          break;
  
       default: res.redirect('/404');
  } 
}else {
    req.session['isJaggaerError'] = true;
    res.redirect(REQUIREMENT_PATHS.RFP_TYPE);
  }

 } catch (error) {
  LoggTracer.errorLogger(
    res,
    error,
    `${req.headers.host}${req.originalUrl}`,
    null,
    TokenDecoder.decoder(SESSION_ID),
    'RFP type page',
    true,
  );
}

};
