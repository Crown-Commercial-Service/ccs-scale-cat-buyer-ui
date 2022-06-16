import * as express from 'express';
import * as cmsData from '../../../resources/content/requirements/rfp-eventpublished.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';


//@GET /rfp/event-sent
export const RFP_GET_EVENT_PUBLISHED  = async (req: express.Request, res: express.Response) => {
    const appendData = {
        data: cmsData,
        projPersistID: req.session['project_name'],
        rfi_ref_no : req.session.eventId
     }
    const { SESSION_ID } = req.cookies; //jwt
    const { projectId } = req.session;
    const {eventId} =req.session;
    const { download } = req.query;
    

try {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${req.session.eventId}/steps/2`, 'Completed');
    if(download!=undefined)
    {
      const FileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/documents/export`;
      const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {
        responseType: 'arraybuffer',
      });
      const file = FetchDocuments;
      const fileName = file.headers['content-disposition'].split('filename=')[1].split('"').join('');
      const fileData = file.data;
      const type = file.headers['content-type'];
      const ContentLength = file.headers['content-length'];
      res.status(200);
      res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': type,
        'Content-Length': ContentLength,
        'Content-Disposition': 'attachment; filename=' + fileName,
      });
      res.send(fileData);
    }
    else{
      res.render('rfp-eventpublished.njk', appendData)
    }
}catch (error) {
  LoggTracer.errorLogger(
    res,
    error,
    `${req.headers.host}${req.originalUrl}`,
    null,
    TokenDecoder.decoder(SESSION_ID),
    'Journey service - update the status failed - RFP Publish Page',
    true,
  );
}

}
    

 




