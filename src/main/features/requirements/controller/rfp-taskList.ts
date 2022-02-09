//@ts-nocheck
import * as express from 'express';
import * as chooseRouteData from '../../../resources/content/requirements/rfpTaskList.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { statusStepsDataFilter } from '../../../utils/statusStepsDataFilter';
/**
 *
 * @Rediect
 * @endpoint '/oauth/login
 * @param req
 * @param res
 */
export const RFP_REQUIREMENT_TASK_LIST = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { eventId, currentEvent } = req.session;
  const releatedContent = req.session.releatedContent;
  const agreementName = req.session.agreementName;
  const lotid = req.session?.lotId;
  const project_name = req.session.project_name;
  const projectId = req.session.projectId;
  const agreementId_session = req.session.agreement_id;
  const agreementLotName = req.session.agreementLotName;
  const { isJaggaerError } = req.session;
  const { assessmentId } = currentEvent;
  req.session['isJaggaerError'] = false;
  const itemList = [
    'Data',
    'Technical',
    'IT Ops',
    'Product Delivery',
    'QAT',
    'User Centred Design',
    'No DDaT Cluster Mapping',
  ];
  res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
  const appendData = { data: chooseRouteData, releatedContent, error: isJaggaerError };
  try {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/3`, 'In progress');
    const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${projectId}/steps`);
    statusStepsDataFilter(chooseRouteData, journeySteps, 'rfp', agreementId_session, projectId, eventId);
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/29`, 'In progress');
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/30`, 'In progress');
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/31`, 'In progress');
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/32`, 'In progress');

    res.render('rfp-taskList', appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Service - status failed - RFP TaskList Page',
      true,
    );
  }
};
