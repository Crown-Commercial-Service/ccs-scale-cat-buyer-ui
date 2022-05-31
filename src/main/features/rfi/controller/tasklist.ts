//@ts-nocheck
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express';
import * as cmsData from '../../../resources/content/RFI/rfiTaskList.json';
import { statusStepsDataFilter } from '../../../utils/statusStepsDataFilter';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
// RFI TaskList
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
    const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${projectId}/steps`);
    // if(journeySteps[9].state=="Cannot start yet")
    // {
    //   await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/10`, 'Not started');
    // }
    // const { data: journeyrfi } = await TenderApi.Instance(SESSION_ID).get(`journeys/${projectId}/steps`);
    // journeyrfi.forEach((element,index)=>{  
    //   if(element.step==9) journeyrfi.splice(index,1);
  // });

    statusStepsDataFilter(cmsData, journeySteps, 'rfi', agreement_id, projectId, eventId);
    const releatedContent = req.session.releatedContent;
    const windowAppendData = { data: cmsData, lotId, agreementLotName, releatedContent };
    res.render('Tasklist', windowAppendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Put failed - RFI task list page',
      true,
    );
  }
};
