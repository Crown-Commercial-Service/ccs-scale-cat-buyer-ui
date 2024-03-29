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
import { logConstant } from '../../../common/logtracer/logConstant';

const tempArray = [];

// eoi Upload document
/**
 *
 * @param req
 * @param res
 * @GETController
 */

export const GET_UPLOAD_DOC: express.Handler = (req: express.Request, res: express.Response) => {
  FILEUPLOADHELPER(req, res, false, [], 'eoi');
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
  req.session.UploadError = false;

  if (!req.files) {
    const JourneyStatusUpload = await TenderApi.Instance(SESSION_ID).get(`journeys/${req.session.eventId}/steps`);
    const journeyStatus = JourneyStatusUpload?.data;
    const journey = journeyStatus?.find((journey) => journey.step === 21)?.state;
    //const routeRedirect = journey === 'Optional' ? '/eoi/suppliers' : '/eoi/upload-doc';
    const routeRedirect = '/eoi/upload-doc';
    req.session.UploadError = true;

    res.redirect(routeRedirect);
    // const journey = journeyStatus.find(journey => journey.step === 21)?.state;
    // const routeRedirect = journey === 'Optional' ? '/eoi/suppliers' : '/eoi/upload-doc';
    // res.redirect(routeRedirect);
  } else {
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
            formData.append('audience', 'supplier');
            const formHeaders = formData.getHeaders();
            try {
              // ------file duplicate check start
              const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FILE_PUBLISHER_BASEURL);
              const FETCH_FILEDATA = FetchDocuments.data;

              let duplicateFile = false;
              for (const item of FETCH_FILEDATA) {
                if (item.fileName == file.name) {
                  duplicateFile = true;
                }
              }
              // ------file duplicate check end
              if (duplicateFile) {
                req.session['isTcUploaded'] = false;
                req.session['fileDuplicateError'] = true;
                FileFilterArray.push({
                  href: '#documents_upload',
                  text: fileName,
                });
                FILEUPLOADHELPER(req, res, true, FileFilterArray);
              } else {
                await DynamicFrameworkInstance.file_Instance(SESSION_ID).put(FILE_PUBLISHER_BASEURL, formData, {
                  headers: {
                    ...formHeaders,
                  },
                });

                //CAS-INFO-LOG
                LoggTracer.infoLogger(null, logConstant.eoiUploadDocumentUpdated, req);
              }
            } catch (error) {
              LoggTracer.errorLogger(
                res,
                error,
                `${req.headers.host}${req.originalUrl}`,
                null,
                TokenDecoder.decoder(SESSION_ID),
                'EOI - Multiple File Upload Error',
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
            // ------file duplicate check start
            const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FILE_PUBLISHER_BASEURL);
            const FETCH_FILEDATA = FetchDocuments.data;

            let duplicateFile = false;
            for (const item of FETCH_FILEDATA) {
              if (item.fileName == eoi_offline_document.name) {
                duplicateFile = true;
              }
            }
            // ------file duplicate check end
            if (duplicateFile) {
              req.session['isTcUploaded'] = false;
              req.session['fileDuplicateError'] = true;
              FileFilterArray.push({
                href: '#documents_upload',
                text: fileName,
              });
              FILEUPLOADHELPER(req, res, true, FileFilterArray);
            } else {
              await DynamicFrameworkInstance.file_Instance(SESSION_ID).put(FILE_PUBLISHER_BASEURL, formData, {
                headers: {
                  ...formHeaders,
                },
              });

              //CAS-INFO-LOG
              LoggTracer.infoLogger(null, logConstant.UploadDocumentUpdated, req);

              res.redirect('/eoi/upload-doc');
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

          FILEUPLOADHELPER(req, res, true, FileFilterArray);
        }
      }
    } else res.render('error/500');
  }
};

export const GET_REMOVE_FILES = (express.Handler = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const EventId = req.session['eventId'];
  const { file_id } = req.query;
  const baseURL = `/tenders/projects/${projectId}/events/${EventId}/documents/${file_id}`;
  try {
    await DynamicFrameworkInstance.Instance(SESSION_ID).delete(baseURL);

    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.UploadDocumentDeleted, req);

    res.redirect('/eoi/upload-doc');
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'EOI - Remove document failed',
      true
    );
  }
});

export const POST_UPLOAD_PROCEED = (express.Handler = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { eventId } = req.session;
  await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/21`, 'Completed');

  res.redirect('/eoi/suppliers');
});
