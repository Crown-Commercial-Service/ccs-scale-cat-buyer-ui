import * as express from 'express';
import * as chooseRouteData from '../../../resources/content/requirements/chooseRoute.json';
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { REQUIREMENT_PATHS } from '../model/requirementConstants';
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('FC / CA CHOOSE ROUTE');

/**
 *
 * @Rediect
 * @endpoint '/oauth/login
 * @param req
 * @param res
 */
export const REQUIREMENT_CHOOSE_ROUTE = async (req: express.Request, res: express.Response) => {
  const releatedContent = req.session.releatedContent;
  const agreementName = req.session.agreementName;
  const lotid = req.session?.lotId;
  const project_name = req.session.project_name;
  const agreementId_session = req.session.agreement_id;
  const agreementLotName = req.session.agreementLotName;
  const { isJaggaerError } = req.session;
  req.session['isJaggaerError'] = false;
  const updatedOptions = await updateRadioButtonOptions(
    chooseRouteData,
    agreementId_session,
    lotid,
    req.session?.types,
  );
  res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
  const appendData = { data: updatedOptions, releatedContent, error: isJaggaerError };
  res.render('choose-route', appendData);
};

function updateRadioButtonOptions(
  chooseRouteOptions: any,
  agreementId: string,
  lotId: string,
  types: string[],
): object {
  let updatedOptions = chooseRouteOptions;
  const updateLotId = lotId.length > 1 ? lotId : 'Lot ' + lotId;
  switch (agreementId) {
    case 'RM6263':
      if (updateLotId == 'Lot 1') {
        for (let i = 0; i < chooseRouteData.form.radioOptions.items.length; i++) {
          if (types.find(element => element == 'FC')) {
            if (updatedOptions.form.radioOptions.items[i].value === '2-stage') {
              // updatedOptions.form.radioOptions.items[i].disabled = "true"
            } else if (updatedOptions.form.radioOptions.items[i].value === 'award') {
              updatedOptions.form.radioOptions.items[i].remove = 'true';
            }
          }
        }
      } else {
        for (let i = 0; i < chooseRouteData.form.radioOptions.items.length; i++) {
          if (types.find(element => element == 'FC')) {
            updatedOptions.form.radioOptions.items[i].remove = 'false';
          }
          if (types.find(element => element == 'DAA')) {
            if (
              updatedOptions.form.radioOptions.items[i].value === '2-stage' ||
              updatedOptions.form.radioOptions.items[i].value === 'award'
            ) {
              // updatedOptions.form.radioOptions.items[i].disabled = "true"
            }
          }
        }
      }
      break;

    case 'RM6187':
      break;

    default:
      updatedOptions = chooseRouteOptions;
  }
  return updatedOptions;
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
    const filtered_body_content_removed_fc_key = ObjectModifiers._deleteKeyofEntryinObject(
      req.body,
      'choose_fc_route_to_market',
    );

    const { fc_route_to_market } = filtered_body_content_removed_fc_key;

    if (fc_route_to_market) {
      switch (fc_route_to_market) {
        case '1-stage':
          // eslint-disable-next-line no-case-declarations
          const redirect_address = REQUIREMENT_PATHS.RFP_TYPE;
          req.session.caSelectedRoute = fc_route_to_market;
          logger.info('One stage further competition selected');
          req.session.selectedRoute = 'FC';
          res.redirect(redirect_address);
          break;

        case '2-stage':
          // eslint-disable-next-line no-case-declarations
          const newAddress = REQUIREMENT_PATHS.GET_LEARN;
          req.session.caSelectedRoute = fc_route_to_market;
          logger.info('two stage further competition selected');
          req.session.selectedRoute = 'FCA';
          res.redirect(newAddress);
          break;

        case 'award':
          // eslint-disable-next-line no-case-declarations
          const nextAddress = REQUIREMENT_PATHS.GET_LEARN;
          req.session.caSelectedRoute = fc_route_to_market;
          logger.info('DA selected');
          req.session.selectedRoute = 'DA';
          res.redirect(nextAddress);
          break;

        default:
          res.redirect('/404');
      }
    } else {
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
