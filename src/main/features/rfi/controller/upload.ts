//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/RFI/offline-doc.json'
import {DynamicFrameworkInstance} from '../util/fetch/dyanmicframeworkInstance'
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import FormData from 'form-data'
import fileSystem from 'fs'




let tempArray = [];



// RFI Upload document
/**
 * 
 * @param req 
 * @param res 
 * @GETController
 */

export const GET_UPLOAD_DOC: express.Handler = async (req: express.Request, res: express.Response) => {
      const lotId = req.session?.lotId;
      const {SESSION_ID} = req.cookies;
      const agreementLotName = req.session.agreementLotName;
      const ProjectId = req.session['projectId'];
      const EventId = req.session['eventId'];
      const {file_id, name} =req.query;

      if(file_id !== undefined){
            const FileDownloadURL = `/tenders/projects/${ProjectId}/events/${EventId}/documents/${file_id}`
            const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {responseType: 'blob'});
            const file = FetchDocuments;
            const fileName = file.headers["content-disposition"].split("filename=")[1].split('"').join("");
            const type = file.headers['content-type']

            const directory = '/uploads/temporary/'+fileName;
            const fileData = file.data.toString('utf-8')

            fileSystem.appendFile(directory, fileData, function (err) {
                  if (err) throw err;
                  console.log('File is created successfully.');
                  const filef = directory
           
                  res.download(filef);

                });
                
             
      }

      try {
            const FileuploadBaseUrl = `/tenders/projects/${ProjectId}/events/${EventId}/documents`
            const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FileuploadBaseUrl);
            const FETCH_FILEDATA = FetchDocuments.data;
            const windowAppendData = { lotId, agreementLotName, data: cmsData, files: FETCH_FILEDATA }
            res.render('uploadDocument', windowAppendData);
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
}

/**
 * 
 * @param req 
 * @param res 
 * @POSTController
 */


export const POST_UPLOAD_DOC : express.Handler = async (req: express.Request, res: express.Response) => {
      const {rfi_file_started} = req.body;
      const {SESSION_ID} = req.cookies;
      const ProjectId = req.session['projectId'];
      const EventId = req.session['eventId'];
      const FILE_PUBLISHER_BASEURL = `/tenders/projects/${ProjectId}/events/${EventId}/documents`
   

      if(rfi_file_started){
        const {rfi_offline_document} = req.files;
        const fileName = rfi_offline_document.name;
        const fileTemporaryPath = 'uploads/'
        rfi_offline_document.mv(fileTemporaryPath + fileName, async (err)=> {
          if (err){
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
                    await DynamicFrameworkInstance.file_Instance(SESSION_ID).put(FILE_PUBLISHER_BASEURL, formData, {headers: {...formHeaders}});
                    fileSystem.unlinkSync(formDataReadPath);
                    res.redirect('/rfi/upload-doc')
  
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

        });
      
            
      }
      else res.render('error/500')
}


export const GET_REMOVE_FILES = express.Handler = (req: express.Request, res: express.Response) => {
      const {file} = req.query;
      tempArray = tempArray.filter((afile)=> afile.name !== file);
      res.redirect('/rfi/upload-doc')
}