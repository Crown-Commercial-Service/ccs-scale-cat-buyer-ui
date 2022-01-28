//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import * as caSubContractors from '../../../resources/content/requirements/caSubContractors.json';
import { REQUIREMENT_PATHS } from '../model/requirementConstants';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const CA_GET_SUBCONTRACTORS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { lotId, agreementLotName, agreementName, eventId, projectId, agreement_id, releatedContent, project_name } =
    req.session;
  const agreementId_session = agreement_id;
  const { isValidationError } = req.session;
  req.session['isValidationError'] = false;
  res.locals.agreement_header = {
    agreementName,
    project_name,
    agreementId_session,
    agreementLotName,
    lotId,
    error: isValidationError,
  };
  try {
    const windowAppendData = { data: caSubContractors, releatedContent, error: isValidationError };
    res.render('ca-SubContractors', windowAppendData);
  } catch (error) {
    req.session['isValidationError'] = true;
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

export const CA_POST_SUBCONTRACTORS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { eventId } = req.session;

  try {
    const { ca_subContractors } = req.body;

    if (ca_subContractors !== undefined && ca_subContractors !== '') {
      req.session['CapAss'].SubContractors = ca_subContractors;
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/48`, 'To-do');
      res.redirect('/ca/security-vetting');
    } else {
      req.session['isValidationError'] = true;
      res.redirect(REQUIREMENT_PATHS.CA_GET_SUBCONTRACTORS); // Invalid path. needs to updaet
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
