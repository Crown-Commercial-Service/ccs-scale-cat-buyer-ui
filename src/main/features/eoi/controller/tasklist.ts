//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/eoi/eoiTaskList.json';
import * as Mcf3cmsData from '../../../resources/content/MCF3/eoi/eoiTaskList.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { statusStepsDataFilter } from '../../../utils/statusStepsDataFilter';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

// eoi TaskList
/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const GET_TASKLIST = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { lotId, agreementLotName, eventId, projectId, agreement_id } = req.session;
  try {
    const agreementId_session = req.session.agreement_id;
    const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
    if(agreementId_session == 'RM6187') {
      statusStepsDataFilter(Mcf3cmsData, journeySteps, 'eoi', agreement_id, projectId, eventId);
    } else {
      statusStepsDataFilter(cmsData, journeySteps, 'eoi', agreement_id, projectId, eventId);
    }
    const releatedContent = req.session.releatedContent;

    
    let forceChangeDataJson;
    if(agreementId_session == 'RM6187') { //MCF3
      forceChangeDataJson = Mcf3cmsData;
    } else { 
      forceChangeDataJson = cmsData;
    }

    const windowAppendData = { data: forceChangeDataJson, lotId, agreementLotName, releatedContent, agreementId_session };
    res.render('TasklistEoi', windowAppendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Put failed - EOI task list page',
      true,
    );
  }
};
