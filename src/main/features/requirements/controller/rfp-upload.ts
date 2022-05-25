//@ts-nocheck
import * as express from 'express';
import FormData from 'form-data';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';
import { FILEUPLOADHELPER } from '../helpers/upload';
import { FileValidations } from '../util/file/filevalidations';
import * as cmsData from '../../../resources/content/requirements/offline-doc.json';

let tempArray = [];

// requirements Upload document
/**
 *
 * @param req
 * @param res
 * @GETController
 */

export const RFP_GET_UPLOAD_DOC: express.Handler = (req: express.Request, res: express.Response) => {
  FILEUPLOADHELPER(req, res, false, null);
};

/**
 *
 * @param req
 * @param res
 * @POSTController
 */

export const RFP_POST_UPLOAD_DOC: express.Handler = async (req: express.Request, res: express.Response) => {
  let { selectedRoute } = req.session;
  if (selectedRoute === 'FC') selectedRoute = 'RFP';

  const selRoute = selectedRoute.toLowerCase();
  const file_started = req.body[`${selRoute}_file_started`];
  const { SESSION_ID } = req.cookies;
  const ProjectId = req.session['projectId'];
  const EventId = req.session['eventId'];
  const journeyStatus = req.session['journey_status'];

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
            formData.append('description', file.name);
            formData.append('audience', 'buyer');
            const formHeaders = formData.getHeaders();
            try {
              await DynamicFrameworkInstance.file_Instance(SESSION_ID).put(FILE_PUBLISHER_BASEURL, formData, {
                headers: {
                  ...formHeaders,
                },
              });
              req.session['isTcUploaded'] = true
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
          FILEUPLOADHELPER(req, res, true, FileFilterArray);
        } else res.redirect(`/${selRoute}/upload-doc`);
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
            res.redirect(`/${selRoute}/upload-doc`);
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

          FILEUPLOADHELPER(req, res, true, FileFilterArray);
        }
      }
    } else {
      res.render('error/500')
    };
  } else {
    req.session["fileObjectIsEmpty"] = true;
    res.redirect(req.url);
    //res.redirect(`/${selRoute}/upload-doc`);
    //const journey = journeyStatus.find(journey => journey.step === 37)?.state;
    //const routeRedirect = journey === 'Optional' ? `/${selRoute}/suppliers` : `/${selRoute}/upload-doc`;
    //res.redirect(routeRedirect);
  }


};

export const RFP_GET_REMOVE_FILES = (express.Handler = async (req: express.Request, res: express.Response) => {
  let { selectedRoute } = req.session
  if (selectedRoute === 'FC') selectedRoute = 'RFP'
  const { SESSION_ID } = req.cookies //jwt
  const { projectId } = req.session
  const EventId = req.session['eventId']
  const { file_id } = req.query
  const baseURL = `/tenders/projects/${projectId}/events/${EventId}/documents/${file_id}`
  try {
    await DynamicFrameworkInstance.Instance(SESSION_ID).delete(baseURL)
    res.redirect(`/${selectedRoute.toLowerCase()}/upload-doc`)
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

export const RFP_POST_UPLOAD_PROCEED = (express.Handler = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;
  const { selectedRoute } = req.session;

  if (req.session['isTcUploaded']) {
    if (selectedRoute === 'FC') selectedRoute = 'RFP';
    const step = selectedRoute.toLowerCase() === 'rfp' ? 30 : 71;
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/${step}`, 'Completed');
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/31`, 'Not started');
    res.redirect(`/rfp/IR35`);
  } else {
    const lotId = req.session?.lotId;
    const agreementLotName = req.session.agreementLotName;
    const releatedContent = req.session.releatedContent;
    let windowAppendData = {
      lotId,
      agreementLotName,
      data: cmsData,
      files: null,
      releatedContent: releatedContent,
      storage: 0,
    }
    windowAppendData = Object.assign({}, { ...windowAppendData, error: 'true' });
    res.render('rfp-uploadDocument.njk', windowAppendData)
  }

});
