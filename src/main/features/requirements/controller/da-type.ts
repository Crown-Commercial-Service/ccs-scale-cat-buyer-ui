import * as express from 'express'
import * as chooseRouteData from '../../../resources/content/requirements/daType.json'
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { REQUIREMENT_PATHS } from '../model/requirementConstants'
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('DA TYP');

/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const DA_REQUIREMENT_TYPE = (req: express.Request, res: express.Response) => {
  const releatedContent = req.session.releatedContent
  const agreementName = req.session.agreementName;
  const lotid = req.session?.lotId;
  const project_name = req.session.project_name;
  const agreementId_session = req.session.agreement_id;
  const agreementLotName = req.session.agreementLotName;
  const { isError } = req.session;
    let errorText = "Select an option";
  if( req.session['isOnlyOneSelected'] == true)
  {
      errorText = "Please select an option from each section";
  }
  res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
  const appendData = { data: chooseRouteData, releatedContent, error: isError, errorText: errorText  }
  req.session['isError'] = false;
  req.session['isOnlyOneSelected'] = false;
  res.render('da-type', appendData);
}

//POST 'da/type'
/**
 *
 * @param req
 * @param res
 * @GETController
 */

 export const DA_POST_TYPE = async (req: express.Request, res: express.Response) => {
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
          const redirect_address = `${REQUIREMENT_PATHS.DA_REQUIREMENT_TASK_LIST}?path=B1`;
          req.session.fcSelectedRoute = choice;
          logger.info(choice + 'selected');
          res.redirect(redirect_address);
          break;

        case 'both_offline':
          // eslint-disable-next-line no-case-declarations
          const bothOfflineAddress = `${REQUIREMENT_PATHS.DA_REQUIREMENT_TASK_LIST}?path=B2`;
          req.session.fcSelectedRoute = choice;
          logger.info(choice + 'selected');
          res.redirect(bothOfflineAddress);
          break;

        case 'part_online':
          // eslint-disable-next-line no-case-declarations
          const partOnlineAddress = `${REQUIREMENT_PATHS.DA_REQUIREMENT_TASK_LIST}?path=B3`;
          req.session.fcSelectedRoute = choice;
          logger.info(choice + 'selected');
          res.redirect(partOnlineAddress);
          break;
        case 'part_offline':
          // eslint-disable-next-line no-case-declarations
          const partOfflineAddress = `${REQUIREMENT_PATHS.DA_REQUIREMENT_TASK_LIST}?path=B4`;
          req.session.fcSelectedRoute = choice;
          logger.info(choice + 'selected');
          res.redirect(partOfflineAddress);
          break;
        default:
          res.redirect('/404');
      }
  } 
  else if(group1 || group2){
    req.session['isOnlyOneSelected'] = true;
    req.session['isError'] = true;
    res.redirect(REQUIREMENT_PATHS.DA_TYPE);
  }
 else
  {
    req.session['isError'] = true;
    res.redirect(REQUIREMENT_PATHS.DA_TYPE);
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
