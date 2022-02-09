//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import * as caSubContractors from '../../../resources/content/requirements/daSubContractors.json';
import { REQUIREMENT_PATHS } from '../model/requirementConstants';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const DA_GET_SUBCONTRACTORS = async (req: express.Request, res: express.Response) => {
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
    res.render('da-SubContractors', windowAppendData);
  } catch (error) {
    req.session['isValidationError'] = true;
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Get failed - DA next steps page',
      true,
    );
  }
};

export const DA_POST_SUBCONTRACTORS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;

  try {
    const { da_subContractors } = req.body;

    if (da_subContractors !== undefined && da_subContractors !== '') {
      req.session['CapAss'].SubContractors = da_subContractors;
      await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/48`, 'To-do');
      res.redirect(REQUIREMENT_PATHS.DA_GET_RESOURCES_VETTING_WEIGHTINGS);
    } else {
      req.session['isValidationError'] = true;
      res.redirect(REQUIREMENT_PATHS.DA_GET_SUBCONTRACTORS); // Invalid path. needs to updaet
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Post failed - DA next steps page',
      true,
    );
  }
};
