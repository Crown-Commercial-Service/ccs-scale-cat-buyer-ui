//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as caTeamScale from '../../../resources/content/requirements/caTeamScale.json';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const DA_GET_TEAM_SCALE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { choosenViewPath } = req.session;
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
    const windowAppendData = { data: caTeamScale, lotId, agreementLotName, choosenViewPath, releatedContent };
    res.render('da-team-scale', windowAppendData);
  } catch (error) {
    req.session['isJaggaerError'] = true;
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Get failed - DA team scale page',
      true,
    );
  }
};

export const DA_POST_TEAM_SCALE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;
  try {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/53`, 'Completed');
    res.redirect('/da/get-work-done');
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Post failed - DA team scale page',
      true,
    );
  }
};
