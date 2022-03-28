import * as express from 'express';
import * as chooseRouteData from '../../../resources/content/requirements/ca-type.json';
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { REQUIREMENT_PATHS } from '../model/requirementConstants';
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('RFP TYP');

/**
 *
 * @Rediect
 * @endpoint '/oauth/login
 * @param req
 * @param res
 */
export const CA_REQUIREMENT_TYPE = (req: express.Request, res: express.Response) => {
  const releatedContent = req.session.releatedContent;
  const agreementName = req.session.agreementName;
  const lotid = req.session?.lotId;
  const project_name = req.session.project_name;
  const agreementId_session = req.session.agreement_id;
  const agreementLotName = req.session.agreementLotName;
  const { isJaggaerError } = req.session;
  req.session['isJaggaerError'] = false;
  res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
  const appendData = { data: chooseRouteData, releatedContent, error: isJaggaerError };
  if (req.session['CapAss'] == undefined || req.session['CapAss'].length < 0) req.session['CapAss'] = {};
  res.render('ca-type', appendData);
};

//POST 'ca/type'
/**
 *
 * @param req
 * @param res
 * @GETController
 */

export const CA_POST_TYPE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;

  try {
    const filtered_body_content_removed_fc_key = ObjectModifiers._deleteKeyofEntryinObject(
      req.body,
      'choose_fc_ca_type',
    );

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
          const redirect_address = `${REQUIREMENT_PATHS.CA_REQUIREMENT_TASK_LIST}?path=A1`;
          req.session['choosenViewPath'] = 'A1';
          req.session.fcSelectedRoute = choice;
          logger.info(choice + 'selected');
          res.redirect(redirect_address);
          break;

        case 'both_offline':
          // eslint-disable-next-line no-case-declarations
          const bothOfflineAddress = `${REQUIREMENT_PATHS.CA_REQUIREMENT_TASK_LIST}?path=A2`;
          req.session.fcSelectedRoute = choice;
          req.session['choosenViewPath'] = 'A2';
          logger.info(choice + 'selected');
          res.redirect(bothOfflineAddress);
          break;

        case 'part_online':
          // eslint-disable-next-line no-case-declarations
          const partOnlineAddress = `${REQUIREMENT_PATHS.CA_REQUIREMENT_TASK_LIST}?path=A4`;
          req.session.fcSelectedRoute = choice;
          req.session['choosenViewPath'] = 'A4';
          logger.info(choice + 'selected');
          res.redirect(partOnlineAddress);
          break;
        case 'part_offline':
          // eslint-disable-next-line no-case-declarations
          const partOfflineAddress = `${REQUIREMENT_PATHS.CA_REQUIREMENT_TASK_LIST}?path=A3`;
          req.session['choosenViewPath'] = 'A3';
          req.session.fcSelectedRoute = choice;
          logger.info(choice + 'selected');
          res.redirect(partOfflineAddress);
          break;
        default:
          res.redirect('/404');
      }
    } else {
      req.session['isJaggaerError'] = true;
      res.redirect(REQUIREMENT_PATHS.CA_TYPE);
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'CA type page',
      true,
    );
  }
};
