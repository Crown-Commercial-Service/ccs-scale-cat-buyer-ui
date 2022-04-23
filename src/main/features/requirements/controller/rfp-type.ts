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
export const RFP_REQUIREMENT_TYPE = (req: express.Request, res: express.Response) => {
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

 export const RFP_POST_TYPE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
 try {
  const filtered_body_content_removed_fc_key = ObjectModifiers._deleteKeyofEntryinObject(req.body, 'choose_fc_rfp_type');

   const { group1, group2 } = filtered_body_content_removed_fc_key;

   if (group1 && group2) {
     let choice = '';
     if (group1 === 'online_attachment_3' && group2 === 'online_attachment_2') {
       choice = 'both_online';
     }
     if (group1 === 'offline_attachment_3' && group2 === 'offline_attachment_2') {
      choice = 'both_offline';
     }
     if (group1 === 'online_attachment_3' && group2 === 'offline_attachment_2') {
      choice = 'part_online';
     }
     if (group1 === 'offline_attachment_3' && group2 === 'online_attachment_2') {
       choice = 'part_offline';
     }
      switch (choice) {
        case 'both_online':
          // eslint-disable-next-line no-case-declarations
          const redirect_address = REQUIREMENT_PATHS.RFP_REQUIREMENT_TASK_LIST;
          req.session.fcSelectedRoute = choice;
          logger.info(choice + 'selected');
          res.redirect(redirect_address);
          break;

        case 'both_offline':
          // eslint-disable-next-line no-case-declarations
          const bothOfflineAddress = REQUIREMENT_PATHS.RFP_OFFLINE_JOURNEY_PAGE;
          req.session.fcSelectedRoute = choice;
          logger.info(choice + 'selected');
          res.redirect(bothOfflineAddress);
          break;

        case 'part_online':
          // eslint-disable-next-line no-case-declarations
          const partOnlineAddress = REQUIREMENT_PATHS.RFP_REQUIREMENT_TASK_LIST;
          req.session.fcSelectedRoute = choice;
          logger.info(choice + 'selected');
          res.redirect(partOnlineAddress);
          break;
        case 'part_offline':
          // eslint-disable-next-line no-case-declarations
          const partOfflineAddress = REQUIREMENT_PATHS.RFP_REQUIREMENT_TASK_LIST;
          req.session.fcSelectedRoute = choice;
          logger.info(choice + 'selected');
          res.redirect(partOfflineAddress);
          break;
        default:
          res.redirect('/404');
      }
  } else {
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
