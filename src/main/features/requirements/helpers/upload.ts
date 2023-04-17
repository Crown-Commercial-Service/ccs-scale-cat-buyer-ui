//@ts-nocheck
import * as express from 'express';
import * as cmsDataDcp from '../../../resources/content/requirements/offline-doc.json';
import * as cmsDataMCF from '../../../resources/content/MCF3/requirements/offline-doc.json';
import * as cmsDataDOS from '../../../resources/content/MCF3/requirements/DOSoffline-doc.json';
import * as cmsDataGCloud from '../../../resources/content/requirements/GCLOUDoffline-doc.json';

import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';
import { logConstant } from '../../../common/logtracer/logConstant';

export const FILEUPLOADHELPER: express.Handler = async (
  req: express.Request,
  res: express.Response,
  fileError: boolean,
  errorList,
) => {
 // req.session.uploaderrorStatus = false;
  const lotId = req.session?.lotId;
  const { SESSION_ID } = req.cookies;
  const agreementLotName = req.session.agreementLotName;
  const ProjectId = req.session['projectId'];
  const EventId = req.session['eventId'];
  let { selectedRoute,stage2_value } = req.session;
  const {fileObjectIsEmpty}=req.session;
  const {fileDuplicateError}=req.session;
  const { file_id } = req.query;
  const { termsNcond } = req.session;
  errorList=errorList ==undefined ||errorList==null?[]:errorList;
  if (file_id !== undefined) {
    
    try {
      const FileDownloadURL = `/tenders/projects/${ProjectId}/events/${EventId}/documents/${file_id}`;
      const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {
        responseType: 'arraybuffer',
      });
      const file = FetchDocuments;
      
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
      res.send(fileData);
    } catch (error) {
      delete error?.config?.['headers'];
      const Logmessage = {
        Person_id: TokenDecoder.decoder(SESSION_ID),
        error_location: `${req.headers.host}${req.originalUrl}`,
        sessionId: 'null',
        error_reason: `File uploading Causes Problem in ${selectedRoute}  - Tenders Api throws error`,
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
      
      //CAS-INFO-LOG 
      LoggTracer.infoLogger(FETCH_FILEDATA, logConstant.getUploadDocument, req);

      let fileNameStorageTermsNcond = [];

      fileNameStorageTermsNcond=[];
      FETCH_FILEDATA?.map(file => {
        if(stage2_value == "Stage 2"){
          if (file.description === "mandatorysecond") {
            fileNameStorageTermsNcond.push(file);
          }
        }else{
          if (file.description === "mandatorysecond") {
            fileNameStorageTermsNcond.push(file);
          }
        }
      });
      

      

      const TOTALSUM = fileNameStorageTermsNcond.reduce((a, b) => a + (b['fileSize'] || 0), 0);
      const releatedContent = req.session.releatedContent;

      // const TOTALSUM = FETCH_FILEDATA.reduce((a, b) => a + (b['fileSize'] || 0), 0);
      // const releatedContent = req.session.releatedContent;

      let cmsData;
      if(req.session.agreement_id == 'RM6187') {
        //MCF3
        cmsData = cmsDataMCF;
      } else if(req.session.agreement_id == 'RM6263') {
        //DSP
        cmsData = cmsDataDcp;
      } else if(req.session.agreement_id == 'RM1043.8') {
        //DSP
        cmsData = cmsDataDOS;
      }
      else if(req.session.agreement_id == 'RM1557.13') {
        //DSP
        cmsData = cmsDataGCloud;
      }
      
      const agreement_id =req.session.agreement_id;
      let windowAppendData = {
        lotId,
        agreementLotName,
        data: cmsData,
        files: fileNameStorageTermsNcond,
        releatedContent: releatedContent,
        storage: TOTALSUM,
        agreement_id:agreement_id,
      };
     
      if (termsNcond != undefined) {
        delete req.session["termsNcond"];
         if (errorList==null) {
           errorList=[];
         }
        console.log('termsNcond',termsNcond) 
         if (termsNcond.IsDocumentError && !termsNcond.IsFile) {
           errorList.push({ text: "Upload your core terms, call-off order form and schedules", href: "#rfp_offline_document" });
           fileError=true;
         }
       }

      // if(req.session.uploaderrorStatus==false){
      //   fileError=true;
      //   errorList.push({ text: "Please choose file before proceeding", href: "#" })
      //   delete req.session["fileObjectIsEmpty"] 
      // }

      if (fileObjectIsEmpty) {
        fileError=true;
        errorList.push({ text: "Please choose file before proceeding", href: "#upload_doc_form" })
        delete req.session["fileObjectIsEmpty"]
      }
      if (fileDuplicateError) {
        fileError=true;
        errorList.push({ text: "The chosen file already exist ", href: "#" })
        delete req.session["fileDuplicateError"];
      }
      if (fileError && errorList !== null) {
        windowAppendData = Object.assign({}, { ...windowAppendData, fileError: 'true', errorlist: errorList });
      }
      
     
      if (fileNameStorageTermsNcond != undefined && fileNameStorageTermsNcond != null && fileNameStorageTermsNcond.length > 0) {
        req.session['isTcUploaded'] = true;
      }
      else {
        req.session['isTcUploaded'] = false;
        const agreementId_session = req.session.agreement_id;
        if(agreementId_session == 'RM6187') { //MCF3
          if (selectedRoute === 'DA' || selectedRoute === 'FC'){
          await TenderApi.Instance(SESSION_ID).put(`journeys/${EventId}/steps/32`, 'In progress');
          }
          }
      }

      if (selectedRoute === 'FC') selectedRoute = 'RFP';
      if (selectedRoute === 'dos') selectedRoute = 'RFP';

      if(req.session.selectedRoute == 'RFP'){
        if(stage2_value !== undefined && stage2_value === "Stage 2"){
          let flag = await ShouldEventStatusBeUpdated(eventId, 31, req);
          if (flag) {
            await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/31`, 'In progress');
          }
        }
      }
      
      console.log("upload");
       
      //CAS-INFO-LOG
      LoggTracer.infoLogger(null, logConstant.uploadTermsAndConditionsPageLog, req);

      res.render(`${selectedRoute.toLowerCase()}-uploadDocument`, windowAppendData);
    } catch (error) {
      delete error?.config?.['headers'];
      const Logmessage = {
        Person_id: TokenDecoder.decoder(SESSION_ID),
        error_location: `${req.headers.host}${req.originalUrl}`,
        sessionId: 'null',
        error_reason: `File uploading Causes Problem in ${selectedRoute}  - Tenders Api throws error`,
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
