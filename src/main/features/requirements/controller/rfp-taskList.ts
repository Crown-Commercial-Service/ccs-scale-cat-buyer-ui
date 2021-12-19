//@ts-nocheck
import * as express from 'express'
import * as chooseRouteData from '../../../resources/content/requirements/rfpTaskList.json'
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import fileData from '../../../resources/content/RFI/rfionlineTaskList.json'

/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const REQUIREMENT_RFP_TASK_LIST = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { eventId } = req.session;
  const releatedContent = req.session.releatedContent
  const agreementName = req.session.agreementName;
  const lotid = req.session?.lotId;
  const project_name = req.session.project_name;
  const agreementId_session = req.session.agreement_id;
  const agreementLotName = req.session.agreementLotName;
  const { isJaggaerError } = req.session;
  req.session['isJaggaerError'] = false;
  res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
  const appendData = { data: chooseRouteData, releatedContent, error: isJaggaerError  }
  try {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/3`, 'In progress');

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

