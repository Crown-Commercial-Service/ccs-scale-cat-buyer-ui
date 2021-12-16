//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/RFI/offline-doc.json'
import {DynamicFrameworkInstance} from '../util/fetch/dyanmicframeworkInstance'
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import FormData from 'form-data'
import fileSystem from 'fs'
import util from 'util'
import stream from 'stream';
import {FileValidations} from '../util/file/filevalidations'
import {FILEUPLOADHELPER} from '../helpers/upload'

// RFI Upload document
/**
 * 
 * @param req 
 * @param res 
 * @GETController
 */

export const GET_UPLOAD_DOC: express.Handler = async (req: express.Request, res: express.Response) => {
  FILEUPLOADHELPER(req, res, false, null)
}

/**
 * 
 * @param req 
 * @param res 
 * @POSTController
 */


 export const POST_UPLOAD_DOC: express.Handler = async (req: express.Request, res: express.Response) => {
  const {
      rfi_file_started
  } = req.body;
  const {
      SESSION_ID
  } = req.cookies;
  const ProjectId = req.session['projectId'];
  const EventId = req.session['eventId'];
  const FILE_PUBLISHER_BASEURL = `/tenders/projects/${ProjectId}/events/${EventId}/documents`

  const FileFilterArray = [];

  if (rfi_file_started) {
      const {
          rfi_offline_document
      } = req.files;

      const multipleFileCheck = Array.isArray(rfi_offline_document);
      if (multipleFileCheck) {
          for (const file of rfi_offline_document) {
              const fileName = file.name;
              const fileTemporaryPath = 'uploads/upload/';

              const fileMimeType = file.mimetype;
              const fileSize = file.size;
    
              const validateMimeType = FileValidations.formatValidation(fileMimeType);
              const validateFileSize = FileValidations.sizeValidation(fileSize);
              
              if(validateMimeType && validateFileSize)
              {
                file.mv(fileTemporaryPath + fileName, async (err) => {
                  if (err) {
                    LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
                    TokenDecoder.decoder(SESSION_ID), "Multiple File Upload Error", false)
                  }
                  const formData = new FormData();
                  const formDataReadPath = fileTemporaryPath + fileName;
                  const fileReadStream = fileSystem.createReadStream(formDataReadPath);
                  formData.append("data", fileReadStream);
                  formData.append("description", file.name)
                  formData.append("audience", "buyer")
                  const formHeaders = formData.getHeaders();
                  try {
                      await DynamicFrameworkInstance.file_Instance(SESSION_ID).put(FILE_PUBLISHER_BASEURL, formData, {
                          headers: {
                              ...formHeaders
                          }
                      });
                      fileSystem.unlinkSync(formDataReadPath);

                  } catch (error) {
                      LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
                          TokenDecoder.decoder(SESSION_ID), "Multiple File Upload Error", false)
                  }
              });
               

              }
              else{
                FileFilterArray.push({
                  "href": "#documents_upload",
                  "text" : fileName
                })
              }           

          }

          if(FileFilterArray.length > 0){
            FILEUPLOADHELPER(req, res, true, FileFilterArray);
          }
          else  res.redirect('/rfi/upload-doc')

         
      } else {
          const fileName = rfi_offline_document.name;
          const fileTemporaryPath = 'uploads/upload/'
          const fileMimeType = rfi_offline_document.mimetype;
          const fileSize = rfi_offline_document.size;

          const validateMimeType = FileValidations.formatValidation(fileMimeType);
          const validateFileSize = FileValidations.sizeValidation(fileSize);


          if(validateMimeType && validateFileSize)
          {
            rfi_offline_document.mv(fileTemporaryPath + fileName, async (err) => {
              if (err) {
                  res.render('error/500')
              }
              const formData = new FormData();
              const formDataReadPath = fileTemporaryPath + fileName;
              const fileReadStream = fileSystem.createReadStream(formDataReadPath);
              formData.append("data", fileReadStream);
              formData.append("description", rfi_offline_document.name)
              formData.append("audience", "buyer")
              const formHeaders = formData.getHeaders();
              try {
                  await DynamicFrameworkInstance.file_Instance(SESSION_ID).put(FILE_PUBLISHER_BASEURL, formData, {
                      headers: {
                          ...formHeaders
                      }
                  });
                  fileSystem.unlinkSync(formDataReadPath);
                  res.redirect('/rfi/upload-doc')
              } catch (error) {
                 fileSystem.unlinkSync(formDataReadPath);
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
          });
          }

          else{
            FileFilterArray.push({
              "href": "#documents_upload",
              "text" : fileName
            })

            FILEUPLOADHELPER(req, res, true, FileFilterArray);

          }
         
      }

  } else res.render('error/500')
}


export const GET_REMOVE_FILES = express.Handler = (req: express.Request, res: express.Response) => {
      res.redirect('/rfi/upload-doc')
}


///rfi/upload-doc/procceed
export const POST_UPLOAD_PROCCEED = express.Handler = (req: express.Request, res: express.Response) => {
  res.redirect('/rfi/suppliers')
}