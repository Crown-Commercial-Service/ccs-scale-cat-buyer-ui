//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import * as daSubContractors from '../../../resources/content/requirements/daSubContractors.json';
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
  const { isValidationError, choosenViewPath } = req.session;
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
    isSubContractorAccepted = req.session['CapAss'].isSubContractorAccepted;

    daSubContractors.form[0].radioOptions.items = daSubContractors.form[0].radioOptions.items.map(opt => {
      if (opt.value == 'yes' && isSubContractorAccepted) opt.checked = true;
      else if (opt.value == 'no' && isSubContractorAccepted == false) opt.checked = true;
      return opt;
    });
    const windowAppendData = {
      data: daSubContractors,
      releatedContent,
      error: isValidationError,
      SubContractorAccepted: isSubContractorAccepted,
      choosenViewPath,
    };
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/65`, 'In progress');
    res.render('da-SubContractors', windowAppendData);
  } catch (error) {
    req.session['isValidationError'] = true;
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

export const DA_POST_SUBCONTRACTORS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;
  const assessmentId = req.session.currentEvent.assessmentId;
  const toolId = req.session['CapAss']?.toolId;

  try {
    const { da_subContractors } = req.body;

    if (da_subContractors !== undefined && da_subContractors !== '') {
      const da_acceptsubcontractors = da_subContractors.toLowerCase() == 'yes' ? true : false;
      req.session['CapAss'].isSubContractorAccepted=da_acceptsubcontractors
      const assessmentDetail = await GET_ASSESSMENT_DETAIL(SESSION_ID, assessmentId);

      for (var dimension of assessmentDetail.dimensionRequirements) {
        const body = {
          name: dimension.name,
          weighting: dimension.weighting,
          requirements: dimension.requirements,
          includedCriteria: dimension.includedCriteria.map(criteria => {
            if (!da_acceptsubcontractors && criteria['name'].toLowerCase() == 'sub contractor') {
              return null;
            } else
              return {
                'criterion-id': criteria['criterion-id'],
              };
          }).filter(criteria => criteria !== null),
        };
        await TenderApi.Instance(SESSION_ID).put(
          `/assessments/${assessmentId}/dimensions/${dimension['dimension-id']}`,
          body,
        );
      }
      await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/65`, 'Completed');
      await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/66`, 'Not started');

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
