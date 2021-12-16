import * as express from 'express'
import * as chooseRouteData from '../../../resources/content/requirements/chooseRoute.json'
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { REQUIREMENT_PATHS } from '../model/requirementConstants'
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('FC / CA CHOOSE ROUTE');

/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const REQUIREMENT_CHOOSE_ROUTE = (req: express.Request, res: express.Response) => {
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
  res.render('choose-route', appendData);
}

/**
 * @POSTController
 * @description
 *
 */
//POST 'eoi/type'
/**
 *
 * @param req
 * @param res
 * @GETController
 */

 export const POST_REQUIREMENT_CHOOSE_ROUTE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
 try {
  const filtered_body_content_removed_fc_key = ObjectModifiers._deleteKeyofEntryinObject(req.body, 'choose_fc_route_to_market');

  const { fc_route_to_market } = filtered_body_content_removed_fc_key;

  if (fc_route_to_market) {
  
    switch (fc_route_to_market) {
       case '1-stage':
          // eslint-disable-next-line no-case-declarations
          const redirect_address = REQUIREMENT_PATHS.RFP_TYPE;
          req.session.caSelectedRoute = fc_route_to_market
          logger.info("One stage further competition selected");
          res.redirect(redirect_address);
          break;
  
       case '2-stage':
          // eslint-disable-next-line no-case-declarations
          const newAddress = '#';
          req.session.caSelectedRoute = fc_route_to_market
          logger.info("two stage further competition selected");
          res.redirect(newAddress);
          break;
  
       default: res.redirect('/404');
  } 
}else {
    req.session['isJaggaerError'] = true;
    res.redirect(REQUIREMENT_PATHS.CHOOSE_ROUTE);
  }

 } catch (error) {
  LoggTracer.errorLogger(
    res,
    error,
    `${req.headers.host}${req.originalUrl}`,
    null,
    TokenDecoder.decoder(SESSION_ID),
    'Requirement Choose route page',
    true,
  );
}

};
