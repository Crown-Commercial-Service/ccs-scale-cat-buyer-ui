//@ts-nocheck
import * as express from 'express'
import * as chooseRouteData from '../../../resources/content/requirements/daTaskList-B1.json'
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { statusStepsDataFilter } from '../../../utils/statusStepsDataFilter';
import * as B1_Template from '../../../resources/content/requirements/daTaskList-B1.json';
import * as B2_Template from '../../../resources/content/requirements/daTaskList-B2.json';
import * as B3_Template from '../../../resources/content/requirements/daTaskList-B3.json';
import * as B4_Template from '../../../resources/content/requirements/daTaskList-B4.json';


/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const DA_REQUIREMENT_TASK_LIST = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const {path} = req.query;
  const { eventId } = req.session;
  const releatedContent = req.session.releatedContent
  const agreementName = req.session.agreementName;
  const lotid = req.session?.lotId;
  const project_name = req.session.project_name;
  const projectId = req.session.projectId;
  const agreementId_session = req.session.agreement_id;
  const agreementLotName = req.session.agreementLotName;
  const { isJaggaerError } = req.session;
  req.session['isJaggaerError'] = false;
  res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };

  let ViewLoadedTemplateData ;


  switch(path){

    case 'B1':
      ViewLoadedTemplateData = B1_Template;
    break;

    case 'B2':
      ViewLoadedTemplateData = B2_Template;
    break;

    case 'B3':
      ViewLoadedTemplateData = B3_Template;
    break;

    case 'B4':
      ViewLoadedTemplateData = B4_Template;
    break;

    default: res.redirect('error/404')

  }



  const appendData = { data: ViewLoadedTemplateData, releatedContent, error: isJaggaerError  }
  try {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/3`, 'In progress');
    const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
    statusStepsDataFilter(ViewLoadedTemplateData, journeySteps, 'rfp', agreementId_session, projectId, eventId);

    res.render('rfp-taskList', appendData);
  }catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - update the status failed - RFP TaskList Page',
      true,
    );
  }

}

