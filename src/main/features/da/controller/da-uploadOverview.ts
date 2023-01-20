//@ts-nocheck
import * as express from 'express';
import * as uploadData from '../../../resources/content/da/daUploadOverview.json';
import * as Mcf3uploadData from '../../../resources/content/da/daUploadOverview.json';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import {ShouldEventStatusBeUpdated} from '../../shared/ShouldEventStatusBeUpdated';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { logConstant } from '../../../common/logtracer/logConstant';

/**
 *
 * @Rediect
 * @endpoint '/oauth/login
 * @param req
 * @param res
 */
export const DA_UPLOAD = async (req: express.Request, res: express.Response) => {
  
  const { SESSION_ID } = req.cookies;
  const { projectId,eventId } = req.session;
  const releatedContent = req.session.releatedContent;
  const agreementName = req.session.agreementName;
  const lotid = req.session?.lotId;
  const project_name = req.session.project_name;
  const agreementId_session = req.session.agreement_id;
  const agreementLotName = req.session.agreementLotName;
  const { isJaggaerError } = req.session;
  let { selectedRoute } = req.session;//BALWINDER
  req.session['isJaggaerError'] = false;
  res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };
  
  const FILE_PUBLISHER_BASEURL = `/tenders/projects/${projectId}/events/${ eventId}/documents`;
    const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FILE_PUBLISHER_BASEURL);
    //CAS-INFO-LOG
    LoggTracer.infoLogger(FetchDocuments, logConstant.getUploadDocument, req);
    const FETCH_FILEDATA = FetchDocuments?.data;
    
  Mcf3uploadData.taskList[0].taskStatus="To do";
  Mcf3uploadData.taskList[1].taskStatus="Cannot start yet";
  Mcf3uploadData.taskList[2].taskStatus="Optional";
   FETCH_FILEDATA?.map(file => {
     
     if (file.description === "mandatoryfirst") {
       Mcf3uploadData.taskList[0].taskStatus="Done";
     }

     if (Mcf3uploadData.taskList[1].taskStatus !='Done' && Mcf3uploadData.taskList[0].taskStatus === "Done") {
      Mcf3uploadData.taskList[1].taskStatus="To do";
     }

     if (file.description === "mandatorysecond") {
       Mcf3uploadData.taskList[1].taskStatus="Done";
     }
     if (file.description === "optional") {
       Mcf3uploadData.taskList[2].taskStatus="Done";
     }
   });
   

    let forceChangeDataJson;
    if(agreementId_session == 'RM6187') { //MCF3
      forceChangeDataJson = Mcf3uploadData;
    } else { 
      forceChangeDataJson = uploadData;
    }
  const appendData = { data: forceChangeDataJson, releatedContent, error: isJaggaerError, agreementId_session };
  try {
    let flag=await ShouldEventStatusBeUpdated(eventId,30,req);
    if(flag)
    {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/30`, 'In progress');
    }
    //37 changes to 30 BALWINDER 
    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.eoiUploadDocumentPageLog, req);
    res.render('daw-uploadOverview', appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - update the status failed - DA upload overview Page',
      true,
    );
  }
};
