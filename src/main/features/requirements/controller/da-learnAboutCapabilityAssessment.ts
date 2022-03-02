//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as daLearnData from '../../../resources/content/requirements/daLearnAboutCapabilityAssessment.json';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const DA_GET_LEARN = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { choosenViewPath } = req.session;
  const { lotId, agreementLotName, agreementName, eventId, projectId, agreement_id, releatedContent, project_name } =
    req.session;
  const lotid = req.session?.lotId;
  const agreementId_session = agreement_id;
  const { isJaggaerError } = req.session;
  const isPathOne = false;
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
    const windowAppendData = {
      data: daLearnData,
      lotId,
      agreementLotName,
      choosenViewPath,
      releatedContent,
      isPathOne,
    };
    res.render('da-learnAboutCapabilityAssessment', windowAppendData);
  } catch (error) {
    req.session['isJaggaerError'] = true;
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Get failed - DA learn page',
      true,
    );
  }
};

export const DA_POST_LEARN = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;
  try {
    res.redirect('/da/resources-vetting-weightings');
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Post failed - DA learn page',
      true,
    );
  }
};
