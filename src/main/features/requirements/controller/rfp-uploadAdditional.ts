//@ts-nocheck
import * as express from 'express';
import FormData from 'form-data';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';
import { ADDITIONALUPLOADHELPER } from '../helpers/uploadAdditional';
import { FileValidations } from '../util/file/filevalidations';
import * as cmsData from '../../../resources/content/requirements/offline-doc.json';
// import Mcf3cmsData from '../../../resources/content/MCF3/eoi/upload-additional.json';

import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';
let tempArray = [];

/**
 *
 * @Rediect
 * @param req
 * @param res
 *
 *
 */


export const RFP_GET_UPLOAD_ADDITIONAL: express.Handler = async (req: express.Request, res: express.Response) => {
  ADDITIONALUPLOADHELPER(req, res, false, null);
}

export const RFP_POST_UPLOAD_ADDITIONAL: express.Handler = async (req: express.Request, res: express.Response) => {
  let { selectedRoute,stage2_value } = req.session;
  if (selectedRoute === 'FC') selectedRoute = 'RFP';
  if (selectedRoute === 'dos') selectedRoute = 'RFP';

  const selRoute = selectedRoute.toLowerCase();
  const file_started = req.body[`${selRoute}_file_started`];

  const { SESSION_ID } = req.cookies;
  const ProjectId = req.session['projectId'];
  const EventId = req.session['eventId'];
  //const journeyStatus = req.session['journey_status'];

  if (req.files != undefined && req.files != null) {
    const FILE_PUBLISHER_BASEURL = `/tenders/projects/${ProjectId}/events/${EventId}/documents`;
    const FileFilterArray = [];

    if (file_started) {
      const offline_document = req.files[`${selRoute}_offline_document`] || req.files[`${selRoute}_attachment_document`];

      const multipleFileCheck = Array.isArray(offline_document);
      if (multipleFileCheck) {
        for (const file of offline_document) {
          const fileName = file.name;
          const fileMimeType = file.mimetype;
          const fileSize = file.size;

          const validateMimeType = FileValidations.formatValidation(fileMimeType);
          const validateFileSize = FileValidations.sizeValidation(fileSize);

          if (validateMimeType && validateFileSize) {
            const formData = new FormData();
            formData.append('data', file.data, {
              contentType: file.mimetype,
              filename: file.name,
            });
            if(stage2_value == 'Stage 2'){
              formData.append('description', 'mandatorysecond');
            }else{
              formData.append('description', 'optional');
            }
            
            formData.append('audience', 'supplier');
            const formHeaders = formData.getHeaders();
            try {
              // ------file duplicate check start
              const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FILE_PUBLISHER_BASEURL);
              const FETCH_FILEDATA = FetchDocuments.data;

              let duplicateFile = false;
              for (const item of FETCH_FILEDATA) {
                // if (item.description === "optional") {
                if (item.fileName == file.name) {
                  duplicateFile = true;
                }
                // }
              }
              // ------file duplicate check end
              if (duplicateFile) {
                req.session['isAssessUploaded'] = false
                req.session["fileDuplicateError"] = true;
                FileFilterArray.push({
                  href: '#documents_upload',
                  text: fileName,
                });
                ADDITIONALUPLOADHELPER(req, res, true, FileFilterArray);
              } else {
                await DynamicFrameworkInstance.file_Instance(SESSION_ID).put(FILE_PUBLISHER_BASEURL, formData, {
                  headers: {
                    ...formHeaders,
                  },
                });
                req.session['isAssessUploaded'] = true
              }
            } catch (error) {
              LoggTracer.errorLogger(
                res,
                error,
                `${req.headers.host}${req.originalUrl}`,
                null,
                TokenDecoder.decoder(SESSION_ID),
                'Multiple File Upload Error',
                false,
              );
            }
          } else {
            FileFilterArray.push({
              href: '#documents_upload',
              text: fileName,
            });
          }
        }

        if (FileFilterArray.length > 0) {
          ADDITIONALUPLOADHELPER(req, res, true, FileFilterArray);
        } else res.redirect(`/${selRoute}/upload-additional`);
      } else {
        const fileName = offline_document.name;
        const fileMimeType = offline_document.mimetype;
        const fileSize = offline_document.size;

        const validateMimeType = FileValidations.formatValidation(fileMimeType);
        const validateFileSize = FileValidations.sizeValidation(fileSize);

        if (validateMimeType && validateFileSize) {
          const formData = new FormData();
          formData.append('data', offline_document.data, {
            contentType: offline_document.mimetype,
            filename: offline_document.name,
          });
          if(stage2_value == 'Stage 2'){
            formData.append('description', 'mandatorysecond');
          }else{
            formData.append('description', 'optional');
          }
          formData.append('audience', 'supplier');
          const formHeaders = formData.getHeaders();
          try {
            // ------file duplicate check start
            const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FILE_PUBLISHER_BASEURL);
            const FETCH_FILEDATA = FetchDocuments.data;

            let duplicateFile = false;
            for (const item of FETCH_FILEDATA) {
              // if (item.description === "optional") {
              if (item.fileName == offline_document.name) {
                duplicateFile = true;
              }
              // }
            }
            // ------file duplicate check end
            if (duplicateFile) {
              req.session['isAssessUploaded'] = false
              req.session["fileDuplicateError"] = true;
              FileFilterArray.push({
                href: '#documents_upload',
                text: fileName,
              });
              ADDITIONALUPLOADHELPER(req, res, true, FileFilterArray);
            } else {
              await DynamicFrameworkInstance.file_Instance(SESSION_ID).put(FILE_PUBLISHER_BASEURL, formData, {
                headers: {
                  ...formHeaders,
                },
              });
              res.redirect(`/${selRoute}/upload-additional`);
            }
          } catch (error) {
            delete error?.config?.['headers'];
            const Logmessage = {
              Person_id: TokenDecoder.decoder(SESSION_ID),
              error_location: `${req.headers.host}${req.originalUrl}`,
              sessionId: 'null',
              error_reason: `File uploading Causes Problem in ${selRoute}  - Tenders Api throws error`,
              exception: error,
            };
            const Log = new LogMessageFormatter(
              Logmessage.Person_id,
              Logmessage.error_location,
              Logmessage.sessionId,
              Logmessage.error_reason,
              Logmessage.exception,
              Logmessage.sessionId
            );
            LoggTracer.errorTracer(Log, res);
          }
        } else {
          FileFilterArray.push({
            href: '#documents_upload',
            text: fileName,
          });

          ADDITIONALUPLOADHELPER(req, res, true, FileFilterArray);
        }
      }
    } else {
      res.render('error/500')
    };
  } else {
    req.session["fileObjectIsEmpty"] = true;
    res.redirect(req.url);
    //res.redirect(`/${selRoute}/rfp/upload-additional`);
    //const journey = journeyStatus.find(journey => journey.step === 37)?.state;
    //const routeRedirect = journey === 'Optional' ? `/${selRoute}/suppliers` : `/${selRoute}/rfp/upload-additional`;
    //res.redirect(routeRedirect);
  }


};

export const RFP_GET_REMOVE_FILES: express.Handler = async (req: express.Request, res: express.Response) => {
  let { selectedRoute } = req.session
  if (selectedRoute === 'FC') selectedRoute = 'RFP'
  const { SESSION_ID } = req.cookies //jwt
  const { projectId } = req.session
  const EventId = req.session['eventId']
  const { file_id } = req.query
  const baseURL = `/tenders/projects/${projectId}/events/${EventId}/documents/${file_id}`

  try {
    await DynamicFrameworkInstance.Instance(SESSION_ID).delete(baseURL)
    res.redirect(`/${selectedRoute.toLowerCase()}/upload-additional`)
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Remove document failed',
      true,
    );
  }
};

export const RFP_POST_UPLOAD_ADDITIONAL_PROCEED: express.Handler = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, eventId } = req.session;
  const agreementId_session = req.session.agreement_id;
  let { selectedRoute, stage2_value } = req.session;
  try {
    if (req.session['isAssessUploaded']) {


      if (selectedRoute === 'FC') selectedRoute = 'RFP';
      if (selectedRoute === 'dos') selectedRoute = 'RFP';
      let DefaultJID;
      if (agreementId_session == 'RM1043.8') {  //XBN00121
        DefaultJID = 31;
      } else {
        DefaultJID = 32;
      }
      let step = selectedRoute.toLowerCase() === 'rfp' ? DefaultJID : 71;

      const FILE_PUBLISHER_BASEURL = `/tenders/projects/${projectId}/events/${eventId}/documents`;
      const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FILE_PUBLISHER_BASEURL);
      const FETCH_FILEDATA = FetchDocuments?.data;
      let fileNameStorageTermsnCond = [];
      let fileNameStoragePricing = [];
      let additionalfile = [];
      FETCH_FILEDATA?.map(file => {

        if (file.description === "mandatoryfirst") {
          fileNameStoragePricing.push(file.fileName);
        }
        if (file.description === "mandatorysecond") {
          fileNameStorageTermsnCond.push(file.fileName);
        }
        if (file.description === "optional") {
          additionalfile.push(file.fileName);
        }
      });

      if (agreementId_session !== 'RM1043.8') {
        if (fileNameStorageTermsnCond.length > 0 && fileNameStoragePricing.length > 0) {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/${step}`, 'Completed');
          let flag = await ShouldEventStatusBeUpdated(eventId, 33, req);
          //if(flag) {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/33`, 'Not started');
          //} 
          res.redirect(`/rfp/IR35`);
        } else {
          res.redirect(`/rfp/upload`);
        }
      } else {
        let nextStep = 32;
        if (stage2_value !== undefined && stage2_value === "Stage 2") {
          step = 32;
          nextStep = 33;
        }
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/${step}`, 'Completed');
        let flag = await ShouldEventStatusBeUpdated(eventId, nextStep, req);
        if (flag) {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/${nextStep}`, 'Not started');
        }
        res.redirect(`/rfp/task-list`);
      }
    } else {
      if(agreementId_session === 'RM1043.8' && stage2_value == "Stage 2"){
        req.session["assessDocument"] = { "IsDocumentError": true, "IsFile": req.session['isAssessUploaded'] ? true : false };
        res.redirect(`/rfp/upload-additional`);
      }else{
        res.redirect(`/rfp/task-list`); 
      }
    }
  } catch (err) {
  }
};


