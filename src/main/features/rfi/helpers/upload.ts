//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/RFI/offline-doc.json'
import {DynamicFrameworkInstance} from '../util/fetch/dyanmicframeworkInstance'
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';





export const FILEUPLOADHELPER: express.Handler = async (req: express.Request, res: express.Response, fileError: boolean, errorList) => {
    const lotId = req.session?.lotId;
    const {SESSION_ID} = req.cookies;
    const agreementLotName = req.session.agreementLotName;
    const ProjectId = req.session['projectId'];
    const EventId = req.session['eventId'];
    const {file_id} =req.query;
    if(file_id !== undefined){
          try {
          const FileDownloadURL = `/tenders/projects/${ProjectId}/events/${EventId}/documents/${file_id}`
          const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {responseType: 'blob'});
          const file = FetchDocuments;
          const fileName = file.headers["content-disposition"].split("filename=")[1].split('"').join("");
          const type = file.headers['content-type']
          const pipeline = util.promisify(stream.pipeline);
          const charset = type.split(";")[1].split("charset=");
          const fileData = file.data;
          const fileTemporaryPath = 'uploads/downloads/'+fileName;
          await pipeline(fileData, fileSystem.createWriteStream(fileTemporaryPath));

          res.download(fileTemporaryPath, (err)=>{
            if(err){
              delete error?.config?.['headers'];
              const Logmessage = {
                Person_id: TokenDecoder.decoder(SESSION_ID),
                error_location: `${req.headers.host}${req.originalUrl}`,
                sessionId: 'null',
                error_reason: 'Error -Downloading File to the local Storage',
                exception: error,
              };
              const Log = new LogMessageFormatter(
                Logmessage.Person_id,
                Logmessage.error_location,
                Logmessage.sessionId,
                Logmessage.error_reason,
                Logmessage.exception,
              );
              fileSystem.unlinkSync(fileTemporaryPath);
              LoggTracer.errorTracer(Log, res);
            }else{
              fileSystem.unlinkSync(fileTemporaryPath);
            }
        
        })

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
    else{
      try {
        const FileuploadBaseUrl = `/tenders/projects/${ProjectId}/events/${EventId}/documents`
        const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FileuploadBaseUrl);
        const FETCH_FILEDATA = FetchDocuments.data;
        console.log(FETCH_FILEDATA)
        let windowAppendData = { lotId, agreementLotName, data: cmsData, files: FETCH_FILEDATA }
        if(fileError && errorList !== null){
          windowAppendData = Object.assign({}, {...windowAppendData, fileError: 'true', errorlist: errorList})
        }        
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

   
}