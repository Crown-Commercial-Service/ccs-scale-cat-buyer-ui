//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/requirements/rfp-upload-attachment.json';
import * as Mcf3cmsData from '../../../resources/content/MCF3/requirements/rfp-upload-attachment.json';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';
import { logConstant } from '../../../common/logtracer/logConstant';

export const ATTACHMENTUPLOADHELPER: express.Handler = async (
  req: express.Request,
  res: express.Response,
  fileError: boolean,
  errorList
) => {
  const lotId = req.session?.lotId;
  const { SESSION_ID } = req.cookies;
  const agreementLotName = req.session.agreementLotName;
  const ProjectId = req.session['projectId'];
  const EventId = req.session['eventId'];
  const { selectedRoute } = req.session;
  const { pricingSchedule } = req.session;
  const { file_id } = req.query;
  const { fileObjectIsEmpty } = req.session;
  const { fileDuplicateError } = req.session;
  errorList = errorList == undefined || errorList == null ? [] : errorList;
  if (file_id !== undefined) {
    try {
      const FileDownloadURL = `/tenders/projects/${ProjectId}/events/${EventId}/documents/${file_id}`;
      const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {
        responseType: 'arraybuffer',
      });
      //CAS-INFO-LOG
      LoggTracer.infoLogger(FetchDocuments, logConstant.getUploadDocument, req);

      const file = FetchDocuments;
      const fileNameStoragePricing = [];
      FetchDocuments.data?.map((file) => {
        if (file.description === 'mandatoryfirst') {
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
      LoggTracer.errorLogger(
        res,
        error,
        null,
        null,
        null,
        null,
        false
      );
    }
  } else {
    try {
      const FileuploadBaseUrl = `/tenders/projects/${ProjectId}/events/${EventId}/documents`;
      const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FileuploadBaseUrl);
      //CAS-INFO-LOG
      LoggTracer.infoLogger(FetchDocuments, logConstant.getUploadDocument, req);
      const FETCH_FILEDATA = FetchDocuments.data;
      const fileNameStoragePricing = [];
      FETCH_FILEDATA?.map((file) => {
        if (file.description === 'mandatoryfirst') {
          fileNameStoragePricing.push(file);
        }
      });
      const TOTALSUM = fileNameStoragePricing.reduce((a, b) => a + (b['fileSize'] || 0), 0);
      const releatedContent = req.session.releatedContent;

      const agreementId_session = req.session.agreement_id;
      let forceChangeDataJson;
      if (agreementId_session == 'RM6187') {
        //MCF3
        forceChangeDataJson = Mcf3cmsData;
      } else {
        forceChangeDataJson = cmsData;
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
      };

      if (pricingSchedule != undefined) {
        delete req.session['pricingSchedule'];
        if (errorList == null) {
          errorList = [];
        }

        if (pricingSchedule.IsDocumentError && pricingSchedule.IsFile) {
          errorList.push({ text: 'Pricing schedule must be uploaded', href: '#rfp_offline_document' });
          fileError = true;
        }
      }
      if (fileObjectIsEmpty) {
        fileError = true;
        errorList.push({ text: 'Please choose file before proceeding', href: '#upload_doc_form' });
        delete req.session['fileObjectIsEmpty'];
      }
      if (fileDuplicateError) {
        fileError = true;
        errorList.push({ text: 'The chosen file already exist ', href: '#' });
        delete req.session['fileDuplicateError'];
      }
      if (fileError && errorList !== null) {
        windowAppendData = Object.assign({}, { ...windowAppendData, fileError: true, errorlist: errorList });
      }
      if (fileNameStoragePricing != undefined && fileNameStoragePricing != null && fileNameStoragePricing.length > 0) {
        req.session['isTcUploaded'] = true;
      } else {
        req.session['isTcUploaded'] = false;
        if (agreementId_session == 'RM6187') {
          //MCF3
          await TenderApi.Instance(SESSION_ID).put(`journeys/${EventId}/steps/32`, 'In progress');
        }
      }

      if (
        selectedRoute != undefined &&
        selectedRoute != null &&
        selectedRoute != '' &&
        selectedRoute.toUpperCase() === 'FC'
      )
        selectedRoute.toUpperCase() = 'RFP';
      if (
        selectedRoute != undefined &&
        selectedRoute != null &&
        selectedRoute != '' &&
        selectedRoute.toUpperCase() === 'FCA'
      )
        selectedRoute.toUpperCase() = 'CA';

      // if (selectedRoute !=undefined && selectedRoute !=null && selectedRoute !=""&& selectedRoute.toUpperCase() === 'DA')
      // selectedRoute.toUpperCase() = 'DA';

      // res.render(`${selectedRoute.toLowerCase()}-uploadAttachment`, windowAppendData);
      //CAS-INFO-LOG
      LoggTracer.infoLogger(null, logConstant.eoiUploadDocumentPageLog, req);
      res.render('daw-uploadAttachment', windowAppendData);
    } catch (error) {
      LoggTracer.errorLogger(
        res,
        error,
        null,
        null,
        null,
        null,
        false
      );
    }
  }
};
