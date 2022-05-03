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

let tempArray = [];

// requirements Upload document
/**
 *
 * @param req
 * @param res
 * @GETController
 */

export const RFP_GET_UPLOAD_ATTACHMENT: express.Handler = (req: express.Request, res: express.Response) => {
  ATTACHMENTUPLOADHELPER(req, res, false, null);
};

/**
 *
 * @param req
 * @param res
 * @POSTController
 */

export const RFP_POST_UPLOAD_ATTACHMENT: express.Handler = async (req: express.Request, res: express.Response) => {
  let { selectedRoute } = req.session;
  if (selectedRoute === 'FC') selectedRoute = 'RFP';

  const selRoute = selectedRoute.toLowerCase();
  const file_started = req.body[`${selRoute}_file_started`];
  const { SESSION_ID } = req.cookies;
  const ProjectId = req.session['projectId'];
  const EventId = req.session['eventId'];
  const journeyStatus = req.session['journey_status'];

  if (!req.files) {
    const journey = journeyStatus.find(journey => journey.step === 37)?.state; // check step number
    const routeRedirect = journey === 'Optional' ? `/${selRoute}/suppliers` : `/${selRoute}/upload-doc`;
    res.redirect(routeRedirect);
  }
  

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
          formData.append('description', file.name);
          formData.append('audience', 'buyer');
          const formHeaders = formData.getHeaders();
          try {
            await DynamicFrameworkInstance.file_Instance(SESSION_ID).put(FILE_PUBLISHER_BASEURL, formData, {
              headers: {
                ...formHeaders,
              },
            });
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
        ATTACHMENTUPLOADHELPER(req, res, true, FileFilterArray);
      } else {
        res.redirect(`/${selRoute}/upload-doc`);
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
        formData.append('description', offline_document.name);
        formData.append('audience', 'buyer');
        const formHeaders = formData.getHeaders();
        try {
          await DynamicFrameworkInstance.file_Instance(SESSION_ID).put(FILE_PUBLISHER_BASEURL, formData, {
            headers: {
              ...formHeaders,
            },
          });
          req.session['isTcUploaded'] = true
          res.redirect(`/${selRoute}/upload-attachment`);
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
          );
          LoggTracer.errorTracer(Log, res);
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
};

export const RFP_GET_REMOVE_FILES_ATTACHMENT = (express.Handler = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies //jwt
  const { projectId } = req.session
  const EventId = req.session['eventId']
  const { file_id } = req.query
  const baseURL = `/tenders/projects/${projectId}/events/${EventId}/documents/${file_id}`
  try {
    await DynamicFrameworkInstance.Instance(SESSION_ID).delete(baseURL)
    res.redirect(`/rfp/upload-attachment`)
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
});

export const RFP_POST_UPLOAD_ATTACHMENT_PROCEED = (express.Handler = async (
  req: express.Request,
  res: express.Response,
) => {
  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;
  let { selectedRoute } = req.session;
  const rfp_confirm_upload =req.body.rfp_confirm_upload;
  if (selectedRoute === 'FC') selectedRoute = 'RFP';
  const step = selectedRoute.toLowerCase() === 'rfp' ? 37 : 71; // check step number
  if (req.session['isTcUploaded'] && rfp_confirm_upload ==="confirm") {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/${step}`, 'Completed');
    res.redirect(`/${selectedRoute.toLowerCase()}/upload-doc`);
  }else{
    req.session["pricingSchedule"]={"IsDocumentError":true,"IsFile":req.session['isTcUploaded'],"rfp_confirm_upload":rfp_confirm_upload ==undefined ?false:true};
    res.redirect(`/rfp/upload-attachment`);
  }
  
});
