//@ts-nocheck
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express';
import * as cmsDSPData from '../../../resources/content/RFI/rfiTaskList.json';
import * as mcf3RFIData from '../../../resources/content/MCF3/rfiTaskList.json';
import * as gcloudRFIData from '../../../resources/content/MCF3/gcloudRfiTaskList.json';
import * as ccsDOSData from '../../../resources/content/RFI/dosrfiTaskList.json';
import { statusStepsDataFilter } from '../../../utils/statusStepsDataFilter';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';
import { logConstant } from '../../../common/logtracer/logConstant';

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
    }else if(agreement_id == 'RM1557.13'){//gcloud
      cmsData = gcloudRFIData;
    }
    
    req.session.RfiUploadError=false;
    // const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
    // if(journeySteps[9].state=="Cannot start yet")
    // {
    //   await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/10`, 'Not started');
    // }
    // const { data: journeyrfi } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
    // journeyrfi.forEach((element,index)=>{
    //   if(element.step==9) journeyrfi.splice(index,1);
    // });
    let agreementId_session = agreement_id;
    
    
    // if((agreementId_session == 'RM1557.13' && lotId == '4')) {
      // name your project for dos
      let flag = await ShouldEventStatusBeUpdated(eventId, 7, req);
      
      if(flag) { await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/7`, 'Not started'); }
      let { data: journeyStepsName } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
    
      let nameJourneysts = journeyStepsName.filter((el: any) => {
        if(el.step == 7 && el.state == 'Completed') return true;
        return false;
      });
      
      if(nameJourneysts.length > 0){

        let addcontsts = journeyStepsName.filter((el: any) => { 
          if(el.step == 81) return true;
          return false;
        });

        if(addcontsts[0].state == 'Cannot start yet' || addcontsts[0].state == 'Not started'){
          await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/81`, 'Not started'); 
        }

      }else{
        // let flagaddCont = await ShouldEventStatusBeUpdated(eventId, 81, req);        
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/81`, 'Cannot start yet'); 
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/10`, 'Cannot start yet'); 
      }
    // }

   
    const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
    statusStepsDataFilter(cmsData, journeySteps, 'rfi', agreement_id, projectId, eventId);

    const releatedContent = req.session.releatedContent;
    const windowAppendData = { data: cmsData, lotId, agreementLotName, releatedContent, agreementId_session };
    
     //CAS-INFO-LOG 
     LoggTracer.infoLogger(null, logConstant.rfiTaskListPageLog, req);

    res.render('Tasklist', windowAppendData);
  } catch (error) {  
    console.log(error);  
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

export const GET_RFI_CLOSE_EVENT = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { eventId, projectId } = req.session;
   
  try {
  
    const baseURL = `tenders/projects/${projectId}/events/${eventId}/termination`;
    const _body = {
            "terminationType": "cancelled"       
      };
      const response = await TenderApi.Instance(SESSION_ID).put(baseURL, _body);


     //CAS-INFO-LOG 
     LoggTracer.infoLogger(response, logConstant.eoiTaskListPageLog, req);
    res.redirect('/projects/create-or-choose');
      

    
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Put failed - EOI close event API',
      true,
    );
  }
};
