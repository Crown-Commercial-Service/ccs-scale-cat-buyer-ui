//@ts-nocheck
import * as express from 'express';
import FormData from 'form-data';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';
import { ATTACHMENTUPLOADHELPER } from '../helpers/uploadAttachment';
import { FileValidations } from '../util/file/filevalidations';
import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';
import { logConstant } from '../../../common/logtracer/logConstant';

const tempArray = [];

// requirements Upload document
/**
 *
 * @param req
 * @param res
 * @GETController
 */

export const DA_GET_UPLOAD_ATTACHMENT: express.Handler = (req: express.Request, res: express.Response) => {
  ATTACHMENTUPLOADHELPER(req, res, false, null);
};

/**
 *
 * @param req
 * @param res
 * @POSTController
 */

export const DA_POST_UPLOAD_ATTACHMENT: express.Handler = async (req: express.Request, res: express.Response) => {
  let { selectedRoute } = req.session;

  if (selectedRoute === 'FC') selectedRoute = 'RFP';
  //if (selectedRoute === 'DA') selectedRoute = 'DA';
  //req.session.selectedRoute = 'DA';
  selectedRoute = 'RFP';

  const selRoute = selectedRoute.toLowerCase();
  const file_started = req.body[`${selRoute}_file_started`];
  const { SESSION_ID } = req.cookies;
  const ProjectId = req.session['projectId'];
  const EventId = req.session['eventId'];
  const journeyStatus = req.session['journey_status'];
  if (req.files != null && req.files != undefined) {
    const FILE_PUBLISHER_BASEURL = `/tenders/projects/${ProjectId}/events/${EventId}/documents`;
    const FileFilterArray = [];

    if (file_started) {
      const offline_document = req.files[`${selRoute}_offline_document`];
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
            formData.append('description', 'mandatoryfirst');
            formData.append('audience', 'supplier');
            const formHeaders = formData.getHeaders();
            try {
              // ------file duplicate check start
              const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FILE_PUBLISHER_BASEURL);
              //CAS-INFO-LOG
              LoggTracer.infoLogger(FetchDocuments, logConstant.getUploadDocument, req);

              const FETCH_FILEDATA = FetchDocuments.data;

              let duplicateFile = false;
              for (const item of FETCH_FILEDATA) {
                // if (item.description === "mandatoryfirst") {
                if (item.fileName == file.name) {
                  duplicateFile = true;
                }
                // }
              }
              // ------file duplicate check end
              if (duplicateFile) {
                req.session['isTcUploaded'] = false;
                req.session['fileDuplicateError'] = true;
                FileFilterArray.push({
                  href: '#documents_upload',
                  text: fileName,
                });
                ATTACHMENTUPLOADHELPER(req, res, true, FileFilterArray);
              } else {
                const response = await DynamicFrameworkInstance.file_Instance(SESSION_ID).put(
                  FILE_PUBLISHER_BASEURL,
                  formData,
                  {
                    headers: {
                      ...formHeaders,
                    },
                  }
                );
                //CAS-INFO-LOG
                LoggTracer.infoLogger(response, logConstant.UploadDocumentUpdated, req);
              }
            } catch (error) {
              LoggTracer.errorLogger(
                res,
                error,
                `${req.headers.host}${req.originalUrl}`,
                null,
                TokenDecoder.decoder(SESSION_ID),
                'DA Multiple File Upload Error',
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
          ATTACHMENTUPLOADHELPER(req, res, true, FileFilterArray);
        } else {
          //res.redirect(`/${selRoute}/upload-doc`);
          res.redirect('/da/upload-doc');
        }
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
          formData.append('description', 'mandatoryfirst');
          formData.append('audience', 'supplier');
          const formHeaders = formData.getHeaders();
          try {
            // ------file duplicate check start
            const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FILE_PUBLISHER_BASEURL);
            //CAS-INFO-LOG
            LoggTracer.infoLogger(FetchDocuments, logConstant.getUploadDocument, req);

            const FETCH_FILEDATA = FetchDocuments.data;
            let duplicateFile = false;
            for (const item of FETCH_FILEDATA) {
              // if (item.description === "mandatoryfirst") {
              if (item.fileName == offline_document.name) {
                duplicateFile = true;
              }
              // }
            }
            // ------file duplicate check end
            if (duplicateFile) {
              req.session['isTcUploaded'] = false;
              req.session['fileDuplicateError'] = true;
              FileFilterArray.push({
                href: '#documents_upload',
                text: fileName,
              });
              ATTACHMENTUPLOADHELPER(req, res, true, FileFilterArray);
            } else {
              const response = await DynamicFrameworkInstance.file_Instance(SESSION_ID).put(
                FILE_PUBLISHER_BASEURL,
                formData,
                {
                  headers: {
                    ...formHeaders,
                  },
                }
              );
              //CAS-INFO-LOG
              LoggTracer.infoLogger(response, logConstant.UploadDocumentUpdated, req);
              req.session['isTcUploaded'] = true;
              // res.redirect(`/${selRoute}/upload-attachment`);
              res.redirect('/da/upload-attachment');
            }
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
          FileFilterArray.push({
            href: '#documents_upload',
            text: fileName,
          });

          ATTACHMENTUPLOADHELPER(req, res, true, FileFilterArray);
        }
      }
    } else res.render('error/500');
  } else {
    req.session['fileObjectIsEmpty'] = true;
    res.redirect(req.url);
    //const journey = journeyStatus.find(journey => journey.step === 37)?.state; // check step number
    //const routeRedirect = journey === 'Optional' ? `/${selRoute}/suppliers` : `/${selRoute}/upload-doc`;
    //res.redirect(routeRedirect);
  }
};

export const DA_GET_REMOVE_FILES_ATTACHMENT = (express.Handler = async (
  req: express.Request,
  res: express.Response
) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const EventId = req.session['eventId'];
  const { file_id } = req.query;
  const baseURL = `/tenders/projects/${projectId}/events/${EventId}/documents/${file_id}`;
  try {
    const response = await DynamicFrameworkInstance.Instance(SESSION_ID).delete(baseURL);
    //CAS-INFO-LOG
    LoggTracer.infoLogger(response, logConstant.UploadDocumentDeleted, req);
    res.redirect('/da/upload-attachment');
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'DA Remove document failed',
      true
    );
  }
});

export const DA_POST_UPLOAD_ATTACHMENT_PROCEED = (express.Handler = async (
  req: express.Request,
  res: express.Response
) => {
  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;
  const { eventId } = req.session;
  let { selectedRoute } = req.session;
  //const rfp_confirm_upload = req.body.rfp_confirm_upload;
  if (selectedRoute === 'FC') selectedRoute = 'RFP';
  if (selectedRoute === 'DA') selectedRoute = 'DA';
  // if (req.session.selectedRoute === 'DA')  selectedRoute = 'DA';
  const step = selectedRoute.toLowerCase() === 'da' ? 32 : 71; // check step number changed step 37 to 30 balwinder

  const FILE_PUBLISHER_BASEURL = `/tenders/projects/${projectId}/events/${eventId}/documents`;
  const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FILE_PUBLISHER_BASEURL);
  //CAS-INFO-LOG
  LoggTracer.infoLogger(FetchDocuments, logConstant.getUploadDocument, req);

  const FETCH_FILEDATA = FetchDocuments?.data;
  const fileNameStorageTermsnCond = [];
  const fileNameStoragePricing = [];
  const additionalfile = [];
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
  });

  if (fileNameStorageTermsnCond.length > 0 && fileNameStoragePricing.length > 0) {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/${step}`, 'Completed');

    const flag = await ShouldEventStatusBeUpdated(eventId, 33, req);
    //if(flag)
    //{

    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/33`, 'Not started');
    //}

    // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/${step}`, 'Completed');
    // let flag=await ShouldEventStatusBeUpdated(eventId,31,req);
    // if(flag)
    // {
    // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/31`, 'Not started');
    // }
  }

  if (req.session['isTcUploaded']) {
    // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/${step}`, 'In progress');
    //     let flag=await ShouldEventStatusBeUpdated(eventId,33,req);
    //   if(flag)
    //   {
    //   await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/33`, 'Cannot start yet');
    //   }
    //  res.redirect(`/${selectedRoute.toLowerCase()}/upload-doc`);
    res.redirect('/da/upload-doc');
  } else {
    req.session['pricingSchedule'] = { IsDocumentError: true, IsFile: !req.session['isTcUploaded'] ? true : false };
    res.redirect('/da/upload-attachment');
  }
});
