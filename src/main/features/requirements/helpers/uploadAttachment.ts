//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/requirements/rfp-upload-attachment.json';
import * as Mcf3cmsData from '../../../resources/content/MCF3/requirements/rfp-upload-attachment.json';
import * as doscmsData from '../../../resources/content/MCF3/requirements/dos6-upload-attachment.json';
import * as gcloudcmsData from '../../../resources/content/requirements/gcloud-upload-attachment.json';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';

export const ATTACHMENTUPLOADHELPER: express.Handler = async (
  req: express.Request,
  res: express.Response,
  fileError: boolean,
  errorList,
) => {
  
  const lotId = req.session?.lotId;
  const { SESSION_ID } = req.cookies;
  const agreementLotName = req.session.agreementLotName;
  const ProjectId = req.session['projectId'];
  const EventId = req.session['eventId'];
  let { selectedRoute, stage2_value } = req.session;
  const { pricingSchedule } = req.session;
  const { file_id } = req.query;
  const {fileObjectIsEmpty}=req.session;
  const {fileDuplicateError}=req.session;
  errorList=errorList ==undefined ||errorList==null?[]:errorList;
  if (file_id !== undefined) {
    try {
      const FileDownloadURL = `/tenders/projects/${ProjectId}/events/${EventId}/documents/${file_id}`;
      const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {
        responseType: 'arraybuffer',
      });
      const file = FetchDocuments;


      let fileNameStoragePricing = [];
      FetchDocuments.data?.map(file => {
        if (file.description === "mandatoryfirst") {
          fileNameStoragePricing.push(file);
        }
      });


      const fileName = file.headers['content-disposition'].split('filename=')[1].split('"').join('');
      const fileData = file.data;
      const type = file.headers['content-type'];
      const ContentLength = file.headers['content-length'];
      res.status(200);
      res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': type,
        'Content-Length': ContentLength,
        'Content-Disposition': 'attachment; filename=' + fileName,
      });
      if (fileNameStoragePricing != undefined && fileNameStoragePricing != null && fileNameStoragePricing.length > 0) {
        req.session['isTcUploaded'] = true;
      } else {
        req.session['isTcUploaded'] = false;
      }
    
      res.send(fileData);
    } catch (error) {
      delete error?.config?.['headers'];
      const Logmessage = {
        Person_id: TokenDecoder.decoder(SESSION_ID),
        error_location: `${req.headers.host}${req.originalUrl}`,
        sessionId: 'null',
        error_reason: `Attachment uploading Causes Problem in ${selectedRoute}  - Tenders Api throws error`,
        exception: error,
      };
      const Log = new LogMessageFormatter(
        Logmessage.Person_id,
        Logmessage.error_location,
        Logmessage.sessionId,
        Logmessage.error_reason,
        Logmessage.exception,
      );
      LoggTracer.errorTracer(Log, res);
    }
  } else {
   
    try {
      const FileuploadBaseUrl = `/tenders/projects/${ProjectId}/events/${EventId}/documents`;
      const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FileuploadBaseUrl);
      const FETCH_FILEDATA = FetchDocuments.data;


      let fileNameStoragePricing = [];
      FETCH_FILEDATA?.map(file => {
        if (file.description === "mandatoryfirst") {
          fileNameStoragePricing.push(file);
        }
      });
      const TOTALSUM = fileNameStoragePricing.reduce((a, b) => a + (b['fileSize'] || 0), 0);
      const releatedContent = req.session.releatedContent;


      // const TOTALSUM = FETCH_FILEDATA.reduce((a, b) => a + (b['fileSize'] || 0), 0);
      // const releatedContent = req.session.releatedContent;


      const agreementId_session = req.session.agreement_id;
    let forceChangeDataJson;
    if(agreementId_session == 'RM6187') { //MCF3
      forceChangeDataJson = Mcf3cmsData;
    }else if(agreementId_session == 'RM1043.8') { //DOS6
      forceChangeDataJson = doscmsData;
    }else if(agreementId_session == 'RM1557.13') { //G-cloud
      forceChangeDataJson = gcloudcmsData;
    }
    else { 
      forceChangeDataJson = cmsData;
    }
    const stage2BaseUrl = `/tenders/projects/${ProjectId}/events`;
    const stage2_dynamic_api = await TenderApi.Instance(SESSION_ID).get(stage2BaseUrl);
    const stage2_dynamic_api_data = stage2_dynamic_api.data;
    const stage2_data = stage2_dynamic_api_data?.filter((anItem: any) => anItem.id == EventId && (anItem.templateGroupId == '13' || anItem.templateGroupId == '14'));
    
    let stage2_value = 'Stage 1';
    if(stage2_data.length > 0){
      stage2_value = 'Stage 2';
    }
      let windowAppendData = {
        lotId,
        agreementLotName,
        data: forceChangeDataJson,
        files: fileNameStoragePricing,
        releatedContent: releatedContent,
        storage: TOTALSUM,
        IsDocumentError: false,
        Rfp_confirm_upload: false,
        IsFileError: false,
        agreementId_session: req.session.agreement_id,
        stage2_value
      };
      
      if (pricingSchedule != undefined) {
       delete req.session["pricingSchedule"];
        if (errorList==null) {
          errorList=[];
        }
        if (pricingSchedule.IsDocumentError && pricingSchedule.rfp_confirm_upload) {
          errorList.push({ text: "The buyer must confirm they understand the statement by ticking the box", href: "#" })
          fileError=true;
        }
        if (pricingSchedule.IsDocumentError && pricingSchedule.IsFile) {
          errorList.push({ text: "Pricing schedule must be uploaded", href: "#" });
          fileError=true;
        }
      }
      if (fileObjectIsEmpty) {
        fileError=true;
        errorList.push({ text: "Please choose file before proceeding ", href: "#" })
        delete req.session["fileObjectIsEmpty"];
      }
      if (fileDuplicateError) {
        fileError=true;
        errorList.push({ text: "The chosen file already exist ", href: "#" })
        delete req.session["fileDuplicateError"];
      }
      
      if (fileError && errorList !== null) {
        
        windowAppendData = Object.assign({}, { ...windowAppendData, fileError: true, errorlist: errorList });
      }
      
      
      if (fileNameStoragePricing != undefined && fileNameStoragePricing != null && fileNameStoragePricing.length > 0) {
        req.session['isTcUploaded'] = true;
      }
      else {
        if(agreementId_session == 'RM6187') { //MCF3
          if (selectedRoute === 'DA' || selectedRoute === 'FC'){
            await TenderApi.Instance(SESSION_ID).put(`journeys/${EventId}/steps/32`, 'In progress');
            }
          }
          if(agreementId_session == 'RM1557.13') {
            await TenderApi.Instance(SESSION_ID).put(`journeys/${EventId}/steps/32`, 'In progress');
          }
        req.session['isTcUploaded'] = false;
      }

      // if (FETCH_FILEDATA != undefined && FETCH_FILEDATA != null && FETCH_FILEDATA.length > 0) {
      //   req.session['isTcUploaded'] = true;
      // }
      // else {
      //   req.session['isTcUploaded'] = false;
      // }
      if (selectedRoute !=undefined && selectedRoute !=null && selectedRoute !="" && selectedRoute.toUpperCase() === 'FC') selectedRoute.toUpperCase() = 'RFP';
      if (selectedRoute !=undefined && selectedRoute !=null && selectedRoute !=""&& selectedRoute.toUpperCase() === 'FCA') selectedRoute.toUpperCase() = 'CA';
      
      if(selectedRoute == 'dos'){
        if(stage2_value !== undefined && stage2_value === "Stage 2"){
          let flag = await ShouldEventStatusBeUpdated(eventId, 30, req);
          if (flag) {
            await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/30`, 'In progress');
          }
        }
      }
      
      res.render(`${selectedRoute.toLowerCase()}-uploadAttachment`, windowAppendData);
      
    } catch (error) {
      delete error?.config?.['headers'];
      const Logmessage = {
        Person_id: TokenDecoder.decoder(SESSION_ID),
        error_location: `${req.headers.host}${req.originalUrl}`,
        sessionId: 'null',
        error_reason: `Attachment uploading Causes Problem in ${selectedRoute}  - Tenders Api throws error`,
        exception: error,
      };
      const Log = new LogMessageFormatter(
        Logmessage.Person_id,
        Logmessage.error_location,
        Logmessage.sessionId,
        Logmessage.error_reason,
        Logmessage.exception,
      );
      LoggTracer.errorTracer(Log, res);
    }
  }
};
