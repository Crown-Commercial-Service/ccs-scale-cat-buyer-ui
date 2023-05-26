//@ts-nocheck
import * as express from 'express';
import FormData from 'form-data';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';
import { ADDITIONALUPLOADHELPER_DOC } from '../helpers/uploadAdditionalDoc';
import { FileValidations } from '../util/file/filevalidations';
import * as cmsData from '../../../resources/content/requirements/offline-doc.json';
// import Mcf3cmsData from '../../../resources/content/MCF3/eoi/upload-additional.json';
import { logConstant } from '../../../common/logtracer/logConstant';

import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';
const tempArray = [];

/**
 *
 * @Rediect
 * @param req
 * @param res
 *
 *
 */

export const RFP_GET_UPLOAD_ADDITIONAL_DOC: express.Handler = async (req: express.Request, res: express.Response) => {
  ADDITIONALUPLOADHELPER_DOC(req, res, false, null);
};

export const RFP_POST_UPLOAD_ADDITIONAL_DOC: express.Handler = async (req: express.Request, res: express.Response) => {
  const { stage2_value } = req.session;
  let { selectedRoute } = req.session;
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
      const offline_document =
        req.files[`${selRoute}_offline_document`] || req.files[`${selRoute}_attachment_document`];

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

            // if(stage2_value == 'Stage 2'){
            //   formData.append('description', 'mandatorysecond');
            // }else{
            formData.append('description', 'secondoptional');
            //}

            formData.append('audience', 'supplier');
            const formHeaders = formData.getHeaders();
            try {
              // ------file duplicate check start
              const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FILE_PUBLISHER_BASEURL);
              const FETCH_FILEDATA = FetchDocuments.data;

              //CAS-INFO-LOG
              LoggTracer.infoLogger(FETCH_FILEDATA, logConstant.getUploadDocument, req);

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
                req.session['isAssessUploaded'] = false;
                req.session['fileDuplicateError'] = true;
                FileFilterArray.push({
                  href: '#documents_upload',
                  text: fileName,
                });
                ADDITIONALUPLOADHELPER_DOC(req, res, true, FileFilterArray);
              } else {
                await DynamicFrameworkInstance.file_Instance(SESSION_ID).put(FILE_PUBLISHER_BASEURL, formData, {
                  headers: {
                    ...formHeaders,
                  },
                });
                // req.session['isAssessUploaded'] = true

                //CAS-INFO-LOG
                LoggTracer.infoLogger(null, logConstant.UploadDocumentUpdated, req);
              }
            } catch (error) {
              LoggTracer.errorLogger(
                res,
                error,
                `${req.headers.host}${req.originalUrl}`,
                null,
                TokenDecoder.decoder(SESSION_ID),
                'Multiple File Upload Error',
                false
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
          ADDITIONALUPLOADHELPER_DOC(req, res, true, FileFilterArray);
        } else res.redirect(`/${selRoute}/upload-additional-doc`);
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
          // if(stage2_value == 'Stage 2'){
          //   formData.append('description', 'mandatorysecond');
          // }else{
          formData.append('description', 'secondoptional');
          //}
          formData.append('audience', 'supplier');
          const formHeaders = formData.getHeaders();
          try {
            // ------file duplicate check start
            const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FILE_PUBLISHER_BASEURL);
            const FETCH_FILEDATA = FetchDocuments.data;

            //CAS-INFO-LOG
            LoggTracer.infoLogger(FETCH_FILEDATA, logConstant.getUploadDocument, req);

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
              // req.session['isAssessUploaded'] = false
              req.session['fileDuplicateError'] = true;
              FileFilterArray.push({
                href: '#documents_upload',
                text: fileName,
              });
              ADDITIONALUPLOADHELPER_DOC(req, res, true, FileFilterArray);
            } else {
              await DynamicFrameworkInstance.file_Instance(SESSION_ID).put(FILE_PUBLISHER_BASEURL, formData, {
                headers: {
                  ...formHeaders,
                },
              });

              //CAS-INFO-LOG
              LoggTracer.infoLogger(null, logConstant.UploadDocumentUpdated, req);

              res.redirect(`/${selRoute}/upload-additional-doc`);
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

          ADDITIONALUPLOADHELPER_DOC(req, res, true, FileFilterArray);
        }
      }
    } else {
      res.render('error/500');
    }
  } else {
    console.log('file else');
    req.session['fileObjectIsEmpty'] = true;
    res.redirect(req.url);
    //res.redirect(`/${selRoute}/rfp/upload-additional`);
    //const journey = journeyStatus.find(journey => journey.step === 37)?.state;
    //const routeRedirect = journey === 'Optional' ? `/${selRoute}/suppliers` : `/${selRoute}/rfp/upload-additional`;
    //res.redirect(routeRedirect);
  }
};

export const RFP_GET_REMOVE_ADDITIONAL_DOC_FILES: express.Handler = async (
  req: express.Request,
  res: express.Response
) => {
  let { selectedRoute } = req.session;
  if (selectedRoute === 'FC') selectedRoute = 'RFP';
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const EventId = req.session['eventId'];
  const { file_id } = req.query;
  const baseURL = `/tenders/projects/${projectId}/events/${EventId}/documents/${file_id}`;

  try {
    await DynamicFrameworkInstance.Instance(SESSION_ID).delete(baseURL);

    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.UploadDocumentDeleted, req);

    res.redirect(`/${selectedRoute.toLowerCase()}/upload-additional-doc`);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Remove document failed',
      true
    );
  }
};

export const RFP_POST_UPLOAD_ADDITIONAL_DOC_PROCEED: express.Handler = async (
  req: express.Request,
  res: express.Response
) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, eventId } = req.session;
  const agreementId_session = req.session.agreement_id;
  const { stage2_value } = req.session;
  let { selectedRoute } = req.session;

  try {
    if (req.session['isAssessUploaded']) {
      if (selectedRoute === 'FC') selectedRoute = 'RFP';
      if (selectedRoute === 'dos') selectedRoute = 'RFP';
      let DefaultJID;
      if (agreementId_session == 'RM1043.8') {
        //XBN00121
        DefaultJID = 31;
      } else {
        DefaultJID = 32;
      }
      const step = selectedRoute.toLowerCase() === 'rfp' ? DefaultJID : 71;

      const FILE_PUBLISHER_BASEURL = `/tenders/projects/${projectId}/events/${eventId}/documents`;
      const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FILE_PUBLISHER_BASEURL);
      const FETCH_FILEDATA = FetchDocuments?.data;

      //CAS-INFO-LOG
      LoggTracer.infoLogger(FETCH_FILEDATA, logConstant.getUploadDocument, req);

      const fileNameStorageTermsnCond = [];
      const fileNameStoragePricing = [];
      const additionalfile = [];
      const additionalDocfile = [];
      FETCH_FILEDATA?.map((file) => {
        if (file.description === 'mandatoryfirst') {
          fileNameStoragePricing.push(file.fileName);
        }
        if (file.description === 'mandatorysecond') {
          fileNameStorageTermsnCond.push(file.fileName);
        }
        if (file.description === 'optional') {
          additionalfile.push(file.fileName);
        }
        if (file.description === 'secondoptional') {
          additionalDocfile.push(file.fileName);
        }
      });

      res.redirect('/rfp/task-list');
    } else {
      if (agreementId_session === 'RM1043.8' && stage2_value == 'Stage 2') {
        res.redirect('/rfp/task-list');
      } else {
        if (agreementId_session === 'RM1043.8' && stage2_value == 'Stage 1') {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/31`, 'Completed');
        }
        res.redirect('/rfp/task-list');
      }
    }
  } catch (err) {
    // Do nothing if there is an error
  }
};
