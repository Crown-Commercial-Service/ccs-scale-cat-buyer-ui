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
  const { assessmentId } = req.session.currentEvent;
  let isSubContractorAccepted = false;
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
    const assessmentDetail = await GET_ASSESSMENT_DETAIL(SESSION_ID, assessmentId);
    if (assessmentDetail.scores.length > 0) {
      // Need refactoring
      isSubContractorAccepted = assessmentDetail.scores.find(asst => asst.name == 'Sub Contractors');
    } else {
      isSubContractorAccepted = req.session['CapAss'].isSubContractorAccepted;
    }
    caSubContractors.form[0].radioOptions.items = caSubContractors.form[0].radioOptions.items.map(opt => {
      opt.checked = opt.value == 'Yes' && isSubContractorAccepted ? true : false;
      return opt;
    });
    const windowAppendData = {
      data: caSubContractors,
      releatedContent,
      error: isValidationError,
      SubContractorAccepted: isSubContractorAccepted,
    };
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
const GET_ASSESSMENT_DETAIL = async (sessionId: any, assessmentId: string) => {
  const assessmentBaseUrl = `/assessments/${assessmentId}`;
  const assessmentApi = await TenderApi.Instance(sessionId).get(assessmentBaseUrl);
  return assessmentApi.data;
};

export const CA_POST_SUBCONTRACTORS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;

  try {
    const { ca_subContractors } = req.body;

    if (ca_subContractors !== undefined && ca_subContractors !== '') {
      req.session['CapAss'].isSubContractorAccepted = ca_subContractors == 'yes' ? true : false;
      await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/48`, 'Not started');

      res.redirect(REQUIREMENT_PATHS.CA_GET_RESOURCES_VETTING_WEIGHTINGS);
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
