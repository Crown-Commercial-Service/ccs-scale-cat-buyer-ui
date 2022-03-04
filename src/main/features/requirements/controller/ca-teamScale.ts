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
export const CA_GET_TEAM_SCALE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { choosenViewPath } = req.session;
  const { lotId, agreementLotName, agreementName, eventId, projectId, agreement_id, releatedContent, project_name } =
    req.session;
  const agreementId_session = agreement_id;
  const assessmentId = req.session.currentEvent.assessmentId;
  const { isJaggaerError } = req.session;
  req.session['isJaggaerError'] = false;
  res.locals.agreement_header = {
    agreementName,
    project_name,
    agreementId_session,
    agreementLotName,
    lotid: lotId,
    error: isJaggaerError,
  };
  try {
    // get the stored value from session. If not found, call api
    const assessmentDetail = await GET_ASSESSMENT_DETAIL(SESSION_ID, assessmentId);

    if (assessmentDetail.dimensionRequirements.length > 0) {
      const optionId = assessmentDetail.dimensionRequirements[0].requirements[0]['requirement-id'];
      const objIndex = caTeamScale.form.radioOptions.items.findIndex(obj => obj.value === optionId);

      caTeamScale.form.radioOptions.items[objIndex].selected = true;
    }
    const windowAppendData = { data: caTeamScale, lotId, agreementLotName, choosenViewPath, releatedContent };
    res.render('ca-team-scale', windowAppendData);
  } catch (error) {
    req.session['isJaggaerError'] = true;
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Get failed - CA team scale page',
      true,
    );
  }
};

const GET_ASSESSMENT_DETAIL = async (sessionId: any, assessmentId: string) => {
  const assessmentBaseUrl = `/assessments/${assessmentId}`;
  const assessmentApi = await TenderApi.Instance(sessionId).get(assessmentBaseUrl);
  return assessmentApi.data;
};

export const CA_POST_TEAM_SCALE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;
  const assessmentId = req.session.currentEvent.assessmentId;
  const dimension = req.session.dimensions;
  const scalabilityData = dimension.filter(data => data.name === 'Scalability')[0];

  try {
    const body = {
      'dimension-id': scalabilityData['dimension-id'],
      name: scalabilityData['name'],
      weighting: 20,
      includedCriteria: [{ 'criterion-id': '0' }],
      requirements: [
        {
          name: scalabilityData.options.find(data => data['requirement-id'] === Number(req.body.team_option)).name,
          'requirement-id': Number(req.body.team_option),
          weighting: 100,
          values: [{ 'criterion-id': '0', value: '1: Yes' }],
        },
      ],
    };

    if (req.session['CapAss']?.isSubContractorAccepted) {
      body.includedCriteria.push({ 'criterion-id': '1' });
      body.requirements[0].values.push({ 'criterion-id': '1', value: '1: Yes' });
    }

    await TenderApi.Instance(SESSION_ID).put(
      `/assessments/${assessmentId}/dimensions/${scalabilityData['dimension-id']}`,
      body,
    );

    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/50`, 'Completed');
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/51`, 'Not started');

    // Check 'review ranked suppliers' step number
    // await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/`, 'To do');

    res.redirect('/ca/get-work-done');
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Post failed - CA team scale page',
      true,
    );
  }
};
