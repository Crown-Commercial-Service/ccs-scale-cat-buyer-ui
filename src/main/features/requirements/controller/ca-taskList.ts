//@ts-nocheck
// import { OrganizationInstance } from '../util/fetch/organizationuserInstance';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as A1_Template from '../../../resources/content/requirements/caTaskList-A1.json';
import * as A2_Template from '../../../resources/content/requirements/caTaskList-A2.json';
import * as A3_Template from '../../../resources/content/requirements/caTaskList-A3.json';
import * as A4_Template from '../../../resources/content/requirements/caTaskList-A4.json';
import * as express from 'express';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { statusStepsDataFilter } from '../../../utils/statusStepsDataFilter';

export const CA_REQUIREMENT_TASK_LIST = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const {path} = req.query;

  const { lotId, agreementLotName, agreementName, eventId, projectId, agreement_id, releatedContent, project_name } =
    req.session;
  const lotid = req.session?.lotId;
  const agreementId_session = agreement_id;
  const { isJaggaerError } = req.session;
  req.session['isJaggaerError'] = false;
  res.locals.agreement_header = {
    agreementName,
    project_name,
    agreementId_session,
    agreementLotName,
    lotid,
    error: isJaggaerError,
  };

  let ViewLoadedTemplateData ;

  switch(path){

    case 'A1':
      ViewLoadedTemplateData = A1_Template;
    break;

    case 'A2':
      ViewLoadedTemplateData = A2_Template;
    break;

    case 'A3':
      ViewLoadedTemplateData = A3_Template;
    break;

    case 'A4':
      ViewLoadedTemplateData = A4_Template;
    break;

    default: res.redirect('error/404')
  }



  try {
    //await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/71`, 'Optional'); //todo: remove later
    const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
    statusStepsDataFilter(ViewLoadedTemplateData, journeySteps, 'CA', agreement_id, projectId, eventId);
    const windowAppendData = { data: ViewLoadedTemplateData, lotId, agreementLotName, releatedContent };
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
