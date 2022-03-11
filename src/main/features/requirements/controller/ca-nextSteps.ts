//@ts-nocheck
import * as express from 'express';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import * as caNextData from '../../../resources/content/requirements/caNextSteps.json';
import { REQUIREMENT_PATHS } from '../model/requirementConstants';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const CA_GET_NEXTSTEPS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { choosenViewPath } = req.session;
  const { lotId, agreementLotName, agreementName, eventId, projectId, agreement_id, releatedContent, project_name } =
    req.session;
  const lotid = req.session?.lotId;
  const agreementId_session = agreement_id;
  const { isJaggaerError } = req.session;
  req.session['isJaggaerError'] = false;
  res.locals.agreement_header = {
    agreementName,
    project_name,
    agreementId_session,
    agreementLotName,
    lotid,
    error: isJaggaerError,
  };
  try {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/58`, 'Not started');
    const windowAppendData = {
      data: caNextData,
      projectLongName: project_name,
      lotId,
      agreementLotName,
      releatedContent: releatedContent,
      error: isJaggaerError,
      choosenViewPath: choosenViewPath,
    };
    res.render('ca-nextSteps', windowAppendData);
  } catch (error) {
    req.session['isJaggaerError'] = true;
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Get failed - CA next steps page',
      true,
    );
  }
};

export const CA_POST_NEXTSTEPS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;
  const { choosenViewPath } = req.session;

  try {
    const filtered_body_content_removed_fc_key = ObjectModifiers._deleteKeyofEntryinObject(
      req.body,
      'choose_fc_ca_next_steps',
    );
    const { ca_next_steps } = filtered_body_content_removed_fc_key;
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/55`, 'Not started');
    if (ca_next_steps) {
      switch (ca_next_steps) {
        case 'yes':
          await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'Completed');
          res.redirect(REQUIREMENT_PATHS.CA_REQUIREMENT_TASK_LIST + '?path=' + choosenViewPath);
          break;

        case 'edit':
          await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'Not started');
          res.redirect(REQUIREMENT_PATHS.CA_REQUIREMENT_TASK_LIST + '?path=' + choosenViewPath);
          break;

        case 'no':
          await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'Completed');
          res.redirect(REQUIREMENT_PATHS.CA_GET_CANCEL);
          break;

        default:
          res.redirect('/404');
      }
    } else {
      req.session['isJaggaerError'] = true;
      res.redirect(REQUIREMENT_PATHS.CA_GET_NEXTSTEPS);
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Post failed - CA next steps page',
      true,
    );
  }
};
