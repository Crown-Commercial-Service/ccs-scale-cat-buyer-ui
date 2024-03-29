//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import * as caSubContractors from '../../../resources/content/requirements/caSubContractors.json';
import { REQUIREMENT_PATHS } from '../model/requirementConstants';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';

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
  const { choosenViewPath } = req.session;
  const { isValidationError } = req.session;
  const { assessmentId } = req.session.currentEvent;
  const lotid = req.session?.lotId;
  let isSubContractorAccepted = false;
  req.session['isValidationError'] = false;
  res.locals.agreement_header = {
    agreementName,
    project_name,
    agreementId_session,
    agreementLotName,
    lotid,
    error: isValidationError,
  };
  try {
    const flag = await ShouldEventStatusBeUpdated(eventId, 47, req);
    if (flag) {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/47`, 'In progress');
    }

    const assessmentDetail = await GET_ASSESSMENT_DETAIL(SESSION_ID, assessmentId);

    isSubContractorAccepted = req.session['CapAss'].isSubContractorAccepted;

    caSubContractors.form[0].radioOptions.items = caSubContractors.form[0].radioOptions.items.map((opt) => {
      if (opt.value == 'yes' && isSubContractorAccepted) opt.checked = true;
      else if (opt.value == 'no' && isSubContractorAccepted == false) opt.checked = true;
      return opt;
    });
    const windowAppendData = {
      data: caSubContractors,
      releatedContent,
      error: isValidationError,
      SubContractorAccepted: isSubContractorAccepted,
      choosenViewPath,
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
      true
    );
  }
};
const GET_ASSESSMENT_DETAIL = async (sessionId: any, assessmentId: string) => {
  const assessmentBaseUrl = `/assessments/${assessmentId}`;
  const assessmentApi = await TenderApi.Instance(sessionId).get(assessmentBaseUrl);
  return assessmentApi.data;
};

const GET_DIMENSIONS_BY_ID = async (sessionId: any, toolId: any) => {
  const baseUrl = `assessments/tools/${toolId}/dimensions`;
  const dimensionsApi = await TenderApi.Instance(sessionId).get(baseUrl);
  return dimensionsApi.data;
};

export const CA_POST_SUBCONTRACTORS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, eventId } = req.session;
  const assessmentId = req.session.currentEvent.assessmentId;
  const toolId = req.session['CapAss']?.toolId;

  try {
    const { ca_subContractors } = req.body;

    if (ca_subContractors !== undefined && ca_subContractors !== '') {
      const ca_acceptsubcontractors = ca_subContractors == 'yes' ? true : false;
      req.session['CapAss'].isSubContractorAccepted = ca_acceptsubcontractors;
      const assessmentDetail = await GET_ASSESSMENT_DETAIL(SESSION_ID, assessmentId);

      for (const dimension of assessmentDetail.dimensionRequirements) {
        const body = {
          name: dimension.name,
          weighting: dimension.weighting,
          requirements: dimension.requirements,
          includedCriteria: dimension.includedCriteria
            .map((criteria) => {
              if (!ca_acceptsubcontractors && criteria['name'] == 'Sub Contractor') {
                return null;
              } else
                return {
                  'criterion-id': criteria['criterion-id'],
                };
            })
            .filter((criteria) => criteria !== null),
        };
        await TenderApi.Instance(SESSION_ID).put(
          `/assessments/${assessmentId}/dimensions/${dimension['dimension-id']}`,
          body
        );
      }
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/47`, 'Completed');
      const flag = await ShouldEventStatusBeUpdated(eventId, 48, req);
      if (flag) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/48`, 'Not started');
      }
      if (req.session['CA_nextsteps_edit']) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/54`, 'Not started');
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/55`, 'Cannot start yet');
      }
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
      true
    );
  }
};
