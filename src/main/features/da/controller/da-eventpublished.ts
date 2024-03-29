import * as express from 'express';
// import * as cmsData from '../../../resources/content/requirements/rfp-eventpublished.json';
import * as daData from '../../../resources/content/da/da-Eventpublished.json';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { logConstant } from '../../../common/logtracer/logConstant';

//@GET /rfp/event-sent
export const DA_GET_EVENT_PUBLISHED = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  const { download } = req.query;
  const agreementId_session = req.session.agreement_id;

  // let jsondata ;
  // if(agreement_id == 'RM6187') {
  //   jsondata = Mcf3cmsData;
  // } else {
  //   jsondata = cmsData;
  // }

  const appendData = {
    data: daData,
    projPersistID: req.session['project_name'],
    rfi_ref_no: req.session.eventId,
    agreementId_session,
    selectedeventtype: 'DA',
  };

  try {
    if (download != undefined) {
      const FileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/documents/export`;
      const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {
        responseType: 'arraybuffer',
      });
      //CAS-INFO-LOG
      LoggTracer.infoLogger(FetchDocuments, logConstant.exportDetailFetch, req);
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
    } else {
      //CAS-INFO-LOG
      LoggTracer.infoLogger(null, logConstant.writePublishPage, req);
      res.render('daw-eventpublished.njk', appendData);
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - update the status failed - DA Publish Page',
      true
    );
  }
};
