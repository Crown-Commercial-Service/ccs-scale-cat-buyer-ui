//@ts-nocheck
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express';
import * as cmsDSPData from '../../../resources/content/RFI/rfiTaskList.json';
import * as mcf3RFIData from '../../../resources/content/MCF3/rfiTaskList.json';
import * as ccsDOSData from '../../../resources/content/RFI/dosrfiTaskList.json';
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
    let cmsData;
    if (agreement_id == 'RM6187') {
      //MCF3
      cmsData = mcf3RFIData;
    } else if (agreement_id == 'RM6263') {
      //DSP
      cmsData = cmsDSPData;
    } else if (agreement_id == 'RM1043.8') {
      //DOS
      cmsData = ccsDOSData;
    }

    const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
    // if(journeySteps[9].state=="Cannot start yet")
    // {
    //   await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/10`, 'Not started');
    // }
    // const { data: journeyrfi } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
    // journeyrfi.forEach((element,index)=>{
    //   if(element.step==9) journeyrfi.splice(index,1);
    // });
    let agreementId_session = agreement_id;
    statusStepsDataFilter(cmsData, journeySteps, 'rfi', agreement_id, projectId, eventId);

    const releatedContent = req.session.releatedContent;
    const windowAppendData = { data: cmsData, lotId, agreementLotName, releatedContent, agreementId_session };
    
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
