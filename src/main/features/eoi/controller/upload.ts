//@ts-nocheck
import * as express from 'express';
import { FILEUPLOADHELPER } from '../../eoi/helpers/upload';
import { FileValidations } from '../../eoi/util/file/filevalidations';
import FormData from 'form-data';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { DynamicFrameworkInstance } from '../../eoi/util/fetch/dyanmicframeworkInstance';
import { TenderApi } from './../../../common/util/fetch/tenderService/tenderApiInstance';

let tempArray = [];

// eoi Upload document
/**
 *
 * @param req
 * @param res
 * @GETController
 */

export const GET_UPLOAD_DOC: express.Handler = (req: express.Request, res: express.Response) => {
  FILEUPLOADHELPER(req, res, false, null, 'eoi');
};

/**
 *
 * @param req
 * @param res
 * @POSTController
 */

export const POST_UPLOAD_DOC: express.Handler = async (req: express.Request, res: express.Response) => {
  const { eoi_file_started } = req.body;
  const { SESSION_ID } = req.cookies;
  const ProjectId = req.session['projectId'];
  const EventId = req.session['eventId'];
  const journeyStatus = req.session['journey_status'];

  if (!req.files) {
    const journey = journeyStatus.find(journey => journey.step === 21)?.state;
    const routeRedirect = journey === 'Optional' ? '/eoi/suppliers' : '/eoi/upload-doc';
    res.redirect(routeRedirect);
  }

  const FILE_PUBLISHER_BASEURL = `/tenders/projects/${ProjectId}/events/${EventId}/documents`;
  const FileFilterArray = [];

  if (eoi_file_started) {
    const { eoi_offline_document } = req.files;

    const multipleFileCheck = Array.isArray(eoi_offline_document);
    if (multipleFileCheck) {
      for (const file of eoi_offline_document) {
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
        FILEUPLOADHELPER(req, res, true, FileFilterArray);
      } else res.redirect('/eoi/upload-doc');
    } else {
      const fileName = eoi_offline_document.name;
      const fileMimeType = eoi_offline_document.mimetype;
      const fileSize = eoi_offline_document.size;

      const validateMimeType = FileValidations.formatValidation(fileMimeType);
      const validateFileSize = FileValidations.sizeValidation(fileSize);

      if (validateMimeType && validateFileSize) {
        const formData = new FormData();
        formData.append('data', eoi_offline_document.data, {
          contentType: eoi_offline_document.mimetype,
          filename: eoi_offline_document.name,
        });
        formData.append('description', eoi_offline_document.name);
        formData.append('audience', 'supplier');
        const formHeaders = formData.getHeaders();
        try {
          await DynamicFrameworkInstance.file_Instance(SESSION_ID).put(FILE_PUBLISHER_BASEURL, formData, {
            headers: {
              ...formHeaders,
            },
          });
          res.redirect('/eoi/upload-doc');
        } catch (error) {
          delete error?.config?.['headers'];
          const Logmessage = {
            Person_id: TokenDecoder.decoder(SESSION_ID),
            error_location: `${req.headers.host}${req.originalUrl}`,
            sessionId: 'null',
            error_reason: 'File uploading Causes Problem in EOI  - Tenders Api throws error',
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
  } else res.render('error/500');
};

export const GET_REMOVE_FILES = (express.Handler = (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies //jwt
  const { projectId } = req.session
  const EventId = req.session['eventId']
  const { file_id } = req.query
  const baseURL = `/tenders/projects/${projectId}/events/${EventId}/documents/${file_id}`
  try {
    await DynamicFrameworkInstance.Instance(SESSION_ID).delete(baseURL)
    res.redirect('/eoi/upload-doc')
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

export const POST_UPLOAD_PROCEED = (express.Handler = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;
  await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/21`, 'Completed');

  res.redirect('/eoi/suppliers');
});
