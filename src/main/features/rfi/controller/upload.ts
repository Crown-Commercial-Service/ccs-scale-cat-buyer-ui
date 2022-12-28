//@ts-nocheck
import * as express from 'express';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import FormData from 'form-data';
import { FileValidations } from '../util/file/filevalidations';
import { FILEUPLOADHELPER } from '../helpers/upload';
import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';

// RFI Upload document
/**
 *
 * @param req
 * @param res
 * @GETController
 */

export const GET_UPLOAD_DOC: express.Handler = async (req: express.Request, res: express.Response) => {
  FILEUPLOADHELPER(req, res, false, null);
};

/**
 *
 * @param req
 * @param res
 * @POSTController
 */

export const POST_UPLOAD_DOC: express.Handler = async (req: express.Request, res: express.Response) => {
  const { rfi_file_started } = req.body;
  const { SESSION_ID } = req.cookies;
  const ProjectId = req.session['projectId'];
  const EventId = req.session['eventId'];
  const journeyStatus = req.session['journey_status'];

  if (!req.files) {
    const journey = journeyStatus.find(journey => journey.step === 11)?.state;
    const routeRedirect = journey === 'Optional' ? '/rfi/suppliers' : '/rfi/upload-doc';
    res.redirect(routeRedirect);
  } else {
    const FILE_PUBLISHER_BASEURL = `/tenders/projects/${ProjectId}/events/${EventId}/documents`;
    const FileFilterArray = [];

    if (rfi_file_started) {
      const { rfi_offline_document } = req.files;

      const multipleFileCheck = Array.isArray(rfi_offline_document);
      if (multipleFileCheck) {
        for (const file of rfi_offline_document) {
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
           for(const item of FETCH_FILEDATA){
               if(item.fileName == file.name){
                 duplicateFile = true;
               }
           }
           // ------file duplicate check end
           if(duplicateFile){
             req.session['isTcUploaded'] = false
             req.session["fileDuplicateError"]=true;
             FileFilterArray.push({
               href: '#documents_upload',
               text: fileName,
             });
             FILEUPLOADHELPER(req, res, true, FileFilterArray);
           }else{
              await DynamicFrameworkInstance.file_Instance(SESSION_ID).put(FILE_PUBLISHER_BASEURL, formData, {
                headers: {
                  ...formHeaders,
                },
              });
            }
            } catch (error) {
              LoggTracer.errorLogger(
                res,
                error,
                `${req.headers.host}${req.originalUrl}`,
                null,
                TokenDecoder.decoder(SESSION_ID),
                'RFI - Multiple File Upload Error',
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
        } else res.redirect('/rfi/upload-doc');
      } else {
        const fileName = rfi_offline_document.name;
        const fileMimeType = rfi_offline_document.mimetype;
        const fileSize = rfi_offline_document.size;

        const validateMimeType = FileValidations.formatValidation(fileMimeType);
        const validateFileSize = FileValidations.sizeValidation(fileSize);

        if (validateMimeType && validateFileSize) {
          const formData = new FormData();
          formData.append('data', rfi_offline_document.data, {
            contentType: rfi_offline_document.mimetype,
            filename: rfi_offline_document.name,
          });
          formData.append('description', rfi_offline_document.name);
          formData.append('audience', 'supplier');
          const formHeaders = formData.getHeaders();
          try {
            // ------file duplicate check start
           const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FILE_PUBLISHER_BASEURL);
           const FETCH_FILEDATA = FetchDocuments.data;

           let duplicateFile = false;
           for(const item of FETCH_FILEDATA){
               if(item.fileName == rfi_offline_document.name){
                 duplicateFile = true;
               }
           }
           // ------file duplicate check end
           if(duplicateFile){
             req.session['isTcUploaded'] = false
             req.session["fileDuplicateError"]=true;
             FileFilterArray.push({
               href: '#documents_upload',
               text: fileName,
             });
             FILEUPLOADHELPER(req, res, true, FileFilterArray);
           }else{
            await DynamicFrameworkInstance.file_Instance(SESSION_ID).put(FILE_PUBLISHER_BASEURL, formData, {
              headers: {
                ...formHeaders,
              },
            });
            res.redirect('/rfi/upload-doc');
            }
          } catch (error) {
            delete error?.config?.['headers'];
            const Logmessage = {
              Person_id: TokenDecoder.decoder(SESSION_ID),
              error_location: `${req.headers.host}${req.originalUrl}`,
              sessionId: 'null',
              error_reason: 'File uploading Causes Problem in RFI  - Tenders Api throws error',
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
  }
};

export const GET_REMOVE_FILES = (express.Handler = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies //jwt
  const { projectId } = req.session
  const EventId = req.session['eventId']
  const { file_id } = req.query
  const baseURL = `/tenders/projects/${projectId}/events/${EventId}/documents/${file_id}`
  try {
    await DynamicFrameworkInstance.Instance(SESSION_ID).delete(baseURL)
    res.redirect('/rfi/upload-doc')
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'RFI - Remove document failed',
      true,
    );
  }

});

///rfi/upload-doc/procceed
export const POST_UPLOAD_PROCEED = (express.Handler = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { eventId,agreement_id } = req.session;
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/11`, 'Completed');
  res.redirect('/rfi/suppliers');
});
