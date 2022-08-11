//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/requirements/rfp-upload-attachment.json';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';

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
  let { selectedRoute } = req.session;
  const { pricingSchedule } = req.session;
  const { file_id } = req.query;
  const {fileObjectIsEmpty}=req.session;
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
        if (file.description === "mandatory") {
          fileNameStoragePricing.push(file);
        }
      });
      const TOTALSUM = fileNameStoragePricing.reduce((a, b) => a + (b['fileSize'] || 0), 0);
      const releatedContent = req.session.releatedContent;
      let windowAppendData = {
        lotId,
        agreementLotName,
        data: cmsData,
        files: fileNameStoragePricing,
        releatedContent: releatedContent,
        storage: TOTALSUM,
        IsDocumentError: false,
        Rfp_confirm_upload: false,
        IsFileError: false,
      };
      
      if (pricingSchedule != undefined) {
       delete req.session["pricingSchedule"];
        if (errorList==null) {
          errorList=[];
        }
        if (pricingSchedule.IsDocumentError && pricingSchedule.rfp_confirm_upload) {
          errorList.push({ text: "You must confirm the statement.", href: "#rfp_confirm_upload" })
          fileError=true;
        }
        if (pricingSchedule.IsDocumentError && pricingSchedule.IsFile) {
          errorList.push({ text: "You must upload your pricing schedule.", href: "#rfp_offline_document" });
          fileError=true;
        }
      }
      if (fileObjectIsEmpty) {
        fileError=true;
        errorList.push({ text: "You must upload your pricing schedule.", href: "#" })
        delete req.session["fileObjectIsEmpty"];
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
      if (selectedRoute !=undefined && selectedRoute !=null && selectedRoute !="" && selectedRoute.toUpperCase() === 'FC') selectedRoute.toUpperCase() = 'RFP';
      if (selectedRoute !=undefined && selectedRoute !=null && selectedRoute !=""&& selectedRoute.toUpperCase() === 'FCA') selectedRoute.toUpperCase() = 'CA';
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
