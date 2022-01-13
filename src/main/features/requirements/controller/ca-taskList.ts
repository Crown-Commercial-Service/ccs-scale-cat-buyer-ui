//@ts-nocheck
// import { OrganizationInstance } from '../util/fetch/organizationuserInstance';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as chooseRouteData from '../../../resources/content/requirements/caTaskList.json';
import * as express from 'express';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { statusStepsDataFilter } from '../../../utils/statusStepsDataFilter';

export const GET_CAPABILITY_ASSESSMENT = async (req: express.Request, res: express.Response) => {
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
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/71`, 'Optional'); //todo: remove later
    const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
    statusStepsDataFilter(chooseRouteData, journeySteps, 'CA', agreement_id, projectId, eventId);
    const windowAppendData = { data: chooseRouteData, lotId, agreementLotName, releatedContent };
    //await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/3`, 'In progress');
    res.render('ca-taskList', windowAppendData);
  } catch (error) {
    req.session['isJaggaerError'] = true;
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Put failed - AC task list page',
      true,
    );
  }
};
