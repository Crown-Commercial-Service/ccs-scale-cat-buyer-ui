//@ts-nocheck
import * as express from 'express';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import * as daNextData from '../../../resources/content/requirements/daNextSteps.json';
import { REQUIREMENT_PATHS } from '../model/requirementConstants';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const DA_GET_NEXTSTEPS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { lotId, agreementLotName, agreementName, eventId, projectId, agreement_id, releatedContent, project_name } =
    req.session;
  const agreementId_session = agreement_id;
  const { isJaggaerError } = req.session;
  req.session['isJaggaerError'] = false;
  res.locals.agreement_header = {
    agreementName,
    project_name,
    agreementId_session,
    agreementLotName,
    lotId,
    error: isJaggaerError,
  };
  try {
    const windowAppendData = { data: daNextData, lotId, agreementLotName, releatedContent };
    res.render('da-nextSteps', windowAppendData);
  } catch (error) {
    req.session['isJaggaerError'] = true;
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Get failed - DA next steps page',
      true,
    );
  }
};

export const DA_POST_NEXTSTEPS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { eventId } = req.session;

  try {
    const filtered_body_content_removed_fc_key = ObjectModifiers._deleteKeyofEntryinObject(
      req.body,
      'choose_fc_da_next_steps',
    );
    const { da_next_steps } = filtered_body_content_removed_fc_key;

    if (da_next_steps) {
      switch (da_next_steps) {
        case 'yes':
          await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/58`, 'Completed');
          res.redirect(REQUIREMENT_PATHS.DA_REQUIREMENT_TASK_LIST);
          break;

        case 'edit':
          await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/58`, 'Not started');
          res.redirect(REQUIREMENT_PATHS.DA_REQUIREMENT_TASK_LIST);
          break;

        case 'no':
          await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/58`, 'Completed');
          res.redirect(REQUIREMENT_PATHS.DA_GET_CANCEL);
          break;

        default:
          res.redirect('/404');
      }
    } else {
      req.session['isJaggaerError'] = true;
      res.redirect(REQUIREMENT_PATHS.DA_GET_NEXTSTEPS);
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Post failed - DA next steps page',
      true,
    );
  }
};
