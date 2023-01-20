//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/da/da-upload-attachment.json';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import * as Mcf3cmsData from '../../../resources/content/da/upload-additional.json';
import { logConstant } from '../../../common/logtracer/logConstant';

export const ADDITIONALUPLOADHELPER: express.Handler = async (
  req: express.Request,
  res: express.Response,
  fileError: boolean,
  errorList,
) => {
  const lotId = req.session?.lotId;
  const { SESSION_ID } = req.cookies;
  const agreementLotName = req.session.agreementLotName;
  const agreementName = req.session.agreementName;
  const project_name = req.session.project_name;
  const ProjectId = req.session['projectId'];
  const EventId = req.session['eventId'];
  let { selectedRoute } = req.session;
  const { pricingSchedule } = req.session;
  const { file_id } = req.query;
  const {fileObjectIsEmpty}=req.session;
  const {fileDuplicateError}=req.session;
  errorList=errorList ==undefined ||errorList==null?[]:errorList;
  const lotid = lotId;

  if (file_id !== undefined) {
    try {
      const FileDownloadURL = `/tenders/projects/${ProjectId}/events/${EventId}/documents/${file_id}`;
      const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {
        responseType: 'arraybuffer',
      });
      //CAS-INFO-LOG
      LoggTracer.infoLogger(FetchDocuments, logConstant.getUploadDocument, req);
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
      if (FetchDocuments != undefined && FetchDocuments != null && FetchDocuments.length > 0) {
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
        error_reason: `Additional uploading Causes Problem in ${selectedRoute}  - Tenders Api throws error`,
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
      //CAS-INFO-LOG
      LoggTracer.infoLogger(FetchDocuments, logConstant.getUploadDocument, req);
      const FETCH_FILEDATA = FetchDocuments.data;

      let fileNameadditional = [];
      let fileNameStorageTermsnCond=[];
      let fileNameStoragePricing=[];
      FETCH_FILEDATA?.map(file => {
       
        // if (file.description === "mandatoryfirst") {
        //   fileNameStoragePricing.push(file.fileName);
        // }
        // if (file.description === "mandatorysecond") {
        //   fileNameStorageTermsnCond.push(file.fileName);
        // }

        if (file.description === "optional") {
          fileNameadditional.push(file);
        }
        


      });
      const TOTALSUM = fileNameadditional.reduce((a, b) => a + (b['fileSize'] || 0), 0);
      const releatedContent = req.session.releatedContent;

      const agreementId_session = req.session.agreement_id;
    let forceChangeDataJson;
    if(agreementId_session == 'RM6187') { //MCF3
      forceChangeDataJson = Mcf3cmsData;
    } else { 
      forceChangeDataJson = cmsData;
    }
      let windowAppendData = {
        lotId,
        agreementLotName,
        data: forceChangeDataJson,
        files: fileNameadditional,
        releatedContent: releatedContent,
        storage: TOTALSUM,
        IsDocumentError: false,
        Rfp_confirm_upload: false,
        IsFileError: false,
        agreementId_session: req.session.agreement_id,
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
        errorList.push({ text: "Please choose file before proceeding", href: "#" })
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
    
      if (FETCH_FILEDATA != undefined && FETCH_FILEDATA != null && FETCH_FILEDATA.length > 0) {
        req.session['isTcUploaded'] = true;
      }
      else {
        req.session['isTcUploaded'] = false;
      }
      selectedRoute='RFP';
      if (selectedRoute !=undefined && selectedRoute !=null && selectedRoute !="" && selectedRoute.toUpperCase() === 'FC') selectedRoute.toUpperCase() = 'RFP';
      if (selectedRoute !=undefined && selectedRoute !=null && selectedRoute !=""&& selectedRoute.toUpperCase() === 'PA') selectedRoute.toUpperCase() = 'CA';
      if (selectedRoute !=undefined && selectedRoute !=null && selectedRoute !="" && selectedRoute.toUpperCase() === 'DA') selectedRoute.toUpperCase() = 'DA';
      const projectId = req.session['projectId'];

      
      res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotId };
      // res.render(`${selectedRoute.toLowerCase()}-uploadAdditional`, windowAppendData);
      //CAS-INFO-LOG
      LoggTracer.infoLogger(null, logConstant.eoiUploadDocumentPageLog, req);
      res.render(`daw-uploadAdditional`, windowAppendData);
    } catch (error) {
     
      delete error?.config?.['headers'];
      const Logmessage = {
        Person_id: TokenDecoder.decoder(SESSION_ID),
        error_location: `${req.headers.host}${req.originalUrl}`,
        sessionId: 'null',
        error_reason: `Additional uploading Causes Problem in ${selectedRoute}  - Tenders Api throws error`,
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
