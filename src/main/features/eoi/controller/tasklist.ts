//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/eoi/eoiTaskList.json';
import * as Mcf3cmsData from '../../../resources/content/MCF3/eoi/eoiTaskList.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { statusStepsDataFilter } from '../../../utils/statusStepsDataFilter';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';

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
  let forceChangeDataJson;
  const agreementId_session = req.session.agreement_id;  
  if(agreementId_session == 'RM6187') { //MCF3
      forceChangeDataJson = Mcf3cmsData;
    } else { 
      forceChangeDataJson = cmsData;
    }
    
    const releatedContent = req.session.releatedContent;
    const windowAppendData = { data: forceChangeDataJson, lotId, agreementLotName, releatedContent, agreementId_session };
    
  
  try {
    
    
    let flag = await ShouldEventStatusBeUpdated(eventId, 16, req);
    if(flag) { await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/16`, 'Not started'); }
   
    let { data: journeyStepsNameJourney } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
    
    let nameJourneysts = journeyStepsNameJourney.filter((el: any) => {
      if(el.step == 16 && el.state == 'Completed') return true;
      return false;
    });
  
    if(nameJourneysts.length > 0){
      
      let addcontsts = journeyStepsNameJourney.filter((el: any) => { 
        if(el.step == 19) return true;
        return false;
      });
     
      if(addcontsts[0].state == 'Cannot start yet'){
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/19`, 'Not started'); 
      }
      
    }else{
     
      let flagaddCont = await ShouldEventStatusBeUpdated(eventId, 19, req);
      if(flagaddCont) await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/19`, 'Cannot start yet'); 
    }

    let { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
    if(agreementId_session == 'RM6187') {
      statusStepsDataFilter(Mcf3cmsData, journeySteps, 'eoi', agreement_id, projectId, eventId);
    } else {
      statusStepsDataFilter(cmsData, journeySteps, 'eoi', agreement_id, projectId, eventId);
    }
   


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
