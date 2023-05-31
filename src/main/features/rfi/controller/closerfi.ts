import * as express from 'express';
import * as cmsData from '../../../resources/content/RFI/closerfi.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { logConstant } from '../../../common/logtracer/logConstant';

//@GET /rfi/event-close/terminate
export const RFI_GET_CLOSE = async (req: express.Request, res: express.Response) => {
  const { releatedContent, projectId } = req.session;
  const { SESSION_ID } = req.cookies; //jwt

  const appendData = {
    data: cmsData,
    projectName: req.session.project_name,
    projectID: req.session.projectId,
    releatedContent,
  };

  try {
    const baseURL = `tenders/projects/${projectId}/close`;
    //const _body = 'cancelled';
    const _body = {
      'terminationType': 'cancelled'       
    };
    const response = await TenderApi.Instance(SESSION_ID).put(baseURL, _body);
    if (response.status == 200) {
      //CAS-INFO-LOG
      LoggTracer.infoLogger(null, logConstant.projectCloseYourProjectPageLogg, req);

      res.render('closerfi.njk', appendData);
    } else {
      res.redirect('/404');
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'close RFI  Page',
      true
    );
  }
};
