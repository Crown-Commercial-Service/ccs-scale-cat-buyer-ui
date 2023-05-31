//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/requirements/rfp-upload-attachment.json';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import * as Mcf3cmsData from '../../../resources/content/MCF3/eoi/upload-additional.json';
import * as GCloudcmsData from '../../../resources/content/requirements/gcloud-upload-additional.json';
import * as dosData from '../../../resources/content/requirements/dos-rfp-upload-attachment.json';
import * as dosStage2Data from '../../../resources/content/requirements/dos-upload-assessment.json';
import { logConstant } from '../../../common/logtracer/logConstant';

export const ADDITIONALUPLOADHELPER: express.Handler = async (
  req: express.Request,
  res: express.Response,
  fileError: boolean,
  errorList
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
  const { fileObjectIsEmpty } = req.session;
  const { fileDuplicateError } = req.session;
  const { assessDocument } = req.session;
  errorList = errorList == undefined || errorList == null ? [] : errorList;
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
        req.session['isAssessUploaded'] = true;
      } else {
        req.session['isAssessUploaded'] = false;
      }
      res.send(fileData);
    } catch (error) {
      console.log(error);
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
        Logmessage.exception
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

      const fileNameadditional = [];
      const fileNameStorageTermsnCond = [];
      const fileNameStoragePricing = [];
      const stage2_value = req.session.stage2_value;
      FETCH_FILEDATA?.map((file) => {
        // if (file.description === "mandatoryfirst") {
        //   fileNameStoragePricing.push(file.fileName);
        // }
        // if (file.description === "mandatorysecond") {
        //   fileNameStorageTermsnCond.push(file.fileName);
        // }
        if (stage2_value == 'Stage 2') {
          if (file.description === 'mandatorythird') {
            fileNameadditional.push(file);
          }
        } else {
          if (file.description === 'optional') {
            fileNameadditional.push(file);
          }
        }
      });
      const FILEDATA_NEW = FETCH_FILEDATA.filter((anItem) => anItem.description == 'mandatorythird');
      const TOTALSUM = fileNameadditional.reduce((a, b) => a + (b['fileSize'] || 0), 0);
      const releatedContent = req.session.releatedContent;

      const agreementId_session = req.session.agreement_id;
      let forceChangeDataJson;
      if (agreementId_session == 'RM6187') {
        //MCF3
        forceChangeDataJson = Mcf3cmsData;
      } else if (agreementId_session == 'RM1043.8') {
        //DOS
        forceChangeDataJson = dosData;
        if (stage2_value !== undefined && stage2_value === 'Stage 2') {
          forceChangeDataJson = dosStage2Data;
        }
      } else if (agreementId_session == 'RM1557.13') {
        //GCloud
        forceChangeDataJson = GCloudcmsData;
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
        stage2_value,
      };

      if (assessDocument != undefined) {
        delete req.session['assessDocument'];
        if (errorList == null) {
          errorList = [];
        }

        if (assessDocument.IsDocumentError && !assessDocument.IsFile) {
          if (agreementId_session == 'RM1043.8' && stage2_value == 'Stage 2') {
            errorList.push({ text: 'Upload assessment documents', href: '#rfp_offline_document' });
          } else {
            errorList.push({ text: 'You must upload assessment documents.', href: '#rfp_offline_document' });
          }
          fileError = true;
        }
      }

      if (pricingSchedule != undefined) {
        delete req.session['pricingSchedule'];
        if (errorList == null) {
          errorList = [];
        }

        if (pricingSchedule.IsDocumentError && pricingSchedule.IsFile) {
          errorList.push({ text: 'Pricing schedule must be uploaded', href: '#' });
          fileError = true;
        }
      }
      if (fileObjectIsEmpty) {
        fileError = true;
        if (req.session?.agreement_id == 'RM1043.8' && stage2_value !== undefined && stage2_value === 'Stage 2') {
          errorList.push({ text: 'Select a file to upload', href: '#' });
        } else {
          errorList.push({ text: 'Please choose file before proceeding', href: '#upload_doc_form' });
        }
        delete req.session['fileObjectIsEmpty'];
      }
      if (fileDuplicateError) {
        fileError = true;
        errorList.push({ text: 'The selected file has already been uploaded ', href: '#' });
        delete req.session['fileDuplicateError'];
      }
      if (fileError && errorList !== null) {
        windowAppendData = Object.assign({}, { ...windowAppendData, fileError: true, errorlist: errorList });
      }
      if (stage2_value == 'Stage 2') {
        if (FILEDATA_NEW != undefined && FILEDATA_NEW != null && FILEDATA_NEW.length > 0) {
          req.session['isAssessUploaded'] = true;
        } else {
          req.session['isAssessUploaded'] = false;
        }
      } else {
        if (FETCH_FILEDATA != undefined && FETCH_FILEDATA != null && FETCH_FILEDATA.length > 0) {
          req.session['isAssessUploaded'] = true;
        } else {
          req.session['isAssessUploaded'] = false;
        }
      }

      // if (fileNameStoragePricing != undefined && fileNameStoragePricing != null && fileNameStoragePricing.length > 0) {

      //   req.session['isTcUploaded'] = true;
      // }
      // else {

      //   req.session['isTcUploaded'] = false;
      // }

      if (
        selectedRoute != undefined &&
        selectedRoute != null &&
        selectedRoute != '' &&
        selectedRoute.toUpperCase() === 'FC'
      )
        selectedRoute.toUpperCase() = 'RFP';
      if (selectedRoute != undefined && selectedRoute != null && selectedRoute != '' && selectedRoute === 'dos')
        selectedRoute = 'RFP';
      if (
        selectedRoute != undefined &&
        selectedRoute != null &&
        selectedRoute != '' &&
        selectedRoute.toUpperCase() === 'FCA'
      )
        selectedRoute.toUpperCase() = 'CA';
      const lotid = lotId;
      const projectId = req.session['projectId'];
      const agreementIdSession = agreementId_session;
      const projectName = project_name;
      res.locals.agreement_header = {
        agreementName,
        projectName,
        projectId,
        agreementIdSession,
        agreementLotName,
        lotid,
      };
      if (req.session.selectedRoute == 'dos') {
        if (stage2_value !== undefined && stage2_value === 'Stage 2') {
          const flag = await ShouldEventStatusBeUpdated(eventId, 32, req);
          if (flag) {
            await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/32`, 'In progress');
          }
        }
      }
      console.log('Additional');
      //CAS-INFO-LOG
      LoggTracer.infoLogger(null, logConstant.uploadAdditionalPageLog, req);

      res.render(`${selectedRoute.toLowerCase()}-uploadAdditional`, windowAppendData);
    } catch (error) {
      console.log(error);
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
        Logmessage.exception
      );
      LoggTracer.errorTracer(Log, res);
    }
  }
};
