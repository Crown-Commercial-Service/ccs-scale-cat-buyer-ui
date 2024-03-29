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

let tempArray = [];

// requirements Upload document
/**
 *
 * @param req
 * @param res
 * @GETController
 */

export const CA_GET_UPLOAD_DOC: express.Handler = (req: express.Request, res: express.Response) => {
  FILEUPLOADHELPER(req, res, false, null);
};

/**
 *
 * @param req
 * @param res
 * @POSTController
 */

export const CA_POST_UPLOAD_DOC: express.Handler = async (req: express.Request, res: express.Response) => {
  const { selectedRoute } = req.session;
  const selRoute = selectedRoute.toLowerCase();
  const file_started = req.body[`${selRoute}_file_started`];
  const { SESSION_ID } = req.cookies;
  const ProjectId = req.session['projectId'];
  const EventId = req.session['eventId'];
  const journeyStatus = req.session['journey_status'];

  if (!req.files) {
    const journey = journeyStatus.find((journey) => journey.step === 37)?.state;
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

        FILEUPLOADHELPER(req, res, true, FileFilterArray);
      }
    }
  } else res.render('error/500');
};

export const CA_GET_REMOVE_FILES = (express.Handler = (req: express.Request, res: express.Response) => {
  const { file } = req.query;
  const { selectedRoute } = req.session;
  tempArray = tempArray.filter((afile) => afile.name !== file);
  res.redirect(`/${selectedRoute.toLowerCase()}/upload-doc`);
});

export const CA_POST_UPLOAD_PROCEED = (express.Handler = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  try {
    const { eventId, selectedRoute } = req.session;
    const step = selectedRoute.toLowerCase() === 'rfp' ? 37 : 71;
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/${step}`, 'Completed');

    res.redirect(`/${selectedRoute.toLowerCase()}/task-list`);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Tender agreement failed to be added',
      true
    );
  }
});
